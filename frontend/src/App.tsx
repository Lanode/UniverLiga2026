import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "@/components/login-page";
import { TaskPage } from "@/components/task-page";
import { SelectPersonPage } from "@/components/select-person-page";
import { FeedbackPage } from "@/components/feedback-page";
import { FeedbackSuccessPage } from "@/components/feedback-success-page";
import { FeedbackSystemPage } from "@/components/feedback-system-page";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/task/:id" element={<TaskPage />} />
        <Route path="/task/:id/users" element={<SelectPersonPage />} />
        <Route path="/task/:id/feedback/:personId" element={<FeedbackPage />} />
        <Route path="/task/:id/feedback/:personId/success" element={<FeedbackSuccessPage />} />
        <Route path="/feedback-system" element={<FeedbackSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
