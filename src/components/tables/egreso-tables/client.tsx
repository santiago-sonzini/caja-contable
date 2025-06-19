'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { EgresoWithRelations, columns } from './columns';
import { CreateEgresoModal } from './create-egreso-modal';


interface ProductsClientProps {
  data: EgresoWithRelations[];
  userId: string;
  adminId: string | null;
}

export const EgresoClient: React.FC<ProductsClientProps> = ({ data, userId, adminId }) => {

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Egresos (${data.length})`}
          description=""
        />
       <CreateEgresoModal userId={userId} adminId={adminId} />
      </div>
      <Separator />
      <DataTable searchKey="fecha" columns={columns} data={data} />
    </>
  );
};
