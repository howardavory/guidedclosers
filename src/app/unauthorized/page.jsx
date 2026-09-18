import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      <div className="text-center flex flex-col items-center">
        <ShieldAlert className="text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-red-500 font-bold text-3xl mb-2 tracking-widest uppercase">Unauthorized Access</h1>
        <p className="text-gray-400 text-sm max-w-md">
          Your current authorization clearance does not grant access to this sector. 
          Please contact your System Administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
