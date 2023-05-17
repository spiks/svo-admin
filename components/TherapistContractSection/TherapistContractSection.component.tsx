import { Alert, Button, Col, Collapse, Form, Row } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { FC, useContext } from 'react';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { useContractsQuery } from 'hooks/useContractsQuery';
import { SignedContractForm } from './SignedContractForm/SignedContractForm.component';
import { useActivateTherapistProfile } from './TherapistContractSection.hooks/useActivateTherapistProfile';

export const TherapistContractSection: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const { signedContract, ...contractService } = useContractsQuery(therapist.id);
  const { activateTherapistProfile, canActivateTherapistProfile } = useActivateTherapistProfile(therapist.id);

  const { Panel } = Collapse;

  const contractSubmit = signedContract?.url
    ? contractService.updateTherapistSignedContract
    : contractService.submitTherapistSignedContract;

  return (
    <section>
      <h2 style={{ marginBottom: '24px' }}>Договор</h2>
      <Collapse
        defaultActiveKey={['signedContract']}
        style={{ width: '100%', marginBottom: '24px' }}
        expandIconPosition={'end'}
      >
        <Panel
          collapsible="disabled"
          showArrow={false}
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                {therapist.status === 'active' ? (
                  <CheckCircleFilled style={{ color: '#A0D911', fontSize: '21px' }} />
                ) : (
                  <CloseCircleFilled style={{ color: '#F5222D', fontSize: '21px' }} />
                )}
              </Col>

              <Col>
                <Form.Item style={{ margin: '0' }} label="Подписанный пользователем договор" required />
              </Col>
            </Row>
          }
          key="signedContract"
        >
          <SignedContractForm
            signedContract={signedContract}
            onSubmit={contractSubmit.mutate}
            onReject={contractService.therapistRejectContract.mutate}
            onAccept={contractService.therapistAcceptContract.mutate}
          />
        </Panel>
      </Collapse>

      {therapist.status === 'created_by_admin' && (
        <Row align="middle" justify="end">
          {!canActivateTherapistProfile ? (
            <Alert
              description={
                'Вы не можете активировать данный профиль пока не загрузите необходимые документы: Паспорт, Снилс, ИНН, Диплом, Контракт'
              }
              type="info"
              showIcon
            />
          ) : (
            <Button size={'large'} type={'primary'} onClick={activateTherapistProfile}>
              Активировать профиль терапевта
            </Button>
          )}
        </Row>
      )}
    </section>
  );
};
