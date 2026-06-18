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
  #playRetry;
  #playAttempts = 0;

  connectedCallback() {
    super.connectedCallback();

    this.#slide = this.closest('slideshow-slide');
    this.#slideshow = this.closest('slideshow-component');
    this.#selected = this.#slide?.getAttribute('aria-hidden') === 'false';

    const { video } = this.refs;
    if (!video) return;

    this.#configureVideo();
    video.addEventListener('play', this.#handlePlay);
    video.addEventListener('pause', this.#handlePause);
    video.addEventListener('canplay', this.#handleCanPlay);
    video.addEventListener('loadeddata', this.#handleCanPlay);
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
    window.clearTimeout(this.#playRetry);
    video?.removeEventListener('play', this.#handlePlay);
    video?.removeEventListener('pause', this.#handlePause);
    video?.removeEventListener('canplay', this.#handleCanPlay);
    video?.removeEventListener('loadeddata', this.#handleCanPlay);
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

  #handleCanPlay = () => {
    this.#syncPlayback();
  };

  #syncPlayback() {
    const { video } = this.refs;
    if (!video) return;

    if (!this.#selected || document.hidden || this.#reducedMotion.matches) {
      window.clearTimeout(this.#playRetry);
      this.#playAttempts = 0;
      video.pause();
      return;
    }

    this.#play();
  }

  #configureVideo() {
    const { video } = this.refs;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.controls = false;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.removeAttribute('controls');
  }

  async #play() {
    const { video } = this.refs;
    if (!video) return;
    if (!this.#selected || document.hidden || this.#reducedMotion.matches) return;

    this.#configureVideo();

    if (video.readyState < HTMLMediaElement.HAVE_METADATA && video.networkState === HTMLMediaElement.NETWORK_EMPTY) {
      video.load();
    }

    try {
      await video.play();
    } catch {
      window.clearTimeout(this.#playRetry);
      if (this.#playAttempts >= 3) {
        this.#handlePlaybackFailure();
        return;
      }

      this.#playAttempts += 1;
      this.#playRetry = window.setTimeout(() => this.#play(), 500);
    }
  }

  #handlePlay = () => {
    window.clearTimeout(this.#playRetry);
    this.#playAttempts = 0;
    this.setAttribute('playing', '');
  };

  #handlePause = () => {
    this.removeAttribute('playing');
  };

  #handlePlaybackFailure = () => {
    window.clearTimeout(this.#playRetry);
    this.refs.video?.pause();
    this.#handlePause();
  };

  #handleVolumeChange = () => {
    this.#configureVideo();
  };
}

if (!customElements.get('ogee-hero-video-component')) {
  customElements.define('ogee-hero-video-component', OgeeHeroVideoComponent);
}
