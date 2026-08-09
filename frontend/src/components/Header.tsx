import {useState} from "react";
import {
    LogIn,
    LogOut,
    Menu,
    PlusCircle,
    Recycle,
    UserRound,
    X,
} from "lucide-react";
import {Link} from "react-router-dom";

import {useAuth} from "../contexts/AuthContext";

export function Header() {
    const {user, isAuthenticated, logout} = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function handleLogout() {
        logout();
        closeMenu();
    }

    return (
        <header className="header">
            <div className="container header__content">
                <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand__icon">
            <Recycle size={22}/>
          </span>

                    <span>Desapega Campus</span>
                </Link>

                <nav className="header__actions header__actions--desktop">
                    {isAuthenticated && user ? (
                        <>
              <span className="header__user">
                <UserRound size={17}/>
                  {user.name}
              </span>

                            <Link className="button button--ghost" to="/my-ads">
                                Meus anúncios
                            </Link>

                            <button
                                className="button button--ghost"
                                type="button"
                                onClick={logout}
                            >
                                <LogOut size={18}/>
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link className="button button--ghost" to="/login">
                            <LogIn size={18}/>
                            Entrar
                        </Link>
                    )}

                    <Link
                        className="button button--primary"
                        to={isAuthenticated ? "/new-ad" : "/login"}
                    >
                        <PlusCircle size={18}/>
                        Anunciar item
                    </Link>
                </nav>

                <button
                    className="mobile-menu-button"
                    type="button"
                    aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </div>

            {isMenuOpen && (
                <nav className="mobile-menu">
                    <div className="container mobile-menu__content">
                        {isAuthenticated && user ? (
                            <>
                <span className="mobile-menu__user">
                  <UserRound size={18}/>
                    {user.name}
                </span>

                                <Link
                                    className="mobile-menu__link"
                                    to="/my-ads"
                                    onClick={closeMenu}
                                >
                                    Meus anúncios
                                </Link>

                                <Link
                                    className="mobile-menu__link mobile-menu__link--primary"
                                    to="/new-ad"
                                    onClick={closeMenu}
                                >
                                    <PlusCircle size={18}/>
                                    Anunciar item
                                </Link>

                                <button
                                    className="mobile-menu__link mobile-menu__logout"
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18}/>
                                    Sair
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="mobile-menu__link"
                                    to="/login"
                                    onClick={closeMenu}
                                >
                                    <LogIn size={18}/>
                                    Entrar
                                </Link>

                                <Link
                                    className="mobile-menu__link"
                                    to="/register"
                                    onClick={closeMenu}
                                >
                                    Criar conta
                                </Link>

                                <Link
                                    className="mobile-menu__link mobile-menu__link--primary"
                                    to="/login"
                                    onClick={closeMenu}
                                >
                                    <PlusCircle size={18}/>
                                    Anunciar item
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}