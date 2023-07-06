import { FC } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';

export const ArticleMarkdown: FC<ReactMarkdownOptions> = ({ children }) => {
  const replacedImg = children.replace(/<img(\[.*])(\(.*\))/gi, '![]$2');
  // У нас подчеркнутый текст выделяется ++, markdown не поддерживает такой синтаксис в принципе, поэтому делаю замену на <u></u>
  const resultMarkdown = replacedImg.replace(/\+\+(.*?)\+\+/gi, '<u>$1</u>');
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
      {resultMarkdown}
    </ReactMarkdown>
  );
};
