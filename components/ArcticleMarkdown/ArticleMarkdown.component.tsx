import { FC } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';

export const ArticleMarkdown: FC<ReactMarkdownOptions> = ({ children }) => {
  return <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>{children}</ReactMarkdown>;
};
