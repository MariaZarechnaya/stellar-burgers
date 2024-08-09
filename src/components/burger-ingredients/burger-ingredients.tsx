import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer'; // intersection-observer апишка , связанная с областью видимости. Вытащили из него хук
import { useDispatch, useSelector } from '../../services/store';
import { IngredientsSelector } from '../../services/slices/ingredientSlice';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  const burgerIngredients = useSelector(IngredientsSelector); //все ингридиенты с сервера []
  const buns = burgerIngredients.filter((elem) => elem.type === 'bun'); //отсортировали булочки []
  const mains = burgerIngredients.filter((elem) => elem.type === 'main'); //отсортировали начинки []
  const sauces = burgerIngredients.filter((elem) => elem.type === 'sauce'); //отсортировали соусы []
  // console.log(burgerIngredients)

  // установили состояние для вкладок (булки\начинки\соусы)
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  // сделали рефы ссылки на заголовки
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // говорим обсерверу за каким элементом следить
  // передали реф который хотим мониторить, в переменных inViewBuns inViewFilling inViewSauces будет меняться значение , в зависимости от скролла
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });
  // при первом рендеринге и изменении переменных в массиве зависимостей записываем значения в стейт для вкладок
  useEffect(() => {
    // console.log(bunsRef)
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // обрабатываем поведение при нажатии на вкладки
  // из UI компонента приходит строка с названием, далее обрабатываем поведение
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // рендер UI компонента со всеми пропсами , что передали из функционального
  return (
    <BurgerIngredientsUI
      currentTab={currentTab} // текущая вкладка
      buns={buns} // булочки
      mains={mains} // начинки
      sauces={sauces} // соусы
      titleBunRef={titleBunRef} // из лочернего компонента нам придут рефы на заголовки
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef} //
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick} //
    />
  );
};
