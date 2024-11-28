import React, { FC } from 'react';
import { Modal } from 'antd';
import { exportModalProps } from 'common/constants/certificate.config';
import styles from '../../../instructor/CourseInstructors/components/styles.module.scss';
import styleGeneration from '../../styles.module.scss';

interface ModalPreviewProps {
  previewLink: string;
  isModalPreview: boolean;
  onCancel: () => void;
}
export const ModalPreviewCert: FC<ModalPreviewProps> = ({ previewLink, isModalPreview, onCancel }) => {
  return (
    <>
      <Modal
        {...exportModalProps('СЕРТИФИКАТ')}
        className={`${styles.modal} ${styleGeneration.modalGeneration} `}
        open={isModalPreview}
        onCancel={() => onCancel()}
      >
        <img className={styleGeneration.previewImg} src={previewLink} alt='' />
      </Modal>
    </>
  );
};
