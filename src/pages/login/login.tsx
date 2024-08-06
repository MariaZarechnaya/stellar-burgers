import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  loginUser,
  getLoginRequest,
  getLoginUserError
} from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  // свое состояние компонента
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginRequest = useSelector(getLoginRequest);
  const loginError = useSelector(getLoginUserError);

  // отправка формы логина
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
    // перенаправляем на главную страницу и заменяем историю
    navigate('/', { replace: true });
  };

  return (
    <>
      {loginRequest ? (
        <Preloader />
      ) : (
        <LoginUI
          errorText={loginError}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
