import React, { FC, Key, useCallback, useEffect, useState } from 'react';
import type { TableColumnsType, TableProps } from 'antd';
import { Button, Modal, Table, Tooltip } from 'antd';
import cn from 'classnames';
import { Icon } from 'common/ui';
import { ColumnTitle, ModalFooter } from 'common/components';
import { IFunction } from 'common/components/Chat/interfaces';
import { locale } from 'common/constants';
import { exportModalProps, ListUsersType } from 'common/constants/certificate.config';
import { useGetUsersCourseMutation } from 'api/tempCertificates/tempCertificates.api';
import { IStudent } from 'types/entities';
import { ICertificatesItem } from 'types/entities/tempCertificates';
import styles from '../../../instructor/CourseInstructors/components/styles.module.scss';
import styleGeneration from '../../styles.module.scss';

interface ModalUploadProps {
  isModalUsersGenerate: boolean;
  onModalFileGenerateCert: IFunction;
  onCancel: () => void;
  onSetUsersGenerateCert: IFunction;
  dataSource: ICertificatesItem[] | undefined;
  courseId: string;
  usersGenerateCert: string[];
}

export const ModalUsersGenerateCert: FC<ModalUploadProps> = (modalProps) => {
  const [getUsersCourse] = useGetUsersCourseMutation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isSortActive, setIsSortActive] = useState<boolean>(false);
  const [dataUsersCourse, setDataUsersCourse] = useState<ListUsersType[]>([]);
  const [dataSort, setDataSort] = useState<ListUsersType[]>([]);

  useEffect(() => {
    getUsersCourse({ id: modalProps.courseId }).then((response) => {
      if ('data' in response) {
        response.data.data.map((item: IStudent, index: number) => {
          setDataUsersCourse((prevState) => {
            return [...prevState, { key: index + 1, accountId: item.accountId, fullName: item.fullName, email: item.email }];
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    setDataSort(dataUsersCourse);
  }, [dataUsersCourse]);

  const rowSelection: TableProps<ListUsersType>['rowSelection'] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Key[], selectedRows: ListUsersType[]) => {
      setSelectedRowKeys(selectedRowKeys);
      modalProps.onSetUsersGenerateCert(selectedRows);
    }
  };

  const clearSelectedRowKey = () => setSelectedRowKeys([]);

  const columns: TableColumnsType<ListUsersType> = [
    {
      title: <ColumnTitle title='ФИО' canSort={true} />,
      dataIndex: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: <ColumnTitle title='Электронная почта' canSort={true} />,
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    }
  ];

  const onSortList = () => {
    if (isSortActive) {
      setIsSortActive(false);
      setDataSort(dataUsersCourse);
      modalProps.onSetUsersGenerateCert([]);
    } else {
      if (selectedRowKeys) {
        const sortData = [...dataSort].sort((a, b) => {
          const aSelected = selectedRowKeys.includes(a.key);
          const bSelected = selectedRowKeys.includes(b.key);

          return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
        });
        setIsSortActive(true);
        setDataSort(sortData);
      }
    }
  };

  const components = {
    header: {
      cell: (props: any) => {
        const { title, children, tabIndex, ...restProps } = props;
        return (
          <th {...restProps}>
            <span className={styleGeneration.sortCheckboxCol}>
              {children}
              {tabIndex !== 0 && (
                <span>
                  <Tooltip title={`Нажмите для сортировки по ${!isSortActive ? 'выбранным' : 'порядку'}`}>
                    <Button
                      onClick={onSortList}
                      icon={<Icon type={'sort'} className={styleGeneration.sortIconCheckbox} />}
                      className={cn(styleGeneration.sortBtn, { [styleGeneration.active]: isSortActive })}
                    />
                  </Tooltip>
                </span>
              )}
            </span>
          </th>
        );
      }
    }
  };

  const onSubmit = useCallback(() => {
    modalProps.onModalFileGenerateCert(true);
    modalProps.onCancel();
  }, [modalProps]);

  return (
    <>
      <Modal
        {...exportModalProps('ГЕНЕРАЦИЯ СЕРТИФИКАТА')}
        className={`${styles.modal} ${styleGeneration.modalGeneration} `}
        open={modalProps.isModalUsersGenerate}
        onCancel={() => {
          modalProps.onCancel();
          clearSelectedRowKey();
        }}
        closeIcon={<Icon type='close' style={{ fontSize: '16px' }} />}
      >
        <div className={styleGeneration.infoPanel}>
          <Icon type={'info bordered'} />
          <p>Выберите учащихся, для которых необходимо сгенерировать сертификат</p>
        </div>
        <Table
          locale={locale}
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={dataSort}
          size='small'
          components={components}
          pagination={false}
        />
        <ModalFooter
          saveDisable={!modalProps.usersGenerateCert.length}
          onCancel={() => modalProps.onCancel()}
          onSubmit={() => onSubmit()}
          submitText='Далее'
        />
      </Modal>
    </>
  );
};
