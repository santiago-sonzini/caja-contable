'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoriaIngreso, Ingreso, MetodoPago, Usuario } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

// Tipo extendido para incluir las relaciones
export type IngresoWithRelations = Ingreso & {
  categoria: CategoriaIngreso
  metodoPago: MetodoPago
  usuario: Usuario
}

export const columns: ColumnDef<IngresoWithRelations>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'fecha',
    header: 'FECHA',
    cell: ({ row }) => {
      const fecha = new Date(row.getValue('fecha'));
      return (
        <div className="font-medium">
          {fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </div>
      );
    }
  },
  {
    accessorKey: 'monto',
    header: 'MONTO',
    cell: ({ row }) => {
      const monto = parseFloat(row.getValue('monto'));
      return (
        <div className="font-semibold text-green-600">
          {formatCurrency(monto)}
        </div>
      );
    }
  },
  {
    accessorKey: 'descripcion',
    header: 'DESCRIPCIÓN',
    cell: ({ row }) => {
      const descripcion = row.getValue('descripcion') as string;
      return (
        <div className="max-w-[200px] truncate" title={descripcion}>
          {descripcion}
        </div>
      );
    }
  },
  {
    accessorKey: 'categoria',
    header: 'CATEGORÍA',
    cell: ({ row }) => {
      const categoria = row.original.categoria;
      return (
        <Badge variant="outline">
          {categoria.nombre}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'metodoPago',
    header: 'MÉTODO DE PAGO',
    cell: ({ row }) => {
      const metodoPago = row.original.metodoPago;
      return (
        <Badge variant="secondary">
          {metodoPago.nombre}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'numeroRecibo',
    header: 'N° RECIBO',
    cell: ({ row }) => {
      const numeroRecibo = row.getValue('numeroRecibo') as string;
      return numeroRecibo ? (
        <span className="font-mono text-sm">{numeroRecibo}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    }
  },
  {
    accessorKey: 'usuario',
    header: 'REGISTRADO POR',
    cell: ({ row }) => {
      const usuario = row.original.usuario;
      return (
        <div className="font-medium">
          {usuario.nombre} {usuario.apellido}
        </div>
      );
    }
  },
  {
    accessorKey: 'creadoEn',
    header: 'CREADO',
    cell: ({ row }) => {
      const fecha = new Date(row.getValue('creadoEn'));
      return (
        <div className="text-sm text-gray-500">
          {fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          })} {fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

// Función helper para formatear moneda (agrega esto a tu lib/utils.ts si no existe)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
};