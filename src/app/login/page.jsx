import TestTerminal from './components/TestTerminal';
import ProductionLogin from './components/ProductionLogin';

export default function LoginPage() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4 relative overflow-hidden">
      {isDevelopment ? <TestTerminal /> : <ProductionLogin />}
    </div>
  );
}
