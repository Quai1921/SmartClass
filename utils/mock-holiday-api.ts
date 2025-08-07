/**
 * Mock API service for testing the holiday integration
 * This simulates the backend holiday service responses
 */

// Holiday type to match the frontend interface
type HolidaySource = 'COLOMBIA_CUSTOM' | 'JOLLYDAY';

interface MockHoliday {
    name: string;
    date: string;
    description: string;
    isNational: boolean;
    source: HolidaySource;
}

// Mock Colombian holidays data for 2025
const mockColombianHolidays2025: MockHoliday[] = [
    {
        name: "Año Nuevo",
        date: "2025-01-01",
        description: "Celebración del inicio del año",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Día de los Reyes Magos",
        date: "2025-01-06",
        description: "Epifanía del Señor",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Día de San José",
        date: "2025-03-24", // Moved to Monday
        description: "Día de San José",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Jueves Santo",
        date: "2025-04-17",
        description: "Jueves Santo",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Viernes Santo",
        date: "2025-04-18",
        description: "Viernes Santo",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Día del Trabajo",
        date: "2025-05-01",
        description: "Día internacional del trabajador",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Día de la Independencia",
        date: "2025-07-20",
        description: "Independencia de Colombia",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Batalla de Boyacá",
        date: "2025-08-07",
        description: "Conmemoración de la Batalla de Boyacá",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Inmaculada Concepción",
        date: "2025-12-08",
        description: "Inmaculada Concepción de María",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    },
    {
        name: "Navidad",
        date: "2025-12-25",
        description: "Celebración del nacimiento de Jesús",
        isNational: true,
        source: "COLOMBIA_CUSTOM"
    }
];

// Mock US holidays data for 2025 (translated to Spanish)
const mockUSHolidays2025: MockHoliday[] = [
    {
        name: "Año Nuevo",
        date: "2025-01-01",
        description: "New Year celebration",
        isNational: true,
        source: "JOLLYDAY"
    },
    {
        name: "Día de Martin Luther King Jr.",
        date: "2025-01-20", // Third Monday in January
        description: "Honoring Martin Luther King Jr.",
        isNational: true,
        source: "JOLLYDAY"
    },
    {
        name: "Día de la Independencia",
        date: "2025-07-04",
        description: "US Independence Day",
        isNational: true,
        source: "JOLLYDAY"
    },
    {
        name: "Día del Trabajo",
        date: "2025-09-01", // First Monday in September
        description: "Labor Day",
        isNational: true,
        source: "JOLLYDAY"
    },
    {
        name: "Navidad",
        date: "2025-12-25",
        description: "Christmas celebration",
        isNational: true,
        source: "JOLLYDAY"
    }
];

/**
 * Mock implementation of the hybrid holiday service API
 */
export class MockHolidayAPI {
    
    /**
     * Mock endpoint: GET /holidays?year=2025&countryCode=CO
     */
    static getHolidays(year: number, countryCode: string) {
        
        let holidays;
        
        switch (countryCode.toUpperCase()) {
            case 'CO':
                holidays = mockColombianHolidays2025;
                break;
            case 'US':
                holidays = mockUSHolidays2025;
                break;            default:
                holidays = [
                    {
                        name: "Año Nuevo",
                        date: `${year}-01-01`,
                        description: "New Year celebration",
                        isNational: true,
                        source: "JOLLYDAY" as const
                    },
                    {
                        name: "Navidad",
                        date: `${year}-12-25`,
                        description: "Christmas celebration",
                        isNational: true,
                        source: "JOLLYDAY" as const
                    }
                ];
        }
        
        return {
            holidays,
            year,
            countryCode: countryCode.toUpperCase(),
            count: holidays.length,
            message: "Holidays retrieved successfully"
        };
    }
    
    /**
     * Mock endpoint: GET /holidays/range?startDate=2025-01-01&endDate=2025-12-31&countryCode=CO
     */
    static getHolidaysInRange(startDate: string, endDate: string, countryCode: string) {
        
        const year = new Date(startDate).getFullYear();
        const allHolidays = this.getHolidays(year, countryCode);
        
        // Filter holidays by date range
        const filteredHolidays = allHolidays.holidays.filter(holiday => {
            return holiday.date >= startDate && holiday.date <= endDate;
        });
        
        return {
            holidays: filteredHolidays,
            startDate,
            endDate,
            countryCode: countryCode.toUpperCase(),
            count: filteredHolidays.length,
            message: "Holidays retrieved successfully for date range"
        };
    }
    
    /**
     * Mock endpoint: GET /holidays/countries
     */
    static getSupportedCountries() {
        
        const countries = ["CO", "US", "MX", "AR"];
        
        return {
            countries,
            count: countries.length,
            message: "Supported countries retrieved successfully"
        };
    }
}

/**
 * Demo function to show how the mock API works
 */
export function runHolidayAPIMockDemo() {

    
    // Test Colombian holidays

    const colombianResult = MockHolidayAPI.getHolidays(2025, "CO");

    

    
    // Test US holidays

    const usResult = MockHolidayAPI.getHolidays(2025, "US");

    

    
    // Test date range

    const rangeResult = MockHolidayAPI.getHolidaysInRange("2025-01-01", "2025-03-31", "CO");

    
    // Test supported countries
    const countriesResult = MockHolidayAPI.getSupportedCountries();

}
