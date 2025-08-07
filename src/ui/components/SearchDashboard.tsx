import { useState, useEffect } from "react";

interface SearchDashboardProps {
    search: string | undefined;
    setSearch: (value: string) => void;
    placeholder?: string;
}

export default function SearchDashboard({ search, setSearch, placeholder = "Buscar" }: SearchDashboardProps) {
    const [localSearch, setLocalSearch] = useState(search || "");

    // Debounce the search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(localSearch);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeout);
    }, [localSearch, setSearch]);

    return (
        <label htmlFor="search" className="">
            <input
                type="search"
                name="search"
                id="search"
                placeholder={placeholder}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full h-[40px] border-1 border-zinc-200 rounded-md px-4 outline-none"
            />
        </label>
    );
}
