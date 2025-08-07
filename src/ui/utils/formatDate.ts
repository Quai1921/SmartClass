// utils/formatDate.ts
export function formatDateToSpanish(dateInput: string | Date): string {
    const fecha = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return `${dia} de ${mes} ${anio}`;
}
