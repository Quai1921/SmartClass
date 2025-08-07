// import React from "react";

// interface HeaderConfig {
//     title: string;
//     sortable?: boolean;
//     sortKey?: string;
// }

// interface Props<T> {
//     headers: (string | HeaderConfig)[];
//     data: T[];
//     rowRenderer: (row: T, index: number) => React.ReactNode;
//     rowClassName?: (row: T, index: number) => string;
//     withRowBorder?: boolean;
//     withCellGap?: boolean;
//     totalElements?: number;
//     pageSize?: number;
//     currentPage?: number;
//     onPageChange?: (page: number) => void;
//     onPageSizeChange?: (pageSize: number) => void;
//     sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
//     onSort?: (key: string) => void;
// }

// export default function TableCustomAdmin<T>({ 
//     headers, 
//     data, 
//     rowRenderer, 
//     rowClassName,
//     withRowBorder = true, 
//     withCellGap = false, 
//     totalElements = 0, 
//     pageSize = 12, 
//     currentPage = 0,
//     onPageChange,
//     onPageSizeChange,
//     sortConfig,
//     onSort
// }: Props<T>) {
//     const totalPages = Math.ceil(totalElements / pageSize);    const handlePageChange = (newPage: number) => {
//         if (onPageChange) onPageChange(newPage);
//     };

//     return (
//         <>
//             <div className="overflow-x-auto bg-white rounded-lg shadow p-4 mt-10">
//                 <table
//                     className={`min-w-full text-[#667085] text-sm text-left ${
//                         withCellGap ? "border-separate border-spacing-x-4" : ""
//                     }`}
//                 >
//                     <thead>
//                         <tr className="text-gray-500 border border-[#EAECF0] bg-[#FCFCFD]">
//                             {headers.map((header, index) => {
//                                 const isString = typeof header === 'string';
//                                 const title = isString ? header : header.title;
//                                 const sortable = isString ? false : header.sortable;
//                                 const sortKey = isString ? '' : header.sortKey || '';
                                
//                                 return (
//                                     <th
//                                         key={index}
//                                         className={`px-4 py-2 whitespace-nowrap ${
//                                             withRowBorder ? "border-b border-[#EAECF0]" : ""
//                                         } ${sortable ? "cursor-pointer hover:bg-gray-50" : ""}`}
//                                         onClick={sortable && onSort ? () => onSort(sortKey) : undefined}
//                                     >
//                                         <div className="flex items-center gap-1">
//                                             {title}
//                                             {sortable && (
//                                                 <span className="text-gray-400">
//                                                     {sortConfig?.key === sortKey ? (
//                                                         sortConfig.direction === 'asc' ? '↑' : '↓'
//                                                     ) : '↕'}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </th>
//                                 );
//                             })}
//                         </tr>
//                     </thead>                    <tbody>
//                         {data.map((row, index) => (
//                             <tr 
//                                 key={index} 
//                                 className={`border border-[#EAECF0] ${rowClassName ? rowClassName(row, index) : ''}`}
//                             >
//                                 {rowRenderer(row, index)}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>              {/* Paginación compacta en la esquina inferior derecha */}
//             {totalElements > 0 && (
//                 <div className="flex justify-end mt-4">
//                     <div className="max-w-[380px] justify-center bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
//                     <div className="flex items-center gap-3">
//                         {/* Selector de filas por página */}
//                         <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-600">filas por página</span>
//                             <select
//                                 value={pageSize}
//                                 onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
//                                 className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-14"
//                             >
//                                 <option value={12}>12</option>
//                                 <option value={24}>24</option>
//                                 <option value={50}>50</option>
//                             </select>
//                         </div>
                        
//                         {/* Información de página */}
//                         <div className="border-l border-gray-200 pl-3">
//                             <span className="text-xs text-gray-600">
//                                 página {currentPage + 1} de {totalPages}
//                             </span>
//                         </div>
                        
//                         {/* Controles de navegación */}
//                         <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
//                             <button
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 0}
//                                 className="flex items-center justify-center w-6 h-6 text-xs text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                 </svg>
//                             </button>

//                             <span className="text-xs text-gray-600 mx-1">{currentPage + 1}</span>

//                             <button
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage + 1 >= totalPages}
//                                 className="flex items-center justify-center w-6 h-6 text-xs text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 </div>
                
//             )}
//         </>
//     );
// }


import React from "react";

interface HeaderConfig {
    title: string;
    sortable?: boolean;
    sortKey?: string;
}

interface Props<T> {
    headers: (string | HeaderConfig)[];
    data: T[];
    rowRenderer: (row: T, index: number) => React.ReactNode;
    rowClassName?: (row: T, index: number) => string;
    withRowBorder?: boolean;
    withCellGap?: boolean;
    totalElements?: number;
    pageSize?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
    onSort?: (key: string) => void;
}

export default function TableCustomAdmin<T>({ 
    headers, 
    data, 
    rowRenderer, 
    rowClassName,
    withRowBorder = true, 
    withCellGap = false, 
    totalElements = 0, 
    pageSize = 12, 
    currentPage = 0,
    onPageChange,
    onPageSizeChange,
    sortConfig,
    onSort
}: Props<T>) {
    const totalPages = Math.ceil(totalElements / pageSize);

    const handlePageChange = (newPage: number) => {
        if (onPageChange) onPageChange(newPage);
    };

    // 🔧 FIXED: Helper function to clean whitespace nodes from rowRenderer output
    const renderRowCells = (row: T, index: number) => {
        const cells = rowRenderer(row, index);
        
        // If the cells are wrapped in a Fragment, extract the children
        if (React.isValidElement(cells) && cells.type === React.Fragment) {
            const children = React.Children.toArray(cells.props.children);
            // Filter out text nodes that are just whitespace
            const cleanChildren = children.filter(child => {
                if (typeof child === 'string') {
                    return child.trim() !== '';
                }
                return true;
            });
            return cleanChildren;
        }
        
        return cells;
    };

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-lg shadow p-4 mt-8">
                <table className={`min-w-full text-[#667085] text-sm text-left ${withCellGap ? "border-separate border-spacing-x-4" : ""}`}>
                    <thead>
                        <tr className="text-gray-500 border border-[#EAECF0] bg-[#FCFCFD]">
                            {headers.map((header, index) => {
                                const isString = typeof header === 'string';
                                const title = isString ? header : header.title;
                                const sortable = isString ? false : header.sortable;
                                const sortKey = isString ? '' : header.sortKey || '';
                                
                                return (
                                    <th
                                        key={index}
                                        className={`px-4 py-2 whitespace-nowrap ${withRowBorder ? "border-b border-[#EAECF0]" : ""} ${sortable ? "cursor-pointer hover:bg-gray-50" : ""}`}
                                        onClick={sortable && onSort ? () => onSort(sortKey) : undefined}
                                    >
                                        <div className="flex items-center gap-1">
                                            {title}
                                            {sortable && (
                                                <span className="text-gray-400">
                                                    {sortConfig?.key === sortKey ? (
                                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                                    ) : '↕'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr 
                                key={index} 
                                className={`border border-[#EAECF0] ${rowClassName ? rowClassName(row, index) : ''}`}
                            >
                                {renderRowCells(row, index)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación compacta en la esquina inferior derecha */}
            {totalElements > 0 && (
                <div className="flex justify-end mt-4">
                    <div className="max-w-[380px] justify-center bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                        <div className="flex items-center gap-3">
                            {/* Selector de filas por página */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">filas por página</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                                    className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-14"
                                >
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            
                            {/* Información de página */}
                            <div className="border-l border-gray-200 pl-3">
                                <span className="text-xs text-gray-600">
                                    página {currentPage + 1} de {totalPages}
                                </span>
                            </div>
                            
                            {/* Controles de navegación */}
                            <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="flex items-center justify-center w-6 h-6 text-xs text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <span className="text-xs text-gray-600 mx-1">{currentPage + 1}</span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage + 1 >= totalPages}
                                    className="flex items-center justify-center w-6 h-6 text-xs text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}