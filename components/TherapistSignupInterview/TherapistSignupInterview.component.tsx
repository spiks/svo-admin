import { FC, useCallback, useContext, useState } from 'react';
import { Button, Space, Spin } from 'antd';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { markInterviewSuccessful } from '../../api/therapist/markInterviewSuccessful';
import { useTherapistSignupQueriesRefresh } from '../../hooks/useTherapistSignupQueries';
import { markInterviewFailed } from '../../api/therapist/markInterviewFailed';

export const TherapistSignupInterview: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const [loading, setLoading] = useState(false);

  const passed = useCallback(async () => {
    setLoading(true);
    await markInterviewSuccessful(therapist.id);
    await refetch('therapist');
  }, [refetch, therapist.id]);

  const failed = useCallback(async () => {
    setLoading(true);
    await markInterviewFailed(therapist.id);
    await refetch('therapist');
    setLoading(false);
  }, [refetch, therapist.id]);

  return (
    <Spin spinning={loading}>
      {therapist.status === 'interview_failed' ? (
        <span style={{ fontSize: '16px' }}>Пользователь не прошел верификацию и не может работать у нас.</span>
      ) : (
        <Space size={8}>
          <Button danger htmlType={'button'} onClick={failed}>
            Интервью провалено
          </Button>
          <Button type={'primary'} htmlType={'button'} onClick={passed}>
            Интервью пройдено
          </Button>
        </Space>
      )}
    </Spin>
  );
};
