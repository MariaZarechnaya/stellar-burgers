import { rootReducer } from '../rootRedicer';
import store from '../store';

describe('Тестирование rootReducer', () => {
  test('Вызов rootReducer с неизвестным экшеном ', () => {
    const beforeUndefined = store.getState();
    const afterUndefined = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(afterUndefined).toEqual(beforeUndefined);
  });
});
