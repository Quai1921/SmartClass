

/* response endpoint /auth/login  */
export interface AuthResponse {
    status: string;
    accessToken: string;
    refreshToken: string;
    policyPending: boolean;
    tutorialEnabled: boolean;
    institutionCreated: boolean;
}
