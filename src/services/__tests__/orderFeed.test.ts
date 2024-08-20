import {
  initialState,
  orderFeedsReducer,
  fetchFeeds
} from '../slices/orderFeedSlice';

describe('Тестирование fetchFeedsSlice', () => {
  global.fetch = jest.fn();
  const mockOrder = {
    _id: '66c1ab27119d45001b500642',
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
    status: 'done',
    name: 'Флюоресцентный бургер',
    createdAt: '2024-08-18T08:04:55.250Z',
    updatedAt: '2024-08-18T08:04:55.714Z',
    number: 50087
  };
  const mockFeeds = {
    success: true,
    orders: [mockOrder],
    total: 34,
    totalToday: 4432,
    error: null,
    isLoaded: true
  };

  test('состояние pending fetchFeeds', () => {
    const state = orderFeedsReducer(
      initialState,
      fetchFeeds.pending('pending')
    );
    expect(state.isLoaded).toBeFalsy();
    expect(state.error).toBeNull();
  });
  test('состояние fulfilled fetchFeeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: mockFeeds })
      })
    ) as jest.Mock;

    const state = orderFeedsReducer(
      initialState,
      fetchFeeds.fulfilled(mockFeeds, 'fulfilled')
    );
    expect(state.isLoaded).toBeTruthy();
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockFeeds.orders);
    expect(state.total).toEqual(mockFeeds.total);
    expect(state.totalToday).toEqual(mockFeeds.totalToday);
  });
  test('состояние rejected fetchFeeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('error'))
      })
    ) as jest.Mock;
    const state = orderFeedsReducer(
      initialState,
      fetchFeeds.rejected(null, 'rejected')
    );
    expect(state.isLoaded).toBeFalsy();
  });
});
