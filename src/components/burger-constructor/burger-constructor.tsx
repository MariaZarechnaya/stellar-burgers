import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';
import {
  getConstructorIngredients,
  clearIngredient
} from '../../services/slices/burgerIngredientsSlice';
import { useNavigate } from 'react-router-dom';
import {
  getOrderRequest,
  getOrder,
  makeUserOrder,
  clearOrder
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(getConstructorIngredients); // стейт собранного бургера
  const  isUserData= useSelector (getUser) // если авторизован у нас щдесь будут данные
  const dispatch = useDispatch();
  const orderRequest = useSelector(getOrderRequest); // запрос на сервер
  const orderModalData = useSelector(getOrder); // данные заказа для модалки

  // обработчик по клику на кнопку заказа
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    // если пользователь не авторизован, перенаправляем на страницу логина при попытке оформить заказ
    if (!isUserData) {
      navigate('/login');
      return;
    }
    // на сервер отправляется массив id ингредиентов string[]
    const orderArray = [
      constructorItems.bun._id,
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((elem) => elem._id)
    ];
    // отправляем подготовленный массив
    console.log(orderArray)
    dispatch(makeUserOrder(orderArray));
    // orderModalData
  };
  // обработчик закрытия модального окна
  const closeOrderModal = () => {
    dispatch(clearOrder()); //тут надо очистить что бы модалка закрывалась
    dispatch(clearIngredient()); // очищаем окно конструктора
  };

  // подсчет стоимости, используем с  useMemo для мемоизации вычислений
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) + // двe булочки, поэтому х2
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price, // задали начальное значение 0, далее прибавляем стоимость каждого итема
        0
      ),
    [constructorItems]
  );
  //рендерим интерфейс
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
