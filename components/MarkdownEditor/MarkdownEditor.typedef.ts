export type MarkdownEditorProps = {
  initialValue?: string;
  onChange?: (markdown: string) => void;
};

export enum MarkdownEditorInlineStyle {
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  UNDERLINE = 'UNDERLINE',
  STRIKETHROUGH = 'STRIKETHROUGH',
}

export enum MarkdownEditorBlockType {
  ORDERED_LIST_ITEM = 'ordered-list-item',
  UNORDERED_LIST_ITEM = 'unordered-list-item',
  HEADER_ONE = 'header-one',
  HEADER_THREE = 'header-three',
  PARAGRAPH = 'paragraph',
  UNSTYLED = 'unstyled',
  BLOCKQUOTE = 'blockquote',
}
