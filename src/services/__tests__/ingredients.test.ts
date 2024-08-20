import {
  allIngredientsReducer,
  IngredientsSelector,
  StatusSelector,
  initialState,
  getIngredients
} from '../slices/ingredientSlice';

describe('Тестирование ingredientSlice', () => {
  global.fetch = jest.fn();
  const mockBun = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
    id: '0674654'
  };

  const mockIngredient = {
    _id: '643d69a5c3f7b9001cfa0948',
    name: 'Кристаллы марсианских альфа-сахаридов',
    type: 'main',
    proteins: 234,
    fat: 432,
    carbohydrates: 111,
    calories: 189,
    price: 762,
    image: 'https://code.s3.yandex.net/react/code/core.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/core-large.png',
    __v: 0,
    id: '000045'
  };

  test('состояние pending getIngredients', () => {
    const state = allIngredientsReducer(
      initialState,
      getIngredients.pending('pending')
    );
    expect(state.isLoaded).toBeFalsy();
    expect(state.error).toBe('');
  });
  test('состояние fulfilled getIngredients', async () => {
    const mockData = [mockBun, mockIngredient];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: mockData })
      })
    ) as jest.Mock;

    const state = allIngredientsReducer(
      initialState,
      getIngredients.fulfilled(mockData, 'fulfilled')
    );
    expect(state.isLoaded).toBeTruthy();
    expect(state.error).toBe('');
    expect(state.ingredients).toEqual(mockData);
  });
  test('состояние rejected getIngredients', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('error'))
      })
    ) as jest.Mock;
    const state = await allIngredientsReducer(
      initialState,
      getIngredients.rejected(null, 'rejected')
    );
    expect(state.error).toBe('Произошла ошибка');
  });
});
