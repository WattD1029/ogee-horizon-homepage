import { Component } from '@theme/component';
import { debounce } from '@theme/utilities';

const SEARCH_HISTORY_KEY = 'ogee-recent-searches';
const SEARCH_HISTORY_LIMIT = 5;

/**
 * A custom element that allows the user to clean a search input.
 *
 * @typedef {object} Refs
 * @property {HTMLInputElement} searchPageInput - The search input element.
 * @extends {Component<Refs>}
 */
class SearchPageInputComponent extends Component {
  requiredRefs = ['searchPageInput'];

  connectedCallback() {
    super.connectedCallback();
    this.refs.searchPageInput.form?.addEventListener('submit', this.#storeSearch);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.refs.searchPageInput.form?.removeEventListener('submit', this.#storeSearch);
  }

  handleKeyDown = debounce((event) => {
    const value = this.refs.searchPageInput.value.trim();

    if (event.key === 'Escape' && value === '') {
      this.#submitEmptySearch();
    }
  }, 100);

  #storeSearch = () => {
    const term = this.refs.searchPageInput.value.trim();
    if (!term) return;

    try {
      const stored = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
      const history = Array.isArray(stored) ? stored.filter((item) => typeof item === 'string') : [];
      const nextHistory = history.filter((item) => item.toLowerCase() !== term.toLowerCase());
      nextHistory.unshift(term);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory.slice(0, SEARCH_HISTORY_LIMIT)));
    } catch {
      return;
    }
  };

  #submitEmptySearch() {
    const searchInput = this.refs.searchPageInput;
    searchInput.focus();
    searchInput.value = '';

    if (this.#isEmptyState()) return;
    searchInput.form?.submit();
  }

  #isEmptyState = () => {
    const url = new URL(window.location.href);
    return (url.searchParams.get('q') ?? '').trim() === '';
  };
}

if (!customElements.get('search-page-input-component')) {
  customElements.define('search-page-input-component', SearchPageInputComponent);
}
