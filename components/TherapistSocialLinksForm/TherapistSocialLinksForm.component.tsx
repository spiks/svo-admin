import { Button, Collapse, Form, Input, message } from 'antd';
import {
  REGEXP_FACEBOOK,
  REGEXP_INSTAGRAM,
  REGEXP_TELEGRAM,
  REGEXP_TWITTER,
  REGEXP_VK,
  REGEXP_YOUTUBE_PROFILE,
} from 'constants/regexp';

import { TherapistPageContext } from 'pages/users/therapists/[id]';
import { FC, useContext, useEffect } from 'react';
import {
  SocialLinksFormValues,
  useTherapistSocialLinks,
} from './TherapistSocialLinksForm.hooks/useTherapistSocialLinks';

export const TherapistSocialsLinksFrom: FC = () => {
  const { therapist } = useContext(TherapistPageContext);
  const [form] = Form.useForm<SocialLinksFormValues>();
  const { socialLinks, ...socialLinksService } = useTherapistSocialLinks(therapist.id);

  const { Panel } = Collapse;

  useEffect(() => {
    form.setFieldsValue({ ...socialLinks });
    // eslint-disable-next-line
  }, [socialLinks]);

  return (
    <Form form={form} initialValues={{}} onFinish={socialLinksService.updateSocialLinks.mutate} layout="vertical">
      <Collapse defaultActiveKey={['instagram']} expandIconPosition={'end'}>
        <Panel forceRender={true} header={'Instagram'} key="instagram">
          <Form.Item
            normalize={(value) => {
              if (!value) {
                return null;
              }
              return value;
            }}
            rules={[
              {
                pattern: REGEXP_INSTAGRAM,
                message: 'Неверный формат',
              },
            ]}
            name={'instagramLink'}
            label={'Cсылка на профиль Instagram'}
          >
            <Input />
          </Form.Item>
        </Panel>
        <Panel forceRender={true} header={'Telegram'} key="telegram">
          <Form.Item
            normalize={(value) => {
              if (!value) {
                return null;
              }
              return value;
            }}
            rules={[
              {
                pattern: REGEXP_TELEGRAM,
                message: 'Неверный формат',
              },
            ]}
            name={'telegramLink'}
            label={'Cсылка на профиль Telegram'}
          >
            <Input />
          </Form.Item>
        </Panel>
        <Panel forceRender={true} header={'VK'} key="vk">
          <Form.Item
            normalize={(value) => {
              if (!value) {
                return null;
              }
              return value;
            }}
            rules={[
              {
                pattern: REGEXP_VK,
                message: 'Неверный формат',
              },
            ]}
            name={'vkLink'}
            label={'Cсылка на профиль VK'}
          >
            <Input />
          </Form.Item>
        </Panel>
        <Panel forceRender={true} header={'YouTube'} key="youtube">
          <Form.Item
            normalize={(value) => {
              if (!value) {
                return null;
              }
              return value;
            }}
            rules={[
              {
                pattern: REGEXP_YOUTUBE_PROFILE,
                message: 'Неверный формат',
              },
            ]}
            name={'youtubeLink'}
            label={'Cсылка на профиль YouTube'}
          >
            <Input />
          </Form.Item>
        </Panel>
        <Panel forceRender={true} header={'FaceBook'} key="facebook">
          <Form.Item
            normalize={(value) => {
              if (!value) {
                return null;
              }
              return value;
            }}
            rules={[
              {
                pattern: REGEXP_FACEBOOK,
                message: 'Неверный формат',
              },
            ]}
            name={'facebookLink'}
            label={'Cсылка на профиль FaceBook'}
          >
            <Input />
          </Form.Item>
        </Panel>
        <Panel forceRender={true} header={'Twitter'} key="twitter">
          <Form.Item
            normalize={(value) => {
              if (!value) {
                return null;
              }
              return value;
            }}
            rules={[
              {
                pattern: REGEXP_TWITTER,
                message: 'Неверный формат',
              },
            ]}
            name={'twitterLink'}
            label={'Cсылка на профиль Twitter'}
          >
            <Input />
          </Form.Item>
        </Panel>
      </Collapse>
      <Form.Item style={{ marginTop: '24px' }} wrapperCol={{ offset: 22 }}>
        <Button type={'primary'} htmlType={'submit'}>
          {'Сохранить'}
        </Button>
      </Form.Item>
    </Form>
  );
};
