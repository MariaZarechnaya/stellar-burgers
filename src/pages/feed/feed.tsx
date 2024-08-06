import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedOrders,
  fetchFeeds
} from '../../services/slices/orderFeedSlice';


export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders); // данные всех заказов
  const dispatch = useDispatch();
  // прри монтировании посылаем запрос за данными всех заказов
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);
  // если данные еще не загрузились
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(fetchFeeds());
        }}
      />
      ;
    </>
  );
};
