import { FC, useEffect, useState } from 'react';
import { Input as AntInput, InputProps, InputRef } from 'antd';
import cn from 'classnames';
import { Icon } from '../Icon';
import styles from './styles.module.scss';

export const Input: FC<InputProps & React.RefAttributes<InputRef>> = (props) => {
  const { type } = props;

  const [bgColor, setBgColor] = useState(props.defaultValue);
  const [onBlurInput, setOnBlurInput] = useState(false);

  useEffect(() => {
    const isString = (value: unknown): value is string => {
      return typeof value === 'string';
    };
    const handleClick = () => {
      if (onBlurInput && (!bgColor || (isString(bgColor) && bgColor?.length < 4))) {
        setBgColor(props.defaultValue);
      }
      setOnBlurInput(false);
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [onBlurInput]);

  if (type === 'password') {
    return <AntInput.Password {...props} className={cn(props.className, styles.appInput)} />;
  }
  if (type === 'search') {
    return <AntInput.Search enterButton={<Icon type={'preview'} />} {...props} className={cn(props.className, styles.searchInput)} />;
  }

  if (type === 'color') {
    return (
      <div className={styles.colorInputPanel}>
        <AntInput
          {...props}
          value={bgColor}
          className={cn(props.className, styles.appInput, styles.colorInput)}
          onChange={(e) => {
            setBgColor(e.target.value);
          }}
        />
        <AntInput
          type={'text'}
          value={bgColor?.toString().toUpperCase()}
          className={cn(props.className, styles.appInput, styles.colorInput, styles.colorInputValue)}
          onChange={(e) => setBgColor(e.target.value)}
          maxLength={12}
          onBlur={() => {
            setOnBlurInput(true);
          }}
        />
      </div>
    );
  }

  return <AntInput {...props} className={cn(props.className, styles.appInput)} />;
};
