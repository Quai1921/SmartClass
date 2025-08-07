import { StorageAdapter } from "../../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../../config/smartClassAPI";
import type { Backup } from "../../../domain/entities/backup.system";
import type { BackupResponse } from "../../../infrastructure/interfaces/backup.system.response";
import { BackupSystemMapper } from "../../../infrastructure/mappers/backup.system.mapper";




export const getBackupsSystemList = async (): Promise<Backup[]> => {
    const token = StorageAdapter.getItem("token");

    try {
        
        const { data } = await smartClassAPI.get<BackupResponse[]>(`/backup/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const backup = data.map( BackupSystemMapper.smartClassBackupSystemToEntity);

        return backup;

    } catch (error) {
        // console.error(error);
        throw new Error("Error getting institutions");
    }
};
