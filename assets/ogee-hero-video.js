import { Component } from '@theme/component';
import { SlideshowSelectEvent } from '@theme/events';

/**
 * Controls playback for one video slide without changing slideshow autoplay.
 *
 * @typedef {Object} Refs
 * @property {HTMLVideoElement} [video]
 *
 * @extends {Component<Refs>}
 */
class OgeeHeroVideoComponent extends Component {
  #slide;
  #slideshow;
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    video.addEventListener('volumechange', this.#handleVolumeChange);
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
    video?.removeEventListener('volumechange', this.#handleVolumeChange);
    this.#slideshow?.removeEventListener(SlideshowSelectEvent.eventName, this.#handleSlideSelect);
    document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
    this.#reducedMotion.removeEventListener('change', this.#handleReducedMotionChange);
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

    if (!this.#selected || document.hidden || this.#reducedMotion.matches) {
      video.pause();
      return;
    }

    this.#play();
  }

  async #play() {
    const { video } = this.refs;
    if (!video) return;
    if (!this.#selected || document.hidden || this.#reducedMotion.matches) return;

    video.muted = true;

    try {
      await video.play();
    } catch {
      this.#handlePlaybackFailure();
    }
  }

  #handlePlay = () => {
    this.setAttribute('playing', '');
  };

  #handlePause = () => {
    this.removeAttribute('playing');
  };

  #handlePlaybackFailure = () => {
    this.refs.video?.pause();
    this.#handlePause();
  };

  #handleVolumeChange = () => {
    const { video } = this.refs;
    if (video) video.muted = true;
  };
}

if (!customElements.get('ogee-hero-video-component')) {
  customElements.define('ogee-hero-video-component', OgeeHeroVideoComponent);
}
