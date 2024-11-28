import { CSSProperties, MouseEvent } from 'react';
import AntIcon from '@ant-design/icons';
import { IIconType } from 'types/common';
import { icons } from './icon.helper';

interface IIconProps {
  type: IIconType;
  style?: CSSProperties;
  className?: string;
  title?: string;
  onCLick?: (event: MouseEvent<HTMLSpanElement>) => void;
}

export const Icon = ({ type, className = '', style = {}, title = '', onCLick }: IIconProps) => {
  return <AntIcon onClick={onCLick} component={icons[type]} className={className} style={style} title={title} />;
};
