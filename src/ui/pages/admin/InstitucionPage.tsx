import { useState, useCallback, useMemo } from 'react';
import CustomSelector from '../../components/CustomSelector';
import SearchDashboard from '../../components/SearchDashboard';
import { SelectedTag } from '../../components/SelectTag';
import { StateTag } from '../../components/StateTag';
import { useQuery } from '@tanstack/react-query';
import { formatDateToSpanish } from '../../utils/formatDate';
import { getInstitutionsByPage } from '../../../actions/institution/get-institutions-by-page';
import { HeaderAdmin } from './components/HeaderAdmin';
import TableCustomAdmin from '../../components/TableCustomAdmin';
import { LoaderDog } from '../../components/LoaderDog';
import { getUserData } from '../../../actions/user/get-user-data';
import { IconComponent } from './components/Icon';
import Tooltip from '../../components/Tooltip';
import { InstitutionModal } from './components/InstitutionModal';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { CourseAssignmentModal } from './components/CourseAssignmentModal';
import { BookPlus } from 'lucide-react';
import { useInstitutionCoursesCount } from '../../hooks/useInstitutionCoursesCount';
import { RoleGuard } from '../../components/RoleGuard';

const InstitucionPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCourseAssignmentModalOpen, setIsCourseAssignmentModalOpen] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
    const [filters, setFilters] = useState<{
        cityName?: string;
        createdAt?: string;
        status?: string;
        search?: string;
    }>({});

    const { role } = useAuthStore();
    const { data: userData } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 15, // 15 minutes
        queryFn: () => getUserData(),
        enabled: role === 'ADMIN',
    }); const { isLoading, data: institutions } = useQuery({
        queryKey: ['institutions', currentPage, pageSize, filters],
        staleTime: 1000 * 60 * 15, // 15 minutes
        queryFn: () => {
            // If there's a search term, fetch without search to get all data for client-side filtering
            // Otherwise, use the original filters including any backend search
            const apiFilters = filters.search
                ? { ...filters, search: undefined } // Remove search from backend call
                : filters;

            return getInstitutionsByPage(currentPage, pageSize, apiFilters);
        },
    });

    // Get institution IDs for courses count query
    const institutionIds = useMemo(() =>
        institutions?.content?.map(inst => inst.id.toString()) || [],
        [institutions?.content]
    );    // Fetch courses count for all institutions
    const { data: coursesCountMap, isLoading: isLoadingCoursesCount } = useInstitutionCoursesCount({
        institutionIds,
        enabled: !!institutions?.content && institutions.content.length > 0
    });    // Enhanced client-side search: filter institutions by name AND encargado name
    // This enhances the backend search with additional client-side filtering
    const filteredInstitutions = useMemo(() => {
        if (!institutions?.content) return institutions;

        // If no local search filter, return all institutions
        if (!filters.search || filters.search.trim() === '') {
            return institutions;
        }

        const searchTerm = filters.search.toLowerCase().trim();
        const filtered = institutions.content.filter(institution => {
            const institutionName = institution.name.toLowerCase();
            const encargadoName = institution.adminUserName.toLowerCase();

            // Search in both institution name and encargado name
            return institutionName.includes(searchTerm) || encargadoName.includes(searchTerm);
        });

        return {
            ...institutions,
            content: filtered,
            totalElements: filtered.length
        };
    }, [institutions, filters.search]);

    const cityNameOptions = useMemo(() =>
        userData?.cities?.map((city) => ({ label: city.name, value: city.name })) || [],
        [userData?.cities]
    );

    const createdDateOptions = useMemo(() =>
        institutions?.content?.map((institution) => {
            const formattedDate = formatDateToSpanish(institution.createdAt);
            return { label: formattedDate, value: formattedDate };
        }) || [],
        [institutions?.content]
    ); const statusOptions = useMemo(() => [
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
        return value;
    }, [statusOptions]);

    const setFiltersWithPageReset = useCallback((updaterFn: (prev: typeof filters) => typeof filters) => {
        setCurrentPage(0);
        setFilters(updaterFn);
    }, []);

    const setSearch = useCallback((value: string) => {
        setFiltersWithPageReset((prev) => ({ ...prev, search: value || undefined }));
    }, [setFiltersWithPageReset]);

    const setCityName = useCallback((name: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, cityName: name }));
    }, [setFiltersWithPageReset]);

    const setCreatedAt = useCallback((date: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, createdAt: date }));
    }, [setFiltersWithPageReset]);

    const setStatus = useCallback((status: string | undefined) => {
        setFiltersWithPageReset((prev) => ({ ...prev, status: status }));
    }, [setFiltersWithPageReset]);

    const removeFilter = useCallback((key: string) => {
        setFiltersWithPageReset((prev) => {
            const updated = { ...prev };
            delete updated[key as keyof typeof prev];
            return updated;
        });
    }, [setFiltersWithPageReset]); const handleEditInstitution = useCallback((institution: any) => {
        setSelectedInstitution(institution);
        setIsEditModalOpen(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setSelectedInstitution(null);
    }, []);

    const handleAssignCourses = useCallback((institution: any) => {
        setSelectedInstitution(institution);
        setIsCourseAssignmentModalOpen(true);
    }, []);

    const handleCloseCourseAssignmentModal = useCallback(() => {
        setIsCourseAssignmentModalOpen(false);
        setSelectedInstitution(null);
    }, []); return (
        <RoleGuard allowedRoles={['ADMIN']}>
            <div className="pb-4 max-w-[1500px] mx-auto min-h-screen 2xl:px-4">
                <HeaderAdmin
                    title="Instituciones"
                    subtitle="En esta sección puedes cambiar la configuración de las instituciones registradas."
                /><div className="flex items-center justify-end mt-4">                <Tooltip text="Buscar por nombre de institución o encargado" position="left">
                    <SearchDashboard
                        search={filters.search || ''}
                        setSearch={setSearch}
                        placeholder="Buscar"
                    />
                </Tooltip>
                </div>

                <div className="flex items-center gap-4 mt-[30px]">
                    <CustomSelector
                        label="Seleccione Ciudad"
                        width="w-[162px]"
                        value={filters.cityName}
                        options={cityNameOptions}
                        onChange={setCityName}
                    />

                    <CustomSelector
                        label="Seleccione Fecha"
                        width="w-[162px]"
                        value={filters.createdAt}
                        options={createdDateOptions}
                        onChange={setCreatedAt}
                    />

                    <CustomSelector
                        label="Seleccione Estado"
                        width="w-[162px]"
                        value={filters.status}
                        options={statusOptions}
                        onChange={setStatus}
                    />                {Object.entries(filters)
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
                    ) : (
                        <TableCustomAdmin
                            headers={[
                                "Institución",
                                "Encargado",
                                "Ciudad",
                                "Fecha creación",
                                "Estudiantes",
                                "Docentes",
                                "Cursos",
                                "Estado",
                                'Acciones',
                            ]}
                            withRowBorder
                            withCellGap={false}
                            data={filteredInstitutions?.content || []}
                            // rowRenderer={(inst) => (
                            //     <>
                            //         <td className="px-4 py-2">{inst.name}</td>
                            //         <td className="px-4 py-2">{inst.adminUserName}</td>
                            //         <td className="px-4 py-2">{inst.cityName}</td>
                            //         <td className="px-4 py-2">{formatDateToSpanish(inst.createdAt)}</td>
                            //         <td className="px-4 py-2">{inst.students}</td>
                            //         <td className="px-4 py-2">{inst.teachers}</td>
                            //         <td className="px-4 py-2">
                            //             {isLoadingCoursesCount ? (
                            //                 <span className="text-gray-400">...</span>
                            //             ) : (
                            //                 coursesCountMap?.[inst.id.toString()] ?? 0
                            //             )}
                            //         </td>                                <td className="px-4 py-2">
                            //             <StateTag state={inst.status === 'INACTIVE' ? 'PENDING' : inst.status} />
                            //         </td><td className="px-4 py-2 flex gap-2">
                            //             <Tooltip text="Asignar Cursos" position="top">
                            //                 <div 
                            //                     className="cursor-pointer hover:text-blue-600"
                            //                     onClick={(e) => {
                            //                         e.preventDefault();
                            //                         e.stopPropagation();
                            //                         handleAssignCourses(inst);
                            //                     }}
                            //                 >
                            //                     <BookPlus className="w-5 h-5" />
                            //                 </div>
                            //             </Tooltip>
                            //             <Tooltip text="Editar Datos" position="top">
                            //                 <div 
                            //                     className="cursor-pointer hover:text-blue-600"
                            //                     onClick={(e) => {
                            //                         e.preventDefault();
                            //                         e.stopPropagation();
                            //                         handleEditInstitution(inst);
                            //                     }}
                            //                 >
                            //                     <IconComponent name="EditIcon" />
                            //                 </div>
                            //             </Tooltip>
                            //         </td>
                            //     </>                        )}

                            rowRenderer={(inst) => (
                                <>
                                    <td className="px-4 py-2 min-w-[200px]">{inst.name}</td>
                                    <td className="px-4 py-2 min-w-[140px]">{inst.adminUserName}</td>
                                    <td className="px-4 py-2 min-w-[200px]">{inst.cityName}</td>
                                    <td className="px-4 py-2">{formatDateToSpanish(inst.createdAt)}</td>
                                    <td className="px-4 py-2 text-center">{inst.students}</td>
                                    <td className="px-4 py-2 text-center">{inst.teachers}</td>
                                    <td className="px-4 py-2 text-center">
                                        {isLoadingCoursesCount ? (
                                            <span className="text-gray-400">...</span>
                                        ) : (
                                            coursesCountMap?.[inst.id.toString()] ?? 0
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <StateTag state={inst.status === 'INACTIVE' ? 'PENDING' : inst.status} />
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Tooltip text="Asignar Cursos" position="top">
                                            <div
                                                className="cursor-pointer hover:text-blue-600"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAssignCourses(inst);
                                                }}
                                            >
                                                <BookPlus className="w-5 h-5" />
                                            </div>
                                        </Tooltip>
                                        <Tooltip text="Editar Datos" position="top">
                                            <div
                                                className="cursor-pointer hover:text-blue-600"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleEditInstitution(inst);
                                                }}
                                            >
                                                <IconComponent name="EditIcon" />
                                            </div>
                                        </Tooltip>
                                    </td>
                                </>
                            )}
                            totalElements={filteredInstitutions?.totalElements}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                        />)}
                </div>            <InstitutionModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    mode="edit"
                    institutionData={selectedInstitution}
                />

                <CourseAssignmentModal
                    isOpen={isCourseAssignmentModalOpen}
                    onClose={handleCloseCourseAssignmentModal}
                    institution={selectedInstitution} />        </div>
        </RoleGuard>
    );
};

export default InstitucionPage;