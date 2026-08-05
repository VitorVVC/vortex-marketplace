import { Gift, UserRound } from "lucide-react";

import type { Ad } from "../types/api";

interface AdCardProps {
    ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
    const formattedPrice = ad.price
        ? Number(ad.price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
        : null;

    return (
        <article className="ad-card">
            <div className="ad-card__image-wrapper">
                {ad.image_url ? (
                    <img
                        className="ad-card__image"
                        src={ad.image_url}
                        alt={ad.title}
                    />
                ) : (
                    <div className="ad-card__placeholder">
                        <span>Sem imagem</span>
                    </div>
                )}

                <span
                    className={
                        ad.is_donation
                            ? "ad-card__badge ad-card__badge--donation"
                            : "ad-card__badge"
                    }
                >
          {ad.is_donation ? (
              <>
                  <Gift size={14} />
                  Doação
              </>
          ) : (
              ad.category
          )}
        </span>
            </div>

            <div className="ad-card__content">
                <span className="ad-card__category">{ad.category}</span>

                <h3>{ad.title}</h3>

                <p className="ad-card__description">{ad.description}</p>

                <div className="ad-card__footer">
                    <strong className="ad-card__price">
                        {ad.is_donation ? "Grátis" : formattedPrice}
                    </strong>

                    <span className="ad-card__owner">
            <UserRound size={15} />
                        {ad.owner.name}
          </span>
                </div>
            </div>
        </article>
    );
}