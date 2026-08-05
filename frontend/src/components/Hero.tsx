import {ArrowRight, Search} from "lucide-react";

export function Hero() {
    function scrollToMarketplace() {
        document
            .getElementById("marketplace")
            ?.scrollIntoView({behavior: "smooth"});
    }

    return (
        <section className="hero">
            <div className="container hero__content">
                <div className="hero__text">
          <span className="eyebrow">
            Economia circular universitária
          </span>

                    <h1>
                        O que não serve mais para você pode transformar o semestre de
                        outro aluno.
                    </h1>

                    <p>
                        Encontre, venda ou doe livros, materiais acadêmicos, eletrônicos e
                        outros itens dentro da comunidade universitária.
                    </p>

                    <div className="hero__actions">
                        <button
                            className="button button--primary button--large"
                            type="button"
                        >
                            Anunciar um item
                            <ArrowRight size={19}/>
                        </button>

                        <button
                            className="button button--secondary button--large"
                            type="button"
                            onClick={scrollToMarketplace}
                        >
                            <Search size={19}/>
                            Explorar anúncios
                        </button>
                    </div>
                </div>

                <div className="hero__visual" aria-hidden="true">
                    <div className="hero-card hero-card--main">
                        <span className="hero-card__badge">Doação</span>
                        <strong>Livro de Cálculo</strong>
                        <small>Ajude outro aluno a continuar estudando.</small>
                    </div>

                    <div className="hero-card hero-card--floating">
                        <span>♻️</span>
                        <strong>Reutilizar aproxima pessoas.</strong>
                    </div>
                </div>
            </div>
        </section>
    );
}