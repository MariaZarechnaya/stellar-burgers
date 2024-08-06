import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientsSelector } from '../../services/slices/ingredientSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams(); // берем id из url, которое там уже есть
  // сопоставляем id из всего списка элементов на странице
  const ingrediets = useSelector(IngredientsSelector);
  const ingredientData = ingrediets.find((elem) => elem._id === id);
  // если совпадение - отображаем ,иначе прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
