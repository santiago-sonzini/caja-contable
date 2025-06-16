import CuentasPage from '@/components/pages/cuentas';
import { getCuentas } from '../actions/cuentas';
import Header from '@/components/layout/header';

export default async function Page() {
  const { data } = await getCuentas();
  return <>
  <Header />
  <CuentasPage cuentasServer={data || []} />
  </>;
}