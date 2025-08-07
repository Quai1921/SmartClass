import { useQuery } from '@tanstack/react-query';
import TableCustom from '../../../components/TableCustom';
import { getBackupsSystemList } from '../../../../actions/configuration-admin/backups/get-backups-system-date';
import { formatDateToSpanish } from '../../../utils/formatDate';
import { IconComponent } from './Icon';




export default function BackupRestore() {

    const { data: backups } = useQuery({
        queryKey: ['backup'],
        staleTime: 1000 * 60 * 60, // 1 hour
        queryFn: () => getBackupsSystemList(),
    })


    return (
        <div>
            <h3 className="Text-2xl-Semi-Bold">Restaurar copias de seguridad</h3>
            <p className="text-Zinc--500">Restaura copias de seguridad.</p>

            <TableCustom
                headers={['Institución', 'Fecha', 'Tipo', 'Estado', 'Acciones']}
                data={backups || []}
                rowRenderer={(backup) =>
                    <>
                        <td className="px-4 py-2">{backup.id}</td>
                        <td className="px-4 py-2">{backup.fileName}</td>
                        <td className="px-4 py-2">{formatDateToSpanish(backup.createdAt)}</td>
                        <td className="px-4 py-2">{backup.status}</td>
                        <td className="px-4 py-2 flex gap-2"> <IconComponent name='DownloadIcon' /> <IconComponent name='UploadIcon' /> </td>
                    </>
                } />

        </div>
    )
}
