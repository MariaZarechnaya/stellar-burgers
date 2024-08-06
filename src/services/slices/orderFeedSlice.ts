import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export interface IFeedState {
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
  error: string | null;
  isLoaded: boolean;
}

const initialState: IFeedState = {
  orders: [],
  total: null,
  totalToday: null,
  error: null,
  isLoaded: false
};
// запрос ленты заказов
export const fetchFeeds = createAsyncThunk('feeds/fetchFeed', async () => {
  const data = await getFeedsApi();
  return data;
});

export const orderFeedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (bulder) => {
    bulder
      // запрос ленты заказов с сервера
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoaded = true;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoaded = false;
      });
  },

  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedState: (state) => state
  }
});

export const feedsName = orderFeedsSlice.name;
export const orderFeedsReducer = orderFeedsSlice.reducer;
export const { getFeedOrders, getFeedState } = orderFeedsSlice.selectors;
