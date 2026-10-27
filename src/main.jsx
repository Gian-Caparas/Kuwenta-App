import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { isSupabaseConfigured } from "./lib/supabase";
import "./styles.css";

function SetupNotice() {
  return (
    <div className="state-screen">
      <h2>Kailangan pang i-setup ang Supabase</h2>
      <p>
        Gumawa ng <code>.env</code> file (kopyahin ang <code>.env.example</code>), ilagay ang
        VITE_SUPABASE_URL at VITE_SUPABASE_ANON_KEY, tapos i-restart ang <code>npm run dev</code>.
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isSupabaseConfigured ? (
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    ) : (
      <SetupNotice />
    )}
  </StrictMode>
);
