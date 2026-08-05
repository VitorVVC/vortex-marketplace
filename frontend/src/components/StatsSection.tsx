import { Gift, PackageOpen, Users } from "lucide-react";

import type { Stats } from "../types/api";

interface StatsSectionProps {
    stats: Stats;
}

export function StatsSection({ stats }: StatsSectionProps) {
    const items = [
        {
            label: "Anúncios ativos",
            value: stats.total_ads,
            icon: PackageOpen,
        },
        {
            label: "Alunos cadastrados",
            value: stats.total_users,
            icon: Users,
        },
        {
            label: "Itens doados",
            value: stats.total_donations,
            icon: Gift,
        },
    ];

    return (
        <section className="stats-section">
            <div className="container stats-grid">
                {items.map(({ label, value, icon: Icon }) => (
                    <article className="stat-card" key={label}>
            <span className="stat-card__icon">
              <Icon size={24} />
            </span>

                        <div>
                            <strong>{value}</strong>
                            <span>{label}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}