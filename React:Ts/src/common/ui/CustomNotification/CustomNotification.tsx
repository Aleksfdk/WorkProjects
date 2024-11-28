import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification';
import { Icon } from '../Icon';

export enum NOTIFICATION_TYPES {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

interface INotificationProps extends ArgsProps {
  type: NOTIFICATION_TYPES;
}

export const customNotification = ({ type, ...props }: INotificationProps) => {
  const MAP: { [K in NOTIFICATION_TYPES]: () => void } = {
    [NOTIFICATION_TYPES.SUCCESS]: () => notification.success({ icon: <Icon type={'default-checked'} />, ...props }),
    [NOTIFICATION_TYPES.ERROR]: () => notification.error({ icon: <Icon type={'close'} />, ...props }),
    [NOTIFICATION_TYPES.INFO]: () => notification.info({ icon: <Icon type={'info'} />, ...props })
  };
  return MAP[type]();
};
