import { FC, MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { Editor, EditorProps } from 'react-draft-wysiwyg';
import { fromStringToContentState } from './MarkdownEditor.utils';
import { MarkdownEditorBlockType, MarkdownEditorInlineStyle, MarkdownEditorProps } from './MarkdownEditor.typedef';
import { convertFromRaw, convertToRaw, EditorState, Modifier, RichUtils } from 'draft-js';
import styles from './MarkdownEditor.module.css';
import Image from 'next/image';
import formatBoldSvg from './MarkdownEditor.resources/format_bold_24px.svg';
import formatItalicSvg from './MarkdownEditor.resources/format_italic_24px.svg';
import formatUnderlineSvg from './MarkdownEditor.resources/format_underlined_24px.svg';
import formatUnorderedListSvg from './MarkdownEditor.resources/format_list_bulleted_24px.svg';
import formatOrderedListSvg from './MarkdownEditor.resources/format_list_numbered_24px.svg';
import formatSizeSvg from './MarkdownEditor.resources/title_24px.svg';
import formatStrikeThroughSvg from './MarkdownEditor.resources/format_strikethrough_24px.svg';
import blockImageSvg from './MarkdownEditor.resources/block_image.svg';
import { Button, Col, Form, Input, Popover, Radio, RadioChangeEvent, Row, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useImageForm } from '@components/MarkdownEditor/MarkdownEditor.hooks/useImageForm';
import { getValueFromEvent } from '@components/MarkdownEditor/MarkdownEditor.utils/getValueFromUploadEvent';
import { HttpRequestHeader } from 'antd/es/upload/interface';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';

export const MarkdownEditor: FC<MarkdownEditorProps> = ({ initialValue, onChange }) => {
  const [touched, setTouched] = useState(false);

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
      const raw = convertToRaw(contentState);
      const markdown = draftToMarkdown(raw);
      onChange(markdown);
    },
    [onChange, touched],
  );

  const [uploadOpen, setUploadOpen] = useState(false);
  const {
    form: imageForm,
    imageValidator,
    submit: imageFormSubmit,
    imageUploadUrl,
    image: imageFormImage,
    url: imageFormUrl,
    urlValidator,
  } = useImageForm({
    onSuccess: async (link) => {
      if (!link) {
        return;
      }

      const cleanLink = link.split('?')[0];
      const fileNameIndex = cleanLink.lastIndexOf('/');
      const alt = cleanLink.substring(fileNameIndex + 1);

      // Так как чистый маркдаун не сохраняется в стейт, приходится использовать специальный идентификатор
      // <img, на месте которого может быть любой другой произвольный набор символов. Не нашел, как нативно вместо изображения,
      // вставлять md так, чтобы он не удалялся и был доступен после сохранения или редактирования статьи.
      // Текущая реализация на фронте предполагает, что мы заменяем <img на !, таким образом переводя контент в маркдавн.
      let image = `\n<img[${alt}](${cleanLink})\n`;
      const contentState = Modifier.insertText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        image,
        editorState.getCurrentInlineStyle(),
      );
      const nextState = EditorState.push(editorState, contentState, 'insert-characters');
      setEditorState(EditorState.push(editorState, contentState, 'insert-characters'));
      handleEditorStateChange(nextState);
      imageForm.resetFields();
      setUploadOpen(false);
    },
  });

  const [editorState, setEditorState] = useState(fromStringToContentState(initialValue));

  /** Keep initial value until any changes by user happen  */
  useEffect(() => {
    if (touched) {
      return;
    }

    if (initialValue) {
      const draft = markdownToDraft(initialValue);
      const content = convertFromRaw(draft);
      const state = EditorState.createWithContent(content);
      setEditorState(state);
    }
  }, [initialValue, touched]);

  /** Current block formatting styles toggle */
  const handleInlineStyleToggle = useCallback(
    (inlineStyle: MarkdownEditorInlineStyle) => {
      const state = RichUtils.toggleInlineStyle(editorState, inlineStyle);
      setEditorState(state);
      handleEditorStateChange(state);
    },
    [editorState, handleEditorStateChange],
  );

  /** Current block type toggle */
  const handleBlockTypeToggle = useCallback(
    (type: MarkdownEditorBlockType) => {
      const state = RichUtils.toggleBlockType(editorState, type);
      setEditorState(state);
      handleEditorStateChange(state);
    },
    [editorState, handleEditorStateChange],
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

  // Функция исключительно для кнопки добавления изображений, обрабатывает клик вне контейнера Popover
  const handleClickOutside = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement)
      if (!event.target.closest('.ant-popover-content') && !event.target.closest('img[alt="add image"]'))
        setUploadOpen(false);
  };

  useEffect(() => {
    if (uploadOpen) document.addEventListener('click', handleClickOutside);
    else document.removeEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);
  }, [uploadOpen]);

  return (
    <div className={styles['container']}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        locale={'ru'}
        wrapperClassName={styles['markdown-editor']}
        toolbar={{
          options: [],
        }}
        /* Toolbar buttons */
        toolbarCustomButtons={[
          /* Bold */
          <button key="bold" type="button" onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.BOLD)}>
            <Image {...formatBoldSvg} alt={'bold'} unoptimized={true} />
          </button>,
          /* Italic */
          <button
            key="italic"
            type="button"
            onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.ITALIC)}
          >
            <Image {...formatItalicSvg} alt={'italic'} unoptimized={true} />
          </button>,
          /* Underline */
          <button
            key="underline"
            type="button"
            onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.UNDERLINE)}
          >
            <Image {...formatUnderlineSvg} alt={'underline'} unoptimized={true} />
          </button>,
          /* Strike through */
          <button
            key="strike-through"
            type="button"
            onClick={handleInlineStyleToggle.bind(null, MarkdownEditorInlineStyle.STRIKETHROUGH)}
          >
            <Image {...formatStrikeThroughSvg} alt={'strike through'} unoptimized={true} />
          </button>,
          /* Unordered list */
          <button
            key="unordered-list"
            type="button"
            onClick={handleBlockTypeToggle.bind(null, MarkdownEditorBlockType.UNORDERED_LIST_ITEM)}
          >
            <Image {...formatUnorderedListSvg} alt={'unordered list'} unoptimized={true} />
          </button>,
          /* Ordered list */
          <button
            key="ordered-list"
            type="button"
            onClick={handleBlockTypeToggle.bind(null, MarkdownEditorBlockType.ORDERED_LIST_ITEM)}
          >
            <Image {...formatOrderedListSvg} alt={'ordered list'} unoptimized={true} />
          </button>,
          /* Popover for different text sizes */
          <Popover
            content={
              <Radio.Group
                value={activeBlockTextType}
                onChange={handleTextTypeChange}
                style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}
              >
                <Radio.Button value={MarkdownEditorBlockType.HEADER_ONE}>Заголовок</Radio.Button>
                {/*<Radio.Button value={MarkdownEditorBlockType.HEADER_THREE}>Подзаголовок</Radio.Button>*/}
                <Radio.Button value={MarkdownEditorBlockType.PARAGRAPH}>Основной текст</Radio.Button>
                <Radio.Button value={MarkdownEditorBlockType.BLOCKQUOTE}>Цитата</Radio.Button>
                {/*<Radio.Button value={MarkdownEditorBlockType.UNSTYLED}>Чистый текст</Radio.Button>*/}
              </Radio.Group>
            }
            key="block-text-type"
            title="Тип текста"
          >
            <button type="button">
              <Image {...formatSizeSvg} alt={'block text type'} unoptimized={true} />
            </button>
          </Popover>,
          /* Popover for images uploading */
          <Popover
            placement={'top'}
            open={uploadOpen}
            content={
              <Form form={imageForm} layout={'vertical'} onFinish={imageFormSubmit}>
                <Form.Item name={'url'} label={'URL'} rules={[urlValidator]}>
                  <Input type={'text'} disabled={!!imageFormImage} />
                </Form.Item>
                <Form.Item
                  name={'image'}
                  getValueFromEvent={getValueFromEvent}
                  valuePropName={'fileList'}
                  rules={[imageValidator]}
                  style={{
                    maxWidth: '219px',
                  }}
                >
                  <Upload
                    headers={{ 'X-Requested-With': null } as unknown as HttpRequestHeader}
                    multiple={false}
                    maxCount={1}
                    showUploadList={true}
                    action={imageUploadUrl}
                  >
                    <Button disabled={!!imageFormImage || imageFormUrl} icon={<UploadOutlined />}>
                      Загрузить с компьютера
                    </Button>
                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Row justify={'space-between'}>
                    <Col>
                      <Button
                        htmlType={'button'}
                        onClick={imageForm.resetFields.bind(null, undefined) as unknown as MouseEventHandler<unknown>}
                        danger={true}
                      >
                        Сбросить
                      </Button>
                    </Col>
                    <Col>
                      <Button htmlType={'submit'} type={'primary'} disabled={!imageFormImage && !imageFormUrl}>
                        Вставить
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            }
            key="add-image"
            title={'Вставить изображение'}
          >
            <button onClick={setUploadOpen.bind(null, !uploadOpen)} type={'button'}>
              <Image {...blockImageSvg} alt={'add image'} unoptimized={true} />
            </button>
          </Popover>,
        ]}
      />
    </div>
  );
};
