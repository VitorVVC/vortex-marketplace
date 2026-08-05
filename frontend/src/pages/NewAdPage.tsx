import { useState, type FormEvent } from "react";
import axios from "axios";
import { ArrowLeft, Gift, Image, PackagePlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Header } from "../components/Header";
import { api } from "../services/api";
import type { Ad, AdPayload } from "../types/api";

const categories = [
    "Livros",
    "Computação",
    "Engenharia",
    "Saúde",
    "Materiais acadêmicos",
    "Eletrônicos",
    "Móveis",
    "Outros",
];

export function NewAdPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [price, setPrice] = useState("");
    const [isDonation, setIsDonation] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        const payload: AdPayload = {
            title,
            description,
            category,
            price: isDonation ? null : Number(price),
            is_donation: isDonation,
            image_url: imageUrl.trim() || null,
        };

        try {
            await api.post<Ad>("/ads", payload);
            navigate("/my-ads");
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                const detail = requestError.response?.data?.detail;

                setError(
                    typeof detail === "string"
                        ? detail
                        : "Revise os dados informados.",
                );
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Header />

            <main className="form-page">
                <div className="container form-page__container">
                    <Link className="auth-back-link" to="/">
                        <ArrowLeft size={18} />
                        Voltar ao marketplace
                    </Link>

                    <section className="form-card">
                        <div className="form-card__heading">
              <span className="form-card__icon">
                <PackagePlus size={26} />
              </span>

                            <div>
                                <span className="eyebrow">Novo anúncio</span>
                                <h1>Dê uma nova vida ao seu item</h1>
                                <p>
                                    Preencha as informações abaixo para publicar no marketplace.
                                </p>
                            </div>
                        </div>

                        <form className="item-form" onSubmit={handleSubmit}>
                            <label>
                                Título
                                <input
                                    type="text"
                                    value={title}
                                    placeholder="Ex.: Calculadora científica Casio"
                                    required
                                    minLength={3}
                                    maxLength={120}
                                    onChange={(event) => setTitle(event.target.value)}
                                />
                            </label>

                            <label>
                                Descrição
                                <textarea
                                    value={description}
                                    placeholder="Descreva o estado, detalhes e forma de entrega."
                                    required
                                    minLength={10}
                                    maxLength={1000}
                                    rows={5}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </label>

                            <div className="form-row">
                                <label>
                                    Categoria
                                    <select
                                        value={category}
                                        onChange={(event) => setCategory(event.target.value)}
                                    >
                                        {categories.map((item) => (
                                            <option value={item} key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Preço
                                    <input
                                        type="number"
                                        value={price}
                                        placeholder="0,00"
                                        min="0.01"
                                        step="0.01"
                                        required={!isDonation}
                                        disabled={isDonation}
                                        onChange={(event) => setPrice(event.target.value)}
                                    />
                                </label>
                            </div>

                            <label className="donation-option">
                                <input
                                    type="checkbox"
                                    checked={isDonation}
                                    onChange={(event) => {
                                        setIsDonation(event.target.checked);

                                        if (event.target.checked) {
                                            setPrice("");
                                        }
                                    }}
                                />

                                <span className="donation-option__icon">
                  <Gift size={21} />
                </span>

                                <span>
                  <strong>Este item será uma doação</strong>
                  <small>O anúncio será publicado como gratuito.</small>
                </span>
                            </label>

                            <label>
                                URL da imagem
                                <span className="input-with-icon">
                  <Image size={19} />
                  <input
                      type="url"
                      value={imageUrl}
                      placeholder="https://exemplo.com/imagem.jpg"
                      onChange={(event) => setImageUrl(event.target.value)}
                  />
                </span>
                            </label>

                            {error && <div className="form-error">{error}</div>}

                            <button
                                className="button button--primary form-submit"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <PackagePlus size={19} />
                                {isSubmitting ? "Publicando..." : "Publicar anúncio"}
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}