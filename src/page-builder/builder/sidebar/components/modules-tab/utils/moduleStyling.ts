export const getModuleCardStyling = (module: any, currentModuleInfo: any) => {
  const isCurrentModule = currentModuleInfo?.id === module.id;
  
  if (isCurrentModule) {
    return {
      border: 'border-blue-500 bg-blue-500/15 shadow-xl shadow-blue-500/25 ring-1 ring-blue-500/20',
      stripe: 'bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 shadow-sm shadow-blue-500/50'
    };
  }
  
  if (module.isDraft) {
    return {
      border: 'border-orange-500/50 bg-orange-500/8 hover:bg-orange-500/15 hover:border-orange-500/70 hover:shadow-lg hover:shadow-orange-500/10',
      stripe: 'bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 group-hover:shadow-sm group-hover:shadow-orange-500/30'
    };
  }
  
  // Status-based styling for published modules
  switch (module.status) {
    case 'PUBLISHED':
      return {
        border: 'border-green-500/50 bg-green-500/8 hover:bg-green-500/15 hover:border-green-500/70 hover:shadow-lg hover:shadow-green-500/10',
        stripe: 'bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 group-hover:shadow-sm group-hover:shadow-green-500/30'
      };
    case 'IN_REVIEW':
      return {
        border: 'border-purple-500/50 bg-purple-500/8 hover:bg-purple-500/15 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/10',
        stripe: 'bg-gradient-to-r from-purple-500 via-purple-400 to-violet-400 group-hover:shadow-sm group-hover:shadow-purple-500/30'
      };
    default:
      return {
        border: 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/40 hover:shadow-lg',
        stripe: 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 group-hover:from-gray-500 group-hover:to-gray-400'
      };
  }
};

export const getModuleIconStyling = (module: any, currentModuleInfo: any) => {
  const isCurrentModule = currentModuleInfo?.id === module.id;
  
  if (isCurrentModule) {
    return 'bg-blue-500 text-white shadow-blue-500/30 ring-2 ring-blue-400/20';
  }
  
  if (module.isDraft) {
    return 'bg-orange-500 text-white shadow-orange-500/20 group-hover:shadow-orange-500/30 group-hover:scale-105';
  }
  
  // Status-based styling for published modules
  switch (module.status) {
    case 'PUBLISHED':
      return 'bg-green-500 text-white shadow-green-500/20 group-hover:shadow-green-500/30 group-hover:scale-105';
    case 'IN_REVIEW':
      return 'bg-purple-500 text-white shadow-purple-500/20 group-hover:shadow-purple-500/30 group-hover:scale-105';
    default:
      return 'bg-gray-600 text-gray-300 group-hover:bg-gray-500 group-hover:text-gray-200 group-hover:scale-105';
  }
};
