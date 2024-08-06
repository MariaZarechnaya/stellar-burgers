import { FC } from 'react';
import errorCat from '../../images/cat404.svg'

export const NotFound404: FC = () => {
  return (

    <>
      <h3 className={`pb-6 text text_type_main-large`}>
      Страница не найдена. Ошибка 404.
      <img
        src={errorCat}
        alt='изображение 404.'
      />
    </h3>
    </>
  
  );
} 
