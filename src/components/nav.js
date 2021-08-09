import { LitElement, html, unsafeCSS } from "lit";
import links from "../styles/links.css";
import navigations from "../styles/navigations.css";

class AuthNav extends LitElement {
  static get properties() {
    return {
      isLoggedIn: Boolean,
    };
  }

  static get styles() {
    return [unsafeCSS(links), unsafeCSS(navigations)];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", () => {
      this._setActiveLink(window.location.pathname);
    });
  }

  firstUpdated() {
    this._setActiveLink(window.location.pathname);
  }

  render() {
    return html`
      <nav class="nav">
        <ul>
          ${this.isLoggedIn
            ? html`<li><a class="link" href="/dashboard">🎛️ Dashboard</a></li>`
            : html`
                <li><a class="link" href="/login">🔑 Login</a></li>
                <li><a class="link" href="/register">🚪 Register</a></li>
              `}
          <li><a class="link" href="/stats">📈 Stats</a></li>
        </ul>
      </nav>
    `;
  }

  _setActiveLink(path) {
    const links = this.shadowRoot.querySelectorAll("a[href]");
    links.forEach((link) => {
      if (new URL(link.href).pathname === path) link.dataset.active = "";
      else delete link.dataset.active;
    });
  }
}

customElements.define("auth-nav", AuthNav);
