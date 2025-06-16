import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import _ from 'lodash';
import { IngresoWithCategoria } from '@/app/actions/cuentas';




interface ChartData {
  categoria: string;
  monto: number;
}

interface IngresoBarChartProps {
  ingresos?: IngresoWithCategoria[];
}

export const IngresoBarChart: React.FC<IngresoBarChartProps> = ({ ingresos = [] }) => {
  // Group ingresos by categoria.nombre and sum the monto values
  const chartData: ChartData[] = React.useMemo(() => {
    const groupedData = _.groupBy(ingresos, 'categoria.nombre');
    console.log("🚀 ~ constchartData:ChartData[]=React.useMemo ~ groupedData:", groupedData)
  console.log(' ', Object.entries(groupedData).map(([categoria, items]) => ({
    categoria,
    monto: items.reduce((sum, item) => sum + parseFloat(item.monto.toString() || '0'), 0)
  })))
    return Object.entries(groupedData).map(([categoria, items]) => ({
      categoria,
      monto: items.reduce((sum, item) => sum + parseFloat(item.monto.toString() || '0'), 0)
    }));
  }, [ingresos]);

  console.log("🚀 ~ constchartData:ChartData[]=React.useMemo ~ chartData:", chartData)

  

  // Custom tooltip formatter to show currency
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium">{`Categoría: ${label}`}</p>
          <p className="text-orange-500">
            {`Monto: $${payload[0].value.toLocaleString('es-ES', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis labels as currency
  const formatYAxis = (value: number): string => {
    return `$${value.toLocaleString('es-ES')}`;
  };

  if (!ingresos || ingresos.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">No hay datos de ingresos para mostrar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="rounded-t-lg bg-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Ingresos por categoria
                </CardTitle>
              </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="categoria" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
            
              dataKey="monto" 
              fill="#f6b23b" 
              name="Monto Total"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

