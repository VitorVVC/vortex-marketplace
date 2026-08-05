import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    ArrowLeft,
    Edit3,
    PackageOpen,
    PlusCircle,
    Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Header } from "../components/Header";
import { api } from "../services/api";
import type { Ad } from "../types/api";

export function MyAdsPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const loadMyAds = useCallback(async () => {
        try {
            setError("");

            const response = await api.get<Ad[]>("/ads/me");

            setAds(response.data);
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                setError(
                    requestError.response?.data?.detail ??
                    "Não foi possível carregar seus anúncios.",
                );
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMyAds();
    }, [loadMyAds]);

    async function handleDelete(ad: Ad) {
        const confirmed = window.confirm(
            `Deseja realmente excluir o anúncio "${ad.title}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(ad.id);
            setError("");
            setSuccessMessage("");

            await api.delete(`/ads/${ad.id}`);

            setAds((currentAds) =>
                currentAds.filter((item) => item.id !== ad.id),
            );

            setSuccessMessage("Anúncio excluído com sucesso.");
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                setError(
                    requestError.response?.data?.detail ??
                    "Não foi possível excluir o anúncio.",
                );
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <>
            <Header />

            <main className="dashboard-page">
                <div className="container">
                    <Link className="auth-back-link" to="/">
                        <ArrowLeft size={18} />
                        Voltar ao marketplace
                    </Link>

                    <div className="dashboard-heading">
                        <div>
                            <span className="eyebrow">Área do anunciante</span>
                            <h1>Meus anúncios</h1>
                            <p>
                                Visualize e gerencie os itens publicados por você.
                            </p>
                        </div>

                        <Link
                            className="button button--primary"
                            to="/new-ad"
                        >
                            <PlusCircle size={18} />
                            Novo anúncio
                        </Link>
                    </div>

                    {error && (
                        <div className="form-error dashboard-message">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="form-success dashboard-message">
                            {successMessage}
                        </div>
                    )}

                    {isLoading && (
                        <div className="state-message">
                            <p>Carregando seus anúncios...</p>
                        </div>
                    )}

                    {!isLoading && ads.length === 0 && (
                        <section className="empty-dashboard">
              <span>
                <PackageOpen size={34} />
              </span>

                            <h2>Você ainda não possui anúncios</h2>

                            <p>
                                Publique seu primeiro item e ajude a movimentar a
                                economia circular da universidade.
                            </p>

                            <Link
                                className="button button--primary"
                                to="/new-ad"
                            >
                                <PlusCircle size={18} />
                                Criar primeiro anúncio
                            </Link>
                        </section>
                    )}

                    {!isLoading && ads.length > 0 && (
                        <div className="management-grid">
                            {ads.map((ad) => (
                                <article
                                    className="management-card"
                                    key={ad.id}
                                >
                                    <div className="management-card__image">
                                        {ad.image_url ? (
                                            <img src={ad.image_url} alt={ad.title} />
                                        ) : (
                                            <div className="ad-card__placeholder">
                                                Sem imagem
                                            </div>
                                        )}

                                        <span
                                            className={
                                                ad.is_donation
                                                    ? "ad-card__badge ad-card__badge--donation"
                                                    : "ad-card__badge"
                                            }
                                        >
                      {ad.is_donation ? "Doação" : ad.category}
                    </span>
                                    </div>

                                    <div className="management-card__content">
                    <span className="ad-card__category">
                      {ad.category}
                    </span>

                                        <h2>{ad.title}</h2>

                                        <p>{ad.description}</p>

                                        <strong className="management-card__price">
                                            {ad.is_donation
                                                ? "Grátis"
                                                : Number(ad.price).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    },
                                                )}
                                        </strong>

                                        <div className="management-card__actions">
                                            <Link
                                                className="button button--secondary"
                                                to={`/ads/${ad.id}/edit`}
                                            >
                                                <Edit3 size={17} />
                                                Editar
                                            </Link>

                                            <button
                                                className="button button--danger"
                                                type="button"
                                                disabled={deletingId === ad.id}
                                                onClick={() => handleDelete(ad)}
                                            >
                                                <Trash2 size={17} />

                                                {deletingId === ad.id
                                                    ? "Excluindo..."
                                                    : "Excluir"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}