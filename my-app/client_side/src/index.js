import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.min.js';
import { GoogleOAuthProvider } from '@react-oauth/google';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="625998531450-dnfcismhun712fnd3dsaphtmjuumlrvj.apps.googleusercontent.com">
            <App />
    </GoogleOAuthProvider>,
);


