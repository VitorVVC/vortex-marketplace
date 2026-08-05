import { Header } from "../components/Header";

export function MyAdsPage() {
    return (
        <>
            <Header />

            <main className="container protected-page">
                <h1>Meus anúncios</h1>
                <p>Seus anúncios aparecerão aqui.</p>
            </main>
        </>
    );
}