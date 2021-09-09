import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import resets from "../styles/resets.css?inline";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnSupport extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(layouts),
      unsafeCSS(slides),
      css`
        figure img {
          height: 100%;
        }

        .column figure {
          max-width: 90%;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>WebAuthn - Platform support</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/web-authn-support.png" alt="Devices" />
            <ficaption>
              <a href="https://www.freepik.com/vectors/technology">Technology vector created by stories</a>
            </ficaption>
          </figure>
        </aside>
        <section class="column">
          <figure>
            <img src="/images/platform-support.png" alt="WebAuthn platform support" />
            <ficaption
              ><a href="https://webauthn.me/browser-support" target="_blank">Browser platform support</a></ficaption
            >
          </figure>
          <figure>
            <img src="/images/roaming-support.png" alt="WebAuthn roaming support" />
            <ficaption
              ><a href="https://webauthn.me/browser-support" target="_blank">Browser roaming support</a></ficaption
            >
          </figure>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Add a new device
    `;
  }
}

customElements.define("presentation-web-authn-support", WebAuthnSupport);
