
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder} from '@utils-types';

type TypeIngredientsState = {
    order: TOrder| null;
    userOrderHistory: TOrder[];
    orderRequest: boolean; // идет ли запрос на сервер, для прелоадера
    errorMakeOrder: string |null
    errorGetOrder: string |null
    errorHistoryOrder:string
  }
  const initialState: TypeIngredientsState = {
    order: null,
    userOrderHistory: [],
    orderRequest: false,
    errorMakeOrder: null,
    errorGetOrder:null,
    errorHistoryOrder: ''
  };

  // отправка заказа пользователем
export const makeUserOrder = createAsyncThunk(
    'order/makeOrder',
    async (data: string[]) => {
      const dataUserOrder = await orderBurgerApi(data);
      return dataUserOrder;
    }
  );


  //  получение данных о конкретном заказе
export const fetchUserDetailOrder = createAsyncThunk(
    'order/fetchDetailOrder',
     (number: number) => {
      return getOrderByNumberApi(number);
    }
  );

  // получение истории заказов
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrderHistory', 
   () => getOrdersApi() 
);

const userOrderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
      clearOrder: (state) => {
        state.order = null;
      }
    },

    extraReducers: (builder) => {
      builder
        // данные своего заказа
        .addCase(fetchUserDetailOrder.pending, (state) => {
          state.errorGetOrder = null;
         
        })
        .addCase(fetchUserDetailOrder.fulfilled, (state, action) => {
          state.order = action.payload.orders[0];
        console.log (action.payload)
          
        })
        .addCase(fetchUserDetailOrder.rejected, (state, action) => {
          state.errorGetOrder = 'Order data Error';
          
        })
        // создание нового заказа
        .addCase(makeUserOrder.pending, (state) => {
          state.errorMakeOrder = null;
          state.orderRequest = true;
        })
        .addCase(makeUserOrder.fulfilled, (state, action) => {
          state.order = action.payload.order;
          state.orderRequest = false;
        })
        .addCase(makeUserOrder.rejected, (state, action) => {
          state.errorMakeOrder = 'При оформлении заказа произошла ошибка';
          state.orderRequest = false;
        })
        // получение истории заказов
        .addCase(fetchUserOrders.pending, (state) => {
          state.userOrderHistory = [];
          state.errorHistoryOrder = '';
        })
        .addCase(fetchUserOrders.fulfilled, (state, action) => {
          state.userOrderHistory = action.payload;
        })
        .addCase(fetchUserOrders.rejected, (state) => {
          state.errorHistoryOrder = 'При загрузке истории заказов произошла ошибка';
        })
    },
    selectors: {
        getOrder: (state) => state.order,
        getOrderRequest: (state) => state.orderRequest,
        getOrderHistory: state => state.userOrderHistory,
        getOrderHistoryError: state => state.errorHistoryOrder

      },
  });
  

export const userOrderReducer = userOrderSlice.reducer;
export const { clearOrder } = userOrderSlice.actions;
export const userOrderName = userOrderSlice.name;
export const {getOrder,
    getOrderRequest,
    getOrderHistory,
    getOrderHistoryError,

} = userOrderSlice.selectors

