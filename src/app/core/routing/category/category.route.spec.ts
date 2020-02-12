import { UrlMatchResult, UrlSegment } from '@angular/router';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { generateCategoryUrl, matchCategoryRoute } from './category.route';

describe('Category Route', () => {
  const specials = { categoryPath: ['Specials'], uniqueId: 'Specials', name: 'Spezielles' } as Category;
  const topSeller = {
    categoryPath: ['Specials', 'Specials.TopSeller'],
    uniqueId: 'Specials.TopSeller',
    name: 'Angebote',
  } as Category;
  const limitedOffer = {
    categoryPath: ['Specials', 'Specials.TopSeller', 'Specials.TopSeller.LimitedOffer'],
    uniqueId: 'Specials.TopSeller.LimitedOffer',
    name: 'Black Friday',
  } as Category;

  expect.addSnapshotSerializer({
    test: val => val && val.consumed && val.posParams,
    print: (val: UrlMatchResult, serialize) =>
      serialize(
        Object.keys(val.posParams)
          .map(key => ({ [key]: val.posParams[key].path }))
          .reduce((acc, v) => ({ ...acc, ...v }), {})
      ),
  });
  // tslint:disable-next-line: no-suspicious-variable-init-in-tests
  const wrap = generated =>
    generated
      .split('/')
      .filter(x => x)
      .map(path => new UrlSegment(path, {}));

  describe('without anything', () => {
    it('should be created', () => {
      expect(generateCategoryUrl(undefined)).toMatchInlineSnapshot(`"/"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(undefined)))).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('with top level category without name', () => {
    const category = createCategoryView(categoryTree([{ ...specials, name: undefined }]), specials.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/catSpecials"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials",
        }
      `);
    });
  });

  describe('with top level category', () => {
    const category = createCategoryView(categoryTree([specials]), specials.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/Spezielles-catSpecials"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials",
        }
      `);
    });
  });

  describe('with deep category', () => {
    const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(
        `"/Spezielles/Angebote/Black-Friday-catSpecials.TopSeller.LimitedOffer"`
      );
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
        }
      `);
    });
  });
});
