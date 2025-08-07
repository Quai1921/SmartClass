interface Props {
  state: string;
}

export const StateTag = ({ state }: Props) => {
  let label = '';
  let bgColor = '';
  let textColor = '';
  let dotColor = '';

  switch (state) {
    case 'ACTIVE':
      label = 'Activo';
      bgColor = 'bg-[#ECFDF3]';
      textColor = 'text-[#037847]';
      dotColor = 'bg-[#14BA6D]';
      break;

    case 'INACTIVE':
      label = 'Inactivo';
      bgColor = 'bg-[#F2F4F7]';
      textColor = 'text-[#364254]';
      dotColor = 'bg-gray-500';
      break;    case 'PENDING':
      label = 'Pendiente';
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-700';
      dotColor = 'bg-orange-500';
      break;

    default:
      label = 'Desconocido';
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-600';
      dotColor = 'bg-gray-400';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      <span className={`h-[6px] w-[6px] rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};
