import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({
                                   children,
                               }: ProtectedRouteProps) {
    const location = useLocation();
    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    if (isLoading) {
        return (
            <main className="route-loading">
                <p>Verificando sua sessão...</p>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}