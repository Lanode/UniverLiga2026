import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./index.css"
import { LoginPage } from "./components/login-page"
import { TaskPage } from "./components/task-page"
import { SelectPersonPage } from "./components/select-person-page"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/task/:id" element={<TaskPage />} />
        <Route path="/task/:id/users" element={<SelectPersonPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
