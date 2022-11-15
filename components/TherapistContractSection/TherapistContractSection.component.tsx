import { Checkbox, Col, Collapse, Form, notification, Row, Select, Upload } from 'antd';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { useContractsQuery } from 'hooks/useContractsQuery';
import { acceptContract } from 'api/therapist/acceptContract';
import { rejectContract } from 'api/therapist/rejectContract';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';

const contractOptions: { value: 'accepted' | 'rejected'; label: string }[] = [
  { value: 'accepted', label: 'Подтвержден' },
  {
    value: 'rejected',
    label: 'Отклонен',
  },
];

export const TherapistContractSection: FC = () => {
  const [accepted, setAccepted] = useState<boolean>(false);
  const { therapist } = useContext(TherapistPageContext);
  const { signedContract } = useContractsQuery(therapist.id);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const toggleAccept = useCallback(() => {
    setAccepted(!accepted);
  }, [accepted]);

  const canModerateContract = useMemo(() => {
    if (therapist.status !== 'contract_awaiting_review') {
      return false;
    }
    return true;
  }, [therapist.status]);

  const handleApproveContract = useCallback(async () => {
    if (!accepted) {
      notification.warning({
        type: 'warning',
        message: 'Предупреждение',
        description:
          'Для изменения статуса контракта пользователя, необходимо подтвердить соответствие договора нормативно-правовым актам, этическим нормам и не нарушает законодательства Российской Федерации',
      });
      return;
    }
    try {
      await acceptContract(therapist.id);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Договор подтвержден',
      });
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось подтвердить договор.',
      });
    } finally {
      await refetch('therapist');
    }
  }, [therapist.id, refetch, accepted]);

  const handleRejectContract = useCallback(async () => {
    try {
      await rejectContract(therapist.id);
      notification.success({
        type: 'success',
        message: 'Успех',
        description: 'Договор отклонен',
      });
    } catch (err) {
      notification.error({
        type: 'error',
        message: 'Ошибка',
        description: 'Не удалось отклонить договор.',
      });
    } finally {
      await refetch('therapist');
    }
  }, [therapist.id, refetch]);

  const getContractStatus = () => {
    if (therapist.status === 'active') {
      return 'accepted';
    } else if (therapist.status === 'contract_awaiting_review') {
      return 'На проверке';
    }
    return 'rejected';
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
              <Col flex={'inherit'} span={8}>
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
              <Col flex={'inherit'} span={8}>
                <Form.Item label={'Статус договора'}>
                  <Select
                    onSelect={(value: string) => {
                      value === 'accepted' ? handleApproveContract() : handleRejectContract();
                    }}
                    defaultValue={getContractStatus()}
                    disabled={!canModerateContract}
                    options={contractOptions}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ width: '133px' }}
                  />
                </Form.Item>
              </Col>
              <Col flex={'inherit'} span={8}>
                <Checkbox disabled={!canModerateContract} checked={accepted} onChange={toggleAccept}>
                  Я подтверждаю!
                </Checkbox>
              </Col>
            </Row>
          </Form>
        </CollapsePanel>
      </Collapse>
    </>
  );
};
