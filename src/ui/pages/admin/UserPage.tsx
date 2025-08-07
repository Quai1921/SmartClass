import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { StateTag } from "../../components/StateTag";
import { getUsersByPage } from "../../../actions/users/get-users-by-page";
import { UserModal } from "./components/UserModal";
import SearchDashboard from "../../components/SearchDashboard";
import CustomButton from "../../components/CustomButton";
import TableCustomAdmin from "../../components/TableCustomAdmin";
import { HeaderAdmin } from "./components/HeaderAdmin";
import { LoaderDog } from "../../components/LoaderDog";
import CustomSelector from "../../components/CustomSelector";
import { SelectedTag } from "../../components/SelectTag";
import Tooltip from "../../components/Tooltip";
import { IconComponent } from "./components/Icon";

interface UserApiData {
    id?: string;
    email: string;
    roles?: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    documentId?: string | null;
    status?: string;
}

interface UserData {
    id?: string;
    email: string;
    role?: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    identificationNumber?: string | null;
    status?: string;
}

const mapApiUserToUserData = (apiUser: UserApiData): UserData => ({
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.roles,
    username: apiUser.username,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    identificationNumber: apiUser.documentId,
    status: apiUser.status
});



const UserPage = React.memo(() => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [usersFilters, setUsersFilters] = useState<{
        role?: string;
        search?: string;
        status?: string;
    }>({}); const { isLoading, data: users, error } = useQuery({
        queryKey: ['users', currentPage, pageSize, usersFilters],
        staleTime: 1000 * 60 * 60,
        queryFn: () => getUsersByPage(currentPage, pageSize, usersFilters),
    });

    const roleOptions = useMemo(() => [
        { label: "Tutor", value: "TUTOR" },
        { label: "Institución", value: "INSTITUTION_ADMIN" },
        { label: "Administrador", value: "ADMIN" }
    ], []); const statusOptions = useMemo(() => [
        { label: "ACTIVO", value: "ACTIVE" },
        { label: "INACTIVO", value: "INACTIVE" },
        { label: "PENDIENTE", value: "PENDING" },
    ], []);

    // Helper function to get Spanish labels for filter tags
    const getSpanishLabel = useCallback((key: string, value: string) => {
        if (key === 'status') {
            const statusOption = statusOptions.find(option => option.value === value);
            return statusOption?.label || value;
        }
        if (key === 'role') {
            const roleOption = roleOptions.find(option => option.value === value);
            return roleOption?.label || value;
        }
        return value;
    }, [statusOptions, roleOptions]);

    const getRoleLabel = useCallback((roleValue: string | undefined) => {
        if (!roleValue) return 'N/A';
        const roleOption = roleOptions.find(option => option.value === roleValue);
        return roleOption ? roleOption.label : roleValue;
    }, [roleOptions]);

    const setFiltersWithPageReset = useCallback((updaterFn: (prev: typeof usersFilters) => typeof usersFilters) => {
        setCurrentPage(0);
        setUsersFilters(updaterFn);
    }, []);

    const setSearch = useCallback((value: string) => {
        setFiltersWithPageReset((prev) => ({ ...prev, search: value || undefined }));
    }, [setFiltersWithPageReset]);

    const setRole = useCallback((name: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, role: name }));
    }, [setFiltersWithPageReset]);

    const setStatus = useCallback((name: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, status: name }));
    }, [setFiltersWithPageReset]);

    const removeFilter = useCallback((key: string) => {
        setFiltersWithPageReset((prev) => {
            const updated = { ...prev };
            delete updated[key as keyof typeof prev];
            return updated;
        });
    }, [setFiltersWithPageReset]);

    const handleCreateUser = useCallback(() => {
        setSelectedUser(null);
        setModalMode('create');
        setIsOpen(true);
    }, []);

    const handleEditUser = useCallback((user: UserData) => {
        setSelectedUser({
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            identificationNumber: user.identificationNumber,
            status: user.status
        });
        setModalMode('edit');
        setIsOpen(true);
    }, []); const handleCloseModal = useCallback(() => {
        setIsOpen(false);
        setSelectedUser(null);
        setModalMode('create');
    }, []);

    const mappedUsers = users?.content?.map(mapApiUserToUserData) || []; return (
        <div className="pb-4 max-w-[1500px] mx-auto min-h-screen 2xl:px-4">
            <HeaderAdmin
                title="Usuarios"
                subtitle="En esta sección puedes configurar los usuarios vinculados a cada institución."
            />

            <div className="flex justify-between mt-10">
                <CustomButton
                    label="Nuevo usuario"
                    onClick={handleCreateUser}
                    icon="User"
                    path=""
                    rounded="rounded-[6px]"
                />
                <SearchDashboard
                    search={usersFilters.search || ''}
                    setSearch={setSearch}
                />
            </div>

            <div className="flex items-center gap-4 mt-[30px]">
                <CustomSelector
                    label="Seleccione Rol"
                    width="w-[162px]"
                    value={usersFilters.role}
                    options={roleOptions}
                    onChange={setRole}
                />

                <CustomSelector
                    label="Seleccione Estado"
                    width="w-[162px]"
                    value={usersFilters.status}
                    options={statusOptions}
                    onChange={setStatus}
                />

                {Object.entries(usersFilters)
                    .filter(([, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => (
                        <SelectedTag
                            key={key}
                            label={getSpanishLabel(key, value!.toString())}
                            onRemove={() => removeFilter(key)}
                        />
                    ))}
            </div>

            <div className="mt-[30px]">
                {isLoading ? (
                    <LoaderDog width={100} height={100} className="mt-[50px]" />
                ) : error ? (
                    <div className="text-red-500 text-center mt-[50px]">
                        Error al cargar los usuarios
                    </div>
                ) : (<TableCustomAdmin
                    headers={[
                        "Nombre y Apellido",
                        "Rol",
                        "Email",
                        "Estado",
                        "Acciones",
                    ]}
                    data={mappedUsers}
                    withRowBorder
                    withCellGap={false} rowClassName={(user: UserData) => {
                        // Check if the user is in pre-registration process
                        const firstName = (user.firstName || '').toLowerCase();
                        const lastName = (user.lastName || '').toLowerCase();
                        const fullName = `${firstName} ${lastName}`.toLowerCase();

                        const isPreRegistroByName = firstName.includes('pre registro') ||
                            lastName.includes('pre registro') ||
                            fullName.includes('pre registro') ||
                            firstName.includes('preregistro') ||
                            lastName.includes('preregistro') ||
                            fullName.includes('preregistro');

                        const isPreRegistroByStatus = user.status === 'PENDING';

                        if (isPreRegistroByName || isPreRegistroByStatus) {
                            return 'bg-gray-100';
                        }
                        return '';
                    }}
                    // rowRenderer={(user: UserData) => (
                    //     <>
                    //         <td className="px-4 py-2">
                    //             {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sin nombre'}
                    //         </td>
                    //         <td className="px-4 py-2">{getRoleLabel(user.role)}</td>
                    //         <td className="px-4 py-2">{user.email}</td>
                    //         <td className="px-4 py-2">
                    //             <StateTag state={user.status || 'INACTIVE'} />
                    //         </td>                                    <td className="px-4 py-2 flex gap-2">                                        {(() => {
                    //             // Check if the user is in pre-registration process
                    //             // This can be determined by:
                    //             // 1. Status being PENDING
                    //             // 2. Name containing "pre registro" (case insensitive) in any part
                    //             const firstName = (user.firstName || '').toLowerCase();
                    //             const lastName = (user.lastName || '').toLowerCase();
                    //             const fullName = `${firstName} ${lastName}`.toLowerCase();

                    //             const isPreRegistroByName = firstName.includes('pre registro') ||
                    //                 lastName.includes('pre registro') ||
                    //                 fullName.includes('pre registro') ||
                    //                 firstName.includes('preregistro') ||
                    //                 lastName.includes('preregistro') ||
                    //                 fullName.includes('preregistro');

                    //             const isPreRegistroByStatus = user.status === 'PENDING';
                    //             const isPreRegistro = isPreRegistroByName || isPreRegistroByStatus;

                    //             return (
                    //                 <Tooltip
                    //                     text={isPreRegistro ? "Usuario en pre-registro - No se puede editar" : "Editar Datos"}
                    //                     position="top"
                    //                 >
                    //                     <div
                    //                         className={`${isPreRegistro
                    //                                 ? 'cursor-not-allowed text-gray-400'
                    //                                 : 'cursor-pointer hover:text-blue-600'
                    //                             }`}
                    //                         onClick={(e) => {
                    //                             e.preventDefault();
                    //                             e.stopPropagation();
                    //                             if (!isPreRegistro) {
                    //                                 handleEditUser(user);
                    //                             }
                    //                         }}
                    //                     >
                    //                         <IconComponent
                    //                             name="EditIcon"
                    //                             color={isPreRegistro ? '#9CA3AF' : undefined}
                    //                         />
                    //                     </div>
                    //                 </Tooltip>
                    //             );
                    //         })()}
                    //         </td></>)}
                    rowRenderer={(user: UserData) => {
                        // Lógica de pre-registro extraída para evitar duplicación
                        const firstName = (user.firstName || '').toLowerCase();
                        const lastName = (user.lastName || '').toLowerCase();
                        const fullName = `${firstName} ${lastName}`.toLowerCase();

                        const isPreRegistroByName = firstName.includes('pre registro') ||
                            lastName.includes('pre registro') ||
                            fullName.includes('pre registro') ||
                            firstName.includes('preregistro') ||
                            lastName.includes('preregistro') ||
                            fullName.includes('preregistro');

                        const isPreRegistroByStatus = user.status === 'PENDING';
                        const isPreRegistro = isPreRegistroByName || isPreRegistroByStatus;

                        return (
                            <React.Fragment>
                                <td className="px-4 py-2">
                                    {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sin nombre'}
                                </td>
                                <td className="px-4 py-2">{getRoleLabel(user.role)}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">
                                    <StateTag state={user.status || 'INACTIVE'} />
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <Tooltip
                                        text={isPreRegistro ? "Usuario en pre-registro - No se puede editar" : "Editar Datos"}
                                        position="top"
                                    >
                                        <div
                                            className={`${isPreRegistro
                                                ? 'cursor-not-allowed text-gray-400'
                                                : 'cursor-pointer hover:text-blue-600'
                                                }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (!isPreRegistro) {
                                                    handleEditUser(user);
                                                }
                                            }}
                                        >
                                            <IconComponent
                                                name="EditIcon"
                                                color={isPreRegistro ? '#9CA3AF' : undefined}
                                            />
                                        </div>
                                    </Tooltip>
                                </td>
                            </React.Fragment>
                        );
                    }}
                    onPageChange={setCurrentPage}
                    totalElements={users?.totalElements || 0}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageSizeChange={setPageSize}
                />)}
            </div>

            <UserModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                mode={modalMode}
                userData={selectedUser}
            />
        </div>
    );
});

UserPage.displayName = 'UserPage';

export default UserPage;