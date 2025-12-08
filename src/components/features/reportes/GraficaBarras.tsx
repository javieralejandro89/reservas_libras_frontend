/**
 * Gráfica de Barras Simple
 */

interface GraficaBarrasProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  maxValue: number;
  title: string;
}

export const GraficaBarras = ({ data, maxValue, title }: GraficaBarrasProps) => {
  return (
  <div>
    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">{title}</h3>
    <div className="space-y-2 sm:space-y-3">
      {data.map((item, index) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        
        return (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[120px] sm:max-w-[200px]">
                {item.label}
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {item.value.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div
                className={`h-2 sm:h-3 rounded-full transition-all ${item.color || 'bg-primary-600'}`}
                style={{ width: `${Math.max(percentage, 2)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};