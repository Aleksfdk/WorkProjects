import { Suspense, useEffect } from 'react';
import cn from 'classnames';
import { ErrorBoundary } from '../containers';
import { Loader } from 'common/components';
import { Header } from 'common/components/Header';
import { user } from 'types/routes/user';
import styles from './App.module.scss';

export const App = () => {
  return (
    <div className={cn({ [styles.forPasswordPage]: pathname === user.password })}>
      <ErrorBoundary>
        <Header />
        <Suspense fallback={<Loader />}>{routes}</Suspense>
      </ErrorBoundary>
    </div>
  );
};
