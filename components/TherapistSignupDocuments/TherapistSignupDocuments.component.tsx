import { FC, useContext } from 'react';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { Button, Form, Spin } from 'antd';
import { Document } from '../Document/Document.component';
import { getDocumentStyle } from '../Document/Document.utils';
import { documentName } from './TherapistSignupDocuments.utils';
import { useTherapistPassport } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistPassport';
import { useTherapistInn } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistInn';
import { useTherapistSnils } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistSnils';
import { useTherapistDiplomas } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistDiplomas';
import { useTherapistBan } from '../../hooks/useTherapistBan';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';

export const TherapistSignupDocuments: FC = () => {
  const { therapist, isLoading } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const { passport } = useTherapistPassport(therapist.id);
  const { inn } = useTherapistInn(therapist.id);
  const { snils } = useTherapistSnils(therapist.id);
  const { diplomas } = useTherapistDiplomas(therapist.id);

  const { banTherapist, unbanTherapist, isMutating } = useTherapistBan({
    onSuccess() {
      refetch('therapist');
    },
  });

  const bannedStatuses = ['blocked', 'pre_blocked'];
  const banMethod = bannedStatuses.includes(therapist.status)
    ? unbanTherapist.mutate.bind(null, therapist.id)
    : banTherapist.mutate.bind(null, therapist.id);

  const banWord = bannedStatuses.includes(therapist.status) ? 'Разблокировать' : 'Заблокировать';

  return (
    <Spin spinning={isLoading}>
      <Form>
        <Form.Item label={'Необходимые документы'}>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: '16px', minWidth: '470px' }}>
            <Document
              style={getDocumentStyle(passport?.isApprovedByModerator, therapist.status)}
              href={`/users/therapists/${therapist.id}?section=documents&target=passport`}
              name={documentName.passport}
            />
            <Document
              style={getDocumentStyle(inn?.isApprovedByModerator, therapist.status)}
              href={`/users/therapists/${therapist.id}?section=documents&target=inn`}
              name={documentName.inn}
            />
            <Document
              style={getDocumentStyle(snils?.isApprovedByModerator, therapist.status)}
              href={`/users/therapists/${therapist.id}?section=documents&target=snils`}
              name={documentName.snils}
            />
            {diplomas?.length ? (
              diplomas?.map((it) => {
                return (
                  <Document
                    key={it.id}
                    style={getDocumentStyle(it?.isApprovedByModerator, therapist.status)}
                    href={`/users/therapists/${therapist.id}?section=documents&target=${it.id}`}
                    name={documentName.diploma}
                  />
                );
              })
            ) : (
              <Document style={'empty'} name={documentName.diploma} />
            )}
          </div>
          <Button
            loading={isMutating || isLoading}
            size="large"
            onClick={() => {
              banMethod();
            }}
            style={{
              marginTop: '24px',
            }}
          >
            {banWord}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};
