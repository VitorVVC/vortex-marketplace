import {useEffect, useState, type FormEvent} from "react";
import axios from "axios";
import {
    ArrowLeft,
    Gift,
    Image,
    LoaderCircle,
    Pencil,
} from "lucide-react";
import {Link, useNavigate, useParams} from "react-router-dom";

import {Header} from "../components/Header";
import {api} from "../services/api";
import type {Ad, AdPayload} from "../types/api";

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

export function EditAdPage() {
    const {adId} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [price, setPrice] = useState("");
    const [isDonation, setIsDonation] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAd() {
            if (!adId) {
                setError("Anúncio inválido.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get<Ad>(`/ads/${adId}`);
                const ad = response.data;

                setTitle(ad.title);
                setDescription(ad.description);
                setCategory(ad.category);
                setPrice(ad.price ?? "");
                setIsDonation(ad.is_donation);
                setImageUrl(ad.image_url ?? "");
            } catch (requestError) {
                if (axios.isAxiosError(requestError)) {
                    setError(
                        requestError.response?.data?.detail ??
                        "Não foi possível carregar o anúncio.",
                    );
                } else {
                    setError("Ocorreu um erro inesperado.");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadAd();
    }, [adId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!adId) {
            return;
        }

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
            await api.patch<Ad>(`/ads/${adId}`, payload);
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

    if (isLoading) {
        return (
            <>
                <Header/>

                <main className="route-loading">
                    <LoaderCircle className="spin" size={30}/>
                    <p>Carregando anúncio...</p>
                </main>
            </>
        );
    }

    return (
        <>
            <Header/>

            <main className="form-page">
                <div className="container form-page__container">
                    <Link className="auth-back-link" to="/my-ads">
                        <ArrowLeft size={18}/>
                        Voltar para meus anúncios
                    </Link>

                    <section className="form-card">
                        <div className="form-card__heading">
              <span className="form-card__icon">
                <Pencil size={26}/>
              </span>

                            <div>
                                <span className="eyebrow">Editar anúncio</span>
                                <h1>Atualize as informações do item</h1>
                                <p>
                                    Altere somente o que for necessário e salve o anúncio.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="form-error dashboard-message">
                                {error}
                            </div>
                        )}

                        {!error && (
                            <form className="item-form" onSubmit={handleSubmit}>
                                <label>
                                    Título
                                    <input
                                        type="text"
                                        value={title}
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
                                        required
                                        minLength={10}
                                        maxLength={1000}
                                        rows={5}
                                        onChange={(event) =>
                                            setDescription(event.target.value)
                                        }
                                    />
                                </label>

                                <div className="form-row">
                                    <label>
                                        Categoria
                                        <select
                                            value={category}
                                            onChange={(event) =>
                                                setCategory(event.target.value)
                                            }
                                        >
                                            {!categories.includes(category) && (
                                                <option value={category}>{category}</option>
                                            )}

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
                                            const checked = event.target.checked;

                                            setIsDonation(checked);

                                            if (checked) {
                                                setPrice("");
                                            }
                                        }}
                                    />

                                    <span className="donation-option__icon">
                    <Gift size={21}/>
                  </span>

                                    <span>
                    <strong>Este item será uma doação</strong>
                    <small>
                      O preço será removido e o anúncio ficará gratuito.
                    </small>
                  </span>
                                </label>

                                <label>
                                    URL da imagem
                                    <span className="input-with-icon">
                    <Image size={19}/>

                    <input
                        type="url"
                        value={imageUrl}
                        placeholder="https://exemplo.com/imagem.jpg"
                        onChange={(event) =>
                            setImageUrl(event.target.value)
                        }
                    />
                  </span>
                                </label>

                                <button
                                    className="button button--primary form-submit"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <Pencil size={19}/>
                                    {isSubmitting
                                        ? "Salvando..."
                                        : "Salvar alterações"}
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}