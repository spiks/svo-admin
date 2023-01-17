import React, { FC } from 'react';
import { Button, DatePicker, Form, Input, Upload, UploadFile } from 'antd';
import moment from 'moment';
import { LocalDiploma } from '@components/TherapistDocumentsForm/TherapistDocumentsForm.hooks/useTherapistDiplomas';
import { RcFile } from 'antd/lib/upload';

export type DiplomaFormProps = {
  diploma?: LocalDiploma;
  onSubmit?: (values: DiplomaFormValues) => void;
  disabled?: boolean;
};

export type DiplomaFormValues = LocalDiploma['information'] & {
  id: string;
  document: UploadFile | RcFile;
  documentToken?: string;
};

export const DiplomaForm: FC<DiplomaFormProps> = ({ diploma, onSubmit, disabled = false }) => {
  const [form] = Form.useForm<DiplomaFormValues>();

  const files = Form.useWatch('document', form) as unknown as (RcFile | UploadFile)[];

  return (
    <Form
      form={form}
      layout={'vertical'}
      onFinish={onSubmit}
      initialValues={{
        id: diploma?.id,
        country: 'russia',
        ...diploma?.information,
        document: diploma?.document,
      }}
      disabled={disabled}
    >
      <Form.Item
        label={'Наименование высшего учебного заведения'}
        rules={[
          {
            required: true,
            type: 'string',
            max: 400,
            message: 'Обязательно для заполнении (до 400 символов)',
          },
        ]}
      >
        <Input type={'text'} />
      </Form.Item>
      <Form.Item
        label={'Специальность'}
        rules={[
          {
            required: true,
            type: 'string',
            max: 255,
            message: 'Обязательно для заполнения (до 255 символов)',
          },
        ]}
      >
        <Input type={'text'} />
      </Form.Item>
      <Form.Item
        label={'Серия / Номер'}
        rules={[
          {
            required: true,
            type: 'string',
            max: 255,
            message: 'Обязательно для заполнения (до 255 символов)',
          },
        ]}
      >
        <Input type={'text'} />
      </Form.Item>
      <Form.Item label={'Год выпуска'}>
        <DatePicker
          picker={'year'}
          disabledDate={(date) => {
            const min = moment().day(1).month(0).year(1900);
            return date.isBefore(min);
          }}
        />
      </Form.Item>
      <Form.Item
        name={'document'}
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e && e.fileList;
        }}
        rules={[
          {
            required: true,
            message: 'Загрузка документа обязательна',
          },
        ]}
      >
        <Upload>{(!files || !files.length) && <Button>Загрузить файл</Button>}</Upload>
      </Form.Item>
      <Button type={'primary'}>OK</Button>
    </Form>
  );
};
