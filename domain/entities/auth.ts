

export interface Auth {
    status: string;
    accessToken: string;
    refreshToken: string;
    policyPending: boolean;
    tutorialEnabled: boolean;
    institutionCreated: boolean;
}
