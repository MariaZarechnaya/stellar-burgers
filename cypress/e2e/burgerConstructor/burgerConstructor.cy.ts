import * as ingredients from '../../fixtures/ingredients.json';
import * as order from '../../fixtures/order.json';
// commands
Cypress.Commands.add('checkElementExists', (selector, text) => {
  cy.get(selector).should('exist');
  if (text) {
    cy.get(selector).should('exist').contains(text);
  }
});
Cypress.Commands.add('buttonClick', (alias, text) => {
  cy.get(alias).next().contains(text).click();
});
Cypress.Commands.add('checkModalNotExist', (callback) => {
  callback().should('not.exist');
});
Cypress.Commands.add('checkModalVisible', (callback) => {
  callback().should('be.visible');
});

describe('тестирование BurgerConstructor', function () {
  const testUrl = 'http://localhost:4000';
  const getModal = () => cy.get('[data-modal = "modal"]'); // понадобится в нескольких тестах

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
    // alias
    cy.get('[data-ingredient="bun"]').as('bunIngredient');
    cy.get('[data-ingredient="sauce"]').as('sauceIngredient');
    cy.get('[data-ingredient="main"]').as('mainIngredient');
    cy.get('[data-cy="constructor-bun-fillings"]').as('fillings');
  });

  //
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit(testUrl);
  });

  //
  it('Проверка существования компонентов на странице', () => {
    cy.checkElementExists('[data-header="app-header"]'); // header
    cy.checkElementExists('[data-section="constructor"]'); // constructor
    cy.checkElementExists('[data-ingredients-section="ingredients-section"]'); // ingredients
  });
  //
  it('проверка существования ингредиентов', () => {
    cy.get('@bunIngredient').should('have.length.at.least', 1);
    cy.get('@sauceIngredient').should('have.length.at.least', 1);
    cy.get('@mainIngredient').should('have.length.at.least', 1);
  });
  //в отдельный дискрайб про модалки
  it('Открытие и зщакрытие модального окна ингредиентов', () => {
    //
    const cardItem = () => cy.get('[data-ingId="643d69a5c3f7b9001cfa093c"]'); // карточка ингреиента
    cardItem().click(); // клик по карточке ингредиента
    cy.checkModalVisible(getModal); // модалка должны появляться
    getModal().contains('Краторная булка N-200i'); // в нем должен быть элемент
    cy.get('[data-modal-close-btn="close-btn"]').click(); // клик по кнопке закрытия модалки
    cy.checkModalNotExist(getModal); // модалка должна закрыться
    //
    cardItem().click(); // снова клик проверки для проверки закрытия модального окна оверлею
    cy.checkModalVisible(getModal); // модалка должны появляться
    cy.get('[data-overlay="overlay"]').click(0, 0, { force: true }); // клик по оверлею
    //
    cardItem().click();
    cy.checkModalVisible(getModal);
    cy.get('body').type('{esc}');
    cy.checkModalNotExist(getModal);
  });
  //
  it('проверка работы конструктора', () => {
    // изначально сумма в конструкторе ноль
    cy.checkElementExists('[data-cy="total-price"]', '0');
    // добавление в конструктор
    // булки
    cy.buttonClick('@bunIngredient', 'Добавить');
    cy.checkElementExists(
      '[data-cy="constructor-bun-top"]',
      'Краторная булка N-200i'
    );
    cy.checkElementExists(
      '[data-cy="constructor-bun-bottom"]',
      'Краторная булка N-200i'
    );
    // начинки
    cy.buttonClick('@mainIngredient', 'Добавить');
    cy.checkElementExists('@fillings', 'Кристаллы марсианских альфа-сахаридов');

    // соусы
    cy.buttonClick('@sauceIngredient', 'Добавить');
    cy.checkElementExists('@fillings', 'Соус Spicy-X');
    // сумма заказа изменилась
    cy.checkElementExists('[data-cy="total-price"]', order.order.price.toString());
    // проверка работоспособности кнопки изменения мест начинок
    cy.get('[data-cy="constructor-li"]')
      .find('button')
      .filter(':not(:disabled)')
      .first()
      .click(); // кликаем по первой найденой доспутной кнопке (вниз)
    cy.get('@fillings').find('li').first().contains('Соус Spicy-X'); // проверили что элементы поменялись местами
    cy.get('[data-cy="constructor-li"]')
      .find('button')
      .filter(':not(:disabled)')
      .last()
      .click(); // поднять ингредиент вверх
    cy.get('@fillings')
      .find('li')
      .first()
      .contains('Кристаллы марсианских альфа-сахаридов');
  });
  // создание заказа

  it('Проверка создания заказа и очистки конструктора после создания ', () => {
    // если мы не ааторизовканы конструктор должен нас перенаправлять

    cy.buttonClick('@bunIngredient', 'Добавить');
    cy.buttonClick('@mainIngredient', 'Добавить');
    cy.buttonClick('@sauceIngredient', 'Добавить');
    // cy.buttonClick('[data-section="constructor"] button', 'Оформить заказ')// клик на Оформить заказ
    cy.buttonClick('[data-cy="total-price"]>div', 'Оформить заказ')// клик на Оформить заказ
    //
    cy.checkModalVisible;
    getModal().contains(order.order.number); //проверка номера заказа
    cy.get('[data-modal-close-btn="close-btn"]').click();
    cy.checkModalNotExist(getModal);

    //
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    cy.get('@fillings').find('li').should('not.exist');
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
    cy.intercept('POST', '/api/auth/login', { fixture: 'login.json' }).as(
      'login'
    );
  });

  it('проверка переадресации и логирования', () => {
    cy.get('[data-cy="to-profile"]').click(); // Переход к логину
    cy.url().should('include', '/login'); // Проверка на переадресацию

    // Заполнение формы отправка
    cy.get('[type="email"]')
      .type('m.zarechnaya.m@mail.ru')
      .should('have.value', 'm.zarechnaya.m@mail.ru');
    cy.get('[type="password"]')
      .type('somePass123')
      .should('have.value', 'somePass123');
    cy.get('[type="submit"]').contains('Войти').click(); // Отправка
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.setCookie('accessToken', 'token test accessToken');
    window.localStorage.setItem('refreshToken', 'refresh token');
  });
});
