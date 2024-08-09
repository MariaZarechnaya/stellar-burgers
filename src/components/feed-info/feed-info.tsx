import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getFeedState } from '../../services/slices/orderFeedSlice';
import { useSelector } from '../../services/store';
// ф сортировки заказов
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// компонент с информацией о заказах (справа от ленты)
export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const { orders, total, totalToday } = useSelector(getFeedState);
  // информация о заказах , которая пришла в стор отт сервера
  const feed = { total, totalToday };
  // сортировка заказов, в зависимости от состояния
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
