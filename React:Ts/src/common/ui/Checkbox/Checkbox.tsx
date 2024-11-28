import { FC, RefAttributes } from 'react';
import { Checkbox as AntCheckbox, CheckboxProps } from 'antd';
import cn from 'classnames';
import styles from './styles.module.scss';

export const Checkbox: FC<CheckboxProps & RefAttributes<HTMLInputElement>> = (props) => {
  const { children, ...checkboxProps } = props;
  return (
    <AntCheckbox {...checkboxProps} className={cn(props.className, styles.appCheckbox)}>
      {children}
    </AntCheckbox>
  );
};
