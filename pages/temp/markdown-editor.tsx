import { NextPage } from 'next';
import { MainLayout } from '../../components/MainLayout/MainLayout.component';
import dynamic from 'next/dynamic';
import { MarkdownEditorProps } from '../../components/MarkdownEditor/MarkdownEditor.typedef';

const MarkdownEditor = dynamic<MarkdownEditorProps>(
  () => {
    return import('../../components/MarkdownEditor/MarkdownEditor.component').then((mod) => {
      return mod.MarkdownEditor;
    });
  },
  {
    ssr: false,
  },
);

const MarkdownEditorPage: NextPage = () => {
  return (
    <MainLayout>
      <div style={{ padding: '100px' }}>
        <MarkdownEditor />
      </div>
    </MainLayout>
  );
};

export default MarkdownEditorPage;
