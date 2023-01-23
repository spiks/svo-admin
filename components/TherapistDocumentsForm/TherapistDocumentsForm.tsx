import React, { FC, useCallback, useContext, useMemo } from 'react';
import { Button, Col, Collapse, Form, Result, Row, Space, Spin } from 'antd';
import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { PassportForm } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/PassportForm/PassportForm.component';
import { useTherapistPassport } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistPassport';
import { SelectStatus } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.children/SelectStatus.component';
import { getDocumentIndicator } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.utils/getDocumentIndicator';
import { useTherapistSnils } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistSnils';
import { SnilsForm } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/SnilsForm/SnilsForm.component';
import { useTherapistInn } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistInn';
import { InnForm } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/InnForm/InnForm.component';
import { useTherapistDiplomas } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistDiplomas';
import { DiplomaForm } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.documents/DiplomaForm/DiplomaForm.component';
import { AddFormButton } from '@components/AddFormButton.component';
import { DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { finishTherapistDocumentModeration } from 'api/therapist/finishTherapistDocumentModeration';
import { useTherapistSignupQueriesRefresh } from 'hooks/useTherapistSignupQueries';

const { Panel } = Collapse;

export const TherapistDocumentsForm: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const refetch = useTherapistSignupQueriesRefresh(therapist.id);

  const { passport, ...passportService } = useTherapistPassport(therapist.id);
  const PassportIndicator = getDocumentIndicator(passportService.query, passport);

  const { snils, ...snilsService } = useTherapistSnils(therapist.id);
  const SnilsIndicator = getDocumentIndicator(snilsService.query, snils);

  const { inn, ...innService } = useTherapistInn(therapist.id);
  const InnIndicator = getDocumentIndicator(innService.query, inn);

  const { diplomas, ...diplomasService } = useTherapistDiplomas(therapist.id);

  const { query } = useRouter();
  const target = query['target'];

  //Индикация возможности редактировать документ терапевта администратором
  const isModerationNotAllowed = !['active', 'documents_awaiting_review', 'created_by_admin'].includes(
    therapist.status,
  );

  const canEndModeration = useMemo(() => {
    const documentsModeration = Object.values({
      passport: passport,
      snils: snils,
      inn: inn,
    })
      .flat()
      .every((doc) => {
        if (doc) {
          return doc?.isApprovedByModerator !== null;
        }
      });
    const diplomaModeration = diplomas?.some((it) => {
      return it.isApprovedByModerator;
    });

    return documentsModeration && diplomaModeration;
  }, [diplomas, snils, passport, inn]);

  const finishModeration = useCallback(async () => {
    await finishTherapistDocumentModeration(therapist.id);
    await refetch('therapist');
    await refetch('documents');
  }, [refetch, therapist.id]);

  return (
    <section>
      <h2 style={{ marginBottom: '24px' }}>Документы, подтверждающие персональные данные</h2>
      <Collapse style={{ width: '100%', marginBottom: '24px' }} defaultActiveKey={target} expandIconPosition={'end'}>
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
            } else if (!passport && therapist.status !== 'created_by_admin') {
              return <Result status={'warning'} subTitle={'Паспорт ещё не загружен клиентом'} />;
            } else {
              const submitHandler = Boolean(passport?.document)
                ? passportService.updatePassport
                : passportService.submitPassport;
              return (
                <PassportForm
                  disabled={isModerationNotAllowed || passportService.isMutating || passportService.query.isLoading}
                  passport={passport}
                  onSubmit={!passportService.isFirstLoading && submitHandler.mutate}
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
            } else if (!snils && therapist.status !== 'created_by_admin') {
              return <Result status={'warning'} subTitle={'СНИЛС ещё не загружен клиентом'} />;
            } else {
              const submitHandler = Boolean(snils?.document) ? snilsService.updateSnils : snilsService.submitSnils;
              return (
                <SnilsForm
                  disabled={isModerationNotAllowed || snilsService.isMutating || snilsService.query.isLoading}
                  snils={snils}
                  onSubmit={!snilsService.isFirstLoading && submitHandler.mutate}
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
              return <Result status={'error'} title={'Ошибка при загрузке ИНН'} subTitle={innService.query.error} />;
            } else if (innService.isFirstLoading) {
              return <Spin style={{ width: '100%', height: '100%' }} spinning={true} />;
            } else if (!inn && therapist.status !== 'created_by_admin') {
              return <Result status={'warning'} subTitle={'ИНН ещё не загружен клиентом'} />;
            } else {
              const submitHandler = Boolean(inn?.document) ? innService.updateInn : innService.submitInn;
              return (
                <InnForm
                  disabled={isModerationNotAllowed || innService.isMutating || innService.query.isLoading}
                  inn={inn}
                  onSubmit={!innService.isFirstLoading && submitHandler.mutate}
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

            const onDelete = isLocal ? diplomasService.deleteLocalDiploma : diplomasService.deleteRemoteDiploma.mutate;

            const statusChangeNotAllowed =
              isModerationNotAllowed || diplomasService.query.isLoading || diplomasService.isMutating || isLocal;

            return (
              <Panel
                key={diploma.id}
                extra={
                  <Space>
                    <Form.Item style={{ margin: '0' }} label={'Статус'}>
                      <SelectStatus
                        onApprove={onApprove as () => void}
                        onReject={onReject as () => void}
                        document={diploma}
                        disabled={statusChangeNotAllowed}
                      />
                    </Form.Item>
                    <Button
                      onClick={() => {
                        onDelete({ id: diploma.id });
                      }}
                      loading={diplomasService.isFirstLoading || diplomasService.isMutating}
                      type={'text'}
                      icon={<DeleteOutlined style={{ color: '#1890FF' }} />}
                    />
                  </Space>
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
        <AddFormButton label={'Добавить диплом об образовании'} onClick={diplomasService.createEmptyLocalDiploma} />
      </Collapse>
      <Row align="middle" justify="end">
        {therapist.status === 'documents_awaiting_review' && (
          <Button
            disabled={!canEndModeration}
            onClick={finishModeration}
            size={'large'}
            style={{ marginTop: '24px' }}
            type={'primary'}
          >
            {'Завершить модерацию документов'}
          </Button>
        )}
      </Row>
    </section>
  );
};
