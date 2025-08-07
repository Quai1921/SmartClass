import React, { useState } from 'react';
import { useResponsiveChildPositioning } from '../../hooks/useResponsiveChildPositioning';
import { Percent, Move, RotateCcw, Info } from 'lucide-react';

interface ResponsivePositioningControlsProps {
  containerId: string;
}

export const ResponsivePositioningControls: React.FC<ResponsivePositioningControlsProps> = ({
  containerId
}) => {
  const {
    convertContainerChildrenToPercentage,
    getContainersWithPixelChildren
  } = useResponsiveChildPositioning();
  
  const [isConverting, setIsConverting] = useState(false);
  const [lastConversion, setLastConversion] = useState<{
    count: number;
    timestamp: number;
  } | null>(null);

  // Get info about current container's children
  const containerInfo = getContainersWithPixelChildren().find(
    info => info.container.id === containerId
  );

  const handleConvertToPercentage = async () => {
    setIsConverting(true);
    try {
      const convertedCount = convertContainerChildrenToPercentage(containerId, {
        convertPosition: true,
        convertDimensions: false, // Keep dimensions in pixels for better control
        preserveAspectRatio: true
      });
      
      setLastConversion({
        count: convertedCount || 0,
        timestamp: Date.now()
      });
    } catch (error) {
      // console.error('Error converting to percentage:', error);
    }
    setIsConverting(false);
  };

  if (!containerInfo || containerInfo.totalChildren === 0) {
    return (
      <div className="responsive-positioning-controls">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Info size={16} />
          <span>Este contenedor no tiene elementos hijo</span>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-positioning-controls space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-300">Posicionamiento Responsivo</h4>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <Move size={14} />
          <span>{containerInfo.totalChildren} elementos</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Status Info */}
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Elementos con posicionamiento fijo:</span>
            <span className={containerInfo.pixelChildren > 0 ? 'text-yellow-400' : 'text-green-400'}>
              {containerInfo.pixelChildren}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Elementos responsivos:</span>
            <span className={containerInfo.totalChildren - containerInfo.pixelChildren > 0 ? 'text-green-400' : 'text-gray-400'}>
              {containerInfo.totalChildren - containerInfo.pixelChildren}
            </span>
          </div>
        </div>

        {/* Convert Button */}
        {containerInfo.hasPixelChildren && (
          <button
            onClick={handleConvertToPercentage}
            disabled={isConverting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded px-3 py-2 text-sm transition-colors"
          >
            <Percent size={16} />
            <span>
              {isConverting ? 'Convirtiendo...' : 'Hacer Responsivo'}
            </span>
          </button>
        )}

        {/* Success Message */}
        {lastConversion && Date.now() - lastConversion.timestamp < 5000 && (
          <div className="text-xs text-green-400 flex items-center space-x-1">
            <span>✅ {lastConversion.count} elementos convertidos a posicionamiento responsivo</span>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 leading-relaxed">
          <p>
            <strong>Posicionamiento responsivo:</strong> Los elementos mantendrán su posición relativa 
            cuando el contenedor cambie de tamaño (ej: al ocultar/mostrar paneles).
          </p>
        </div>
      </div>
    </div>
  );
};
