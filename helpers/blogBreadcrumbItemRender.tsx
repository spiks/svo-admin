import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import Link from 'next/link';

export const blogBreadcrumbItemRender = (route: Route, params: any, routes: Route[]) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? <span>{route.breadcrumbName}</span> : <Link href={'/content/blog'}>{route.breadcrumbName}</Link>;
};
