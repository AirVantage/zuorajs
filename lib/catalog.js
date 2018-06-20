const _ = require('lodash');

/**
 * @typedef {object} Product
 * @todo stuff needed to describe Product model ...
 */

/**
 * @typedef {Array.<Product>} ProductCatalogModel
 */

/**
 * @interface ProductCatalogCache
 * @property {function: (function(): Promise<ProductCatalogModel>) get
 * @property (function(productCatalogModel): Promise<ProductCatalogModel>)} set
 */

/**
 * @implements ProductCatalogCache
 */
class InMemoryCache {
  constructor() {
    this.productCatalogModel = null;
  }

  async get() {
    return this.productCatalogModel;
  }

  async set(productCatalogModel) {
    this.productCatalogModel = productCatalogModel;
    return productCatalogModel;
  }
}

/**
 * @param {object} zuoraClient
 * @param {ProductCatalogCache} productCatalogCache
 * @returns {{get: (function(): Promise<ProductCatalogModel>)}}
 */
module.exports = (zuoraClient, productCatalogCache) => {
  const cache = (productCatalogCache || new InMemoryCache());

  const getCatalogPage = (url) => zuoraClient.getObject(url);

  const accumulateCatalogProducts = (url, catalogProductsModel) => getCatalogPage(url)
    .then((page) => {
      const { nextPage, products } = page;
      const accumulatedCatalogProductsModel = catalogProductsModel.concat(products);

      if (nextPage) {
        return accumulateCatalogProducts(nextPage, accumulatedCatalogProductsModel);
      }

      return accumulatedCatalogProductsModel;
    });

  const cacheFill = async () => {
    const productCatalogModel = await accumulateCatalogProducts('/catalog/products', []);
    return cache.set(productCatalogModel);
  };

  const getCatalogProductsModel = async () => {
    const cached = await cache.get();
    const cacheResult = cached || await cacheFill();
    return _.cloneDeep(cacheResult);
  };

  return {
    get: () => getCatalogProductsModel(),
  };
};
