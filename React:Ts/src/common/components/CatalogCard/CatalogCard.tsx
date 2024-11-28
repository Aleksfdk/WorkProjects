import { FC, useEffect, useRef, useState } from 'react';
import { Tooltip, Typography } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { Img } from 'common/ui';
import { IFormattedCourse } from 'types/entities';
import { useFormatDates, useRedirect } from '../../hooks';
import styles from './styles.module.scss';

interface ICatalogCardProps {
  course: IFormattedCourse;
}

export const CatalogCard: FC<ICatalogCardProps> = ({ course: { picture, begin, end, label, id, score, dates } }) => {
  const redirectTo = useRedirect();
  const date = useFormatDates(begin, end, dates);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const onClick = () => {
    redirectTo.coursePreview({ id });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleResize = () => {
      if (labelRef.current) {
        const { clientHeight, scrollHeight } = labelRef.current;
        if (scrollHeight - 1 === clientHeight) {
          setIsTooltipVisible(false);
        } else setIsTooltipVisible(clientHeight < scrollHeight);
      }
    };
    // Добавляем слушателя события resize
    window.addEventListener('resize', handleResize);
    // Добавляем слушателя события изменения масштаба
    window.addEventListener('orientationchange', handleResize);
    // Вызываем handleResize после монтирования компонента
    handleResize();
    // Убираем слушателя при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [label]);

  return (
    <div className={styles.catalogCard}>
      <div className={styles.img}>
        <Img src={picture} />
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.rate}>
            <StarOutlined className={styles.star} />
            <span>{score ?? 'Нет оценок'}</span>
          </div>
          <Tooltip title={isTooltipVisible ? label : ''}>
            <Typography.Title ref={labelRef} className={styles.label} onClick={onClick}>
              {label}
            </Typography.Title>
          </Tooltip>
        </div>
        <span className={styles.dates}>{date}</span>
      </div>
    </div>
  );
};
