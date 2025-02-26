import { Building2 } from 'lucide-react';

export default function AcmeLogo() {
  return (
    <>
      <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">ACME</span>
        <span className="text-xs text-muted-foreground">Industries</span>
      </div>
    </>
  );
}
