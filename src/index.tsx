import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import store from './services/store'; // импорт стора 
import { Provider } from 'react-redux';  // импорт провайдера, что бы сделать стор доступным всему приложению 
import {
  BrowserRouter,
} from "react-router-dom";

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
  {/* // передаем стор провайдеру */}
<Provider store = {store}>
{/* // оборачиваем приложение  в роутер */}
    <BrowserRouter>
            <App />
        </BrowserRouter>
        </Provider>
  </React.StrictMode>
);
