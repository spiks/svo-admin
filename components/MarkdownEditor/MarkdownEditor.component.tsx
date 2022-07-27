import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Editor, EditorProps } from 'react-draft-wysiwyg';
import { fromStringToContentState } from './MarkdownEditor.utils';
import { MarkdownEditorBlockType, MarkdownEditorInlineStyle, MarkdownEditorProps } from './MarkdownEditor.typedef';
import { convertToRaw, RichUtils } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import styles from './MarkdownEditor.module.css';
import Image from 'next/image';
import formatBoldSvg from './MarkdownEditor.resources/format_bold_24px.svg';
import formatItalicSvg from './MarkdownEditor.resources/format_italic_24px.svg';
import formatUnderlineSvg from './MarkdownEditor.resources/format_underlined_24px.svg';
import formatUnorderedListSvg from './MarkdownEditor.resources/format_list_bulleted_24px.svg';
import formatOrderedListSvg from './MarkdownEditor.resources/format_list_numbered_24px.svg';
import formatSizeSvg from './MarkdownEditor.resources/title_24px.svg';
import formatStrikeThroughSvg from './MarkdownEditor.resources/format_strikethrough_24px.svg';
import { Popover, Radio, RadioChangeEvent } from 'antd';

export const MarkdownEditor: FC<MarkdownEditorProps> = ({ initialValue, onChange }) => {
  const [editorState, setEditorState] = useState(fromStringToContentState(initialValue));
  const [touched, setTouched] = useState(false);

  /** Keep initial value until any changes by user happen  */
  useEffect(() => {
    if (touched) {
      return;
    }

    const draftState = fromStringToContentState(initialValue);
    setEditorState(draftState);
  }, [initialValue, touched]);

  /** Editor state change handler */
  const handleEditorStateChange: EditorProps['onEditorStateChange'] = useCallback(
    (draftState) => {
      setEditorState(draftState);

      /** User changed content, don't reveal initial value anymore  */
      if (!touched) {
        setTouched(true);
      }

      if (!onChange) {
        return;
      }

      const contentState = draftState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      const markdown = draftToMarkdown(rawContentState);
      onChange(markdown);
    },
    [onChange, touched],
  );

  /** Current block formatting styles toggle */
  const handleInlineStyleToggle = useCallback(
    (inlineStyle: MarkdownEditorInlineStyle) => {
      const state = RichUtils.toggleInlineStyle(editorState, inlineStyle);
      setEditorState(state);
    },
    [editorState],
  );

  /** Current block type toggle */
  const handleBlockTypeToggle = useCallback(
    (type: MarkdownEditorBlockType) => {
      const state = RichUtils.toggleBlockType(editorState, type);
      setEditorState(state);
    },
    [editorState],
  );

  /** Text type toggle */
  const handleTextTypeChange = useCallback(
    (e: RadioChangeEvent) => {
      const type: MarkdownEditorBlockType = e.target.value;
      handleBlockTypeToggle(type);
    },
    [handleBlockTypeToggle],
  );

  /** Status */
  const activeBlockTextType = useMemo(() => {
    const currentSelection = editorState.getSelection();
    const blockKey = currentSelection.getStartKey();
    const block = editorState.getCurrentContent().getBlockForKey(blockKey);
    return block.getType();
  }, [editorState]);

  console.log(activeBlockTextType);

  return (
    <div className={styles['container']}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        locale={'ru'}
        wrapperClassName={styles['markdown-editor']}
      />
      {/* Toolbar */}
      <div className={styles['toolbar']}>
        {/* Bold */}
        <button onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.BOLD)}>
          <Image {...formatBoldSvg} alt={'bold'} unoptimized={true} />
        </button>
        {/* Italic */}
        <button onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.ITALIC)}>
          <Image {...formatItalicSvg} alt={'italic'} unoptimized={true} />
        </button>
        {/* Underline */}
        <button onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.UNDERLINE)}>
          <Image {...formatUnderlineSvg} alt={'underline'} unoptimized={true} />
        </button>
        {/* Strike through */}
        <button onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.STRIKETHROUGH)}>
          <Image {...formatStrikeThroughSvg} alt={'strike through'} unoptimized={true} />
        </button>
        {/* Dotted list */}
        <button onClick={handleBlockTypeToggle.bind(null, MarkdownEditorBlockType.UNORDERED_LIST_ITEM)}>
          <Image {...formatUnorderedListSvg} alt={'unordered list'} unoptimized={true} />
        </button>
        {/* Numeric list */}
        <button onClick={handleBlockTypeToggle.bind(null, MarkdownEditorBlockType.ORDERED_LIST_ITEM)}>
          <Image {...formatOrderedListSvg} alt={'ordered list'} unoptimized={true} />
        </button>
        {/* BLock text type */}
        <Popover
          content={
            <Radio.Group
              value={activeBlockTextType}
              onChange={handleTextTypeChange}
              style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}
            >
              <Radio.Button value={MarkdownEditorBlockType.HEADER_ONE}>Заголовок</Radio.Button>
              <Radio.Button value={MarkdownEditorBlockType.HEADER_THREE}>Подзаголовок</Radio.Button>
              <Radio.Button value={MarkdownEditorBlockType.PARAGRAPH}>Основной текст</Radio.Button>
              <Radio.Button value={MarkdownEditorBlockType.UNSTYLED}>Чистый текст</Radio.Button>
            </Radio.Group>
          }
          title="Тип текста"
        >
          <button>
            <Image {...formatSizeSvg} alt={'block text type'} unoptimized={true} />
          </button>
        </Popover>
      </div>
    </div>
  );
};
