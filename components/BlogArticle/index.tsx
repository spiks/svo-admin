import { Avatar, Col, List, Row, Tag, Typography } from 'antd';
import { FC } from 'react';
import { format } from 'date-fns';
import { Image } from '../Image';

export type BlogArticleProps = {
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
};

export const BlogArticle: FC<BlogArticleProps> = ({ title, description, tags, avatar, author, data, image }) => {
  return (
    <List.Item
      style={{ padding: '32px' }}
      actions={[
        <Row key={1} gutter={18} align="middle">
          <Col>
            <Row gutter={8} align="middle">
              <Col>
                <Avatar src={avatar} size={'small'} />
              </Col>
              <Col>
                <Typography.Link style={{ fontSize: '16px' }}>{author}</Typography.Link>
              </Col>
            </Row>
          </Col>
          <Col>
            <span style={{ color: '#262626' }}>Опубликовано: </span>
            <span>{format(data, 'yyyy-MM-dd HH:mm')}</span>
          </Col>
        </Row>,
      ]}
    >
      <List.Item.Meta
        title={
          <Row justify="space-between">
            <Col>
              <h3 style={{ marginBottom: '16px' }}>{title}</h3>
              {tags.map((tag) => {
                return (
                  <Tag key={tag.label} color={tag.value}>
                    {tag.label}
                  </Tag>
                );
              })}
            </Col>
            <Col>
              {image && <Image style={{ borderRadius: '4px' }} width={272} height={78} alt={'image'} src={image} />}
            </Col>
          </Row>
        }
        description={description && <span style={{ fontSize: '16px' }}>{description}</span>}
      />
    </List.Item>
  );
};
