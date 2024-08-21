import {
  addIngredients,
  deleteIngredient,
  clearIngredient,
  changeIngredientInList,
  getConstructorIngredients
} from '../slices/burgerIngredientsSlice'; // actions

import {
  burgerConstructorReducer,
  initialState
} from '../slices/burgerIngredientsSlice';

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
const mockIngredient2 = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '0987654321',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

describe('Тестирование burgerConstructorSlice ', () => {
  test('Установка булки через addIngredients', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredients(mockBun)
    );
    // проверка что булка добавилась
    expect(state.bun).toEqual({
      ...mockBun,
      id: expect.any(String) // проверка , что здесь должна быть строка, все6 равно какая
    });
    // проверка что булка добавилась только в bun
    expect(state.ingredients).toHaveLength(0);
  });

  test('Установка начинки  через addIngredients', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredients(mockIngredient)
    );
    expect(state.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String) // проверка , что здесь должна быть строка, все равно какая
    });

    expect(state.ingredients).toHaveLength(1);
  });

  test('Проверка перемещения начинок вниз', () => {
    const array = [mockIngredient, mockIngredient2];
    const _initialState = {
      bun: null,
      ingredients: array
    };
    const payload = { index: 0, newIndex: 1 };
    const state = burgerConstructorReducer(
      _initialState,
      changeIngredientInList(payload)
    );
    expect(state.ingredients[0]).toEqual({
      ...mockIngredient2,
      id: expect.any(String)
    });
    expect(state.ingredients[1]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });
  test('Проверка перемещения начинок вверх', () => {
    const array = [mockIngredient2, mockIngredient];
    const _initialState = {
      bun: null,
      ingredients: array
    };
    const payload = { index: 1, newIndex: 0 };
    const state = burgerConstructorReducer(
      _initialState,
      changeIngredientInList(payload)
    );
    expect(state.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
    expect(state.ingredients[1]).toEqual({
      ...mockIngredient2,
      id: expect.any(String)
    });
  });

  test('Проверка удаления ингредиентов', () => {
    const _initialState = {
      bun: null,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = burgerConstructorReducer(
      _initialState,
      deleteIngredient(mockIngredient2.id)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });
  test('Очистка конструктора', () => {
    const _initialState = {
      bun: mockBun,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = burgerConstructorReducer(_initialState, clearIngredient());
    expect(state.ingredients).toHaveLength(0);
    expect(state.bun).toBeNull();
  });
});
