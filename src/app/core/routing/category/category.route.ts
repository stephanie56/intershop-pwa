import { UrlMatchResult, UrlSegment } from '@angular/router';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';

export function generateLocalizedCategorySlug(category: CategoryView) {
  return (
    category &&
    category
      .pathCategories()
      .map(cat => cat.name)
      .filter(x => x)
      .map(name => name.replace(/ /g, '-'))
      .join('/')
  );
}

export const categoryRouteFormat = new RegExp('^/(.*)cat(.*)$');

export function matchCategoryRoute(segments: UrlSegment[]): UrlMatchResult {
  const url = '/' + segments.join('/');
  if (categoryRouteFormat.test(url)) {
    const match = categoryRouteFormat.exec(url);
    const posParams: { [id: string]: UrlSegment } = {};
    if (match[2]) {
      posParams.categoryUniqueId = new UrlSegment(match[2], {});
    }
    return {
      consumed: [],
      posParams,
    };
  }
  return;
}

export function generateCategoryUrl(category: CategoryView): string {
  if (!category) {
    return '/';
  }
  let route = '/';

  route += generateLocalizedCategorySlug(category);

  if (route !== '/') {
    route += '-';
  }

  route += `cat${category.uniqueId}`;

  return route;
}
