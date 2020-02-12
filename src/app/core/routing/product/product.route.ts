import { UrlMatchResult, UrlSegment } from '@angular/router';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { generateLocalizedCategorySlug } from 'ish-core/routing/category/category.route';

function generateProductSlug(product: ProductView) {
  return product && product.name ? product.name.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+$/g, '') : undefined;
}

export const productRouteFormat = new RegExp('^/(.*)?sku(.*?)(-cat(.*))?$');

export function matchProductRoute(segments: UrlSegment[]): UrlMatchResult {
  const url = '/' + segments.join('/');
  if (productRouteFormat.test(url)) {
    const match = productRouteFormat.exec(url);
    const posParams: { [id: string]: UrlSegment } = {};
    if (match[4]) {
      posParams.categoryUniqueId = new UrlSegment(match[4], {});
    }
    if (match[2]) {
      posParams.sku = new UrlSegment(match[2], {});
    }
    return {
      consumed: [],
      posParams,
    };
  }
  return;
}

export function generateProductUrl(product: ProductView, category?: CategoryView): string {
  const contextCategory = category || (product && product.defaultCategory());

  if (!(product && product.sku)) {
    return '/';
  }

  let route = '/';

  if (contextCategory) {
    route += generateLocalizedCategorySlug(contextCategory);
    route += '/';
  }

  if (product.name) {
    route += `${generateProductSlug(product)}-`;
  }

  route += `sku${product.sku}`;

  if (contextCategory) {
    route += `-cat${contextCategory.uniqueId}`;
  }

  return route;
}
