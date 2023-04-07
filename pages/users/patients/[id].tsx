import { MainLayout } from '@components/MainLayout/MainLayout.component';
import { NotFoundLayout } from '@components/NotFoundLayout/NotFoundLayout.component';
import { PageWrapper } from '@components/PageWrapper/PageWrapper.component';
import { PatientProfileHeader } from '@components/PatientProfileHeader/PatientProfileHeader.component';
import { TabList } from '@components/TabList/TabList.component';
import { UserProfileForm } from '@components/UserProfileForm/UserProfileForm.component';
import { Form, FormProps, notification } from 'antd';
import { ApiRegularError } from 'api/errorClasses';
import { removePatientAvatar } from 'api/patient/removePatientAvatar';
import { updatePatientAvatar } from 'api/patient/updatePatientAvatar';
import { PatientServiceWithToken } from 'api/services';
import { requestFileUploadUrl } from 'api/upload/requestFileUploadUrl';
import { uploadFile } from 'api/upload/uploadFile';
import { usePatient } from 'hooks/usePatient';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { UserProfileFormValues } from '../therapists/[id]';

const tabListItems: { label: string; key: 'information' | 'appointments' }[] = [
  { label: 'Сведения', key: 'information' },
  { label: 'Сеансы', key: 'appointments' },
];

const PatientPage: NextPage = () => {
  const { query, push } = useRouter();
  const [form] = Form.useForm<UserProfileFormValues>();

  const patientId = useMemo(() => {
    return query['id'] as string;
    // eslint-disable-next-line
  }, [query['id']]);

  const { isLoading, isError, patient, refetch } = usePatient(patientId);

  const activeTab = useMemo(() => {
    const tabKey = String(query['activeTab']);
    const allKeys = tabListItems.map((tab) => {
      return tab.key.toLowerCase();
    });
    return allKeys.includes(tabKey) ? tabKey : 'information';
  }, [query]);

  const handleTabListChange = useCallback(
    (key) => {
      push({
        query: {
          ...query,
          activeTab: key,
        },
      });
    },
    [query, push],
  );

  const onFinish: FormProps<UserProfileFormValues>['onFinish'] = async (values) => {
    const isAvatarChanged = Boolean(values?.avatar?.[0]?.originFileObj);
    if (isAvatarChanged) {
      const file = values.avatar[0].originFileObj!;
      try {
        const { data: cred } = await requestFileUploadUrl('avatar');
        const avatarToken = (await uploadFile(cred, file)).data.token;
        await updatePatientAvatar({
          patientId: patientId,
          avatar: avatarToken,
        });
      } catch (err) {
        if (!(err instanceof Error)) {
          notification.error({
            type: 'error',
            message: 'Ошибка',
            description: `Неизвестная ошибка`,
          });
        }
      }
    } else if (!isAvatarChanged && !values.avatar.length && patient?.avatar?.sizes) {
      try {
        await removePatientAvatar(patientId);
      } catch (err) {
        notification.error({
          type: 'error',
          message: 'Ошибка',
          description: 'Не удалось удалить изображение',
        });
      }
    }
    try {
      await PatientServiceWithToken.updatePatient({
        requestBody: {
          arguments: {
            id: patientId,
            surname: values.surname,
            name: values.name,
            phone: '+' + getCountryCallingCode(values.phone.short as CountryCode) + values.phone.phone,
            email: values.email,
            //backend требует эти поля, но по макету в форме их нет, должны исправить
            gender: patient?.gender!,
            birthday: patient?.birthday!,
            city: patient?.city!,
            country: patient?.country!,
          },
        },
      });

      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Информация сохранена!',
      });
    } catch (error) {
      let message = 'неизвестная ошибка';
      if (error instanceof ApiRegularError) {
        switch (error.error.type) {
          case 'user_with_this_email_already_exists':
            message = 'Пользователь с такой почтой уже существует';
            form.setFields([
              {
                name: 'email',
                errors: [message],
              },
            ]);
            break;
          case 'user_with_this_phone_already_exists':
            message = 'Пользователь с таким номером уже сщуествует';
            form.setFields([
              {
                name: 'phone',
                errors: [message],
              },
            ]);
            break;
        }
      }
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось сохранить: ' + message,
      });
    } finally {
      refetch();
    }
  };

  const renderTabContents = () => {
    switch (activeTab) {
      case 'information':
        return (
          <PageWrapper>
            <UserProfileForm
              id={patient?.id}
              name={patient?.name}
              surname={patient?.surname}
              avatar={patient?.avatar}
              phone={patient?.phone}
              email={patient?.email}
              form={form}
              onFinish={onFinish}
            />
          </PageWrapper>
        );
      case 'appointments':
        return (
          <PageWrapper>
            <div>{'Сеансы'}</div>
          </PageWrapper>
        );
    }
  };

  if (isError) {
    return <NotFoundLayout message={'Запрашиваемый аккаунт не найден'} />;
  }

  if (isLoading) {
    return <MainLayout loading={true} />;
  }

  return (
    <MainLayout>
      <PatientProfileHeader name={patient?.name} surname={patient?.surname} id={patientId}>
        <TabList items={tabListItems} activeKey={activeTab} onChange={handleTabListChange} />
      </PatientProfileHeader>
      {renderTabContents()}
    </MainLayout>
  );
};

export default PatientPage;
