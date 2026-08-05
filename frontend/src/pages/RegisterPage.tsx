import {useState, type FormEvent} from "react";
import axios from "axios";
import {ArrowLeft, Recycle, UserPlus} from "lucide-react";
import {Link, Navigate, useNavigate} from "react-router-dom";

import {useAuth} from "../contexts/AuthContext";

export function RegisterPage() {
    const navigate = useNavigate();
    const {register, isAuthenticated} = useAuth();

    const [name, setName] = useState("");
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
            await register({
                name,
                email,
                password,
            });

            navigate("/");
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                const detail = requestError.response?.data?.detail;

                if (typeof detail === "string") {
                    setError(detail);
                } else {
                    setError("Verifique os dados informados.");
                }
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
                        <span>Faça parte da comunidade</span>
                    </div>
                </div>

                <div className="auth-heading">
          <span className="auth-heading__icon">
            <UserPlus size={24}/>
          </span>

                    <h1>Crie sua conta</h1>

                    <p>
                        Comece a vender, doar e encontrar itens no campus.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                        Nome

                        <input
                            type="text"
                            value={name}
                            placeholder="Seu nome"
                            autoComplete="name"
                            required
                            minLength={2}
                            maxLength={100}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </label>

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
                            placeholder="Mínimo de 8 caracteres"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            maxLength={72}
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
                        {isSubmitting ? "Criando conta..." : "Criar conta"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Já possui uma conta?{" "}
                    <Link to="/login">Entrar</Link>
                </p>
            </section>
        </main>
    );
}