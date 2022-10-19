import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';
import { GetServerSidePropsContext } from 'next';

export default function Home() {
  return <SplashScreenLoader />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    redirect: {
      destination: '/login',
      statusCode: 307,
    },
  };
};
