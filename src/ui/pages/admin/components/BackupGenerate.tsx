
import TableCustomAdmin from '../../../components/TableCustomAdmin';
import { useQuery } from '@tanstack/react-query';
import { getBackupsSystemList } from '../../../../actions/configuration-admin/backups/get-backups-system-date';
import { formatDateToSpanish } from '../../../utils/formatDate';
import { IconComponent } from './Icon';

export const BackupGenerate = () => {

    const { data: backups } = useQuery({
        queryKey: ['backup'],
        staleTime: 1000 * 60 * 60, // 1 hour
        queryFn: () => getBackupsSystemList(),
    })




    return (
        <div>
            <h3 className="Text-2xl-Semi-Bold">Generar copias de seguridad del sistema</h3>
            <p className="text-Zinc--500">Genera copias de seguridad.</p>
            <div className="p-4 space-y-4">

                {/* Botón */}
                <div className="flex justify-end">
                    <button
                        className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-700"
                        onClick={() => alert('Generar copia de seguridad')}
                    >
                        Generar copia de seguridad
                    </button>
                </div>


                <TableCustomAdmin
                    headers={['id', 'Nombre del archivo', 'fecha de creación', 'Estado', 'Acciones']}
                    withCellGap={true}
                    withRowBorder={true}
                    data={backups || []}

                    rowRenderer={(backup) => <>
                        <td className="px-4 py-2">{backup.id}</td>
                        <td className="px-4 py-2">{backup.fileName}</td>
                        <td className="px-4 py-2">{formatDateToSpanish(backup.createdAt)}</td>
                        <td className="px-4 py-2">{backup.status}</td>
                        <td className="px-4 py-2 flex gap-2"> <IconComponent name='DownloadIcon' /> <IconComponent name='UploadIcon' /> </td>
                    </>}
                />


            </div>
        </div>
    );
};
