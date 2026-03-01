import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LoginPage } from "@/components/login-page";
import { SelectPersonPage } from "@/components/select-person-page";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root stays the same */}
        <Route path="/" element={<LoginPage />} />

        {/* New page */}
        <Route path="/select-person" element={<SelectPersonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;