import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { registerUserApi } from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi
} from '@api';

interface TUserState {
  isAuthChecked: boolean;
  userData: TUser | null;
  loginUserRequest: boolean;
  loginUserError: string;
  errorRegistration: string;
  errorLogout: string;
  updateError: string;
}

const initialState: TUserState = {
  isAuthChecked: false, // флаг для статуса проверки токена пользователя
  userData: null, // данные пользователя
  loginUserError: '', // ошибка авторизации
  updateError: '', // ошибка отправки обновленных данных пользователя
  loginUserRequest: false, // статус запроса логирования
  errorRegistration: '', // ошибка регистрации
  errorLogout: '' // ошибка выхода из аккаунта
};

//запрос регистрации пользователя
export const fetchRegisterUser = createAsyncThunk(
  'user/registerUser',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    // обработка токенов
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);
// запрос для входа пользователя
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData: TLoginData) => {
    console.log('логинимся');
    const data = await loginUserApi(loginData);
    console.log(data);
    // обработка токенов
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);
// обновление данных личного кабинета
export const updateUser = createAsyncThunk(
  'authUser/updateUser',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

//
//получчение данных пользователя
export const fetchUserData = createAsyncThunk(
  'authUser/fetchUserData',
  async () => await getUserApi()
);
// проверка аутентификации пользователя
export const verifyUserAuth = createAsyncThunk(
  'authUser/verifyUserAuth',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(fetchUserData());
    }
    dispatch(setAuthChecked());
  }
);
// выход пользователя
export const logoutUser = createAsyncThunk('authUser/logout', () =>
  logoutApi()
);
// очистка хранимой информации
const clearUserInfo = () => {
  localStorage.clear(); // удаляем инфу из локального хранилища
  deleteCookie('accessToken'); // удаляем токен  из куки
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Редьюсер для установки флага проверки аутентификации
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (bulder) => {
    bulder
      // регистрация
      .addCase(fetchRegisterUser.pending, (state) => {
        state.errorRegistration = '';
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.errorRegistration = '';
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.errorRegistration = 'Возникла ошибка при регистрации';
      })

      // логин
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.userData = action.payload;
        state.loginUserError = '';
      })
      .addCase(loginUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.loginUserError = 'Ошибка авторизации';
      })

      // проверка пользователя, при входе на сайт и первоначальной загрузки
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      })
   
      // обновление личных данных
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.userData = null;
        state.updateError = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.userData = action.payload.user;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.updateError = 'При обновлении данных произошла ошибка';
      })
      // выход из аккаунта
      .addCase(logoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.errorLogout = '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loginUserRequest = false;
        state.userData = null;
        clearUserInfo(); // очищаем данные
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.errorLogout = 'Произошла ошибка';
      });
  },
  selectors: {
    getAuthChecked: (state) => state.isAuthChecked,
    getUser: (state) => state.userData,
    getLoginRequest: (state) => state.loginUserRequest,
    getLoginUserError: (state) => state.loginUserError
  }
});

export const userDataReducer = userSlice.reducer;
export const { setAuthChecked } = userSlice.actions;
export const userDataName = userSlice.name;
export const {
  getUser,
  getLoginRequest,
  getLoginUserError,
  getAuthChecked
} = userSlice.selectors;
