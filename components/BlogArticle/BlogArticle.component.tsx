import { Avatar, Col, Row, Tag, Typography, Card } from 'antd';
import { max } from 'date-fns';
import { AdminBlogArticle } from 'generated';
import moment from 'moment';
import { FC } from 'react';
import { Image } from '../Image/Image.component';

export type BlogArticleProps = {
  selectedArticles: string[];
  handleSelectArticle: (value: string) => void;
};

export const BlogArticle: FC<BlogArticleProps & AdminBlogArticle> = ({
  id,
  title,
  text,
  tags,
  author,
  publicationDate,
  cover,
  selectedArticles,
  handleSelectArticle,
}) => {
  const selectedArticle = selectedArticles.includes(id);
  return (
    <Card
      style={
        selectedArticle
          ? { padding: '8px', outline: '4px solid #69C0FF', borderRadius: '8px', cursor: 'pointer' }
          : { padding: '8px' }
      }
      hoverable={!selectedArticle}
      bordered={false}
      onClick={() => {
        handleSelectArticle(id);
      }}
    >
      <Row justify="space-between">
        <Col style={{ marginBottom: '24px' }} span={14}>
          <h3 style={{ marginBottom: '16px' }}>{title}</h3>
          {tags.map((tag) => {
            return <Tag key={tag.id}>{tag.name}</Tag>;
          })}
        </Col>
        <Col>
          {cover && (
            <Image
              layout="fixed"
              objectFit="cover"
              style={{ borderRadius: '4px' }}
              width={272}
              height={78}
              alt={'image'}
              src={'https://' + cover.sizes.original.url}
            />
          )}
        </Col>
        <Col style={{ marginBottom: '24px' }} span={24}>
          <Typography.Paragraph ellipsis={{ rows: 3 }} type="secondary" style={{ fontSize: '16px' }}>
            {text}
          </Typography.Paragraph>
        </Col>
        <Col span={24}>
          <Avatar style={{ marginRight: '8px' }} src={author.avatar} size={'small'} />
          <Typography.Link style={{ fontSize: '16px', marginRight: '18px' }}>{author.fullName}</Typography.Link>
          <Typography.Text style={{ marginRight: '8px' }}>Опубликовано:</Typography.Text>
          <Typography.Text type="secondary">{moment(publicationDate).format('YYYY-MM-DD HH:MM')}</Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};
