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
        <article className="listing-card">
            <div className="listing-card__image-wrapper">
                {ad.image_url ? (
                    <img
                        className="listing-card__image"
                        src={ad.image_url}
                        alt={ad.title}
                    />
                ) : (
                    <div className="listing-card__placeholder">
                        <span>Sem imagem</span>
                    </div>
                )}

                <span
                    className={
                        ad.is_donation
                            ? "listing-card__badge listing-card__badge--donation"
                            : "listing-card__badge"
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

            <div className="listing-card__content">
                <span className="listing-card__category">{ad.category}</span>

                <h3>{ad.title}</h3>

                <p className="listing-card__description">{ad.description}</p>

                <div className="listing-card__footer">
                    <strong className="listing-card__price">
                        {ad.is_donation ? "Grátis" : formattedPrice}
                    </strong>

                    <span className="listing-card__owner">
            <UserRound size={15} />
                        {ad.owner.name}
          </span>
                </div>
            </div>
        </article>
    );
}