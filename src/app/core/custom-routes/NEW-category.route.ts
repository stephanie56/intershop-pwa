import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { Category } from 'ish-core/models/category/category.model';

import { CustomRoute } from './custom-route';

export function generateCategoryRoute(category: Category) {
  return `/${category.uniqueId}-c`;
}

/**
 * UrlMatcher for category route
 * Defines a specific URL format for the category page
 */
export function categoryRouteMatcher(url: UrlSegment[], _: UrlSegmentGroup, route: Route) {
  if (!route.data) {
    route.data = {};
  }
  route.data.format = '<categoryUniqueId>-c';

  // Format: /<categoryUniqueId>-c
  if (url.length === 1 && url[0].path.endsWith('-c')) {
    const categoryUniqueId = url[0].path.slice(0, -2);
    return {
      posParams: {
        categoryUniqueId: new UrlSegment(categoryUniqueId, {}),
      },
      consumed: url,
    };
  }
}

export const categoryRoute: CustomRoute = {
  matcher: categoryRouteMatcher,
  generateUrl: generateCategoryRoute,
  formats: ['<categoryUniqueId>-c'],
};
