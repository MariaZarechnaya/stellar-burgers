// import { deleteCookie } from 'src/utils/cookie';
import {
  initialState,
  userDataReducer,
  setAuthChecked,
  fetchRegisterUser,
  loginUser,
  updateUser,
  logoutUser,
  fetchUserData,
  clearUserInfo
} from '../slices/userSlice';
import { deleteCookie } from '../../utils/cookie';
// мокированные данные
const userMockData = {
  email: 'Stepan@example.mail',
  name: 'Stepan'
};

const registerMockData = {
  email: 'Stepan@example.mail',
  name: 'Stepan',
  password: 'Stepan123'
};

const loginMockData = {
  email: 'Stepan@example.mail',
  password: 'Stepan123'
};
// Замокали локал
global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(() => null),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn((index: number) => null)
};
// Замокали куки
jest.mock('../../utils/cookie', () => ({
  deleteCookie: jest.fn()
}));

describe('работа userSlice', () => {
  //fetchRegisterUser
  test('Результат запроса: fetchRegisterUser.pending', () => {
    const state = userDataReducer(
      initialState,
      fetchRegisterUser.pending('pending', registerMockData)
    );

    expect(state).toEqual(initialState);
  });

  test('Результат запроса: fetchRegisterUser.fulfilled', () => {
    const state = userDataReducer(
      initialState,
      fetchRegisterUser.fulfilled(userMockData, 'fulfilled', registerMockData)
    );

    expect(state.userData).toEqual(userMockData);
  });

  test('Результат запроса: fetchRegisterUser.rejected', () => {
    const state = userDataReducer(
      initialState,
      fetchRegisterUser.rejected(
        new Error('error'),
        'rejected',
        registerMockData
      )
    );

    expect(state.errorRegistration).toContain(
      'Возникла ошибка при регистрации'
    );
  });

  //loginUser
  test('Результат запроса: loginUser.pending', () => {
    const state = userDataReducer(
      initialState,
      loginUser.pending('pending', loginMockData)
    );

    expect(state.loginUserRequest).toBeTruthy;
  });
  test('Результат запроса: loginUser.fulfilled', () => {
    const state = userDataReducer(
      initialState,
      loginUser.fulfilled(userMockData, 'fulfilled', loginMockData)
    );
    expect(state.loginUserRequest).toBeFalsy;
    expect(state.userData).toEqual(userMockData);
  });
  test('Результат запроса: loginUser.rejected', () => {
    const state = userDataReducer(
      initialState,
      loginUser.rejected(new Error('error'), 'rejected', loginMockData)
    );
    expect(state.loginUserRequest).toBeFalsy;
    expect(state.loginUserError).toContain('Ошибка авторизации');
  });
  //fetchUserData
  test('Результат запроса: fetchUserData.fulfilled', () => {
    const state = userDataReducer(
      initialState,
      fetchUserData.fulfilled(
        { success: true, user: userMockData },
        'fulfilled'
      )
    );

    expect(state.userData).toEqual(userMockData);
  });
  //updateUser
  test('Результат запроса: updateUser.pending', () => {
    const state = userDataReducer(
      initialState,
      updateUser.pending('pending', loginMockData)
    );

    expect(state.loginUserRequest).toBeTruthy;
  });
  test('Результат запроса: updateUser.fulfilled', () => {
    const state = userDataReducer(
      initialState,
      updateUser.fulfilled(
        { success: true, user: userMockData },
        'fulfilled',
        userMockData
      )
    );

    expect(state.loginUserRequest).toBeFalsy;
    expect(state.userData).toEqual(userMockData);
  });
  test('Результат запроса: updateUser.rejected', () => {
    const state = userDataReducer(
      initialState,
      updateUser.rejected(new Error('error'), 'rejected', registerMockData)
    );
    expect(state.loginUserRequest).toBeFalsy;
    expect(state.updateError).toContain(
      'При обновлении данных произошла ошибка'
    );
  });
  //logoutUser
  test('Результат запроса: logoutUser.pending', () => {
    const state = userDataReducer(initialState, logoutUser.pending('pending'));
    expect(state.loginUserRequest).toBeTruthy;
  });
  test('Результат запроса: logoutUser.fulfilled', () => {
    const state = userDataReducer(
      initialState,
      logoutUser.fulfilled({ success: true }, 'fulfilled')
    );
    expect(global.localStorage.clear).toHaveBeenCalled();
    expect(deleteCookie).toHaveBeenCalled();
    expect(state.loginUserRequest).toBeFalsy;
    expect(state.userData).toBeNull();
  });
    //setAuthChecked
    test('Результат setAuthChecked', () => {
      const state = userDataReducer(initialState, setAuthChecked());
      expect(state.isAuthChecked).toBeTruthy;
    });
});
