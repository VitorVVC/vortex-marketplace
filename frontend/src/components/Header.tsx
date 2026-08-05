import { LogIn, PlusCircle, Recycle } from "lucide-react";

export function Header() {
    return (
        <header className="header">
            <div className="container header__content">
                <a className="brand" href="/">
          <span className="brand__icon">
            <Recycle size={22} />
          </span>

                    <span>Desapega Campus</span>
                </a>

                <nav className="header__actions">
                    <button className="button button--ghost" type="button">
                        <LogIn size={18} />
                        Entrar
                    </button>

                    <button className="button button--primary" type="button">
                        <PlusCircle size={18} />
                        Anunciar item
                    </button>
                </nav>
            </div>
        </header>
    );
}