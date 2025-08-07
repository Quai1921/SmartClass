import { useCallback } from 'react';
import type { BuilderAction, BuilderState } from '../types';

export const useBuilderPreview = (
  dispatch: React.Dispatch<BuilderAction>,
  state: BuilderState
) => {
  const togglePreview = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  }, [dispatch]);

  const nextSlide = useCallback(() => {
    const maxIndex = state.course ? state.course.pages.length - 1 : 0;
    const nextIndex = Math.min(state.currentSlideIndex + 1, maxIndex);
    dispatch({
      type: 'SET_SLIDE_INDEX',
      payload: { index: nextIndex },
    });
  }, [dispatch, state.currentSlideIndex, state.course]);

  const prevSlide = useCallback(() => {
    const prevIndex = Math.max(state.currentSlideIndex - 1, 0);
    dispatch({
      type: 'SET_SLIDE_INDEX',
      payload: { index: prevIndex },
    });
  }, [dispatch, state.currentSlideIndex]);

  const goToSlide = useCallback((index: number) => {
    const maxIndex = state.course ? state.course.pages.length - 1 : 0;
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    dispatch({
      type: 'SET_SLIDE_INDEX',
      payload: { index: clampedIndex },
    });
  }, [dispatch, state.course]);

  return {
    togglePreview,
    nextSlide,
    prevSlide,
    goToSlide,
  };
};
