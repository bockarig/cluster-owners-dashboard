import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@fontsource-variable/sora";
import "@/styles/global.css"

import App from "./App.tsx"
import {ThemeProvider} from "@/components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light'><App/></ThemeProvider>
  </StrictMode>
)
