import React, { FC, useContext } from 'react';
import { Col, Collapse, Form, Result, Row, Spin } from 'antd';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { PassportForm } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/PassportForm/PassportForm.component';
import { useTherapistPassport } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.hooks/useTherapistPassport';
import { SelectStatus } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.children/SelectStatus.component';
import { getDocumentIndicator } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.utils/getDocumentIndicator';
import { useTherapistSnils } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.hooks/useTherapistSnils';
import { SnilsForm } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/SnilsForm/SnilsForm.component';
import { useTherapistInn } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.hooks/useTherapistInn';
import { InnForm } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/InnForm/InnForm.component';
import { useTherapistDiplomas } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.hooks/useTherapistDiplomas';
import { DiplomaForm } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.documents/DiplomaForm/DiplomaForm.component';
import { AddDiplomaButton } from '@components/UserProfileDocumentsForm/UserProfileDocumentsForm.children/AddDiplomaButton.component';

const { Panel } = Collapse;

export const TherapistDocumentsForm: FC = () => {
  const { therapist } = useContext(TherapistPageContext);

  const { passport, ...passportService } = useTherapistPassport(therapist.id);
  const PassportIndicator = getDocumentIndicator(passportService.query, passport);

  const { snils, ...snilsService } = useTherapistSnils(therapist.id);
  const SnilsIndicator = getDocumentIndicator(snilsService.query, snils);

  const { inn, ...innService } = useTherapistInn(therapist.id);
  const InnIndicator = getDocumentIndicator(innService.query, inn);

  const { diplomas, ...diplomasService } = useTherapistDiplomas(therapist.id);

  //Индикация возможности редактировать документ терапевта администратором
  const isModerationNotAllowed = !['active', 'documents_awaiting_review'].includes(therapist.status);

  return (
    <section>
      <h2 style={{ marginBottom: '24px' }}>Документы, подтверждающие персональные данные</h2>
      <Collapse style={{ width: '100%', marginBottom: '24px' }} expandIconPosition={'end'}>
        {/* Паспорт */}
        <Panel
          extra={
            <Form.Item style={{ margin: 0 }} label={'Статус'}>
              <SelectStatus
                onApprove={passportService.approvePassport.mutate}
                onReject={passportService.rejectPassport.mutate}
                document={passport}
                disabled={isModerationNotAllowed}
                loading={passportService.isMutating || passportService.query.isLoading}
              />
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <PassportIndicator />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="Паспорт" required />
              </Col>
            </Row>
          }
          key="passport"
        >
          {(() => {
            if (passportService.query.isError) {
              return (
                <Result
                  status={'error'}
                  title={'Ошибка при загрузке паспорта'}
                  subTitle={passportService.query.error.message}
                />
              );
            } else if (passportService.isFirstLoading) {
              return <Spin style={{ width: '100%', height: '100%' }} spinning={true} />;
            } else if (!passport) {
              return <Result status={'warning'} subTitle={'Паспорт ещё не загружен клиентом'} />;
            } else {
              return (
                <PassportForm
                  disabled={isModerationNotAllowed || passportService.isMutating || passportService.query.isLoading}
                  passport={passport}
                  onSubmit={passportService.updatePassport.mutate}
                />
              );
            }
          })()}
        </Panel>
        {/* СНИЛС */}
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <SelectStatus
                onApprove={snilsService.approveSnils.mutate}
                onReject={snilsService.rejectSnils.mutate}
                document={snils}
                disabled={isModerationNotAllowed || snilsService.query.isLoading || snilsService.isMutating}
              />
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <SnilsIndicator />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="СНИЛС" required />
              </Col>
            </Row>
          }
          key="snils"
        >
          {(() => {
            if (snilsService.query.isError) {
              return (
                <Result
                  status={'error'}
                  title={'Ошибка при загрузке СНИЛС'}
                  subTitle={snilsService.query.error.message}
                />
              );
            } else if (snilsService.isFirstLoading) {
              return <Spin style={{ width: '100%', height: '100%' }} spinning={true} />;
            } else if (!snils) {
              return <Result status={'warning'} subTitle={'СНИЛС ещё не загружен клиентом'} />;
            } else {
              return (
                <SnilsForm
                  disabled={isModerationNotAllowed || snilsService.isMutating || snilsService.query.isLoading}
                  snils={snils}
                  onSubmit={snilsService.updateSnils.mutate}
                />
              );
            }
          })()}
        </Panel>
        {/* ИНН */}
        <Panel
          extra={
            <Form.Item style={{ margin: '0' }} label={'Статус'}>
              <SelectStatus
                onApprove={innService.approveInn.mutate}
                onReject={innService.rejectInn.mutate}
                document={inn}
                disabled={isModerationNotAllowed || innService.query.isLoading || innService.isMutating}
              />
            </Form.Item>
          }
          header={
            <Row align="middle" gutter={17.5}>
              <Col>
                <InnIndicator />
              </Col>
              <Col>
                <Form.Item style={{ margin: '0' }} label="ИНН" required />
              </Col>
            </Row>
          }
          key="inn"
        >
          {(() => {
            if (innService.query.isError) {
              return (
                <Result status={'error'} title={'Ошибка при загрузке ИНН'} subTitle={innService.query.error.message} />
              );
            } else if (innService.isFirstLoading) {
              return <Spin style={{ width: '100%', height: '100%' }} spinning={true} />;
            } else if (!inn) {
              return <Result status={'warning'} subTitle={'ИНН ещё не загружен клиентом'} />;
            } else {
              return (
                <InnForm
                  disabled={isModerationNotAllowed || innService.isMutating || innService.query.isLoading}
                  inn={inn}
                  onSubmit={innService.updateInn.mutate}
                />
              );
            }
          })()}
        </Panel>
      </Collapse>
      <h2 style={{ marginBottom: '24px' }}>Документы об образовании</h2>
      <Collapse style={{ width: '100%' }} expandIconPosition={'end'} defaultActiveKey={['1']}>
        {/* Диплом: обработка ошибок и первой загрузки */}
        {(() => {
          if (diplomas) {
            return null;
          } else if (diplomasService.query.isError) {
            return (
              <Result
                status={'error'}
                title={'Ошибка при загрузке списка дипломов'}
                subTitle={(diplomasService.query.error as Error).message}
              />
            );
          } else if (diplomasService.isFirstLoading) {
            return <Spin style={{ width: '100%', height: '100%' }} spinning={true} />;
          }
        })()}
        {/* Диплом: вывод списка дипломов */}
        {diplomas &&
          diplomas.map((diploma) => {
            const isLocal = Number(diploma.id) < 0;

            const onApprove = isLocal ? () => {} : diplomasService.approveDiploma.mutate.bind(null, diploma.id);
            const onReject = isLocal ? () => {} : diplomasService.rejectDiploma.mutate.bind(null, diploma.id);

            const Indicator = getDocumentIndicator(diplomasService.query, diploma);

            const onSubmit = isLocal
              ? diplomasService.createRemoteDiploma.mutate
              : diplomasService.updateDiploma.mutate;

            return (
              <Panel
                key={diploma.id}
                extra={
                  <Form.Item style={{ margin: '0' }} label={'Статус'}>
                    <SelectStatus
                      onApprove={onApprove as () => void}
                      onReject={onReject as () => void}
                      document={diploma}
                      disabled={isModerationNotAllowed || diplomasService.query.isLoading || diplomasService.isMutating}
                    />
                  </Form.Item>
                }
                header={
                  <Row align="middle" gutter={17.5}>
                    <Col>
                      <Indicator />
                    </Col>
                    <Col>
                      <Form.Item style={{ margin: '0' }} label="Документ об образовании" required />
                    </Col>
                  </Row>
                }
              >
                <DiplomaForm diploma={diploma} onSubmit={onSubmit} />
              </Panel>
            );
          })}
        <AddDiplomaButton onClick={diplomasService.createEmptyLocalDiploma} />
      </Collapse>
    </section>
  );
};
