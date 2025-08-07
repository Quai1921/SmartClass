import { smartClassAPI } from "../../config/smartClassAPI";
import { MockHolidayAPI } from "../../utils/mock-holiday-api";

// 🎯 Interface for holiday data from the hybrid holiday service
export interface Holiday {
    name: string;
    date: string; // ISO date string (YYYY-MM-DD)
    description: string;
    isNational: boolean;
    source: 'COLOMBIA_CUSTOM' | 'JOLLYDAY';
}

// 🎯 Interface for the API response
export interface HolidayResponse {
    holidays: Holiday[];
    year: number;
    countryCode: string;
    count: number;
    message: string;
}

/**
 * 🎉 Get holidays for a specific year and country using the hybrid holiday service
 * 
 * @param year - The year to get holidays for (defaults to current year)
 * @param countryCode - The ISO country code (defaults to "CO" for Colombia)
 * @returns Promise<Holiday[]> - Array of holidays with Spanish names
 */
export const getHolidays = async (
    year?: number,
    countryCode: string = "CO"
): Promise<Holiday[]> => {
    try {
        const currentYear = year || new Date().getFullYear();

        // Use query parameters for the holiday endpoint
        const endpoint = `/holidays?year=${currentYear}&countryCode=${countryCode}`;

        const { data } = await smartClassAPI.get<HolidayResponse>(endpoint);

        // Log each holiday for debugging
        data.holidays.forEach((holiday, index) => {
        });

        return data.holidays;
    } catch (error) {
        // console.error("❌ Error fetching holidays:", {
        //     error: error instanceof Error ? error.message : 'Unknown error',
        //     status: (error as any)?.response?.status,
        //     data: (error as any)?.response?.data
        // });

        // Use mock API as fallback when the real backend is not available
        try {
            const mockResult = MockHolidayAPI.getHolidays(year || new Date().getFullYear(), countryCode);
            return mockResult.holidays;
        } catch (mockError) {
            // console.error("❌ Mock API also failed:", mockError);

            // Final fallback: hardcoded Colombian holidays
            if (countryCode === "CO") {
                return getFallbackColombianHolidays(year || new Date().getFullYear());
            }

            throw error;
        }
    }
};

/**
 * 🎉 Get holidays for a specific date range
 * 
 * @param startDate - Start date (ISO format: YYYY-MM-DD)
 * @param endDate - End date (ISO format: YYYY-MM-DD)
 * @param countryCode - The ISO country code (defaults to "CO")
 * @returns Promise<Holiday[]> - Array of holidays in the date range
 */
export const getHolidaysInRange = async (
    startDate: string,
    endDate: string,
    countryCode: string = "CO"
): Promise<Holiday[]> => {
    try {

        const endpoint = `/holidays/range?startDate=${startDate}&endDate=${endDate}&countryCode=${countryCode}`;

        const { data } = await smartClassAPI.get<HolidayResponse>(endpoint);

        return data.holidays;

    } catch (error) {
        // console.error("❌ Error fetching holidays in range:", error);
        throw error;
    }
};

/**
 * 🌍 Get list of supported countries
 * 
 * @returns Promise<string[]> - Array of supported country codes
 */
export const getSupportedCountries = async (): Promise<string[]> => {
    try {

        const endpoint = '/holidays/countries';

        const { data } = await smartClassAPI.get<{
            countries: string[];
            count: number;
            message: string;
        }>(endpoint);

        return data.countries;

    } catch (error) {
        // console.error("❌ Error fetching supported countries:", error);

        // Return default supported countries
        return ["CO", "US", "MX", "AR"];
    }
};

/**
 * 🔄 Fallback Colombian holidays (used when the service is not available)
 */
const getFallbackColombianHolidays = (year: number): Holiday[] => {
    return [
        {
            name: "Año Nuevo",
            date: `${year}-01-01`,
            description: "Celebración del inicio del año",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        },
        {
            name: "Día de los Reyes Magos",
            date: `${year}-01-06`, // Note: In real implementation, this would be moved to Monday
            description: "Epifanía del Señor",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        },
        {
            name: "Día de San José",
            date: `${year}-03-19`, // Note: In real implementation, this would be moved to Monday
            description: "Día de San José",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        },
        {
            name: "Día del Trabajo",
            date: `${year}-05-01`,
            description: "Día internacional del trabajador",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        },
        {
            name: "Día de la Independencia",
            date: `${year}-07-20`,
            description: "Independencia de Colombia",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        },
        {
            name: "Batalla de Boyacá",
            date: `${year}-08-07`,
            description: "Conmemoración de la Batalla de Boyacá",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        },
        {
            name: "Inmaculada Concepción",
            date: `${year}-12-08`,
            description: "Inmaculada Concepción de María",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        },
        {
            name: "Navidad",
            date: `${year}-12-25`,
            description: "Celebración del nacimiento de Jesús",
            isNational: true,
            source: "COLOMBIA_CUSTOM"
        }
    ];
};
