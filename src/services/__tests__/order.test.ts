import {
  userOrderReducer,
  initialState,
  clearOrder,
  makeUserOrder,
  fetchUserOrders,
  fetchUserDetailOrder
} from '../slices/orderSlice';
import { getOrderByNumberApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';

const mockOrder = {
  _id: '66c1ab27119d45001b500642',
  ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2024-08-18T08:04:55.250Z',
  updatedAt: '2024-08-18T08:04:55.714Z',
  number: 50087
};

describe('Тестирование orderSlice', () => {
  test('состояние pending fetchUserDetailOrder', async () => {
    const orderNumber = 1556565;
    const state = userOrderReducer(
      initialState,
      fetchUserDetailOrder.pending('pending', orderNumber)
    );
    expect(state).toEqual({
      ...initialState
    });
  });

  test('состояние fulfilled fetchUserDetailOrder', () => {
    const orderNumber = 1556565;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, orders: [mockOrder] })
      })
    ) as jest.Mock;
    const state = userOrderReducer(
      initialState,
      fetchUserDetailOrder.fulfilled(
        { success: true, orders: [mockOrder] },
        'fulfilled',
        orderNumber
      )
    );
    expect(state).toEqual({
      ...initialState,
      order: mockOrder
    });
  });
  test('состояние rejected fetchUserDetailOrder', async () => {
    const orderNumber = 1556565;
    const state = userOrderReducer(
      initialState,
      fetchUserDetailOrder.rejected(null, 'rejected', orderNumber)
    );
    expect(state).toEqual({
      ...initialState,
      errorGetOrder: 'Order data Error'
    });
  });

  test('состояние pending makeUserOrder', async () => {
    const state = userOrderReducer(
      initialState,
      makeUserOrder.pending('pending', mockOrder.ingredients)
    );
    expect(state.orderRequest).toBeTruthy();
  });
  test('состояние fulfilled makeUserOrder', async () => {
    const state = userOrderReducer(
      initialState,
      makeUserOrder.fulfilled(
        { success: true, order: mockOrder, name: 'name' },
        'fulfilled',
        mockOrder.ingredients
      )
    );
    expect(state.orderRequest).toBeFalsy();
    expect(state).toEqual({
      ...initialState,
      order: mockOrder
    });
  });
  test('состояние rejected makeUserOrder', async () => {
    const state = userOrderReducer(
      initialState,
      makeUserOrder.rejected(new Error('error'), 'rejected', [])
    );
    expect(state.errorMakeOrder).toContain(
      'При оформлении заказа произошла ошибка'
    );
    expect(state.orderRequest).toBeFalsy();
    expect(state.order).toBeNull;
  });

  //
  test('состояние pending fetchUserOrders', async () => {
    const state = userOrderReducer(
      initialState,
      fetchUserOrders.pending('pending')
    );
    expect(state).toEqual({
      ...initialState
    });
  });
  test('состояние fulfilled fetchUserOrders', async () => {
    const state = userOrderReducer(
      initialState,
      fetchUserOrders.fulfilled([mockOrder], 'fulfilled')
    );
    expect(state.userOrderHistory).toEqual([mockOrder]);
  });
  test('состояние rejected fetchUserOrders', async () => {
    const state = userOrderReducer(
      initialState,
      fetchUserOrders.rejected(new Error('error'), 'rejected')
    );
    expect(state.errorHistoryOrder).toContain(
      'При загрузке истории заказов произошла ошибка'
    );
  });
});
