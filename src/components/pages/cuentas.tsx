"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { CuentaWithRelations, getCuenta } from "@/app/actions/cuentas";
import { Egreso, Ingreso } from "@prisma/client";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  User,
  CreditCard,
} from "lucide-react";
import { IngresoBarChart } from "../charts/ingreso-categoria";

// Tipos
type Cuenta = {
  id: string;
  nombre: string;
  numero: string;
  tipo: string;
};

type Movimiento = {
  monto: number;
  descripcion: string;
  fecha: string;
};

export default function CuentasPage({
  cuentasServer,
}: {
  cuentasServer: Cuenta[];
}) {
  const [cuentas] = useState(cuentasServer);
  const [cuentaId, setCuentaId] = useState<string | null>(
    cuentas[0]?.id || null,
  );
  const [cuenta, setCuenta] = useState<CuentaWithRelations | null>(null);
  const [desde, setDesde] = useState<string>("");
  const [hasta, setHasta] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cuentaId) return;

    setLoading(true);
    getCuenta(cuentaId).then((res) => {
      if (res.status === 200 && res.data) setCuenta(res.data);
      setLoading(false);
    });
  }, [cuentaId]);

  const filtrar = (movs: Ingreso[]) => {
    return movs.filter((m) => {
      const fecha = new Date(m.fecha);
      return (
        (!desde || fecha >= new Date(desde)) &&
        (!hasta || fecha <= new Date(hasta))
      );
    });
  };

  const filtrarE = (movs: Egreso[]) => {
    return movs.filter((m) => {
      const fecha = new Date(m.fecha);
      return (
        (!desde || fecha >= new Date(desde)) &&
        (!hasta || fecha <= new Date(hasta))
      );
    });
  };

  const datosGrafico = () => {
    if (!cuenta) return [];
    const ingresos = filtrar(cuenta.ingresos);
    const egresos = filtrarE(cuenta.egresos);

    const agrupado: Record<string, { ingresos: number; egresos: number }> = {};

    ingresos.forEach((i) => {
      const date = new Date(i.fecha);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      const fecha = format(new Date(date), "yyyy-MM-dd");

      agrupado[fecha] = agrupado[fecha] || { ingresos: 0, egresos: 0 };
      // Convert Decimal to number
      agrupado[fecha].ingresos += Number(i.monto);
    });

    egresos.forEach((e) => {
      const fecha = format(new Date(e.fecha), "yyyy-MM-dd");
      agrupado[fecha] = agrupado[fecha] || { ingresos: 0, egresos: 0 };
      // Convert Decimal to number - this fixes the TypeScript error
      agrupado[fecha].egresos += Number(e.monto);
    });

    return Object.entries(agrupado)
      .map(([fecha, val]) => ({
        fecha: format(new Date(fecha + "T00:00:00"), "dd/MM"),
        fechaCompleta: fecha,
        ...val,
      }))
      .sort(
        (a, b) =>
          new Date(a.fechaCompleta).getTime() -
          new Date(b.fechaCompleta).getTime(),
      );
  };

  const calcularTotales = () => {
    if (!cuenta) return { totalIngresos: 0, totalEgresos: 0, saldo: 0 };

    const ingresos = filtrar(cuenta.ingresos);
    const egresos = filtrarE(cuenta.egresos);

    const totalIngresos = ingresos.reduce((sum, i) => sum + Number(i.monto), 0);
    const totalEgresos = egresos.reduce((sum, e) => sum + Number(e.monto), 0);
    const saldo = totalIngresos - totalEgresos;

    return { totalIngresos, totalEgresos, saldo };
  };

  const { totalIngresos, totalEgresos, saldo } = calcularTotales();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-900">{`Fecha: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey === "ingresos" ? "Ingresos" : "Egresos"}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-10 min-h-screen bg-background from-slate-50 to-blue-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-text text-4xl font-bold">Panel de Cuentas</h1>
          <p className="text-text">
            Gestiona y visualiza tus movimientos financieros
          </p>
        </div>

        {/* Filters Card */}
        <Card className="border-0 border-blue-600 bg-background shadow-lg backdrop-blur-sm">
          <CardHeader className="rounded-t-lg bg-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              Seleccionar Cuenta y Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-text text-sm font-medium">Cuenta</label>
                <Select
                  value={cuentaId || ""}
                  onValueChange={(v) => setCuentaId(v)}
                >
                  <SelectTrigger className="w-full border-2 border-gray-200 transition-colors focus:border-blue-500">
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuentas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {c.tipo}
                          </Badge>
                          {c.nombre}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-text flex items-center gap-1 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Desde
                </label>
                <Input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="border-2 border-gray-200 transition-colors focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-text flex items-center gap-1 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Hasta
                </label>
                <Input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="border-2 border-gray-200 transition-colors focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-text mt-2">
                Cargando información de la cuenta...
              </p>
            </CardContent>
          </Card>
        )}

        {cuenta && !loading && (
          <>
            {/* Account Info Card */}
            <Card className="border-0 border-teal-600 bg-background shadow-lg backdrop-blur-sm">
              <CardHeader className="rounded-t-lg bg-teal-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  Información de la Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-text text-sm font-medium">Nombre</p>
                    <p className="text-text text-lg font-semibold">
                      {cuenta.nombre}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text text-sm font-medium">Número</p>
                    <p className="text-text font-mono text-lg font-semibold">
                      {cuenta.numero}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text text-sm font-medium">Tipo</p>
                    <Badge variant="secondary" className="text-sm">
                      {cuenta.tipo}
                    </Badge>
                  </div>
                </div>

                {cuenta.admin && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-text text-sm font-medium">
                      Administrador
                    </p>
                    <p className="text-text text-lg font-semibold">
                      {cuenta.admin.nombre}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Total Ingresos
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(totalIngresos)}
                      </p>
                    </div>
                    <div className="rounded-full bg-green-100 p-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">
                        Total Egresos
                      </p>
                      <p className="text-2xl font-bold text-red-700">
                        {formatCurrency(totalEgresos)}
                      </p>
                    </div>
                    <div className="rounded-full bg-red-100 p-3">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`border-0 shadow-lg ${
                  saldo >= 0
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50"
                    : "bg-gradient-to-br from-orange-50 to-red-50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${saldo >= 0 ? "text-blue-600" : "text-orange-600"}`}
                      >
                        Saldo Actual
                      </p>
                      <p
                        className={`text-2xl font-bold ${saldo >= 0 ? "text-blue-700" : "text-orange-700"}`}
                      >
                        {formatCurrency(saldo)}
                      </p>
                    </div>
                    <div
                      className={`rounded-full p-3 ${saldo >= 0 ? "bg-blue-100" : "bg-orange-100"}`}
                    >
                      {saldo >= 0 ? (
                        <TrendingUp
                          className={`h-6 w-6 ${saldo >= 0 ? "text-blue-600" : "text-orange-600"}`}
                        />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-orange-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Card */}
            <Card className="border-0 bg-background shadow-lg backdrop-blur-sm">
              <CardHeader className="rounded-t-lg bg-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Ingresos vs Egresos por Fecha
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text flex items-center justify-center p-6">
                {datosGrafico().length > 0 ? (
                  <ResponsiveContainer width="95%" height={500}>
                    <BarChart
                      data={datosGrafico()}
                      margin={{ top: 20, right: 30, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />

                      <XAxis
                        dataKey="fecha"
                        className="text-text"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tick={{ fontSize: 6 }}
                        className="text-text m-2"
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="ingresos"
                        fill="#10b981"
                        color="#10b981"
                        name="Ingresos"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="egresos"
                        fill="#ef4444"
                        name="Egresos"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-text mb-4">
                      <BarChart className="mx-auto h-12 w-12" />
                    </div>
                    <p className="text-text">
                      No hay datos para mostrar en el rango seleccionado
                    </p>
                    <p className="text-text mt-2 text-sm">
                      Intenta ajustar los filtros de fecha o selecciona otra
                      cuenta
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
        {cuenta && <IngresoBarChart ingresos={cuenta.ingresos} />}
      </div>
    </div>
  );
}
