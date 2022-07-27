import { markdownToDraft } from 'markdown-draft-js';
import { convertFromRaw, EditorState } from 'draft-js';

export const fromStringToContentState = (value?: string) => {
  const markdown = value || '';
  const draft = markdownToDraft(markdown);
  const contentState = convertFromRaw(draft);
  return EditorState.createWithContent(contentState);
};
