import React, { FC, useState } from 'react';
import { Button, Form, Modal, Upload } from 'antd';
import { Icon, Input } from 'common/ui';
import { DatePicker, ModalFooter } from 'common/components';
import { IFunction, IObject } from 'common/components/Chat/interfaces';
import { onlyRequiredRules } from 'common/helpers';
import { exportModalProps } from 'common/constants/certificate.config';
import styles from '../../../instructor/CourseInstructors/components/styles.module.scss';
import styleGeneration from '../../styles.module.scss';

interface ModalUploadProps {
  isModalUpload: boolean;
  onCancel: () => void;
  uploadProps: IObject;
  fileName: string;
  saveForm: IFunction;
  setFileName: IFunction;
}
export const ModalUploadFile: FC<ModalUploadProps> = (modalProps) => {
  const [form] = Form.useForm();
  const [isSaveBtnActive, setIsSaveBtnActive] = useState<boolean>(true);

  const onChangeForm = async () => {
    const { title, file } = form.getFieldsValue();
    if (title && file) {
      return setIsSaveBtnActive(false);
    }
    setIsSaveBtnActive(true);
  };
  const onSubmit = (data: { title: string; file: File; createdDate: Date }) => {
    modalProps.saveForm(data);
  };

  const clearFileField = () => {
    form.setFieldsValue({ file: undefined });
    modalProps.setFileName('');
  };

  return (
    <>
      <Modal
        {...exportModalProps('СЕРТИФИКАТ')}
        className={`${styles.modal} ${styleGeneration.modalGeneration} `}
        open={modalProps.isModalUpload}
        onCancel={() => {
          modalProps.onCancel();
          form.resetFields();
          modalProps.setFileName('');
        }}
        closeIcon={<Icon type='close' style={{ fontSize: '16px' }} />}
      >
        <Form form={form} onFinish={onSubmit} layout='vertical' onValuesChange={onChangeForm}>
          <Form.Item name='title' label='Наименование' rules={onlyRequiredRules}>
            <Input placeholder='Ввод текста' />
          </Form.Item>
          <Form.Item name='file' label='Файл' rules={onlyRequiredRules}>
            <div className={styleGeneration.fileUploadRow}>
              <Input placeholder='Файл не загружен' className={styleGeneration.inputStyle} readOnly value={modalProps.fileName} />
              <div>
                <Upload {...modalProps.uploadProps}>
                  {!modalProps.fileName ? (
                    <Button type='ghost' className={styleGeneration.btnUploadFile}>
                      Загрузить
                    </Button>
                  ) : (
                    <div className={styleGeneration.panelBtnEdit}>
                      <Button icon={<Icon type={'edit-pencil'} />} />
                      <Button
                        icon={<Icon type={'delete-outline'} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFileField();
                        }}
                      />
                    </div>
                  )}
                </Upload>
              </div>
            </div>
          </Form.Item>
          <Form.Item name='createdDate' label='Дата выдачи'>
            <DatePicker
              className={styleGeneration.datePicker}
              allowClear={false}
              placeholder='дд.мм.гггг'
              format={'DD.MM.YYYY'}
              suffixIcon={<Icon type={'calendar-profile'} />}
              showToday={false}
              onChange={onChangeForm}
            />
          </Form.Item>
          <ModalFooter saveDisable={isSaveBtnActive} onSubmit={() => onSubmit} onCancel={() => false} submitText='Загрузить' />
        </Form>
      </Modal>
    </>
  );
};
