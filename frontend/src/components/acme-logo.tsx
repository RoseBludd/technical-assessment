import { Building2 } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export default function AcmeLogo() {
  return (
    <SidebarMenuButton className="inline-flex items-center gap-3 py-6 px-2 cursor-default hover:bg-transparent active:bg-transparent">
      <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">ACME</span>
        <span className="text-xs text-muted-foreground">Industries</span>
      </div>
    </SidebarMenuButton>
  );
}
