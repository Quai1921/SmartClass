import { useCallback } from 'react';

export const useUrlParams = () => {
  const getUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
      courseId: urlParams.get('courseId'),
      moduleId: urlParams.get('moduleId'),
      action: urlParams.get('action')
    };
    return params;
  }, []);

  const updateUrlWithModule = useCallback((moduleId: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('moduleId', moduleId);
    newUrl.searchParams.set('action', 'edit');
    window.history.pushState({}, '', newUrl.toString());
  }, []);

  return {
    getUrlParams,
    updateUrlWithModule
  };
};
