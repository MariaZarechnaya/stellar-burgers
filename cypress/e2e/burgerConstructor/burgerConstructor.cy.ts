
import * as ingredients from '../../fixtures/ingredients.json'
import * as order from '../../fixtures/order.json'
describe('тестирование BurgerConstructor', function() {
    const testUrl = 'http://localhost:4000';
    const getModal = () => cy.get('[data-modal = "modal"]'); // понадобится в нескольких тестах
    //
    beforeEach(() => {
        // перед каждым тестом для этой страницы  делаем имитацию запроса за ингредиентами
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
        cy.visit(testUrl); 
        cy.intercept('GET', 'api/auth/user', {
          fixture: 'login.json'
        }).as('login');
        cy.intercept('POST', 'api/orders', {
          fixture: 'order.json'
        }).as('order'); 
  
        cy.setCookie('accessToken', 'example');
        window.localStorage.setItem('refreshToken', 'example');
        cy.visit(testUrl);
      });
      

      

      //
    it('сервис должен быть доступен по адресу localhost:4000', function() {
        cy.visit(testUrl); 
    });

    //
    it('Проверка существования компонентов на странице', () => {
      cy.get('[data-header="app-header"]').should('exist'); // header
      cy.get('[data-section="constructor"]').should('exist'); // constructor
      cy.get('[data-ingredients-section="ingredients-section"]').should('exist'); // ingredients
      // cy.get('h1').should('exist').and('contain', 'Соберите бургер'); // главный заголовок страницы

    });
//
    it('проверка существования ингредиентов', () => {
      // cy.get('[data-ingredient="bun"]').should('exist');
      cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1);
      cy.get('[data-ingredient="sauce"]').should('have.length.at.least', 1);
      cy.get('[data-ingredient="main"]').should('have.length.at.least', 1);
    });
  //в отдельный дискрайб про модалки
    it('Открытие и зщакрытие модального окна ингредиентов', () => {
      //
      const cardItem = ()=> cy.get('[data-ingId="643d69a5c3f7b9001cfa093c"]') // карточка ингреиента
      cardItem().click() // клик по карточке ингредиента
      getModal().should('be.visible'); // модалка должны появляться
      getModal().contains('Краторная булка N-200i'); // в нем должен быть элемент
      cy.get('[data-modal-close-btn="close-btn"]').click() // клик по кнопке закрытия модалки
      getModal().should('not.exist');// модалка должна закрыться
//
      cardItem().click() // снова клик проверки для проверки закрытия модального окна оверлею
      getModal().should('be.visible'); // модалка должны появляться   
      cy.get('[data-overlay="overlay"]').click(0, 0,{ force: true }) // клик по оверлею
//
      cardItem().click() 
      getModal().should('be.visible'); 
      cy.get('body').type('{esc}');
      getModal().should('not.exist');

    });
    //
    it('проверка работы конструктора', () => {
      // изначально сумма в конструкторе ноль
      cy.get('[data-cy="total-price"]').contains("0")
      // добавление в конструктор
      // булки
      cy.get('[data-ingredient="bun"]').next().contains('Добавить').click(); 
      cy.get('[data-cy="constructor-bun-top"]').contains("Краторная булка N-200i").should("exist");
      cy.get('[data-cy="constructor-bun-bottom"]').contains("Краторная булка N-200i").should("exist");
      // начинки
      cy.get('[data-ingredient="main"]').next().contains('Добавить').click(); 
      cy.get('[data-cy="constructor-bun-fillings"]').contains("Кристаллы марсианских альфа-сахаридов").should("exist");
      // соусы
      cy.get('[data-ingredient="sauce"]').next().contains('Добавить').click(); 
      cy.get('[data-cy="constructor-bun-fillings"]').contains("Соус Spicy-X").should("exist");
      // сумма заказа изменилась 
      cy.get('[data-cy="total-price"]').contains(order.order.price)
      // проверка работоспособности кнопки изменения мест начинок
      cy.get('[data-cy="constructor-li"]').find('button').filter(':not(:disabled)').first().click() // кликаем по первой найденой доспутной кнопке (вниз)
      cy.get('[data-cy="constructor-bun-fillings"]').find('li').first().contains('Соус Spicy-X') // проверили что элементы поменялись местами
      cy.get('[data-cy="constructor-li"]').find('button').filter(':not(:disabled)').last().click() // поднять ингредиент вверх
      cy.get('[data-cy="constructor-bun-fillings"]').find('li').first().contains('Кристаллы марсианских альфа-сахаридов')


    });
    // создание заказа 

    it('Проверка создания заказа и очистки конструктора после создания ', () => {
      // если мы не ааторизовканы конструктор должен нас перенаправлять
      // 
      cy.get('[data-ingredient="bun"]').next().contains('Добавить').click(); 
      cy.get('[data-ingredient="main"]').next().contains('Добавить').click(); 
      cy.get('[data-ingredient="sauce"]').next().contains('Добавить').click(); 
      cy.get('[data-section="constructor"] button').contains('Оформить заказ').click(); // клик на Оформить заказ
      //
      getModal().should('exist')
      getModal().contains(order.order.number); //проверка номера заказа
      cy.get('[data-modal-close-btn="close-btn"]').click() 
      getModal().should('not.exist');
  
      //
      cy.get('[data-cy="constructor-bun-top"]').should("not.exist");
      cy.get('[data-cy="constructor-bun-bottom"]').should("not.exist");
      cy.get('[data-cy="constructor-bun-fillings"]').find('li').should("not.exist");


    });

}); 
 

describe('переадресация и логирование', () => {
  const testUrl = 'http://localhost:4000';

  before(() => {
    // Сбрасываем состояние пользователя
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
    cy.visit(testUrl);
    
    // Перехват запроса на логин
    cy.intercept('POST', '/api/auth/login', { fixture: 'login.json' }
    ).as('login');
  });

  it('проверка переадресации и логирования', () => {
    cy.get('[data-cy="to-profile"]').click(); // Переход к логину
    cy.url().should('include', '/login'); // Проверка на переадресацию

    // Заполнение формы отправка
    cy.get('[type="email"]').type('m.zarechnaya.m@mail.ru').should('have.value', 'm.zarechnaya.m@mail.ru');
    cy.get('[type="password"]').type('somePass123').should('have.value', 'somePass123');
    cy.get('[type="submit"]').contains('Войти').click(); // Отправка 
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.setCookie('accessToken', 'token test accessToken');
    window.localStorage.setItem('refreshToken', 'refresh token');
  
  });
});