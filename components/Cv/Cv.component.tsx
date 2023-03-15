import { createContext, FC, useEffect } from 'react';
import styles from './Cv.module.css';
import { Top } from '@components/Cv/Cv.sections/Top.component';
import { Personal } from '@components/Cv/Cv.sections/Personal.component';
import { Practice } from '@components/Cv/Cv.sections/Practice.component';
import { Values } from '@components/Cv/Cv.sections/Values.component';
import { Important } from '@components/Cv/Cv.sections/Important.component';
import { Links } from '@components/Cv/Cv.sections/Links.component';
import { useCv } from '@components/Cv/useCv';
import { Result } from 'antd';

export const CvContext = createContext<ReturnType<typeof useCv>>({} as ReturnType<typeof useCv>);

export const Cv: FC<{ therapistId: string }> = ({ therapistId }) => {
  const value = useCv(therapistId);

  useEffect(() => {
    if (!value.isLoading && !value.isError && value.isSuccess) {
      setTimeout(() => {
        window.print();
      }, 3000);
    }
  }, [value.isError, value.isLoading, value.isSuccess]);

  if (value.isLoading) {
    return <Result status={'success'} title={'Генерация резюме...'} />;
  } else if (value.isError) {
    return (
      <Result
        status={'error'}
        title={'Ошибка генерации'}
        subTitle={'Мы не смогли сгенерировать резюме из-за ошибки при получении данных'}
      />
    );
  }

  return (
    <CvContext.Provider value={value}>
      <article className={styles['root']}>
        <Top />
        <Personal />
        <Practice />
        <Values />
        <Important />
        <Links />
      </article>
    </CvContext.Provider>
  );
};
