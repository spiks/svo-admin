import { NextPage } from 'next';
import { useRouter } from 'next/router';

const TherapistPage: NextPage = () => {
  const router = useRouter();

  return <p>{'Therapist page ' + router.query['id']}</p>;
};

export default TherapistPage;
