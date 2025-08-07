export class StorageAdapter {
    private static usePersistentStorage = false;

    static setUsePersistentStorage(persistent: boolean) {
        this.usePersistentStorage = persistent;
    }

    private static getStorage() {
        return this.usePersistentStorage ? localStorage : sessionStorage;
    }    static getItem(key: string) {
        try {
            // For tokens, check both storages and auto-detect the correct one
            if (key === 'token') {
                const localValue = localStorage.getItem(key);
                const sessionValue = sessionStorage.getItem(key);
                
                // If we find a token in localStorage, use persistent storage
                if (localValue) {
                    this.usePersistentStorage = true;
                    return localValue;
                }
                
                // If we find a token in sessionStorage, use session storage
                if (sessionValue) {
                    this.usePersistentStorage = false;
                    return sessionValue;
                }
                
                return null;
            }
            
            // For other keys, use the current storage type
            const storage = this.getStorage();
            const value = storage.getItem(key);
            
            return value;
        } catch (error) {
            // Silently handle storage access errors
            return null
        }
    }

    static setItem(key: string, value: string){
        try {
            const storage = this.getStorage();
            storage.setItem(key, value);
            
            // Always clear from the other storage to avoid conflicts
            const otherStorage = this.usePersistentStorage ? sessionStorage : localStorage;
            otherStorage.removeItem(key);
            
            return;
        } catch (error) {
            throw new Error(`Error setting item ${key} ${value} ${error}`);
        }
    }    static removeItem(key: string){
        try {
            // Remove from both storages to ensure cleanup
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
            return;
        } catch (error) {
            throw new Error(`Error removing item ${key} ${error}`);
        }
    }

    static clearAllAuthData() {
        try {
            // Clear all authentication-related data from both storages
            const authKeys = ['token', 'userData', 'user', 'authStatus'];
            authKeys.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
        } catch (error) {
            // console.error('Error clearing auth data:', error);
        }
    }

    // Sent emails management
    static getSentEmails(): SentEmail[] {
        try {
            const sentEmails = this.getItem('sentEmails');
            return sentEmails ? JSON.parse(sentEmails) : [];
        } catch (error) {
            // console.error('Error getting sent emails:', error);
            return [];
        }
    }

    static addSentEmail(email: SentEmail) {
        try {
            const sentEmails = this.getSentEmails();
            const updatedEmails = [email, ...sentEmails].slice(0, 100); // Keep only last 100 emails
            this.setItem('sentEmails', JSON.stringify(updatedEmails));
        } catch (error) {
            // console.error('Error saving sent email:', error);
        }
    }

    static clearSentEmails() {
        try {
            this.removeItem('sentEmails');
        } catch (error) {
            // console.error('Error clearing sent emails:', error);
        }
    }

    // Page Builder Storage Methods
    static getPageBuilderData(): PageBuilderStorage {
        try {
            const data = this.getItem('pageBuilderData');
            return data ? JSON.parse(data) : {
                projects: [],
                autoSaveEnabled: true
            };
        } catch (error) {
            // console.error('Error getting page builder data:', error);
            return {
                projects: [],
                autoSaveEnabled: true
            };
        }
    }

    static savePageBuilderData(data: PageBuilderStorage) {
        try {
            this.setItem('pageBuilderData', JSON.stringify(data));
        } catch (error) {
            // console.error('Error saving page builder data:', error);
        }
    }

    static saveProject(project: SavedProject) {
        try {
            const data = this.getPageBuilderData();
            const existingIndex = data.projects.findIndex(p => p.id === project.id);
            
            if (existingIndex >= 0) {
                // Update existing project
                data.projects[existingIndex] = {
                    ...project,
                    updatedAt: new Date().toISOString(),
                    version: data.projects[existingIndex].version + 1
                };
            } else {
                // Add new project
                data.projects.unshift({
                    ...project,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1
                });
            }
            
            // Keep only last 50 projects
            data.projects = data.projects.slice(0, 50);
            this.savePageBuilderData(data);
        } catch (error) {
            // console.error('Error saving project:', error);
        }
    }

    static getProject(id: string): SavedProject | null {
        try {
            const data = this.getPageBuilderData();
            return data.projects.find(p => p.id === id) || null;
        } catch (error) {
            // console.error('Error getting project:', error);
            return null;
        }
    }

    static getAllProjects(): SavedProject[] {
        try {
            const data = this.getPageBuilderData();
            return data.projects;
        } catch (error) {
            // console.error('Error getting all projects:', error);
            return [];
        }
    }

    static deleteProject(id: string) {
        try {
            const data = this.getPageBuilderData();
            data.projects = data.projects.filter(p => p.id !== id);
            this.savePageBuilderData(data);
        } catch (error) {
            // console.error('Error deleting project:', error);
        }
    }

    static setCurrentProject(project: SavedProject | null) {
        try {
            const data = this.getPageBuilderData();
            data.currentProject = project || undefined;
            data.lastAutoSave = new Date().toISOString();
            this.savePageBuilderData(data);
        } catch (error) {
            // console.error('Error setting current project:', error);
        }
    }

    static getCurrentProject(): SavedProject | null {
        try {
            const data = this.getPageBuilderData();
            return data.currentProject || null;
        } catch (error) {
            // console.error('Error getting current project:', error);
            return null;
        }
    }

    static setAutoSaveEnabled(enabled: boolean) {
        try {
            const data = this.getPageBuilderData();
            data.autoSaveEnabled = enabled;
            this.savePageBuilderData(data);
        } catch (error) {
            // console.error('Error setting auto-save preference:', error);
        }
    }

    static isAutoSaveEnabled(): boolean {
        try {
            const data = this.getPageBuilderData();
            return data.autoSaveEnabled !== false; // Default to true
        } catch (error) {
            // console.error('Error checking auto-save preference:', error);
            return true;
        }
    }

    static clearPageBuilderData() {
        try {
            this.removeItem('pageBuilderData');
        } catch (error) {
            // console.error('Error clearing page builder data:', error);
        }
    }
}

export interface SentEmail {
    id: string;
    to: string[];
    subject: string;
    body: string;
    templateId?: string;
    templateName?: string;
    sentAt: string;
    status: 'sent' | 'failed';
}

// Page Builder Storage Interfaces
export interface SavedProject {
    id: string;
    title: string;
    description: string;
    type: 'Academico' | 'Evaluativo';
    elements: any[]; // Will be Element[] from page builder types
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
    status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
    version: number;
}

export interface PageBuilderStorage {
    projects: SavedProject[];
    currentProject?: SavedProject;
    autoSaveEnabled: boolean;
    lastAutoSave?: string;
}