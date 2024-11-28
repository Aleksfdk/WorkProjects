import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { ActionsPanel, ColumnTitle } from 'common/components';
import { getIanaDate } from 'common/helpers';
import { IActionPanelItem } from 'types/common';
import { ICertificatesItem } from 'types/entities/tempCertificates';
import styles from '../instructor/Resources/styles.module.scss';

type actionType = 'preview' | 'delete' | 'upload';
type IAttributeAction = Omit<IActionPanelItem, 'action'> & { action: actionType };
type IGetColumnsFn = (options: {
  onClick: (record: ICertificatesItem, action: actionType) => void;
  permission: boolean;
  onFullNameClick: (record: ICertificatesItem) => void;
  timeZone?: string;
}) => ColumnsType<ICertificatesItem>;

export const attribute = (local: boolean, permission: boolean): IAttributeAction[] => {
  return [
    {
      action: 'preview',
      tooltip: 'Предпросмотр',
      icon: 'search',
      visible: local
    },
    {
      action: 'upload',
      tooltip: 'Добавить сертификат',
      icon: 'upload-new'
    },
    {
      action: 'delete',
      tooltip: 'Удалить',
      icon: 'delete-outline',
      visible: local
    }
  ];
};

export const getColumns: IGetColumnsFn = ({ onClick, permission, onFullNameClick, timeZone }) => {
  const columns: ColumnsType<ICertificatesItem> = [
    {
      title: <ColumnTitle title='ФИО' canSort={true} />,
      sorter: (a, b) => {
        const fullNameA = a.fullName || '';
        const fullNameB = b.fullName || '';
        if (fullNameB) {
          return fullNameA.localeCompare(fullNameB);
        } else {
          return 0;
        }
      },
      render: (record) => (
        <span onClick={() => onFullNameClick(record)} className={styles.username}>
          {record.fullName}
        </span>
      )
    },
    {
      title: 'Наименование',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Дата',
      dataIndex: 'created',
      key: 'created',
      render: (date, record) => record.title && date && getIanaDate(timeZone, date, 'DD.MM.YYYY')
    },
    {
      key: 'button',
      width: 220,
      render: (record) => {
        const attributes = attribute(!!record.link, permission);

        return (
          <ActionsPanel
            onActionSelect={(action) => onClick(record, action as actionType)}
            actions={attributes}
            className={styles.columnBtn}
          />
        );
      }
    }
  ];
  return columns;
};
