
import type { Backup } from '../../domain/entities/backup.system';
import type { BackupResponse } from '../interfaces/backup.system.response';



export class BackupSystemMapper {

    static smartClassBackupSystemToEntity(Backup: BackupResponse): Backup {
        return {
            id: Backup.id,
            fileName: Backup.fileName,
            createdAt: Backup.createdAt,
            status: Backup.status,
        };
    }

}