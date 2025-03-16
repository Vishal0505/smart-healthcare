import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css"; // Import Radix UI styles
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner"; // Import Toaster from Sonner
import App from "./App";
import "./index.css"; // Ensure Tailwind is still included

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Theme>
      <App />
      <Toaster position="top-right" richColors />
    </Theme>
  </React.StrictMode>
);
