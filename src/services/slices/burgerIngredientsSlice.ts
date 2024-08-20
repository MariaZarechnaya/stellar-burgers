import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

interface IburgerConstructor {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: IburgerConstructor = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          // Если добавляем булочку, заменяем текущую
          state.bun = action.payload;
        } else {
          // Иначе добавляем ингредиент в список
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid(); // генерируем уникальный id, пригодится для идентификации при удалении
        return { payload: { ...ingredient, id } }; // новый payload
      }
    },
    // поменять местами ингредиенты
    changeIngredientInList: (state, action) => {
      console.log(action.payload);
      let fromIndex = action.payload.index;
      let toIndex = action.payload.newIndex;
      const ingredients = state.ingredients;
      const element = ingredients[fromIndex];
      ingredients[fromIndex] = ingredients[toIndex];
      ingredients[toIndex] = element;
    },
    // удаление из конструктора
    deleteIngredient: (state, action) => {
      // булочки не удаляем
      state.ingredients = state.ingredients.filter((item) => {
        return item.id !== action.payload;
      });
    },
    // очистка конструктора
    clearIngredient: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
    // меняем местами ингредиенты
  },
  selectors: {
    getConstructorIngredients: (state) => state
  }
});
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const burgerConstructor = burgerConstructorSlice.name;

export const {
  addIngredients,
  deleteIngredient,
  clearIngredient,
  changeIngredientInList
} = burgerConstructorSlice.actions;

export const {
  getConstructorIngredients
  // getCurrent
} = burgerConstructorSlice.selectors;
