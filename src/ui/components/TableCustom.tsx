import { useState } from "react";



interface Props<T> {
    headers: string[];
    data: T[];
    rowRenderer: (row: T, index: number) => React.ReactNode;
    withRowBorder?: boolean;
    withCellGap?: boolean;
    totalElements?: number;
    pageSize?: number; // por defecto 12
    onPageChange?: (page: number) => void;
}

export default function TableCustom<T>({ headers, data, rowRenderer, withRowBorder = true, withCellGap = false, totalElements, pageSize = 12, onPageChange }: Props<T>) {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = totalElements ? Math.ceil(totalElements / pageSize) : 1;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (onPageChange) onPageChange(newPage);
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4 mt-10">
            <table
                className={`min-w-full text-[#667085] text-sm text-left ${withCellGap ? "border-separate border-spacing-x-4" : "border-collapse"
                    }`}
            >
                <thead>
                    <tr className="text-gray-500 border-b bg-[#FCFCFD]">
                        {headers.map((title, index) => (
                            <th
                                key={index}
                                className={`px-4 py-2 whitespace-nowrap ${withRowBorder ? "border-b border-[#EAECF0]" : ""}`}
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="border-b border-[#EAECF0]">
                            {rowRenderer(row, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Botones de paginación */}
            {totalElements && totalElements > pageSize && (
                <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <span>Página {currentPage + 1} de {totalPages}</span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
