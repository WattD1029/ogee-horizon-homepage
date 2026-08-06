import { RecentlyViewed } from '@theme/recently-viewed-products';
import { sectionRenderer } from '@theme/section-renderer';

class RecentlyViewedProductsSection extends HTMLElement {
  connectedCallback() {
    this.viewport = this.querySelector('[data-recently-viewed-viewport]');
    this.status = this.querySelector('[data-recently-viewed-status]');
    this.maxProducts = this.parseMaxProducts();
    this.renderSectionIds = this.getRenderSectionIds();
    this.currentProductId = this.dataset.currentProductId || '';

    if (!this.viewport || this.dataset.loaded === 'true') return;

    this.loadRecentlyViewed();
  }

  async loadRecentlyViewed() {
    const productIds = this.getProductIds();

    if (productIds.length === 0 && this.hasServerRenderedProducts()) {
      this.showServerRenderedProducts();
      return;
    }

    try {
      let renderedContent = await this.getRenderedContent(this.getRenderUrl(productIds));
      let renderedViewport = renderedContent?.viewport;
      let productCount = renderedContent?.productCount || 0;

      if ((!renderedViewport || productCount === 0) && productIds.length > 0) {
        renderedContent = await this.getRenderedContent(this.getFallbackRenderUrl());
        renderedViewport = renderedContent?.viewport;
        productCount = renderedContent?.productCount || 0;
      }

      if (!renderedViewport || productCount === 0) {
        if (this.hasServerRenderedProducts()) {
          this.showServerRenderedProducts();
          return;
        }

        this.hide();
        return;
      }

      this.viewport.replaceChildren(...Array.from(renderedViewport.childNodes));
      this.dataset.loaded = 'true';
      this.dataset.productCount = String(productCount);
      this.hidden = false;

      if (this.status) {
        this.status.textContent = '';
      }
    } catch (error) {
      if (this.hasServerRenderedProducts()) {
        this.showServerRenderedProducts();
        return;
      }

      this.hide();
    }
  }

  getRenderUrl(productIds) {
    if (productIds.length === 0) {
      return this.getFallbackRenderUrl();
    }

    const url = new URL(Theme.routes.search_url, window.location.origin);
    url.searchParams.set('q', productIds.map((id) => `id:${id}`).join(' OR '));
    url.searchParams.set('resources[type]', 'product');

    return url;
  }

  getFallbackRenderUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    return url;
  }

  getProductIds() {
    let viewedProducts = [];

    try {
      viewedProducts = RecentlyViewed.getProducts();
    } catch (error) {
      RecentlyViewed.clearProducts();
      return [];
    }

    const uniqueProductIds = [];

    for (const productId of viewedProducts) {
      const normalizedId = String(productId);

      if (!/^\d+$/.test(normalizedId)) continue;
      if (normalizedId === this.currentProductId) continue;
      if (uniqueProductIds.includes(normalizedId)) continue;

      uniqueProductIds.push(normalizedId);

      if (uniqueProductIds.length >= this.maxProducts) break;
    }

    return uniqueProductIds;
  }

  async getRenderedContent(url) {
    for (const sectionId of this.renderSectionIds) {
      const sectionHTML = await sectionRenderer.getSectionHTML(sectionId, false, url);
      const parsedSection = new DOMParser().parseFromString(sectionHTML, 'text/html');
      const renderedSection = parsedSection.querySelector('[data-recently-viewed-section]');
      const renderedViewport = renderedSection?.querySelector('[data-recently-viewed-viewport]');
      const productCount = Number.parseInt(renderedSection?.dataset.productCount || '0', 10);

      if (renderedViewport && productCount > 0) {
        return {
          productCount,
          viewport: renderedViewport,
        };
      }
    }

    return null;
  }

  getRenderSectionIds() {
    const sectionIds = [this.dataset.renderSectionId, this.dataset.fallbackSectionId || 'recently-viewed-products'];

    return sectionIds.filter((sectionId, index) => sectionId && sectionIds.indexOf(sectionId) === index);
  }

  parseMaxProducts() {
    const maxProducts = Number.parseInt(this.dataset.maxProducts || '4', 10);

    if (Number.isNaN(maxProducts)) return 4;

    return Math.min(Math.max(maxProducts, 1), 4);
  }

  hasServerRenderedProducts() {
    const productCount = Number.parseInt(this.dataset.productCount || '0', 10);

    return !Number.isNaN(productCount) && productCount > 0;
  }

  showServerRenderedProducts() {
    this.hidden = false;
    this.dataset.loaded = 'true';

    if (this.status) {
      this.status.textContent = '';
    }
  }

  hide() {
    this.hidden = true;
    this.dataset.loaded = 'false';
    this.dataset.productCount = '0';
  }
}

if (!customElements.get('recently-viewed-products')) {
  customElements.define('recently-viewed-products', RecentlyViewedProductsSection);
}
