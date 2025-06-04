import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import types to ensure Date prototype extensions are loaded
import "./lib/types";

createRoot(document.getElementById("root")!).render(<App />);
