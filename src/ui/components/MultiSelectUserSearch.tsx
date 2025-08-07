import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { getUsersForSelection } from '../../actions/users/get-users-for-selection';
import type { UserForSelection } from '../../actions/users/get-users-for-selection';

interface MultiSelectUserSearchProps {
    label: string;
    placeholder?: string;
    selectedUsers: UserForSelection[];
    onSelectionChange: (users: UserForSelection[]) => void;
    roles?: string; // Filter by roles (e.g., 'TEACHER')
    className?: string;
}

export const MultiSelectUserSearch: React.FC<MultiSelectUserSearchProps> = ({
    label,
    placeholder = "Buscar usuarios...",
    selectedUsers,
    onSelectionChange,
    roles,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<UserForSelection[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId: number;
            return (term: string) => {
                clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => {
                    fetchUsers(term);
                }, 300);
            };
        })(),
        [roles]
    );

    const fetchUsers = async (search: string = '') => {
        setLoading(true);
        try {
            const fetchedUsers = await getUsersForSelection(search || undefined, roles, 50);
            setUsers(fetchedUsers);
        } catch (error) {
            // console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers(searchTerm);
        }
    }, [isOpen, searchTerm]);

    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        } else if (isOpen) {
            fetchUsers();
        }
    }, [searchTerm, debouncedSearch, isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUserSelect = (user: UserForSelection) => {
        const isSelected = selectedUsers.some(selected => selected.id === user.id);
        
        if (isSelected) {
            // Remove user from selection
            onSelectionChange(selectedUsers.filter(selected => selected.id !== user.id));
        } else {
            // Add user to selection
            onSelectionChange([...selectedUsers, user]);
        }
    };

    const handleRemoveUser = (userId: string) => {
        onSelectionChange(selectedUsers.filter(user => user.id !== userId));
    };

    const filteredUsers = users.filter(user => 
        !selectedUsers.some(selected => selected.id === user.id)
    );

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            
            {/* Selected users display */}
            {selectedUsers.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                        <div 
                            key={user.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                            <span>{user.fullName}</span>
                            <button
                                onClick={() => handleRemoveUser(user.id)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search input */}
            <div 
                className="relative w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 outline-none bg-transparent"
                        onFocus={() => setIsOpen(true)}
                    />
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="p-3 text-center text-gray-500">
                            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <span className="mt-2 block text-sm">Buscando...</span>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">{user.fullName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            {searchTerm ? 'No se encontraron usuarios' : 'Escribe para buscar usuarios'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
