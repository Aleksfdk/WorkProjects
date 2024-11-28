import { FC } from 'react';
import { Radio } from 'antd';
import styles from './styles.module.scss';

export interface ITabFilter {
  label: string;
  id: number | null;
}

interface ITabFiltersProps {
  buttons: ITabFilter[];
  onChange: (id: number) => void;
  defaultValue?: number | null;
  isDefaultButton?: boolean;
}

export const TabFilters: FC<ITabFiltersProps> = ({ isDefaultButton = false, buttons, onChange, defaultValue = buttons[0]?.id }) => {
  return (
    <nav className={isDefaultButton ? styles.filtersDefault : styles.filters}>
      <Radio.Group
        onChange={(e) => onChange(e.target.value)}
        defaultValue={defaultValue}
        className={isDefaultButton ? styles.filtersGroupButtonDefault : styles.filtersGroupButton}
      >
        {buttons.map(({ label, id }) => (
          <Radio.Button key={id} value={id} className={isDefaultButton ? styles.filterButtonDefault : styles.filterButton}>
            {label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </nav>
  );
};
