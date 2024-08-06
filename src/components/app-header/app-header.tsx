import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  // если пользователь успешно залогинился берем данные из стейта
  const userName = useSelector(getUser)?.name || '';
  return <AppHeaderUI userName={userName} />;
};
