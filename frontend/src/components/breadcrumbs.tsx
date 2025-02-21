'use client';

/*
This is a rudimentary implementation of a hardcoded, single level breadcrumb nav.
Typically this would be much more complex.
*/

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { routes } from '@/lib/utils';

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const staticRoutes = routes.map(({ url }) => url);

  if (!staticRoutes.some((route: string) => route === pathname)) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {pathname === staticRoutes.at(0)
              ? 'Dashboard'
              : pathname.replace('/', '')}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
