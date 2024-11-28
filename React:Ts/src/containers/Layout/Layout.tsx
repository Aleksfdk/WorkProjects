import { FC, ReactNode } from 'react';
import cn from 'classnames';
import { ErrorBoundary } from 'containers';
import styles from './styles.module.scss';

interface IProps {
  children: ReactNode;
  centered?: boolean;
  layoutPadding?: boolean;
}

export const Layout: FC<IProps> = ({ children, centered = false, layoutPadding = true }) => {
  return (
    <>
      <main className={styles.layout}>
        <ErrorBoundary>
          <section className={cn(styles.content, { [styles.centered]: centered, [styles.withPadding]: layoutPadding })}>{children}</section>
        </ErrorBoundary>
      </main>
    </>
  );
};
