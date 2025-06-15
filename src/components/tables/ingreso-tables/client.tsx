'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { User } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns, IngresoWithRelations } from './columns';
import { Ingreso } from '@prisma/client';
import { CreateIngresoModal } from './create-ingreso-modal';

interface ProductsClientProps {
  data: IngresoWithRelations[];
  userId: string;
}

export const IngresoClient: React.FC<ProductsClientProps> = ({ data, userId }) => {

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Ingresos (${data.length})`}
          description=""
        />
       <CreateIngresoModal userId={userId} />
      </div>
      <Separator />
      <DataTable searchKey="fecha" columns={columns} data={data} />
    </>
  );
};
