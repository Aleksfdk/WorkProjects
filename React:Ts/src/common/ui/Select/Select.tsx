import React, { FC } from 'react';
import { RefSelectProps, Select as AntSelect, SelectProps } from 'antd';
import { Icon } from '../Icon';
import './styles.module.scss';

export const Select: FC<SelectProps & React.RefAttributes<RefSelectProps>> = (props) => {
  return (
    <AntSelect
      {...props}
      suffixIcon={props.suffixIcon ? props.suffixIcon : <Icon type={'arrow-profile'} />}
      clearIcon={<Icon type='x' />}
      filterOption={(input, option) => ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase())}
    />
  );
};
