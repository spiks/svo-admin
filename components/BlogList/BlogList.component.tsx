import { Badge, Button, Col, List, Pagination, Row, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import { BlogArticle } from '../BlogArticle/BlogArticle.component';
import style from './BlogList.module.css';

export type BlogArticlesType = {
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
}[];

const blogArticles: BlogArticlesType = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
  {
    id: '5',
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
];

export type BlogListProps = {
  showFilters: boolean;
};

export const BlogList: FC<BlogListProps> = ({ showFilters }) => {
  const [multipleChoice, setMultipleChoice] = useState<boolean>(true);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  useEffect(() => {
    if (showFilters) {
      setMultipleChoice(false);
    }
  }, [showFilters]);

  const idArticles = blogArticles.map((article) => {
    return article.id;
  });

  const toggleMultipleChoice = () => {
    setMultipleChoice(!multipleChoice);
    setSelectedArticles([]);
  };

  const handleSelectArticle = (id: string) => {
    if (multipleChoice) {
      const index = selectedArticles.indexOf(id);
      if (index !== -1) {
        selectedArticles.splice(index, 1);
      } else {
        selectedArticles.push(id);
      }
      setSelectedArticles([...selectedArticles]);
    }
  };

  const selectAllArticles = () => {
    setSelectedArticles([...idArticles]);
  };

  return (
    <List
      style={{ width: '100%', backgroundColor: '#FFFFFF' }}
      size="large"
      itemLayout="vertical"
      header={
        <Row align="middle" justify="space-between">
          <Row gutter={8}>
            <Col>
              <span>{showFilters || !multipleChoice ? 'Найдено статей:' : 'Выбрано:'}</span>
            </Col>
            <Col>
              <Badge count={showFilters || !multipleChoice ? blogArticles.length : selectedArticles.length} />
            </Col>
          </Row>
          <Row>
            {!showFilters && (
              <Row align="middle" gutter={24}>
                <Col>
                  <span style={{ marginRight: '28px' }}>Множественный выбор</span>
                  <Switch onChange={toggleMultipleChoice} defaultChecked={multipleChoice} />
                </Col>
                {multipleChoice && (
                  <Col>
                    <Button
                      onClick={() => {
                        selectAllArticles();
                      }}
                      style={{ marginRight: '8px' }}
                    >
                      Выбрать всё
                    </Button>
                    <Button>Отправить в архив</Button>
                  </Col>
                )}
              </Row>
            )}
            <Row>
              <Pagination
                className={style['pagination']}
                showSizeChanger
                totalBoundaryShowSizeChanger={1}
                hideOnSinglePage={false}
              />
            </Row>
          </Row>
        </Row>
      }
      pagination={{
        showSizeChanger: true,
        total: 500,
      }}
      dataSource={blogArticles}
      renderItem={(item) => {
        return (
          <List.Item style={{ padding: '24px 16px 27px 16px' }}>
            <BlogArticle selectedArticles={selectedArticles} handleSelectArticle={handleSelectArticle} {...item} />
          </List.Item>
        );
      }}
    />
  );
};
