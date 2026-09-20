import { checkUserCount } from '@/actions/auth';
import BootstrapAdmin from './components/BootstrapAdmin';
import ProductionLogin from './components/ProductionLogin';

export default async function LoginPage() {
  const userCount = await checkUserCount();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4 relative overflow-hidden">
      {userCount === 0 ? <BootstrapAdmin /> : <ProductionLogin />}
    </div>
  );
}
