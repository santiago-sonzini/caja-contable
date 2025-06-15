import BreadCrumb from '@/components/breadcrumb';
import { IngresoClient } from '@/components/tables/ingreso-tables/client';
import { getIngresos } from '../actions/ingresos';
import getUserServer from '@/lib/supabase';
import { redirect } from 'next/navigation';

const breadcrumbItems = [{ title: 'Ingresos', link: '/ingreso' }];
export default async function page() {
  const res = await getIngresos();
  const user = await getUserServer();

  if (!user) {
    redirect("/auth/signin");
  }

  console.log("🚀 ~ page ~ res:", res)
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <IngresoClient userId={user.id} data={res.data || []} />
      </div>
    </>
  );
}
