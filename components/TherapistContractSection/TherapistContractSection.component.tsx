import { Col, Collapse, Form, Row, Typography, Upload } from 'antd';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { FC, useContext } from 'react';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { useContractsQuery } from 'hooks/useContractsQuery';

export const TherapistContractSection: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const { signedContract } = useContractsQuery(therapist.id);

  const getTherapistContractStatus = () => {
    switch (therapist.status) {
      case 'active':
        return 'Договор подтвержден';
      case 'contract_awaiting_review':
        return 'Договор на проверке';
      case 'contract_not_submitted_yet':
        return 'Договор ещё не был отправлен';
      case 'contract_rejected':
        return 'Договор отклонен';
      default:
        return 'Договор ещё не был отправлен';
    }
  };
  return (
    <>
      <h2 style={{ marginBottom: '24px' }}>Договор</h2>
      <Collapse defaultActiveKey={1} style={{ width: '100%', marginBottom: '24px' }} expandIconPosition={'end'}>
        <CollapsePanel
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
                <Form.Item style={{ margin: '0' }} label="Подписанный пользователем договор" required tooltip />
              </Col>
            </Row>
          }
          key="1"
        >
          <Form layout="vertical">
            <Row justify={'space-between'} align="middle">
              <Col span={12}>
                <Form.Item label={'Подписанный договор'}>
                  {signedContract ? (
                    <Upload
                      showUploadList={{ showRemoveIcon: false }}
                      defaultFileList={[
                        {
                          uid: signedContract?.originalFileName,
                          name: signedContract?.originalFileName,
                          url: signedContract?.url,
                        },
                      ]}
                    />
                  ) : (
                    'Договор ещё не был отправлен терапевтом'
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={'Статус договора'}>
                  <Typography.Text>{getTherapistContractStatus()}</Typography.Text>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </CollapsePanel>
      </Collapse>
    </>
  );
};
