import { CartAddEvent, CartErrorEvent, ThemeEvents } from '@theme/events';

const ERROR_MESSAGE_DISPLAY_DURATION = 10000;

class QuickShopDrawer extends HTMLElement {
  #timeout;

  connectedCallback() {
    this.addEventListener('change', this.#handleChange);
    this.addEventListener('click', this.#handleClick);
    this.addEventListener('submit', this.#handleSubmit, { capture: true });
    this.addEventListener(ThemeEvents.variantUpdate, this.#handleVariantUpdate);
    this.#updateTotal();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.#handleChange);
    this.removeEventListener('click', this.#handleClick);
    this.removeEventListener('submit', this.#handleSubmit, { capture: true });
    this.removeEventListener(ThemeEvents.variantUpdate, this.#handleVariantUpdate);
    if (this.#timeout) clearTimeout(this.#timeout);
  }

  #handleChange = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    if (target.matches('[data-quick-shop-addon]')) {
      this.#updateTotal();
      return;
    }

    if (target.matches('[data-quick-shop-shade-label]')) {
      this.#updateSelectedShade(target);
    }
  };

  #handleClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const tab = target.closest('[data-quick-shop-shade-tab]');
    if (!(tab instanceof HTMLButtonElement)) return;

    const tabs = this.querySelectorAll('[data-quick-shop-shade-tab]');
    for (const item of tabs) {
      const isCurrent = item === tab;
      item.classList.toggle('is-active', isCurrent);
      item.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    }
  };

  #handleSubmit = async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const selectedAddons = this.#selectedAddons;
    if (selectedAddons.length === 0) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const variantId = formData.get('id');
    if (!variantId) return;

    const quantity = Number(formData.get('quantity')) || Number(this.dataset.quantityDefault) || 1;
    const sellingPlan = formData.get('selling_plan');
    const items = [
      {
        id: Number(variantId),
        quantity,
      },
    ];

    if (sellingPlan) items[0].selling_plan = Number(sellingPlan);

    for (const addon of selectedAddons) {
      const addonVariantId = addon.dataset.variantId;
      if (!addonVariantId) continue;

      items.push({
        id: Number(addonVariantId),
        quantity: 1,
      });
    }

    const button = this.querySelector('[ref="addToCartButton"]');
    if (button instanceof HTMLButtonElement) button.disabled = true;

    const payload = {
      items,
      sections: this.#cartSectionIds.join(','),
    };

    try {
      const response = await fetch(Theme.routes.cart_add_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.status) {
        this.#showError(data.message);
        this.dispatchEvent(new CartErrorEvent(form.id, data.message, data.description, data.errors));
        this.dispatchEvent(
          new CartAddEvent({}, form.id, {
            didError: true,
            source: 'quick-shop-drawer',
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            productId: this.dataset.productId,
          })
        );
        return;
      }

      this.#hideError();
      const cart = await this.#fetchCart();
      this.dispatchEvent(
        new CartAddEvent(cart ?? data, form.id, {
          source: 'quick-shop-drawer',
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          productId: this.dataset.productId,
          sections: data.sections,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      if (button instanceof HTMLButtonElement) button.disabled = false;
    }
  };

  #handleVariantUpdate = (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('quick-shop-drawer') !== this) return;

    const html = event.detail?.data?.html;
    const source = html?.querySelector('[data-quick-shop-drawer-content]');
    if (!(source instanceof HTMLElement)) return;

    this.dataset.selectedVariantId = source.dataset.selectedVariantId || '';

    this.#replaceFromSource(source, '[data-quick-shop-primary-image]');
    this.#replaceFromSource(source, '[data-quick-shop-full-set]');
    this.#replaceFromSource(source, '[data-quick-shop-subscription-price]');
    this.#replaceFromSource(source, '[data-quick-shop-footer-price]');
    this.#syncAttributeFromSource(source, '.quick-shop-drawer__details-link', 'href');

    requestAnimationFrame(() => this.#updateTotal());
  };

  #updateSelectedShade(input) {
    const label = input.dataset.quickShopShadeLabel;
    const target = this.querySelector('[data-quick-shop-selected-shade]');
    if (label && target) target.textContent = label;

    const imageUrl = input.dataset.quickShopVariantImage;
    const image = this.querySelector('[data-quick-shop-primary-image] img');
    if (imageUrl && image instanceof HTMLImageElement) {
      image.src = imageUrl;
      image.srcset = '';
    }
  }

  #updateTotal() {
    const price = this.querySelector('[data-quick-shop-footer-price]');
    if (!(price instanceof HTMLElement)) return;

    const basePrice = Number(price.dataset.price) || 0;
    const addonTotal = this.#selectedAddons.reduce((sum, addon) => sum + (Number(addon.dataset.price) || 0), 0);
    price.textContent = this.#formatMoney(basePrice + addonTotal);
  }

  #replaceFromSource(source, selector) {
    const current = this.querySelector(selector);
    const next = source.querySelector(selector);
    if (!current || !next) return;
    current.replaceWith(next.cloneNode(true));
  }

  #syncAttributeFromSource(source, selector, attribute) {
    const current = this.querySelector(selector);
    const next = source.querySelector(selector);
    const value = next?.getAttribute(attribute);
    if (!current || value === null || value === undefined) return;
    current.setAttribute(attribute, value);
  }

  #showError(message) {
    this.#hideError();

    const error = this.querySelector('[ref="addToCartTextError"]');
    if (error instanceof HTMLElement) {
      error.classList.remove('hidden');
      error.append(document.createTextNode(message));
    }

    const liveRegion = this.querySelector('[ref="liveRegion"]');
    if (liveRegion) liveRegion.textContent = message;

    if (this.#timeout) clearTimeout(this.#timeout);
    this.#timeout = window.setTimeout(() => this.#hideError(), ERROR_MESSAGE_DISPLAY_DURATION);
  }

  #hideError() {
    const error = this.querySelector('[ref="addToCartTextError"]');
    if (error instanceof HTMLElement) {
      error.classList.add('hidden');
      for (const node of Array.from(error.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE) node.remove();
      }
    }

    const liveRegion = this.querySelector('[ref="liveRegion"]');
    if (liveRegion) liveRegion.textContent = '';
  }

  async #fetchCart() {
    try {
      const response = await fetch('/cart.js', {
        headers: {
          Accept: 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  #formatMoney(cents) {
    const currency = this.dataset.currencyCode || 'USD';
    return new Intl.NumberFormat(document.documentElement.lang || 'en-US', {
      style: 'currency',
      currency,
    }).format(cents / 100);
  }

  get #selectedAddons() {
    return Array.from(this.querySelectorAll('[data-quick-shop-addon]:checked')).filter(
      (input) => input instanceof HTMLInputElement && !input.disabled
    );
  }

  get #cartSectionIds() {
    return Array.from(document.querySelectorAll('cart-items-component'))
      .map((item) => (item instanceof HTMLElement ? item.dataset.sectionId : ''))
      .filter(Boolean);
  }
}

if (!customElements.get('quick-shop-drawer')) {
  customElements.define('quick-shop-drawer', QuickShopDrawer);
}
