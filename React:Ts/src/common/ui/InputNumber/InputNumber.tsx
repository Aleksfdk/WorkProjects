import { FC } from 'react';
import { InputNumber as AntInputNumber, InputNumberProps } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import cn from 'classnames';
import styles from './styles.module.scss';

const controls = {
  upIcon: <CaretUpOutlined />,
  downIcon: <CaretDownOutlined />
};

interface IProps extends InputNumberProps {
  onChange?: (value: any) => void;
}

export const InputNumber: FC<IProps> = ({ className, step, ...props }) => {
  return (
    <div className={styles.inputWrapper}>
      <AntInputNumber {...props} controls={controls} className={cn(styles.input, className)} step={step || 1} type='number' />
    </div>
  );
};
