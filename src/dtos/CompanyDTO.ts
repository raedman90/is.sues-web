export interface CompanyDto {
    id?: string;
    name: string;
    email: string;
    password: string;
    latitude?: number;
    longitude?: number;
    headid?: string | null;
    description?: string | null;
    departments?: string[];
}
