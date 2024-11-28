import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react';
import { Input, Row, Spin, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import cn from 'classnames';
import { Button, customNotification, Icon, NOTIFICATION_TYPES } from 'common/ui';
import { IFormFieldProps } from 'types/entities';
import styles from './styles.module.scss';

interface Props {
  field: IFormFieldProps;
  readOnly?: boolean;
  accept?: string;
  input?: string;
  onInput?: (value: string) => void;
  onChange?: (uploadFile: RcFile) => void;
  placeholder?: string;
  className?: string;
  isShowTitleChange?: boolean;
  setValueBeforeUpload?: boolean;
  btnLoading?: boolean;
  showIcon?: boolean;
  defaultFileList?: UploadFile[] | undefined;
  disabled?: boolean;
  btnPreview?: boolean;
  onRemoveFile?: () => void;
  limit?: number;
  withButtons?: boolean;
}

export const SingleFileUpload: FC<Props> = ({
  onChange,
  input,
  onInput,
  readOnly,
  accept = '*',
  placeholder = '',
  className,
  isShowTitleChange = false,
  setValueBeforeUpload = true,
  btnLoading = false,
  showIcon = true,
  btnPreview = false,
  defaultFileList,
  disabled,
  onRemoveFile,
  limit = 10000,
  withButtons = true
}) => {
  const [inputValue, setInputValue] = useState('');
  const [address, setAddress] = useState<string | undefined>();
  const [sizeError, setSizeError] = useState(false);
  const maxFileSizeBytes = limit * 1024 * 1024;

  useEffect(() => {
    if (typeof input === 'string') {
      setInputValue(input);
    }
  }, [input]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInput && onInput(e.target.value);
  };

  const onBeforeUpload = (file: RcFile) => {
    const isLessThanMaxSize = file.size <= maxFileSizeBytes;
    setSizeError(!isLessThanMaxSize);

    if (!isLessThanMaxSize) {
      customNotification({ type: NOTIFICATION_TYPES.ERROR, message: `Файл должен быть меньше, чем ${limit}mb!` });
      return false;
    }

    onChange && onChange(file);
    setAddress(URL.createObjectURL(file as RcFile));
    setValueBeforeUpload && setInputValue(file.name);
    return false;
  };

  const onPreview = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(
      address ? address : defaultFileList && defaultFileList[0].url && `${process.env.REACT_APP_API}/files/${defaultFileList[0].url}`,
      '_blank'
    );
  };

  const clearInputFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setInputValue('');
    setAddress('');
    onRemoveFile && onRemoveFile();
  };

  return (
    <div className={cn(styles.container, className)}>
      <Upload
        defaultFileList={defaultFileList}
        className={styles.logoUpload}
        maxCount={1}
        showUploadList={false}
        beforeUpload={onBeforeUpload}
        onChange={() => false}
        disabled={disabled}
        accept={accept}
      >
        <div
          className={cn(styles.inputBlock, {
            [styles.inputBlockBorder]: address ?? inputValue,
            [styles.sizeError]: sizeError
          })}
        >
          <Input
            className={styles.logoInput}
            accept={accept}
            readOnly={readOnly}
            value={inputValue}
            onChange={onInputChange}
            placeholder={placeholder}
            disabled={disabled}
          />
          {btnPreview && !!inputValue.length && (
            <Button type='link' onClick={onPreview} className={cn(styles.btnReview, { [styles.btnReviewDisabled]: disabled })}>
              <Icon className={styles.searchIcon} type='violet search' />
              Просмотр
            </Button>
          )}
        </div>
        {withButtons && (
          <>
            {inputValue && isShowTitleChange ? (
              <Row style={{ width: '100px', justifyContent: 'space-between' }}>
                <Button type='default' className={cn(styles.btn, styles.btnMake)} disabled={disabled}>
                  {btnLoading ? <Spin /> : <Icon type={'pen2'} />}
                </Button>
                {inputValue && (
                  <Button
                    type='default'
                    className={cn(styles.btn, { [styles.btnDelete]: true }, styles.btnMake)}
                    disabled={disabled}
                    onClick={clearInputFile}
                  >
                    <Icon type='delete-outline' />
                  </Button>
                )}
              </Row>
            ) : (
              <Button type='default' className={cn(styles.btn, styles.uploadBtn)} loading={btnLoading} disabled={disabled}>
                Загрузить
              </Button>
            )}
          </>
        )}
      </Upload>
    </div>
  );
};
