import { Collapse } from 'antd';
import React, { FC, useContext } from 'react';
import { TherapistPageContext } from '../../pages/users/therapists/[id]';
import { TherapistEmploymentForm } from '@components/TherapistEmploymentForm/TherapistEmploymentForm.component';
import { TherapistSpecializationTagsForm } from '@components/TherapistSpecializationTagsForm/TherapistSpecializationTagsForm.component';
import { TherapistSpecializationsForm } from '@components/TherapistSpecializationsForm/TherapistSpecializationsForm.component';

const { Panel } = Collapse;

export const TherapistPracticeSection: FC = () => {
  const {
    therapist: { employments, id, specializationTags },
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
        <Panel forceRender key={'tags'} header={'Мои теги'}>
          <TherapistSpecializationTagsForm id={id} fetchedSpecializationTags={specializationTags} />
        </Panel>
      </Collapse>
    </section>
  );
};
