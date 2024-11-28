import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRu from 'antd/es/locale/ru_RU';
import { App } from 'app/App';
import { setupStore } from './api';
import 'common/styles/styles.scss';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <ErrorBoundary>
  // <AcceptCookie>
  <ConfigProvider locale={ruRu}>
    <Provider store={setupStore()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
  // </AcceptCookie>
  // </ErrorBoundary>
);
