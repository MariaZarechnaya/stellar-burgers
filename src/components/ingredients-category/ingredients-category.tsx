import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useDispatch, useSelector } from '../../services/store';
import { getConstructorIngredients } from '../../services/slices/burgerIngredientsSlice';

// компонент для каждой категории , рендерит UI
export const IngredientsCategory = forwardRef<
  // через forwardRef передадим родительскому компоненту реф ссылку
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // данные и переменные
  const burgerConstructor = useSelector(getConstructorIngredients); // стейт собранного бургера
  // считаем сколько какого ингредиента добавлено в бургер
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      // если по ключу в объекте элемент не найден, то элемент не добавлен и значение = 0 ( ключ - это значение нашего id, значение ключа- 0 )
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    // булочек всегда две
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
