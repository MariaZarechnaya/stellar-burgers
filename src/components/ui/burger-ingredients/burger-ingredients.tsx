import React, { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components'; //  готовый React Tab component
import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type'; // типизация пропсов
import { IngredientsCategory } from '@components'; //

// большой компонент"Соберите бургер "
export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab, //текущая вкладка
    buns, //булки соусы и начинки
    mains,
    sauces,
    titleBunRef, // рефы заголовков
    titleMainRef,
    titleSaucesRef,
    bunsRef, // пока не поняла что за рефы
    mainsRef,
    saucesRef,
    onTabClick // обработчик при клике на вкладку
  }) => (
    <>
      <section className={styles.burger_ingredients}>
        {/* // меню вкладок */}
        <nav>
          <ul className={styles.menu}>
            <Tab
              value='bun'
              active={currentTab === 'bun'} // в active попадает булевое значение в зависимости от пропса currentTab
              onClick={onTabClick}
            >
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={onTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={onTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>

        {/* // блок с контентом */}
        <div className={styles.content}>
          {/* // общий блок (компонент) для булочек */}
          <IngredientsCategory
            title='Булки'
            titleRef={titleBunRef} //
            ingredients={buns}
            ref={bunsRef}
          />
          {/* //  для начинок */}
          <IngredientsCategory
            title='Начинки'
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
          />
          {/* //  для соусов */}
          <IngredientsCategory
            title='Соусы'
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
          />
        </div>
      </section>
    </>
  )
);
