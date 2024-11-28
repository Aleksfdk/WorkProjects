import { FC } from 'react';
import { Form, Switch } from 'antd';
import cn from 'classnames';
import styles from './style.module.scss';

interface ICustomSwitch {
  defaultChecked?: boolean;
  title?: string;
  wrapperClassname?: string;
  name?: string | string[];
  onChange?: (bool: boolean) => void;
  disabled?: boolean;
}

export const CustomSwitch: FC<ICustomSwitch> = ({
  defaultChecked,
  title = '',
  wrapperClassname = '',
  name,
  onChange,
  disabled = false
}) => {
  return (
    <div className={cn(styles.switch, wrapperClassname)}>
      <Form.Item initialValue={defaultChecked} name={name} valuePropName='checked'>
        <Switch disabled={disabled} checked={defaultChecked} checkedChildren={true} unCheckedChildren={false} onChange={onChange} />
      </Form.Item>
      {title && <span>{title}</span>}
    </div>
  );
};
