import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs, { extend } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

export const useCalendarData = () => {
  extend(weekday);
  const DATE_FORMAT = useMemo(() => 'DD MMMM YYYY', []);

  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [chosenDate, setChosenDate] = useState<string>('');

  const getTitleFromDate = useCallback(
    (date: string) => {
      return dayjs(date, DATE_FORMAT)
        .locale('ru')
        .format('MMMM YYYY')
        .split('')
        .reduce((res: string, char: string, i) => {
          return i === 0 ? char.toUpperCase() : res + char;
        }, '');
    },
    [DATE_FORMAT]
  );

  const setCurrentData = useCallback(() => {
    const now = dayjs().format(DATE_FORMAT);
    setTitle(getTitleFromDate(now));
    setChosenDate(now);
    setCurrentMonth(now);
  }, [DATE_FORMAT, getTitleFromDate]);
  const updateChosenDate = useCallback(
    (day: string) => {
      const [, m, y] = dayjs(currentMonth, DATE_FORMAT).format(DATE_FORMAT).split(' ');
      const formattedDay = day.length === 1 ? `0${day}` : day;
      setChosenDate(`${formattedDay} ${m} ${y}`);
    },
    [currentMonth, DATE_FORMAT]
  );
  const nextMonth = useCallback(() => {
    const next = dayjs(currentMonth, DATE_FORMAT).add(1, 'month').format(DATE_FORMAT);
    setCurrentMonth(next);
    setTitle(getTitleFromDate(next));
  }, [currentMonth, DATE_FORMAT, getTitleFromDate]);
  const prevMonth = useCallback(() => {
    const prev = dayjs(currentMonth, DATE_FORMAT).subtract(1, 'month').format(DATE_FORMAT);
    setCurrentMonth(prev);
    setTitle(getTitleFromDate(prev));
  }, [currentMonth, DATE_FORMAT, getTitleFromDate]);

  useEffect(() => setCurrentData(), [setCurrentData]);

  return {
    title,
    chosenDate,
    currentMonth,
    updateChosenDate,
    nextMonth,
    prevMonth,
    resetMonth: () => setCurrentData(),
    format: DATE_FORMAT
  };
};
