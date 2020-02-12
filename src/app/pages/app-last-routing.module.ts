import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';

import { matchCategoryRoute } from 'ish-core/routing/category/category.route';
import { matchProductRoute } from 'ish-core/routing/product/product.route';

const routes: Routes = [
  {
    matcher: matchProductRoute,
    loadChildren: () => import('./product/product-page.module').then(m => m.ProductPageModule),
    canActivate: [MetaGuard],
  },
  {
    matcher: matchCategoryRoute,
    loadChildren: () => import('./category/category-page.module').then(m => m.CategoryPageModule),
    canActivate: [MetaGuard],
  },
  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AppLastRoutingModule {}
