import styles from '../../public/styles/LoginPage.module.css';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import SplashScreenLoader from '@components/SplashScreenLoader/SplashScreenLoader.component';

const LoginFormComponent = dynamic(() => import('@components/LoginForm/LoginForm.component'), {
  loading: () => <SplashScreenLoader />,
});

const LoginPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <LoginFormComponent />
    </div>
  );
};

export default LoginPage;
