import { useMutation, useQuery } from '@tanstack/react-query';
import { createInstitution, type CreateInstitutionData } from '../../actions/institution/create-institution';
import { getCities, type City } from '../../actions/institution/get-cities';
import { createInstitutionStructure, type InstitutionStructureData } from '../../actions/institution/create-institution-structure';

// Hook for fetching cities
export const useCities = () => {
  return useQuery<City[], Error>({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Hook for creating institution
export const useCreateInstitution = () => {
  return useMutation<
    { success: boolean; message: string },
    Error,
    CreateInstitutionData
  >({
    mutationFn: createInstitution,
  });
};

// Hook for creating institution structure
export const useCreateInstitutionStructure = () => {
  return useMutation<
    { success: boolean; message: string },
    Error,
    InstitutionStructureData
  >({
    mutationFn: createInstitutionStructure,
  });
};
