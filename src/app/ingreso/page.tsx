import BreadCrumb from '@/components/breadcrumb';
import { IngresoClient } from '@/components/tables/ingreso-tables/client';
import { getIngresos } from '../actions/ingresos';

const breadcrumbItems = [{ title: 'Ingresos', link: '/ingreso' }];
export default async function page() {
  const res = await getIngresos();
  console.log("🚀 ~ page ~ res:", res)
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <IngresoClient data={res.data || []} />
      </div>
    </>
  );
}
