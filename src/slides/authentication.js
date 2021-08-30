import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import resets from "../styles/resets.css?inline";
import slides from "../styles/slides.css?inline";

class Authentication extends PresentationPageTemplate {
  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>Authentication - Introduction</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/authentication.png" alt="Authentication process" />
            <ficaption>
              <a href="https://www.freepik.com/vectors/security"
                >Security vector created by stories - www.freepik.com</a
              >
            </ficaption>
          </figure>
        </aside>
        <blockquote>Authentication is the <b>act of validating that users are whom they claim to be</b>.</blockquote>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      Authentication - Introduction

      Some general notes about authentication
      Explain why authentication is needed
    `;
  }
}

customElements.define("presentation-authentication", Authentication);
