import { FC, useContext } from 'react';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { Form, Spin } from 'antd';
import { Document } from '../Document/Document.component';
import { getDocumentStyle } from '../Document/Document.utils';
import { documentName } from './TherapistSignupDocuments.utils';
import { useTherapistPassport } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistPassport';
import { useTherapistInn } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistInn';
import { useTherapistSnils } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistSnils';
import { useTherapistDiplomas } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistDiplomas';

export const TherapistSignupDocuments: FC = () => {
  const { therapist, isLoading } = useContext(TherapistPageContext);

  const { passport } = useTherapistPassport(therapist.id);
  const { inn } = useTherapistInn(therapist.id);
  const { snils } = useTherapistSnils(therapist.id);
  const { diplomas } = useTherapistDiplomas(therapist.id);

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
            {diplomas?.map((it) => {
              return (
                <Document
                  key={it.id}
                  style={getDocumentStyle(it?.isApprovedByModerator, therapist.status)}
                  href={`/users/therapists/${therapist.id}?section=documents&target=${it.id}`}
                  name={documentName.diploma}
                />
              );
            })}
          </div>
        </Form.Item>
      </Form>
    </Spin>
  );
};
