import { FC, useMemo } from 'react';
import styles from './styles.module.scss';

interface ICourseCompletionProgressProps {
  active: number | undefined;
  total: number | undefined;
}

export const CourseCompletionProgress: FC<ICourseCompletionProgressProps> = ({ active, total }) => {
  const modules = useMemo<JSX.Element | JSX.Element[]>(() => {
    if (typeof active === 'undefined' || typeof total === 'undefined') return <div className={styles.module} />;
    const result = [];
    for (let i = 1; i <= total; i++) {
      result.push(<div key={i} className={`${styles.module} ${i <= active ? styles.active : ''}`} />);
    }
    return result;
  }, [total, active]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.modules}>{modules}</div>
    </div>
  );
};
