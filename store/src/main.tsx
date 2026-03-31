import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ThemeProvider } from "./app/context/ThemeContext.tsx";
import { ToastProvider } from "./app/context/ToastContext.tsx";
import { WishlistProvider } from "./app/context/WishlistContext.tsx";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <ToastProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </ToastProvider>
    </AuthProvider>
  </ThemeProvider>
);