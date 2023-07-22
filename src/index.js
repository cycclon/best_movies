import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './hamburguers.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Loading from './components/Loading';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <ToastContainer position='top-right' theme="dark"/>  
        <App />        
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);