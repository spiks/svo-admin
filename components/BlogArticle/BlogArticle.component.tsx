import { Avatar, Col, Row, Tag, Typography, Card } from 'antd';
import moment from 'moment';
import { FC } from 'react';
import { Image } from '../Image/Image.component';

export type BlogArticleProps = {
  id: string;
  title: string;
  tags: {
    label: string;
    value: string;
  }[];
  avatar: string;
  author: string;
  data: Date;
  description?: string;
  image?: string;
  selectedArticles: string[];
  handleSelectArticle: (value: string) => void;
};

export const BlogArticle: FC<BlogArticleProps> = ({
  id,
  title,
  description,
  tags,
  avatar,
  author,
  data,
  image,
  selectedArticles,
  handleSelectArticle,
}) => {
  const selectedArticle = selectedArticles.includes(id);
  return (
    <Card
      style={
        selectedArticle
          ? { padding: '8px', border: '4px solid #69C0FF', borderRadius: '8px', cursor: 'pointer' }
          : { padding: '8px' }
      }
      hoverable={!selectedArticle}
      bordered={false}
      onClick={() => {
        handleSelectArticle(id);
      }}
    >
      <Row>
        <Col style={{ marginBottom: '24px' }} flex={3}>
          <h3 style={{ marginBottom: '16px' }}>{title}</h3>
          {tags.map((tag) => {
            return (
              <Tag key={tag.label} color={tag.value}>
                {tag.label}
              </Tag>
            );
          })}
        </Col>
        <Col flex={2}>
          {image && <Image style={{ borderRadius: '4px' }} width={272} height={78} alt={'image'} src={image} />}
        </Col>
        {description && (
          <Col style={{ marginBottom: '24px' }} span={24}>
            <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
              {description}
            </Typography.Text>
          </Col>
        )}
        <Col span={24}>
          <Avatar style={{ marginRight: '8px' }} src={avatar} size={'small'} />
          <Typography.Link style={{ fontSize: '16px', marginRight: '18px' }}>{author}</Typography.Link>
          <Typography.Text style={{ marginRight: '8px' }}>Опубликовано:</Typography.Text>
          <Typography.Text type="secondary">{moment(data).format('YYYY-MM-DD HH:MM')}</Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};
