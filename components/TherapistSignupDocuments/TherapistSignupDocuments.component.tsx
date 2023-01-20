import { FC, useContext, useMemo } from 'react';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { Form, Spin } from 'antd';
import { Document } from '../Document/Document.component';
import { getDocumentStyle } from '../Document/Document.utils';
import { documentName } from './TherapistSignupDocuments.utils';

export const TherapistSignupDocuments: FC = () => {
  const { documents, therapist, isLoading } = useContext(TherapistPageContext);

  const diploma = useMemo(() => {
    return documents.diploma.map((it) => {
      return (
        <Document
          key={it.id}
          style={getDocumentStyle(it?.isApprovedByModerator, therapist.status)}
          href={'#'}
          name={'Диплом'}
        />
      );
    });
  }, [documents.diploma, therapist.status]);

  return (
    <Spin spinning={isLoading}>
      <Form>
        <Form.Item label={'Необходимые документы'}>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: '16px', minWidth: '470px' }}>
            <Document
              style={getDocumentStyle(documents.passport?.isApprovedByModerator, therapist.status)}
              href={`/users/therapists/${therapist.id}?section=documents&target=passport`}
              name={documentName.passport}
            />
            <Document
              style={getDocumentStyle(documents.inn?.isApprovedByModerator, therapist.status)}
              href={`/users/therapists/${therapist.id}?section=documents&target=inn`}
              name={documentName.inn}
            />
            <Document
              style={getDocumentStyle(documents.snils?.isApprovedByModerator, therapist.status)}
              href={`/users/therapists/${therapist.id}/section=documents&target=snils`}
              name={documentName.snils}
            />
            {diploma}
          </div>
        </Form.Item>
      </Form>
    </Spin>
  );
};
