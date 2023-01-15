import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DiplomaServiceWithToken } from '../../../api/services';
import { notification } from 'antd';
import { useCallback, useMemo, useRef } from 'react';
import { DiplomaFormValues } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/DiplomaForm/DiplomaForm.component';
import { DiplomaOfHigherEducation, StaticFile } from '../../../generated';
import { useQueryInitialLoading } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.hooks/useQueryInitialLoading';
import moment, { Moment } from 'moment';
import { useDiplomaFromLocalToSubmitDtoConverter } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/DiplomaForm/DiplomaForm.hooks/useDiplomaFromLocalToSubmitDtoConverter';
import { useDiplomaFromDtoConverter } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/DiplomaForm/DiplomaForm.hooks/useDiplomaFromDtoConverter';

type RemoteGetFetchResult = Awaited<ReturnType<typeof DiplomaServiceWithToken.getTherapistDiplomasOfHigherEducation>>;

type LocalGetFetchResult = Omit<
  Awaited<ReturnType<typeof DiplomaServiceWithToken.getTherapistDiplomasOfHigherEducation>>,
  'data'
> &
  LocalQueryData;

export type LocalDiploma = Pick<DiplomaOfHigherEducation, 'isApprovedByModerator' | 'id'> & {
  document?: StaticFile | null;
  information: Omit<DiplomaOfHigherEducation['information'], 'graduationYear'> & {
    graduationYear: Moment;
  };
};

type LocalQueryData = Omit<RemoteGetFetchResult, 'data'> & {
  data: LocalDiploma[];
};

const queryKey = (therapistId: string) => {
  return ['THERAPIST', therapistId, 'DIPLOMAS'];
};

export function useTherapistDiplomas(therapistId: string) {
  const dtoToLocal = useDiplomaFromDtoConverter();
  const localToSubmit = useDiplomaFromLocalToSubmitDtoConverter();

  const client = useQueryClient();

  const query = useQuery<LocalGetFetchResult>(
    queryKey(therapistId),
    async () => {
      const remote = await DiplomaServiceWithToken.getTherapistDiplomasOfHigherEducation({
        requestBody: {
          arguments: {
            therapistId,
          },
        },
      });

      const local = {
        ...remote,
        data: remote.data.map((dto) => {
          return dtoToLocal(dto);
        }),
      };

      const existingData = client.getQueryData<LocalGetFetchResult>(queryKey(therapistId));
      if (!existingData) {
        return local;
      }

      // Сохраняем локально созданные дипломы
      const localDiplomas = existingData.data.filter((diploma) => {
        return Number(diploma.id) < 0;
      });
      local.data = [...local.data, ...localDiplomas];

      return local;
    },
    {
      onError: (err) => {
        const error = err as Error;
        notification.error({
          message: error.name,
          description: error.message,
        });
      },
    },
  );

  const updateDiploma = useMutation(
    (values: DiplomaFormValues) => {
      const dto = localToSubmit(values);
      return DiplomaServiceWithToken.updateTherapistDiplomaOfHigherEducation({
        requestBody: {
          arguments: {
            diplomaId: values.id,
            diplomaInformation: dto.information,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'Диплом',
          description: 'Данные успешно обновлены',
        });
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Диплом',
          description: err.message,
        });
      },
    },
  );

  const approveDiploma = useMutation(
    (diplomaId: string) => {
      return DiplomaServiceWithToken.acceptTherapistDiplomaOfHigherEducation({
        requestBody: {
          arguments: {
            diplomaId,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'Диплом',
          description: 'Данные подтверждён',
        });
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Диплом',
          description: err.message,
        });
      },
    },
  );

  const rejectDiploma = useMutation(
    (diplomaId: string) => {
      return DiplomaServiceWithToken.rejectTherapistDiplomaOfHigherEducation({
        requestBody: {
          arguments: {
            diplomaId,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'Диплом',
          description: 'Диплом отклонён',
        });
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Диплом',
          description: err.message,
        });
      },
    },
  );

  const lastUniqueId = useRef(-1);
  const occupyUniqueId = useCallback(() => {
    return (lastUniqueId.current -= 1);
  }, [lastUniqueId]);

  const createEmptyLocalDiploma = useCallback(async () => {
    const data = client.getQueryData<LocalGetFetchResult>(queryKey(therapistId));
    if (!data?.data) {
      throw new Error('Дипломы ещё не загружены, либо запрос прошел неуспешно');
    }

    const _data = { ...data };
    const _diplomas = [..._data.data];
    _diplomas.push({
      id: occupyUniqueId().toString(),
      information: {
        educationalInstitution: '',
        graduationYear: moment(),
        speciality: '',
        serialAndNumber: '',
        country: 'russia',
      },
      isApprovedByModerator: null,
    });
    _data.data = _diplomas;

    client.setQueryData(queryKey(therapistId), _data);
  }, [client, occupyUniqueId, therapistId]);

  const createRemoteDiploma = useMutation(
    (values: DiplomaFormValues) => {
      const isLocal = Number(values.id) < 0;
      if (!isLocal) {
        throw new Error('Данный метод предназначен создания заполненного диплома на сервере на основе локального');
      } else if (!values.documentToken) {
        throw new Error('Для создания диплоам на сервере необходимо указать токен документа');
      }

      const dto = localToSubmit(values);
      return DiplomaServiceWithToken.submitTherapistDiplomaOfHigherEducation({
        requestBody: {
          arguments: {
            therapistId,
            diplomaOfHigherEducation: {
              document: values.documentToken,
              information: dto.information,
            },
          },
        },
      });
    },
    {
      onSuccess: (_, values) => {
        notification.success({
          message: 'Диплом',
          description: 'Диплом создан и сохранён',
        });

        // Удаляем локальную копию, в ответе мы не получаем ID созданного документа
        const queryData = client.getQueryData<LocalGetFetchResult>(queryKey(therapistId));
        const dataCopy = { ...queryData! };
        dataCopy.data = dataCopy.data.filter((diploma) => {
          return diploma.id !== values.id;
        });
        client.setQueryData(queryKey(therapistId), dataCopy);

        query.refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Диплом',
          description: err.message,
        });
      },
    },
  );

  const deleteLocalDiploma = useCallback(
    (values: DiplomaFormValues) => {
      const queryData = client.getQueryData<LocalGetFetchResult>(queryKey(therapistId));
      if (!queryData?.data) {
        throw new Error('Диплом ещё не загружен, либо произошла ошибка при получении дипломов');
      }

      const queryCopy = { ...queryData };
      const diplomasCopy = [...queryData.data];
      queryCopy.data = diplomasCopy.filter((diploma) => {
        return diploma.id !== values.id;
      });

      client.setQueryData(queryKey(therapistId), queryCopy);
    },
    [client, therapistId],
  );

  const deleteRemoteDiploma = useMutation(
    (values: DiplomaFormValues) => {
      return DiplomaServiceWithToken.deleteTherapistDiplomaOfHigherEducation({
        requestBody: {
          arguments: {
            diplomaId: values.id,
          },
        },
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: 'Диплом',
          description: 'Диплом удалён',
        });
        query.refetch();
      },
      onError: (err: Error) => {
        notification.error({
          message: 'Диплом',
          description: err.message,
        });
      },
    },
  );

  const firstTimeLoading = useQueryInitialLoading(query);
  const isMutating = [
    updateDiploma.status,
    approveDiploma.status,
    rejectDiploma.status,
    createRemoteDiploma.status,
    deleteRemoteDiploma.status,
  ].includes('loading');

  return useMemo(() => {
    return {
      diplomas: query.data?.data,
      updateDiploma,
      approveDiploma,
      rejectDiploma,
      isMutating,
      createEmptyLocalDiploma,
      createRemoteDiploma,
      deleteLocalDiploma,
      deleteRemoteDiploma,
      isFirstLoading: firstTimeLoading,
      query,
    };
  }, [
    approveDiploma,
    createEmptyLocalDiploma,
    createRemoteDiploma,
    deleteLocalDiploma,
    deleteRemoteDiploma,
    firstTimeLoading,
    isMutating,
    query,
    rejectDiploma,
    updateDiploma,
  ]);
}
