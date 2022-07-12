import { LoginForm } from '../../components/LoginForm';
import styles from '../../public/styles/LoginPage.module.css';
import { NextPage } from 'next';

const LoginPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
