import {useState, type FormEvent} from "react";
import axios from "axios";
import {ArrowLeft, LockKeyhole, Recycle} from "lucide-react";
import {Link, Navigate, useNavigate} from "react-router-dom";

import {useAuth} from "../contexts/AuthContext";

export function LoginPage() {
    const navigate = useNavigate();
    const {login, isAuthenticated} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/" replace/>;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            await login({
                email,
                password,
            });

            navigate("/");
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                setError(
                    requestError.response?.data?.detail ??
                    "Não foi possível realizar o login.",
                );
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <Link className="auth-back-link" to="/">
                    <ArrowLeft size={18}/>
                    Voltar para o marketplace
                </Link>

                <div className="auth-brand">
          <span className="brand__icon">
            <Recycle size={23}/>
          </span>

                    <div>
                        <strong>Desapega Campus</strong>
                        <span>Entre para continuar</span>
                    </div>
                </div>

                <div className="auth-heading">
          <span className="auth-heading__icon">
            <LockKeyhole size={24}/>
          </span>

                    <h1>Bem-vindo de volta</h1>

                    <p>
                        Acesse sua conta para anunciar e gerenciar seus itens.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                        E-mail

                        <input
                            type="email"
                            value={email}
                            placeholder="voce@email.com"
                            autoComplete="email"
                            required
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>

                    <label>
                        Senha

                        <input
                            type="password"
                            value={password}
                            placeholder="Sua senha"
                            autoComplete="current-password"
                            required
                            minLength={8}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <button
                        className="button button--primary auth-submit"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Ainda não possui conta?{" "}
                    <Link to="/register">Criar cadastro</Link>
                </p>
            </section>
        </main>
    );
}