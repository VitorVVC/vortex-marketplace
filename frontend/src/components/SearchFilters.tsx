import { Search } from "lucide-react";

interface SearchFiltersProps {
    search: string;
    selectedCategory: string;
    categories: string[];
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

export function SearchFilters({
                                  search,
                                  selectedCategory,
                                  categories,
                                  onSearchChange,
                                  onCategoryChange,
                              }: SearchFiltersProps) {
    return (
        <div className="filters">
            <label className="search-field">
                <Search size={20} />

                <input
                    type="search"
                    value={search}
                    placeholder="Buscar livros, calculadoras, componentes..."
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </label>

            <div className="category-list">
                <button
                    type="button"
                    className={
                        selectedCategory === ""
                            ? "category-button category-button--active"
                            : "category-button"
                    }
                    onClick={() => onCategoryChange("")}
                >
                    Todos
                </button>

                {categories.map((category) => (
                    <button
                        type="button"
                        key={category}
                        className={
                            selectedCategory === category
                                ? "category-button category-button--active"
                                : "category-button"
                        }
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}