import {
    LogIn,
    LogOut,
    PlusCircle,
    Recycle,
    UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export function Header() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="header">
            <div className="container header__content">
                <Link className="brand" to="/">
          <span className="brand__icon">
            <Recycle size={22} />
          </span>

                    <span>Desapega Campus</span>
                </Link>

                <nav className="header__actions">
                    {isAuthenticated && user ? (
                        <>
              <span className="header__user">
                <UserRound size={17} />
                  {user.name}
              </span>

                            <Link
                                className="button button--ghost"
                                to="/my-ads"
                            >
                                Meus anúncios
                            </Link>

                            <button
                                className="button button--ghost"
                                type="button"
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link
                            className="button button--ghost"
                            to="/login"
                        >
                            <LogIn size={18} />
                            Entrar
                        </Link>
                    )}

                    <Link
                        className="button button--primary"
                        to={isAuthenticated ? "/new-ad" : "/login"}
                    >
                        <PlusCircle size={18} />
                        Anunciar item
                    </Link>
                </nav>
            </div>
        </header>
    );
}