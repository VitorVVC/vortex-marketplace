export interface AdOwner {
    id: number;
    name: string;
}

export interface Ad {
    id: number;
    title: string;
    description: string;
    category: string;
    price: string | null;
    is_donation: boolean;
    image_url: string | null;
    owner_id: number;
    owner: AdOwner;
    created_at: string;
}

export interface AdListResponse {
    items: Ad[];
    total: number;
    page: number;
    page_size: number;
}

export interface Stats {
    total_ads: number;
    total_users: number;
    total_donations: number;
}