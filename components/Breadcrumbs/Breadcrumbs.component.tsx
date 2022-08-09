import { Breadcrumb } from 'antd';
import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { breadCrumbsConfig } from './breadcrumbsConfig';

export const Breadcrumbs: FC = () => {
  const { pathname, query } = useRouter();
  const linkPath = pathname.split('/').filter((path) => {
    return path;
  });

  const id = typeof query['id'] === 'string' ? query['id'] : '';
  const pathArray = linkPath.map((path, i) => {
    return {
      breadcrumb: path,
      href: '/' + linkPath.slice(0, i + 1).join('/'),
    };
  });

  let breadCrumbs: Record<string, string> = {
    ...breadCrumbsConfig,
    '[id]': id,
  };

  return (
    <Breadcrumb>
      {pathArray.map((item) => {
        return (
          item.breadcrumb in breadCrumbs && (
            <Breadcrumb.Item key={item.breadcrumb}>
              {item.breadcrumb == '[id]' ? (
                <a>{breadCrumbs[item.breadcrumb]}</a>
              ) : (
                <Link href={item.href}>
                  <a>{breadCrumbs[item.breadcrumb]}</a>
                </Link>
              )}
            </Breadcrumb.Item>
          )
        );
      })}
    </Breadcrumb>
  );
};
