import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchRegisterUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

// ф. компонент регистрации
export const Register: FC = () => {
  // внутреннее состояние компонента
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate()

// отправка формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (userName&&email&& password) {
      const registerData = {
        email,
        name: userName,
        password
      }
      dispatch (fetchRegisterUser(registerData))
      navigate (-1)  
    }
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
