import type { Element } from '../../../types';
import { getElementStyles } from '../../../utils/elementStyles';

export const getContainerStyles = (element: Element): React.CSSProperties => {
  return getElementStyles(element, true);
};
