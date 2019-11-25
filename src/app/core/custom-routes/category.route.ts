import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { Category } from 'ish-core/models/category/category.model';

import { CustomRoute } from './custom-route';

export function generateCategoryRoute(category: Category) {
  return '/category/' + category.uniqueId;
}

/**
 * UrlMatcher for category route
 * Defines a specific URL format for the category page
 */
export function categoryRouteMatcher(url: UrlSegment[], _: UrlSegmentGroup, route: Route) {
  if (!route.data) {
    route.data = {};
  }
  route.data.format = 'category/:categoryUniqueId';

  // Format: category/:categoryUniqueId
  if (url[0].path === 'category') {
    return {
      posParams: {
        categoryUniqueId: url[1],
      },
      consumed: url,
    };
  }
}

export const categoryRoute: CustomRoute = {
  matcher: categoryRouteMatcher,
  generateUrl: generateCategoryRoute,
  formats: ['category/:categoryUniqueId'],
};
