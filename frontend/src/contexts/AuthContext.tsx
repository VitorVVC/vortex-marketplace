import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {api} from "../services/api";
import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
} from "../types/api";

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get<User>("/auth/me");

                setUser(response.data);
            } catch {
                localStorage.removeItem("access_token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        restoreSession();
    }, []);

    async function login(payload: LoginPayload) {
        const response = await api.post<AuthResponse>(
            "/auth/login",
            payload,
        );

        localStorage.setItem(
            "access_token",
            response.data.access_token,
        );

        setUser(response.data.user);
    }

    async function register(payload: RegisterPayload) {
        await api.post<User>("/auth/register", payload);

        await login({
            email: payload.email,
            password: payload.password,
        });
    }

    function logout() {
        localStorage.removeItem("access_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth deve ser utilizado dentro de AuthProvider.",
        );
    }

    return context;
}