import { Collapse } from 'antd';
import React, { FC, useContext } from 'react';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { TherapistEmploymentForm } from '@components/TherapistEmploymentForm/TherapistEmploymentForm.component';
import { TherapistSpecializationsForm } from '@components/TherapistSpecializationsForm/TherapistSpecializationsForm.component';

const { Panel } = Collapse;

export const TherapistPracticeSection: FC = () => {
  const {
    therapist: { employments, id },
  } = useContext(TherapistPageContext);

  return (
    <section>
      <Collapse defaultActiveKey={'employments'} expandIconPosition={'end'}>
        <Panel key={'employments'} header={'Профильный опыт и место работы'}>
          <TherapistEmploymentForm fetchedEmployments={employments} id={id} />
        </Panel>
        <Panel key={'specializations'} header={'Специализации'}>
          <TherapistSpecializationsForm />
        </Panel>
      </Collapse>
    </section>
  );
};
