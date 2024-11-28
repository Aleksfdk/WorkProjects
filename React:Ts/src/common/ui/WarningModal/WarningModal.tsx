import {FC, ReactNode, SetStateAction, useEffect, useState} from 'react';
import { Input, Spin } from 'antd';
import cn from 'classnames';
import { IIconType } from 'types/common';
import { ButtonKit } from '../../ui-kit';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import styles from './styles.module.scss';

interface IWarningModalProps {
  visible: boolean;
  onClick?: (value?: string) => void;
  label?: string;
  className?: string;
  onCancel: () => void;
  isLoading?: boolean;
  description?: string | ReactNode;
  confirmBtn?: string;
  cancelBtn?: string;
  iconType?: IIconType;
  width?: number;
  onClose?: () => void;
  labelInput?: string;
  returnValue?: boolean;
  errorField?: boolean;
  errorText?: string;
  setErrorFieldClear?: () => void;
}

export const WarningModal: FC<IWarningModalProps> = (props) => {
  const {
    visible,
    onClick,
    className,
    onCancel,
    description,
    label,
    confirmBtn,
    cancelBtn,
    isLoading = false,
    iconType = 'info',
    width = 504,
    onClose,
    labelInput,
    errorField,
    errorText,
    setErrorFieldClear
  } = props;

  const [inputValue, setInputValue] = useState<string>('');

  const onSave = async () => {
    if (inputValue) {
      onClick?.(inputValue);
    } else {
      onClick?.();
    }
  };

  return (
    <Modal
      width={width}
      destroyOnClose
      centered
      onCancel={() => {
        setInputValue('');
        onClose?.() || onCancel();
      }}
      className={cn(styles.modal, className)}
      footer={false}
      open={visible}
    >
      <Spin spinning={isLoading}>
        <div className={styles.contentBlock}>
          <Icon className={styles.icon} type={iconType} />
          <h3 className={styles.title}>{label}</h3>
          <span className={styles.additional}>{description}</span>
          {labelInput && <span className={styles.labelInput}>{labelInput}</span>}
          {labelInput && (
            <Input
              className={cn({ [styles.emptyField]: errorField })}
              onChange={(e) => {
                setErrorFieldClear && setErrorFieldClear();
                setInputValue(e.target.value);
              }}
              value={inputValue}
              placeholder='Введите текст'
            />
          )}
          {labelInput && errorField && <span className={styles.emptyFieldText}>{errorText}</span>}
        </div>
        <div className={styles.btnsBlock}>
          {cancelBtn && (
            <ButtonKit typeBtn='secondary' className={styles.btn} onClick={onCancel}>
              {cancelBtn}
            </ButtonKit>
          )}
          {confirmBtn && (
            <ButtonKit disabled={!!labelInput && !inputValue} className={styles.btn} onClick={onSave}>
              {confirmBtn}
            </ButtonKit>
          )}
        </div>
      </Spin>
    </Modal>
  );
};
