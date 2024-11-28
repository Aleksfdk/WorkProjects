import { FC, ReactNode } from 'react';
import { Modal, ModalProps } from 'antd';

interface IFullWidthModalProps extends ModalProps {
  children: ReactNode;
}

// С помощью этого класса я переопределяю стили для модального окна в файле override-antd-styles.
// Чтобы не влиять на все модальные окна, я добавил дополнительный класс
const modalOverrideClassName = 'full-width-modal';

export const FullWidthModal: FC<IFullWidthModalProps> = ({ children, className = '', ...rest }) => {
  return (
    <Modal closable destroyOnClose centered footer={false} width='92%' {...rest} className={`${modalOverrideClassName} ${className}`}>
      {children}
    </Modal>
  );
};
