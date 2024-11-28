import { FC, useCallback, useMemo, useState } from 'react';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import cn from 'classnames';
import { Button, Img } from 'common/ui';
import { useAppSelector, useRedirect } from 'common/hooks';
import { profileSelectors } from 'api/student/profile/profile.selectors';
import { SanitazedDescription } from '../SanitazedDescription';
import styles from './styles.module.scss';

interface IEventsCardProps {
  id: string;
  title: string;
  img: string;
  begin: string;
  end: string;
  description: string;
  role?: 'Students' | 'Instructors';
  isParticipant?: boolean;
  onClick?: () => void;
  noRedirect?: boolean;
  btnIsLoading?: boolean;
}

export const DetailedEventCard: FC<IEventsCardProps> = (props) => {
  const { id, title, img, begin, end, description, role: roleProps, isParticipant, onClick, noRedirect, btnIsLoading } = props;
  const { role } = useAppSelector(profileSelectors.role);
  const redirectTo = useRedirect();

  const [btnTimeout, setBtnTimeout] = useState<boolean>(false);
  const formatedDate = useMemo(() => {
    const beginDate = dayjs(begin).format('DD.MM.YYYY');
    const endDate = dayjs(end).format('DD.MM.YYYY');
    if (beginDate === endDate) return beginDate;
    return `${beginDate} - ${endDate}`;
  }, [begin, end]);

  const detailedView = () => {
    if (noRedirect) return;
    redirectTo.detailedEvent({ id });
  };

  const onBtnClick = useCallback(() => {
    if (!onClick) return;
    setBtnTimeout(true);
    onClick();
    setTimeout(() => {
      setBtnTimeout(false);
    }, 2000);
  }, [onClick]);

  const subscribeBtnType = useMemo(
    () => ({
      subscribeBtn: onClick && roleProps !== 'Instructors' && !isParticipant,
      unsubscribeBtn: onClick && roleProps === 'Students' && isParticipant,
      disabled: !onClick || role === 'Instructors' || role === 'Root'
    }),
    [role, isParticipant, roleProps, onClick]
  );

  const btnClassName = cn(styles.btn, {
    [styles.subscribeBtn]: subscribeBtnType.subscribeBtn,
    [styles.unsubscribeBtn]: subscribeBtnType.unsubscribeBtn,
    [styles.disable]: subscribeBtnType.disabled
  });

  return (
    <div className={cn(styles.eventsCard, { [styles.noRedirect]: noRedirect })} onClick={detailedView}>
      <div className={styles.col}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.infoWrapper}>
          <span className={styles.date}>{formatedDate}</span>
        </div>

        <SanitazedDescription description={description} classnames={cn('defaultStyles', styles.description)} />
        <div className={styles.btnWrapper} onClick={(e) => e.stopPropagation()}>
          <Button loading={btnIsLoading || btnTimeout} onClick={onBtnClick} className={btnClassName} disabled={subscribeBtnType.disabled}>
            {isParticipant ? 'Отменить запись' : 'Записаться'}
          </Button>
        </div>
      </div>

      <div className={styles.col}>
        <div className={styles.imgWrapper}>
          <Img src={img} className={styles.img} />
        </div>
      </div>
    </div>
  );
};
