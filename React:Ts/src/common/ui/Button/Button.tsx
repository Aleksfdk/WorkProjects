import { FC } from 'react';
import { Button as AntButton, ButtonProps } from 'antd';
import './Button.scss';

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return <AntButton {...props}>{children}</AntButton>;
};
