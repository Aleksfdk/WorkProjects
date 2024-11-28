import { FC, ReactNode } from 'react';
import { Modal as AntModal, ModalProps } from 'antd';
import { Icon } from '../Icon';
import './Modal.scss';

interface IModalProps extends ModalProps {
  children: ReactNode;
}

export const Modal: FC<IModalProps> = ({ children, ...rest }) => {
  return (
    <AntModal closeIcon={<Icon type={'modal-close'} />} closable destroyOnClose centered footer={false} width='92%' {...rest}>
      {children}
    </AntModal>
  );
};
