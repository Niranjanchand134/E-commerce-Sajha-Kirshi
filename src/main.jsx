import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';
import google_client_id from './Context/AuthDetails';

window.global = window;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={google_client_id}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
