import { useEffect, useMemo, useState } from "react";

import { AdCard } from "../components/AdCard";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { SearchFilters } from "../components/SearchFilters";
import { StatsSection } from "../components/StatsSection";
import { api } from "../services/api";
import type { AdListResponse, Stats } from "../types/api";

export function HomePage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [ads, setAds] = useState<AdListResponse | null>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadHomeData() {
            try {
                const [statsResponse, adsResponse] = await Promise.all([
                    api.get<Stats>("/stats"),
                    api.get<AdListResponse>("/ads", {
                        params: {
                            page: 1,
                            page_size: 12,
                        },
                    }),
                ]);

                setStats(statsResponse.data);
                setAds(adsResponse.data);
            } catch {
                setError("Não foi possível carregar os dados da plataforma.");
            } finally {
                setIsLoading(false);
            }
        }

        loadHomeData();
    }, []);

    const categories = useMemo(() => {
        if (!ads) {
            return [];
        }

        return [...new Set(ads.items.map((ad) => ad.category))].sort();
    }, [ads]);

    const filteredAds = useMemo(() => {
        if (!ads) {
            return [];
        }

        const normalizedSearch = search.trim().toLowerCase();

        return ads.items.filter((ad) => {
            const matchesCategory =
                !selectedCategory || ad.category === selectedCategory;

            const matchesSearch =
                !normalizedSearch ||
                ad.title.toLowerCase().includes(normalizedSearch) ||
                ad.description.toLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [ads, search, selectedCategory]);

    return (
        <>
            <Header />

            <main>
                <Hero />

                {stats && <StatsSection stats={stats} />}

                <section className="marketplace-section" id="marketplace">
                    <div className="container">
                        <div className="section-heading">
                            <div>
                                <span className="eyebrow">Marketplace</span>
                                <h2>Itens disponíveis no campus</h2>
                            </div>

                            <p>
                                Encontre materiais úteis e dê uma nova vida ao que outros
                                alunos já não utilizam.
                            </p>
                        </div>

                        <SearchFilters
                            search={search}
                            selectedCategory={selectedCategory}
                            categories={categories}
                            onSearchChange={setSearch}
                            onCategoryChange={setSelectedCategory}
                        />

                        {isLoading && (
                            <div className="state-message">
                                <p>Carregando anúncios...</p>
                            </div>
                        )}

                        {error && (
                            <div className="state-message state-message--error">
                                <p>{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && filteredAds.length === 0 && (
                            <div className="state-message">
                                <h3>Nenhum anúncio encontrado</h3>
                                <p>Tente buscar outro termo ou selecionar outra categoria.</p>
                            </div>
                        )}

                        {!isLoading && !error && filteredAds.length > 0 && (
                            <div className="ads-grid">
                                {filteredAds.map((ad) => (
                                    <AdCard ad={ad} key={ad.id} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}