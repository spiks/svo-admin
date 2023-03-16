import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Result } from 'antd';
import { Cv } from '@components/Cv/Cv.component';

const TherapistCVPage: NextPage = () => {
  const { query } = useRouter();
  const therapistId = query['id'];

  if (!therapistId) {
    return <Result title={'Загрузка...'} />;
  } else if (Array.isArray(therapistId)) {
    return <Result status={'error'} title={'Неверный ID терапевта'} />;
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Cv therapistId={therapistId as string} />
    </main>
  );
};

export default TherapistCVPage;
