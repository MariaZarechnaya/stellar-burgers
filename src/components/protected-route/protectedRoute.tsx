import { FC } from 'react';
import { getAuthChecked, getUser } from '../../services/slices/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { ReactNode } from 'react';
import { useSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

// Компонент защищенного маршрута
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth,
  children
}) => {
  const isAuthChecked = useSelector(getAuthChecked); // статус запроса пользователя
  const user = useSelector(getUser); // данные пользователя
  const location = useLocation();

  // Отображаем загрузчик, если аутентификация еще не проверена
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // если данных о пользователе нет
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут только для неаутентифицированных пользователей и пользователь уже аутентифицирован, перенаправляем на исходную страницу или на главную
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Возвращаем дочерние элементы, если условия аутентификации выполнены
  return children;
};

export type { ProtectedRouteProps };
