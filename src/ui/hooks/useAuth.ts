import { useMutation, useQuery } from '@tanstack/react-query';
import { acceptPolicies } from '../../actions/auth/accept-policies';
import { getPolicies, type Policy } from '../../actions/auth/get-policies';

// Hook for fetching policies
export const usePolicies = () => {
  return useQuery<Policy[], Error>({
    queryKey: ['policies'],
    queryFn: getPolicies,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Hook for accepting policies
export const useAcceptPolicies = () => {
  return useMutation<
    { success: boolean; message?: string },
    Error,
    string[] | undefined
  >({
    mutationFn: acceptPolicies,
  });
};
