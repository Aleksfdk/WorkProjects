import { FC, useCallback, useState } from 'react';
import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from 'common/components';
import { onlyRequiredRules, validateEndDate } from 'common/helpers';
import { IStartEndDate } from 'types/entities';
import { Icon } from '../Icon';
import styles from './styles.module.scss';

interface IStartEndDateProps {
  disabled?: boolean;
  start: Dayjs;
  end: Dayjs;
  datePickerData: IStartEndDate;
  suffixIcon?: boolean;
}

const datePickerProps = {
  placeholder: 'дд.мм.гггг',
  format: 'DD.MM.YYYY',
  showToday: false
};

export const StartEndDate: FC<IStartEndDateProps> = ({ disabled, start, end, datePickerData, suffixIcon }) => {
  const [lastCheckedMonth, setLastCheckedMonth] = useState<string>(dayjs().format('MM'));
  const { startName, startLabel, endName, endLabel } = datePickerData;
  const calendarIcon = <Icon type='calendar' />;
  const changeLastCheckedMonth = useCallback(
    (date: Dayjs | null) => {
      if (end || !date) return;
      setLastCheckedMonth(dayjs(date).format('MM-YYYY'));
    },
    [end]
  );

  return (
    <div className={styles.date}>
      <Form.Item name={startName} label={startLabel} rules={onlyRequiredRules}>
        <DatePicker
          {...datePickerProps}
          suffixIcon={suffixIcon ? calendarIcon : null}
          allowClear={false}
          onChange={changeLastCheckedMonth}
        />
      </Form.Item>

      <div className={styles.separator}>-</div>

      <Form.Item name={endName} label={endLabel} rules={[validateEndDate(end, start), ...onlyRequiredRules]}>
        <DatePicker
          {...datePickerProps}
          key={end ? lastCheckedMonth : dayjs(start).format('MM-YYYY')}
          suffixIcon={suffixIcon ? calendarIcon : null}
          defaultPickerValue={start}
          disabled={disabled}
        />
      </Form.Item>
    </div>
  );
};
