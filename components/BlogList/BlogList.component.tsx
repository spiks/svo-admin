import { useBlogHeaderQueryParams } from '@components/BlogHeader/BlogHeader.hooks/useBlogHeaderQueryParams';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Col, List, Pagination, Row, Switch } from 'antd';
import { getListBlogArticles } from 'api/blog/getListBlogArticles';
import { markBlogArticlesAsArchived } from 'api/blog/markBlogArticlesAsArchived';
import { AdminBlogArticle, DateWithTimezone } from 'generated';
import { ArticleBlogStatus } from 'pages/content/blog';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { getTimeZoneToString } from 'utility/getTimeZoneToString';
import { BlogArticle } from '../BlogArticle/BlogArticle.component';
import style from './BlogList.module.css';
import { router } from 'next/client';
import { NAVIGATION } from '../../constants/navigation';

export type BlogListProps = {
  showFilters: boolean;
  activeTab: ArticleBlogStatus;
};

const BlogList: FC<BlogListProps> = ({ showFilters, activeTab }) => {
  const [multipleChoice, setMultipleChoice] = useState<boolean>(false);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { search, tags, publishDate } = useBlogHeaderQueryParams();

  const dateWithTimeZone = useMemo((): DateWithTimezone | null => {
    if (publishDate) {
      return {
        date: publishDate,
        timezone: getTimeZoneToString(new Date(publishDate)),
      };
    }
    return null;
  }, [publishDate]);

  const queryClient = useQueryClient();

  const updateBlogArticleList = useMutation(() => fetchBlogArticles(page), {
    onSuccess: () => queryClient.invalidateQueries(['articles']),
  });

  const sendArticlesToArchive = async () => {
    await markBlogArticlesAsArchived(selectedArticles);
    updateBlogArticleList.mutate();
    setSelectedArticles([]);
  };

  const fetchBlogArticles = useCallback(
    (page) => {
      return getListBlogArticles({
        status: activeTab === 'article_archived' ? null : activeTab,
        search,
        isArchived: activeTab === 'article_archived',
        tags,
        publicationDate: dateWithTimeZone,
        pagination: {
          count: pageSize,
          offset: page * pageSize,
        },
      });
    },
    [pageSize, search, tags, activeTab, dateWithTimeZone],
  );

  const getQueryKey = useCallback(
    (page) => {
      return ['articles', page, publishDate, search, tags, pageSize, activeTab];
    },
    [pageSize, tags, search, publishDate, activeTab],
  );

  const { isFetching, data: blogArticlesList } = useQuery(
    getQueryKey(page),
    () => {
      return fetchBlogArticles(page - 1);
    },
    {
      keepPreviousData: true,
      retryDelay: 3000,
    },
  );

  useEffect(() => {
    if (showFilters) {
      setMultipleChoice(false);
      setSelectedArticles([]);
    }
  }, [showFilters]);

  const idArticles = blogArticlesList?.data.items.map((article) => {
    return article.id;
  });

  const toggleMultipleChoice = () => {
    setMultipleChoice(!multipleChoice);
    setSelectedArticles([]);
  };

  const handleSelectArticle = useCallback(
    (article: AdminBlogArticle) => {
      if (multipleChoice) {
        const index = selectedArticles.indexOf(article.id);
        if (index !== -1) {
          selectedArticles.splice(index, 1);
        } else {
          selectedArticles.push(article.id);
        }
        setSelectedArticles([...selectedArticles]);
      } else {
        switch (article.status) {
          case 'article_published': {
            router.push(`${NAVIGATION.blog}/editArticle/${article.id}`);
            break;
          }
          case 'article_awaiting_review': {
            router.push(`${NAVIGATION.blog}/moderateArticle/${article.id}`);
            break;
          }
        }
      }
    },
    [multipleChoice, selectedArticles],
  );

  const selectAllArticles = () => {
    if (idArticles) {
      setSelectedArticles([...idArticles]);
    }
  };

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPageSize(pageSize);
    setPage(page);
  }, []);

  return (
    <List
      loading={isFetching}
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
              <Badge
                count={showFilters || !multipleChoice ? blogArticlesList?.data.itemsAmount : selectedArticles.length}
              />
            </Col>
          </Row>
          <Row>
            {!showFilters && (
              <Row align="middle" gutter={24}>
                <Col>
                  <span style={{ marginRight: '28px' }}>Множественный выбор</span>
                  <Switch onChange={toggleMultipleChoice} defaultChecked={multipleChoice} />
                </Col>
                <Col>
                  <Button
                    disabled={!multipleChoice}
                    onClick={() => {
                      selectAllArticles();
                    }}
                    style={{ marginRight: '8px' }}
                  >
                    Выбрать всё
                  </Button>
                  <Button
                    disabled={!multipleChoice}
                    onClick={() => {
                      sendArticlesToArchive();
                    }}
                  >
                    Отправить в архив
                  </Button>
                </Col>
              </Row>
            )}
            <Row>
              <Pagination
                className={style['pagination']}
                current={page}
                showSizeChanger
                pageSize={pageSize}
                onChange={handlePaginationChange}
                pageSizeOptions={['10', '20', '50']}
              />
            </Row>
          </Row>
        </Row>
      }
      pagination={{
        current: page,
        pageSize: pageSize,
        onChange: handlePaginationChange,
        total: blogArticlesList?.data.itemsAmount,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      }}
      dataSource={blogArticlesList?.data.items}
      renderItem={(item) => {
        return (
          <List.Item style={{ padding: '24px 16px 27px 16px' }}>
            <BlogArticle
              selectedArticles={selectedArticles}
              handleSelectArticle={() => handleSelectArticle(item)}
              {...item}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default BlogList;
