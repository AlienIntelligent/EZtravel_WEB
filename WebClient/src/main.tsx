import React, { StrictMode } from "react";
window.React = React;
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/system/ErrorBoundary";

// Fonts
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";

// Global CSS (Tailwind)
import "./index.css";

createRoot(document.getElementById('root')!).render(
 <StrictMode>
 <ErrorBoundary>
 <Provider store={store}>
 <AuthProvider>
 <App />
 </AuthProvider>
 </Provider>
 </ErrorBoundary>
 </StrictMode>,
)
