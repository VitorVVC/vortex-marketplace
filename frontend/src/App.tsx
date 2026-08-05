import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MyAdsPage } from "./pages/MyAdsPage";
import { NewAdPage } from "./pages/NewAdPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/new-ad"
                element={
                    <ProtectedRoute>
                        <NewAdPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-ads"
                element={
                    <ProtectedRoute>
                        <MyAdsPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}