import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChartIcon } from 'lucide-react';
import _ from 'lodash';
import { IngresoWithCategoria } from '@/app/actions/cuentas';



interface ChartData {
  categoria: string;
  monto: number;
}



interface IngresoChartsProps {
  ingresos?: IngresoWithCategoria[];
}

export default function IngresoCharts({ ingresos  }: IngresoChartsProps) {
  // Group ingresos by categoria.nombre and sum the monto values
  const chartData: ChartData[] = React.useMemo(() => {
    const groupedData = _.groupBy(ingresos, 'categoria.nombre');
    return Object.entries(groupedData).map(([categoria, items]) => ({
      categoria,
      monto: items.reduce((sum, item) => sum + parseFloat(item.monto.toString() || '0'), 0)
    }));
  }, [ingresos]);

  // Colors for pie chart
  const COLORS = ['#f6b23b', '#ff8c00', '#ffa500', '#ffb347', '#ffd700', '#ffdf00'];

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

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium">{`Categoría: ${data.name}`}</p>
          <p className="text-orange-500">
            {`Monto: $${data.value.toLocaleString('es-ES', { 
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
    <Card className="w-full lg:w-1/2 max-w-4xl mx-auto">
      <CardHeader className="rounded-t-lg bg-orange-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Ingresos por Categoría
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Gráfico de Barras
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Gráfico Circular
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="pie" className="mt-6">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="monto"
                  nameKey="categoria"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}