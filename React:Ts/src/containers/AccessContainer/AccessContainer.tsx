import { FC, ReactNode } from 'react';
import { Empty } from 'antd';
import { Layout } from 'containers/Layout/Layout';
import { BackButton } from 'common/components';
import Plug from '../../common/assets/icons/notAccess.svg';
import styles from './styles.module.scss';

interface IProps {
  children: ReactNode;
  isShowChildren?: boolean;
}

export const AccessContainer: FC<IProps> = ({ children, isShowChildren = false }) => {
  return (
    <>
      {!isShowChildren ? (
        children
      ) : (
        <Layout>
          <BackButton />
          <div className={styles.emptyContainer}>
            <Empty description='У Вас нет доступа к данной странице' image={Plug} className={styles.customEmpty} />
          </div>
        </Layout>
      )}
    </>
  );
};
