import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {fetchUserOrders, getOrderHistory, getOrderHistoryError} from '../../services/slices/orderSlice'

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrderHistory);
  const error = useSelector(getOrderHistoryError);
  // запрос данных всем по заказам пользователя
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
