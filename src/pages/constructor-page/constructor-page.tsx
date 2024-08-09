import { useSelector } from '../../services/store';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page/constructor-page';
import { StatusSelector } from '../../services/slices/ingredientSlice';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(StatusSelector); // статус загрузки
  // если идет загрузка показываем прелоадер
  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />
      )}
    </>
  );
};
