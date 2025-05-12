import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Focus from "./focus.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Focus />
  </StrictMode>,
);
