import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  deleteIngredient,
  changeIngredientInList
} from '../../services/slices/burgerIngredientsSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    // обработчики смены места ингредиента в бургере
    const handleMoveDown = () => {
      dispatch(changeIngredientInList({ index, newIndex: index + 1 }));
    };

    const handleMoveUp = () => {
      dispatch(changeIngredientInList({ index, newIndex: index - 1 }));
    };

    // обработчик удаления ингредиента из конструктора
    const handleClose = () => {
      console.log(ingredient);
      dispatch(deleteIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
