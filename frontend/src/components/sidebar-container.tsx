import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { SidebarLinks } from '@/components/sidebar-links';
import AcmeLogo from '@/components/acme-logo';

export const SidebarContainer = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton className="inline-flex items-center gap-3 py-6 px-2 cursor-default hover:bg-transparent active:bg-transparent">
          <AcmeLogo />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarLinks />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
