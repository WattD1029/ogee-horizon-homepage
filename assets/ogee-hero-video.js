import { Component } from '@theme/component';
import { SlideshowSelectEvent } from '@theme/events';

/**
 * Controls playback for one video slide without changing slideshow autoplay.
 *
 * @typedef {Object} Refs
 * @property {HTMLVideoElement} [video]
 * @property {HTMLButtonElement} [toggle]
 * @property {HTMLElement} [playIcon]
 * @property {HTMLElement} [pauseIcon]
 *
 * @extends {Component<Refs>}
 */
class OgeeHeroVideoComponent extends Component {
  #slide;
  #slideshow;
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  #userPaused = false;
  #selected = false;

  connectedCallback() {
    super.connectedCallback();

    this.#slide = this.closest('slideshow-slide');
    this.#slideshow = this.closest('slideshow-component');
    this.#selected = this.#slide?.getAttribute('aria-hidden') === 'false';

    const { video } = this.refs;
    if (!video) return;

    video.muted = true;
    video.addEventListener('play', this.#handlePlay);
    video.addEventListener('pause', this.#handlePause);
    video.addEventListener('error', this.#handlePlaybackFailure);
    this.#slideshow?.addEventListener(SlideshowSelectEvent.eventName, this.#handleSlideSelect);
    document.addEventListener('visibilitychange', this.#handleVisibilityChange);
    this.#reducedMotion.addEventListener('change', this.#handleReducedMotionChange);

    requestAnimationFrame(() => {
      this.#selected = this.#slide?.getAttribute('aria-hidden') === 'false';
      this.#syncPlayback();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const { video } = this.refs;
    video?.removeEventListener('play', this.#handlePlay);
    video?.removeEventListener('pause', this.#handlePause);
    video?.removeEventListener('error', this.#handlePlaybackFailure);
    this.#slideshow?.removeEventListener(SlideshowSelectEvent.eventName, this.#handleSlideSelect);
    document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
    this.#reducedMotion.removeEventListener('change', this.#handleReducedMotionChange);
  }

  togglePlayback() {
    const { video } = this.refs;
    if (!video) return;

    if (video.paused) {
      this.#userPaused = false;
      this.#play(true);
    } else {
      this.#userPaused = true;
      video.pause();
    }
  }

  /**
   * @param {SlideshowSelectEvent} event
   */
  #handleSlideSelect = (event) => {
    this.#selected = event.detail.slide === this.#slide;
    this.#syncPlayback();
  };

  #handleVisibilityChange = () => {
    this.#syncPlayback();
  };

  #handleReducedMotionChange = () => {
    this.#syncPlayback();
  };

  #syncPlayback() {
    const { video } = this.refs;
    if (!video) return;

    if (!this.#selected || document.hidden || this.#userPaused || this.#reducedMotion.matches) {
      video.pause();
      return;
    }

    this.#play(false);
  }

  /**
   * @param {boolean} userInitiated
   */
  async #play(userInitiated) {
    const { video } = this.refs;
    if (!video) return;
    if (!userInitiated && (!this.#selected || document.hidden || this.#reducedMotion.matches)) return;

    video.muted = true;

    try {
      await video.play();
    } catch {
      this.#handlePlaybackFailure();
    }
  }

  #handlePlay = () => {
    const { toggle, playIcon, pauseIcon } = this.refs;
    if (!toggle || !playIcon || !pauseIcon) return;

    this.setAttribute('playing', '');
    toggle.setAttribute('aria-label', toggle.dataset.pauseLabel || 'Pause video');
    playIcon.hidden = true;
    pauseIcon.hidden = false;
  };

  #handlePause = () => {
    const { toggle, playIcon, pauseIcon } = this.refs;
    if (!toggle || !playIcon || !pauseIcon) return;

    this.removeAttribute('playing');
    toggle.setAttribute('aria-label', toggle.dataset.playLabel || 'Play video');
    playIcon.hidden = false;
    pauseIcon.hidden = true;
  };

  #handlePlaybackFailure = () => {
    this.refs.video?.pause();
    this.#handlePause();
  };
}

if (!customElements.get('ogee-hero-video-component')) {
  customElements.define('ogee-hero-video-component', OgeeHeroVideoComponent);
}
