import { FC, Fragment } from 'react';
import { Dropdown as AntDropdown, DropdownProps, Menu } from 'antd';
import { IIconType } from 'types/common';
import { IMenuItems } from 'types/entities';
import { Icon } from '../Icon';
import styles from './styles.module.scss';

interface IDropdownProps extends DropdownProps {
  items: IMenuItems[];
  wrapperClassName?: string;
  contentClassName?: string;
  record?: Record<string, unknown>;
  onOpenChange?: (bool: boolean) => void;
}

export const Dropdown: FC<IDropdownProps> = (props) => {
  const { items, children, wrapperClassName = '', contentClassName = '', record, ...rest } = props;

  return (
    <div className={`${styles.mainWrapper} ${wrapperClassName}`} onClick={(event) => event.stopPropagation()}>
      <AntDropdown
        destroyPopupOnHide
        overlayClassName={`${styles.mainWrapper} ${wrapperClassName}`}
        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
        {...rest}
        overlay={
          <Menu className={styles.customMenu}>
            {items?.map(({ icon, title, key, onClick, visible = true }) => (
              <Fragment key={key}>
                {visible && (
                  <Menu.Item key={key} onClick={() => onClick?.(record)} className={`${styles.menuItemWrapper} ${contentClassName}`}>
                    {icon && <Icon className={styles.icon} type={icon as IIconType} />}
                    <p>{title}</p>
                  </Menu.Item>
                )}
              </Fragment>
            ))}
          </Menu>
        }
      >
        <span>{children}</span>
      </AntDropdown>
    </div>
  );
};
