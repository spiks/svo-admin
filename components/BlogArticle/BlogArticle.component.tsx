import { Avatar, Col, Row, Tag, Typography, Card } from 'antd';
import { AdminBlogArticle } from 'generated';
import moment from 'moment';
import { FC } from 'react';
import { Image } from '../Image/Image.component';
import { ArticleBlogStatus } from '../../pages/content/blog';
import { UserOutlined } from '@ant-design/icons';
import { extractFullName } from '../../utility/extractFullName';
import { ArticleMarkdown } from '@components/ArcticleMarkdown/ArticleMarkdown.component';

export type BlogArticleProps = {
  selectedArticles: string[];
  handleSelectArticle: () => void;
  status: ArticleBlogStatus;
};

export const getTagItem = (status: ArticleBlogStatus) => {
  switch (status) {
    case 'article_published':
    case 'article_archived': {
      return null;
    }
    case 'article_awaiting_review': {
      return (
        <Tag color={'#FFFBE6'} style={{ border: '1px solid #FFE58F', borderRadius: '2px', color: '#D48806' }}>
          {'На модерации'}
        </Tag>
      );
    }
    case 'article_rejected':
      return (
        <Tag color={'#FFF1F0'} style={{ border: '1px solid #FFBB96', borderRadius: '2px', color: '#D4380D' }}>
          {'Отклонено'}
        </Tag>
      );
  }
};

export const BlogArticle: FC<BlogArticleProps & AdminBlogArticle> = ({
  id,
  title,
  tags,
  author,
  publicationDate,
  cover,
  selectedArticles,
  handleSelectArticle,
  status,
  shortText,
  showPreviewFromArticle,
  text,
}) => {
  const selectedArticle = selectedArticles.includes(id);
  const fullName = extractFullName(author);
  const description = showPreviewFromArticle ? <ArticleMarkdown>{text}</ArticleMarkdown> : <>{shortText}</>;
  return (
    <Card
      style={
        selectedArticle
          ? { padding: '8px', outline: '4px solid #69C0FF', borderRadius: '8px', cursor: 'pointer' }
          : { padding: '8px' }
      }
      hoverable={!selectedArticle}
      bordered={false}
      onClick={handleSelectArticle}
    >
      <Row justify="space-between">
        <Col style={{ marginBottom: tags.length ? '24px' : '0' }} span={14}>
          <h3 style={{ marginBottom: '16px' }}>{title}</h3>
          {tags.map((tag) => {
            //TODO: сделать разноцветный Tag компонент
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
              unoptimized={true}
            />
          )}
        </Col>
        <Col style={{ marginBottom: '24px' }} span={24}>
          <Typography.Paragraph ellipsis={{ rows: 3 }} type="secondary" style={{ fontSize: '16px' }}>
            {description}
          </Typography.Paragraph>
        </Col>
        <Col span={14}>
          {author.avatar ? (
            <Avatar style={{ marginRight: '8px' }} src={'https://' + author.avatar.sizes.medium.url} size={'small'} />
          ) : (
            <Avatar style={{ marginRight: '8px' }} icon={<UserOutlined />} size={'small'} />
          )}
          <Typography.Link style={{ fontSize: '16px', marginRight: '18px' }}>{fullName}</Typography.Link>
          <Typography.Text style={{ marginRight: '8px' }}>Дата создания:</Typography.Text>
          <Typography.Text type="secondary">{moment(publicationDate).format('YYYY-MM-DD HH:MM')}</Typography.Text>
        </Col>
        <Col>{getTagItem(status)}</Col>
      </Row>
    </Card>
  );
};
