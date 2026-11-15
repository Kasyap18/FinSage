import { Routes, Route } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { HomePage } from "@/pages/HomePage";
import { LoanPage } from "@/pages/LoanPage";
import { FraudPage } from "@/pages/FraudPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/fraud" element={<FraudPage />} />

          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page not found"
                description="The requested page does not exist."
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
