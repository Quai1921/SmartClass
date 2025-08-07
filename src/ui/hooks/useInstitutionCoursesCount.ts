import { useQuery } from '@tanstack/react-query';
import { getInstitutionCourses } from '../../actions/institution/get-institution-courses';

interface UseInstitutionCoursesCountProps {
  institutionIds: string[];
  enabled?: boolean;
}

export const useInstitutionCoursesCount = ({ institutionIds, enabled = true }: UseInstitutionCoursesCountProps) => {
  return useQuery({
    queryKey: ['institutions-courses-count', institutionIds],
    queryFn: async () => {
      const coursesCountMap: Record<string, number> = {};
      
      // Fetch courses for each institution
      await Promise.all(
        institutionIds.map(async (institutionId) => {
          try {
            const result = await getInstitutionCourses(institutionId);
            if (result.success && result.data?.courses) {
              coursesCountMap[institutionId] = result.data.courses.length;
            } else {
              coursesCountMap[institutionId] = 0;
            }
          } catch (error) {
            // console.error(`Error fetching courses for institution ${institutionId}:`, error);
            coursesCountMap[institutionId] = 0;
          }
        })
      );
      
      return coursesCountMap;
    },    enabled: enabled && institutionIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
