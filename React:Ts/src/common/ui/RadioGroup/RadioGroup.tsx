import { FC, RefAttributes } from 'react';
import { Radio as AntRadio, RadioGroupProps } from 'antd';
import './styles.module.scss';

const AntRadioGroup = AntRadio.Group;

export const RadioGroup: FC<RadioGroupProps & RefAttributes<HTMLDivElement>> = (props) => {
  return <AntRadioGroup {...props} />;
};
