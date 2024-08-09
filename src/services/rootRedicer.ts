import {allIngredientsReducer} from './slices/ingredientSlice'
import {burgerConstructorReducer, burgerConstructor} from './slices/burgerIngredientsSlice'
import {userDataReducer, userDataName} from './slices/userSlice'
import {orderFeedsReducer, feedsName} from './slices/orderFeedSlice'
import {userOrderReducer, userOrderName} from './slices/orderSlice'
import { combineReducers} from '@reduxjs/toolkit';


export const rootReducer = combineReducers({
    'ingredients':  allIngredientsReducer,
    [burgerConstructor] : burgerConstructorReducer,
    [userDataName] : userDataReducer,
    [feedsName]: orderFeedsReducer,
    [userOrderName]: userOrderReducer

}
)