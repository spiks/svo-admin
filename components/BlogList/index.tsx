import { Badge, Col, List, PaginationProps, Row } from 'antd';
import { FC } from 'react';
import { BlogArticle } from '../BlogArticle';

export type BlogArticlesType = {
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
}[];

const blogArticles: BlogArticlesType = [
  {
    title: 'Персональные данные — почему они всем так нужны (кроме нас)',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim, nunc faucibus aliquet adipiscing vestibulum laoreet. Volutpat et ut ullamcorper duis commodo quam. Accumsan id fusce eu turpis netus nibh. Vitae ullamcorper elementum accumsan congue turpis potenti. Cursus non, nisi sit venenatis vitae at sit. Adipiscing sit blandit odio egestas magna egestas a. Nunc, faucibus eu, neque in eget. Dis ut tortor eget quam a...',
    tags: [
      { label: 'Общая практика', value: 'gold' },
      { label: 'Мотивация', value: 'blue' },
      { label: 'Семья', value: 'lime' },
      { label: 'Мысли', value: 'gray' },
      { label: 'Страх', value: 'gray' },
    ],
    avatar: '',
    author: 'Станислав Концевич',
    data: new Date(),
  },
  {
    title: 'Колыбель для взрослого: как восполнить нехватку материнской любви',
    tags: [
      { label: 'Общая практика', value: 'gold' },
      { label: 'Мотивация', value: 'blue' },
      { label: 'Семья', value: 'lime' },
      { label: 'Мысли', value: 'gray' },
      { label: 'Страх', value: 'gray' },
      { label: 'Чувства', value: 'gray' },
    ],
    avatar: 'https://klike.net/uploads/posts/2019-03/1551511801_1.jpg',
    author: 'Станислав Концевич',
    data: new Date(),
  },
];

export const BlogList: FC = () => {
  return (
    <List
      style={{ width: '100%' }}
      size="large"
      itemLayout="vertical"
      header={
        <Row gutter={8}>
          <Col>
            <span>Найдено статей:</span>
          </Col>
          <Col>
            <Badge count={blogArticles.length} />
          </Col>
        </Row>
      }
      dataSource={blogArticles}
      renderItem={(item) => <BlogArticle {...item} />}
    />
  );
};
