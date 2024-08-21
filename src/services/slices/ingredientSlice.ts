import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type TypeIngredientsState = {
  ingredients: TIngredient[]; // массив с сервера
  isLoaded: boolean; // статус загрузки
  error: string; // текст ошибки
};

export const initialState: TypeIngredientsState = {
  isLoaded: false,
  ingredients: [],
  error: ''
};
// запрос получения всех ингредиентов
export const getIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  () => {
    return getIngredientsApi();
  }
);

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    IngredientsSelector: (state) => state.ingredients,
    StatusSelector: (state) => state.isLoaded
  },
  extraReducers: (bulder) => {
    bulder
      .addCase(getIngredients.pending, (state) => {
        state.isLoaded;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoaded = !state.isLoaded;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.error = 'Произошла ошибка';
      });
  }
});

export const allIngredientsReducer = ingredientSlice.reducer;
export const { IngredientsSelector, StatusSelector } =
  ingredientSlice.selectors;
