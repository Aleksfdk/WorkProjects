import { FC, Fragment, ReactNode, useMemo } from 'react';
import { Col, DatePickerProps, Form, FormItemProps, InputProps, UploadProps } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { PickerComponentClass } from 'antd/lib/date-picker/generatePicker/interface';
import { ColProps } from 'antd/lib/grid/col';
import { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { DraggerProps } from 'antd/lib/upload';
import { Input } from '../Input';

export type inputProps = SelectProps | InputProps | DatePickerProps | TextAreaProps | UploadProps | DraggerProps | DefaultOptionType;

export interface IFormFieldProps extends FormItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: FC<any> | PickerComponentClass;
  inputProps?: inputProps;

  colProps?: ColProps;
  children?: ReactNode;

  optionsId?: string;
  description?: string;
}

export interface IFormFieldList {
  [index: string]: IFormFieldProps;
}

export const FormField: FC<IFormFieldProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { component: Component = Input, colProps = null, inputProps, children, optionsId, ...formItemProps } = props;

  const extendedInputProps = { ...inputProps };

  const Wrapper = useMemo<typeof Col | typeof Fragment>(() => (colProps ? Col : Fragment), [colProps]);

  if (!Object.keys(props).length) {
    return null;
  }

  return (
    <Wrapper {...colProps}>
      <Form.Item {...formItemProps}>
        <Component {...extendedInputProps}>{children}</Component>
      </Form.Item>
    </Wrapper>
  );
};
