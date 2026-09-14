import { Component } from '@theme/component';
import { debounce, prefersReducedMotion } from '@theme/utilities';
import { sectionRenderer } from '@theme/section-renderer';
import { morph } from '@theme/morph';
import { DialogCloseEvent, DialogOpenEvent, DialogComponent } from '@theme/dialog';

const SEARCH_HISTORY_KEY = 'ogee-recent-searches';
const SEARCH_HISTORY_LIMIT = 5;

/**
 * A custom element that allows the user to search for resources available on the store.
 *
 * @typedef {object} Refs
 * @property {HTMLInputElement} searchInput - The search input element.
 * @property {HTMLElement} predictiveSearchResults - The predictive search results container.
 * @property {HTMLElement} resetButton - The reset button element.
 * @property {HTMLFormElement} [form] - The search form.
 * @property {HTMLInputElement} [searchTypeInput] - The active search resource type.
 * @extends {Component<Refs>}
 */
class PredictiveSearchComponent extends Component {
  requiredRefs = ['searchInput', 'predictiveSearchResults', 'resetButton'];

  #controller = new AbortController();

  /** @type {AbortController | null} */
  #activeFetch = null;

  #promptInterval = null;

  /** @returns {DialogComponent | null} */
  get dialog() {
    return this.closest('dialog-component');
  }

  connectedCallback() {
    super.connectedCallback();

    const { dialog } = this;
    const { signal } = this.#controller;

    if (this.refs.searchInput.value.length > 0) {
      this.#showResetButton();
    }

    this.refs.form?.addEventListener('submit', this.#handleSubmit, { signal });
    this.addEventListener('click', this.#handleClick, { signal });

    if (dialog) {
      document.addEventListener('keydown', this.#handleKeyboardShortcut, { signal });
      dialog.addEventListener(DialogCloseEvent.eventName, this.#handleDialogClose, { signal });
      dialog.addEventListener(DialogOpenEvent.eventName, this.#handleDialogOpen, { signal });
    }

    this.#renderRecentSearches();
    this.#startPromptRotation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#controller.abort();
    this.#activeFetch?.abort();
    if (this.#promptInterval) window.clearInterval(this.#promptInterval);
  }

  #handleClick = (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    const resourceTab = target.closest('[data-search-resource-tab]');
    const emptyTab = target.closest('[data-search-empty-tab]');
    const keyword = target.closest('[data-search-keyword]');

    if (resourceTab instanceof HTMLElement) {
      this.#activateTabs('resource', resourceTab.dataset.searchResourceTab || 'product');
      return;
    }

    if (emptyTab instanceof HTMLElement) {
      this.#activateTabs('empty', emptyTab.dataset.searchEmptyTab || 'bestsellers');
      return;
    }

    if (keyword instanceof HTMLElement) {
      const term = keyword.dataset.searchKeyword?.trim();
      if (term) this.#saveSearch(term);
      return;
    }

    const isInteractiveElement =
      target instanceof HTMLButtonElement ||
      target instanceof HTMLAnchorElement ||
      target instanceof HTMLInputElement ||
      target.closest('button, a, input');

    if (!isInteractiveElement) {
      this.refs.searchInput.focus();
    }
  };

  #handleSubmit = () => {
    this.#saveSearch(this.refs.searchInput.value);
  };

  #handleKeyboardShortcut = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.dialog?.toggleDialog();
    }
  };

  #handleDialogClose = () => {
    this.#resetSearch();
  };

  #handleDialogOpen = () => {
    this.#renderRecentSearches();
  };

  onSearchTabKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const currentTab = /** @type {HTMLElement} */ (event.currentTarget);
    const tablist = currentTab.closest('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.indexOf(currentTab);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextTab = /** @type {HTMLElement} */ (tabs[(currentIndex + direction + tabs.length) % tabs.length]);

    event.preventDefault();
    nextTab.click();
    nextTab.focus();
  };

  #activateTabs(group, value) {
    const tabAttribute = group === 'resource' ? 'data-search-resource-tab' : 'data-search-empty-tab';
    const panelAttribute = group === 'resource' ? 'data-search-resource-panel' : 'data-search-empty-panel';

    this.querySelectorAll(`[${tabAttribute}]`).forEach((tab) => {
      const isActive = tab.getAttribute(tabAttribute) === value;
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    this.querySelectorAll(`[${panelAttribute}]`).forEach((panel) => {
      panel.toggleAttribute('hidden', panel.getAttribute(panelAttribute) !== value);
    });

    if (group === 'resource' && this.refs.searchTypeInput) {
      this.refs.searchTypeInput.value = value;
    }
  }

  get #allResultsItems() {
    return /** @type {HTMLElement[]} */ (
      Array.from(
        this.querySelectorAll(
          '.predictive-search-results__queries [ref="resultsItems[]"], ' +
            '.predictive-search-results__wrapper-products .predictive-search-results__card, ' +
            '.predictive-search-results__resource-grid .predictive-search-results__card'
        )
      ).filter((item) => item instanceof HTMLElement && !item.closest('[hidden]'))
    );
  }

  #isKeyboardNavigation = false;

  get #currentIndex() {
    return this.#allResultsItems.findIndex((item) => item.getAttribute('aria-selected') === 'true');
  }

  set #currentIndex(index) {
    const items = this.#allResultsItems;
    if (!items.length) return;

    let activeItem = null;
    items.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.toggleAttribute('aria-selected', isActive);
      item.classList.toggle('keyboard-focus', isActive && this.#isKeyboardNavigation);
      if (isActive) activeItem = item;
    });

    activeItem?.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'nearest' });
    this.refs.searchInput.focus();
  }

  get #currentItem() {
    return this.#allResultsItems[this.#currentIndex];
  }

  onSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.#resetSearch();
      return;
    }

    if (!this.#allResultsItems.length || event.key === 'ArrowLeft' || event.key === 'ArrowRight') return;

    const currentIndex = this.#currentIndex;
    const totalItems = this.#allResultsItems.length;

    switch (event.key) {
      case 'ArrowDown':
        this.#isKeyboardNavigation = true;
        event.preventDefault();
        this.#currentIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        break;
      case 'Tab':
        this.#isKeyboardNavigation = true;
        event.preventDefault();
        this.#currentIndex = event.shiftKey
          ? currentIndex > 0
            ? currentIndex - 1
            : totalItems - 1
          : currentIndex < totalItems - 1
            ? currentIndex + 1
            : 0;
        break;
      case 'ArrowUp':
        this.#isKeyboardNavigation = true;
        event.preventDefault();
        this.#currentIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        break;
      case 'Enter': {
        const singleResultContainer = this.refs.predictiveSearchResults.querySelector('[data-single-result-url]');
        if (singleResultContainer instanceof HTMLElement && singleResultContainer.dataset.singleResultUrl) {
          event.preventDefault();
          this.#saveSearch(this.refs.searchInput.value);
          window.location.href = singleResultContainer.dataset.singleResultUrl;
          return;
        }

        if (this.#currentIndex >= 0) {
          event.preventDefault();
          this.#currentItem?.querySelector('a')?.click();
        } else {
          event.preventDefault();
          const searchUrl = new URL(Theme.routes.search_url, location.origin);
          searchUrl.searchParams.set('q', this.refs.searchInput.value);
          searchUrl.searchParams.set('type', this.refs.searchTypeInput?.value || 'product');
          this.#saveSearch(this.refs.searchInput.value);
          window.location.href = searchUrl.toString();
        }
        break;
      }
    }
  };

  resetSearch = debounce((keepFocus = true) => {
    if (keepFocus) this.refs.searchInput.focus();
    this.#resetSearch();
  }, 100);

  search = debounce((event) => {
    if (!event.inputType) return;

    const searchTerm = this.refs.searchInput.value.trim();
    this.#currentIndex = -1;

    if (!searchTerm.length) {
      this.#resetSearch();
      return;
    }

    this.#showResetButton();
    this.#getSearchResults(searchTerm);
  }, 200);

  #resetScrollPositions() {
    requestAnimationFrame(() => {
      this.refs.predictiveSearchResults.querySelector('.predictive-search-results__inner')?.scrollTo(0, 0);
      this.querySelector('.predictive-search-form__content')?.scrollTo(0, 0);
    });
  }

  async #getSearchResults(searchTerm) {
    if (!this.dataset.sectionId) return;

    const url = new URL(Theme.routes.predictive_search_url, location.origin);
    url.searchParams.set('q', searchTerm);
    url.searchParams.set('resources[type]', 'query,product,page,article');
    url.searchParams.set('resources[limit]', '10');
    url.searchParams.set('resources[limit_scope]', 'each');

    const { predictiveSearchResults } = this.refs;
    predictiveSearchResults.setAttribute('aria-busy', 'true');
    const abortController = this.#createAbortController();

    sectionRenderer
      .getSectionHTML(this.dataset.sectionId, false, url)
      .then((resultsMarkup) => {
        if (!resultsMarkup || abortController.signal.aborted) return;
        morph(predictiveSearchResults, resultsMarkup);
        if (this.refs.searchTypeInput) this.refs.searchTypeInput.value = 'product';
        this.#resetScrollPositions();
      })
      .catch((error) => {
        if (!abortController.signal.aborted) throw error;
      })
      .finally(() => {
        if (!abortController.signal.aborted) predictiveSearchResults.removeAttribute('aria-busy');
      });
  }

  #hideResetButton() {
    this.refs.resetButton.hidden = true;
  }

  #showResetButton() {
    this.refs.resetButton.hidden = false;
  }

  #createAbortController() {
    this.#activeFetch?.abort();
    this.#activeFetch = new AbortController();
    return this.#activeFetch;
  }

  #startPromptRotation() {
    let prompts = [];

    try {
      prompts = JSON.parse(this.dataset.searchPrompts || '[]');
    } catch {
      return;
    }

    if (!Array.isArray(prompts) || prompts.length === 0) return;

    const prefix = this.dataset.searchPromptPrefix || 'Search for';
    let index = 0;
    const updatePrompt = () => {
      if (!this.refs.searchInput.value) {
        this.refs.searchInput.placeholder = `${prefix} ${prompts[index]}`;
      }
      index = (index + 1) % prompts.length;
    };

    updatePrompt();
    if (!prefersReducedMotion()) {
      this.#promptInterval = window.setInterval(updatePrompt, 3000);
    }
  }

  #getSearchHistory() {
    try {
      const value = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
      return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }

  #saveSearch(term) {
    const normalizedTerm = term.trim();
    if (!normalizedTerm) return;

    const history = this.#getSearchHistory().filter((item) => item.toLowerCase() !== normalizedTerm.toLowerCase());
    history.unshift(normalizedTerm);

    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, SEARCH_HISTORY_LIMIT)));
    } catch {
      return;
    }
  }

  #renderRecentSearches() {
    const wrapper = this.querySelector('[data-search-history]');
    const list = wrapper?.querySelector('[data-search-history-list]');
    if (!(wrapper instanceof HTMLElement) || !(list instanceof HTMLElement)) return;

    const history = this.#getSearchHistory();
    wrapper.hidden = history.length === 0;
    list.replaceChildren(
      ...history.map((term) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        const url = new URL(Theme.routes.search_url, location.origin);
        url.searchParams.set('q', term);
        url.searchParams.set('type', 'product');
        link.href = url.toString();
        link.textContent = term;
        link.dataset.searchKeyword = term;
        item.append(link);
        return item;
      })
    );
  }

  #resetSearch = async () => {
    const { predictiveSearchResults, searchInput } = this.refs;
    this.#currentIndex = -1;
    searchInput.value = '';
    this.#hideResetButton();
    if (this.refs.searchTypeInput) this.refs.searchTypeInput.value = 'product';

    const abortController = this.#createAbortController();
    const url = new URL(window.location.href);
    url.searchParams.delete('page');

    const emptySectionMarkup = await sectionRenderer.getSectionHTML('predictive-search-empty', false, url);
    if (abortController.signal.aborted) return;

    const parsedEmptySectionMarkup = new DOMParser()
      .parseFromString(emptySectionMarkup, 'text/html')
      .querySelector('.predictive-search-empty-section');

    if (!parsedEmptySectionMarkup) throw new Error('No empty section markup found');

    morph(predictiveSearchResults, parsedEmptySectionMarkup);
    this.#renderRecentSearches();
    this.#resetScrollPositions();
  };
}

if (!customElements.get('predictive-search-component')) {
  customElements.define('predictive-search-component', PredictiveSearchComponent);
}
