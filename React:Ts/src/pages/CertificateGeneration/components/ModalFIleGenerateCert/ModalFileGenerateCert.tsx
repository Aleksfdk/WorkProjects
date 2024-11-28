import React, { FC, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { Icon, Input, Select } from 'common/ui';
import { ModalFooter } from 'common/components';
import { IFunction } from 'common/components/Chat/interfaces';
import { exportModalProps } from 'common/constants/certificate.config';
import { useGetListTempCertificatesQuery } from 'api/tempCertificates/tempCertificates.api';
import styles from '../../../instructor/CourseInstructors/components/styles.module.scss';
import styleGeneration from '../../styles.module.scss';

interface ModalUploadProps {
  isModalFileGenerate: boolean;
  onCancel: () => void;
  usersGenerateCert: string[];
  onGenerateCertificates: IFunction;
}

interface OptionsCertType {
  label: string;
  value: string;
}
export const ModalFileGenerateCert: FC<ModalUploadProps> = (modalProps) => {
  const [form] = Form.useForm();
  const { data: tempCertificates, isLoading } = useGetListTempCertificatesQuery({
    currentPage: 0,
    pageSize: 0,
    isReady: true
  });
  const [optionsCert, setOptionsCert] = useState<OptionsCertType[]>([]);
  const [certId, setCertId] = useState<string>('');

  useEffect(() => {
    tempCertificates?.items.map((item) => {
      setOptionsCert((prevState) => [...prevState, ...[{ label: item.title, value: item.id }]]);
    });
  }, [tempCertificates]);

  const onSubmit = () => {
    modalProps.onGenerateCertificates(certId);
  };
  const onChange = (id: string) => {
    setCertId(id);
  };

  return (
    <>
      <Modal
        {...exportModalProps('ГЕНЕРАЦИЯ СЕРТИФИКАТА')}
        className={`${styles.modal} ${styleGeneration.modalGeneration} `}
        open={modalProps.isModalFileGenerate}
        onCancel={() => {
          setCertId('');
          modalProps.onCancel();
        }}
        closeIcon={<Icon type='close' style={{ fontSize: '16px' }} />}
      >
        <div className={styleGeneration.infoPanel}>
          <Icon type={'info bordered'} />
          <p>Выберите сертификат, который будет сгенерирован для учащегося</p>
        </div>
        <Form form={form} onFinish={onSubmit} layout='vertical'>
          <Form.Item label='Выбор сертификата' required>
            <Select placeholder='Ничего не выбрано' onChange={onChange} options={optionsCert} value={certId} />
          </Form.Item>
        </Form>
        <ModalFooter
          saveDisable={!certId.length}
          onCancel={() => {
            setCertId('');
            modalProps.onCancel();
          }}
          onSubmit={() => onSubmit()}
          submitText='Сгенерировать'
        />
      </Modal>
    </>
  );
};
