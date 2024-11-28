import { FC, useMemo } from 'react';
import { Tooltip } from 'antd';
import { TRACE_TYPES } from 'types/entities/courses';
import { Icon } from '../Icon';
import styles from './styles.module.scss';

interface ITraceButtonProps {
  trace: number;
  onClick: () => void;
  size?: number;
  traceClass?: string;
}

const { trace: traceBaseStyles, hidden, notCollected, collecting, collected } = styles;

export const TraceButton: FC<ITraceButtonProps> = ({ trace, onClick, size = 18, traceClass }) => {
  const className = useMemo<string>(() => {
    const classesForTrace: { [K in TRACE_TYPES as string]: string } = {
      [TRACE_TYPES.NOT_COLLECTED]: notCollected,
      [TRACE_TYPES.COLLECTING]: collecting,
      [TRACE_TYPES.COLLECTED]: collected,
      [TRACE_TYPES.FINISHED]: collected,
      [TRACE_TYPES.DISABLED]: hidden
    };

    return [traceBaseStyles, classesForTrace[trace] || hidden].join(' ');
  }, [trace]);

  const tooltip = useMemo(() => {
    const tooltipForTrace: { [K in TRACE_TYPES as string]: string } = {
      [TRACE_TYPES.NOT_COLLECTED]: 'Требуется цифровой след',
      [TRACE_TYPES.COLLECTING]: 'Цифровой след собирается',
      [TRACE_TYPES.COLLECTED]: 'Цифровой след собран',
      [TRACE_TYPES.FINISHED]: 'Цифровой след зафиксирован'
    };
    return [tooltipForTrace[trace]];
  }, [trace]);

  return (
    <Tooltip title={tooltip} className={traceClass} placement='top'>
      <div onClick={onClick}>
        <Icon type='imprint' className={`${className} `} style={{ fontSize: size }} />
      </div>
    </Tooltip>
  );
};
