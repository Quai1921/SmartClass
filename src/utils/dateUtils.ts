// utils/dateUtils.ts
export interface DateFormatOptions {
  includeTime?: boolean;
  relative?: boolean;
  locale?: string;
}

export function formatDate(
  dateString: string | null | undefined,
  options: DateFormatOptions = {}
): string {
  if (!dateString || dateString === 'null') {
    return 'Sin fecha';
  }

  const {
    includeTime = false,
    relative = false,
    locale = 'es-ES'
  } = options;

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      // console.warn('formatDate: Invalid date string:', dateString);
      return 'Fecha inválida';
    }

    // If relative time is requested, calculate the difference
    if (relative) {
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // If the date is in the future, show formatted date instead of relative
      if (diffTime < 0) {
        return date.toLocaleDateString(locale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          ...(includeTime && {
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      }

      // Return relative time
      switch (true) {
        case diffMinutes < 1:
          return 'Ahora mismo';
        case diffMinutes < 60:
          return `Hace ${diffMinutes} min`;
        case diffHours < 24:
          return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} h`;
        case diffDays === 1:
          return 'Ayer';
        case diffDays < 7:
          return `Hace ${diffDays} días`;
        case diffDays < 30:
          const weeks = Math.floor(diffDays / 7);
          return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
        default:
          return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          });
      }
    }

    // Return formatted date
    const formatOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    return date.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    // console.error('formatDate: Error parsing date:', error);
    return 'Fecha inválida';
  }
}

export function formatDateLong(dateString: string | null | undefined): string {
  if (!dateString || dateString === 'null') {
    return 'Sin fecha';
  }

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    // console.error('formatDateLong: Error parsing date:', error);
    return 'Fecha inválida';
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  return formatDate(dateString, { includeTime: true });
}

export function formatDateRelative(dateString: string | null | undefined): string {
  return formatDate(dateString, { relative: true });
}
