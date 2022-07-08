import { LoginForm } from '../../components/LoginForm';
import styles from '../../public/styles/LoginPage.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}
