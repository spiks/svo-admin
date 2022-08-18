import { useRouter } from 'next/router';
import { SiderMenuItems } from './SiderMenu.const';

export function useSidebarItemsToHighlight(): [string | undefined, string | undefined] {
  const router = useRouter();
  const highlightCategory = SiderMenuItems.find((it) => router.pathname.startsWith(it.url));
  const highlightCategoryUrl = highlightCategory?.url;
  if (!highlightCategoryUrl) {
    console.error(`Not found sidebar item for ${router.pathname}`);
  }
  const highlightSubcategoryUrl = highlightCategory?.children?.find((it) => router.pathname.startsWith(it.url))?.url;
  return [highlightCategoryUrl, highlightSubcategoryUrl];
}
