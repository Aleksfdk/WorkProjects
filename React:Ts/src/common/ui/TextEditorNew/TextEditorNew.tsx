/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect } from 'react';
import { Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import cn from 'classnames';
import { useUploadTextEditorFileMutation } from 'api/instructor/storage/storage.api';
import {
  addAllowedTagsInFilterData,
  addIndentForTextLineByTab,
  changeTooltipOfToolbarElementCode,
  insertToolbarBeforeInit,
  removeFormatForCopyPaste,
  setResizeInBottom,
  setWrapperForTextEditor
} from './TextEditor.helper';
import styles from './styles.module.scss';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build-gof';

type ITextEditorProps = {
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  withoutWrapper?: boolean;
};

export const TextEditorNew: FC<ITextEditorProps> = (props) => {
  const { onChange: onFormItemChange, placeholder = '', defaultValue = '', disabled = false, withoutWrapper = false } = props;
  const [saveUpload, { isLoading }] = useUploadTextEditorFileMutation();

  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  const uploadAdapter = (editor: any, loader: any) => {
    return {
      upload: () => {
        return new Promise(() => {
          const body = new FormData();
          loader.file.then((file: any) => {
            body.append('file', file as RcFile);
            saveUpload(body)
              .unwrap()
              .then((file) => {
                editor.model.change((writer: any) => {
                  const imageElement = writer.createElement('imageBlock', {
                    src: process.env.REACT_APP_API + file.url
                  });
                  editor.model.insertContent(imageElement);
                });
              });
          });
        });
      }
    };
  };

  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return uploadAdapter(editor, loader);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = {
    extraPlugins: [uploadPlugin],
    image: {
      upload: {
        types: ['jpeg', 'png', 'gif', 'webp']
      }
    },
    placeholder,
    fontFamily: {
      options: [
        'default',
        'Segoe UI Symbol',
        'Helvetica',
        'Arial',
        'Comic-sans',
        'Courier New',
        'Georgia',
        'Lucida Sans',
        'Arial Black',
        'Impact',
        'Tahoma',
        'Times New Roman',
        'Verdana',
        'Fira sans',
        'Segoe UI',
        'Segoe UI Emoji',
        'Segoe UI Symbol'
      ]
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Обычный текст', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: { name: 'h2', classes: ['heading1'] }, title: 'Заголовок 1', class: 'ck-heading' },
        { model: 'heading2', view: { name: 'h3', classes: ['heading2'] }, title: 'Заголовок 2', class: 'ck-heading' },
        { model: 'heading3', view: { name: 'h4', classes: ['heading3'] }, title: 'Заголовок 3', class: 'ck-heading' }
      ]
    },
    fontSize: {
      options: [10, 12, 14, 16, 18, 20, 22, 24]
    },
    language: 'ru',
    link: {
      addTargetToExternalLinks: true
    }
  };

  return (
    <div className={cn(styles.editorWrapper, { [styles.disabled]: disabled })}>
      <Spin spinning={isLoading}>
        <CKEditor
          disabled={disabled}
          editor={Editor}
          config={config}
          data={defaultValue}
          onReady={(editor) => {
            addAllowedTagsInFilterData(editor);
            changeTooltipOfToolbarElementCode(editor);
            removeFormatForCopyPaste(editor);
            insertToolbarBeforeInit(editor);
            !withoutWrapper && setWrapperForTextEditor(styles);
            !withoutWrapper && setResizeInBottom(styles);
            addIndentForTextLineByTab(editor);
          }}
          onChange={(_, editor) => {
            onFormItemChange && onFormItemChange(editor.getData());
          }}
        />
      </Spin>
    </div>
  );
};
