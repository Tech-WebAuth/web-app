import { LitElement, html, unsafeCSS } from "lit";
import { connectToBroadcastChannel } from "./utils/network";
import "./utils/puck";
import { Router } from "@vaadin/router";
import resets from "./styles/resets.css?inline";
import presentation from "./styles/presentation.css?inline";

export const routes = [
  {
    name: "index",
    path: "/",
    redirect: "/presentation/cover",
  },
  {
    name: "cover",
    path: "/cover",
    component: "presentation-cover",
    action: () => import("./slides/cover"),
  },
  {
    name: "agenda",
    path: "/agenda",
    component: "presentation-agenda",
    action: () => import("./slides/agenda"),
  },
  {
    name: "authentication",
    path: "/authentication",
    component: "presentation-authentication",
    action: () => import("./slides/authentication"),
  },
  {
    name: "authentication-how",
    path: "/authentication-how",
    component: "presentation-authentication-how",
    action: () => import("./slides/authentication-how"),
  },
  {
    name: "authentication-challenges",
    path: "/authentication-challenges",
    component: "presentation-authentication-challenges",
    action: () => import("./slides/authentication-challenges"),
  },
  {
    name: "web-authn-introduction",
    path: "/web-authn-introduction",
    component: "presentation-web-authn-introduction",
    action: () => import("./slides/web-authn-introduction"),
  },
  {
    name: "web-authn-asymmetric-cryptography",
    path: "/web-authn-asymmetric-cryptography",
    component: "presentation-web-authn-asymmetric-cryptography",
    action: () => import("./slides/web-authn-asymmetric-cryptography"),
  },
  {
    name: "web-authn-ceremonies",
    path: "/web-authn-ceremonies",
    component: "presentation-web-authn-ceremonies",
    action: () => import("./slides/web-authn-ceremonies"),
  },
  {
    name: "web-authn-register",
    path: "/web-authn-register",
    component: "presentation-web-authn-register",
    action: () => import("./slides/web-authn-register"),
  },
  {
    name: "web-authn-authentication",
    path: "/web-authn-authentication",
    component: "presentation-web-authn-authentication",
    action: () => import("./slides/web-authn-authentication"),
  },
  {
    name: "web-authn-recover",
    path: "/web-authn-recover",
    component: "presentation-web-authn-recover",
    action: () => import("./slides/web-authn-recover"),
  },
  {
    name: "web-authn-add-new",
    path: "/web-authn-add-new",
    component: "presentation-web-authn-add-new",
    action: () => import("./slides/web-authn-add-new"),
  },
  {
    name: "web-authn-demo-time",
    path: "/web-authn-demo-time",
    component: "presentation-web-authn-demo-time",
    action: () => import("./slides/web-authn-demo-time"),
  },
  {
    name: "web-authn-resources",
    path: "/web-authn-resources",
    component: "presentation-web-authn-resources",
    action: () => import("./slides/web-authn-resources"),
  },
  {
    name: "web-authn-support",
    path: "/web-authn-support",
    component: "presentation-web-authn-support",
    action: () => import("./slides/web-authn-support"),
  },
  {
    name: "try-it-out",
    path: "/try-it-out",
    component: "presentation-try-it-out",
    action: () => import("./slides/try-it-out"),
  },
];

class PresentationApp extends LitElement {
  constructor() {
    super();

    this.isDarkTheme = window.localStorage.getItem("theme") === "dark";
    window.addEventListener("theme-changed", ({ detail: { theme } }) => (this.isDarkTheme = theme === "dark"));
    this._keyUpListener = this._onKeyUp.bind(this);
  }

  static get properties() {
    return {
      isDarkTheme: Boolean,
    };
  }

  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(presentation)];
  }

  connectedCallback() {
    super.connectedCallback();
    this._broadcastChannel = connectToBroadcastChannel("presentation");
    this.onfullscreenchange = this._onFullscreen.bind(this);
    this.onwebkitfullscreenchange = this._onFullscreen.bind(this);
    window.addEventListener("keyup", this._keyUpListener);
  }

  render() {
    return html`
      <slot></slot>
      <footer>
        <img ?hidden="${!this.isDarkTheme}" loading="lazy" src="/images/ing-logo-dark.svg" alt="ING logo" />
        <img ?hidden="${this.isDarkTheme}" loading="lazy" src="/images/ing-logo-bright.svg" alt="ING logo" />
      </footer>
    `;
  }

  disconnectedCallback() {
    window.removeEventListener("keyup", this._keyUpListener);

    this._broadcastChannel.close();
    super.disconnectedCallback();
  }

  _onKeyUp(event) {
    const { code, altKey, ctrlKey } = event;

    if (!["ArrowLeft", "ArrowRight", "F11", "KeyP", "KeyF", "KeyR"].includes(code)) return;
    const currentSlide = this.location.pathname.replace("/presentation", "");
    const routeIndex = routes.findIndex((r) => r.path === currentSlide);

    if (code === "ArrowLeft" && routeIndex > 0) {
      Router.go(`/presentation${routes[routeIndex - 1].path}`);
    }

    if (code === "ArrowRight" && routeIndex < routes.length - 1) {
      Router.go(`/presentation${routes[routeIndex + 1].path}`);
    }

    if (code === "F11" || (code === "KeyF" && ctrlKey && altKey)) {
      event.preventDefault();
      document.fullscreenElement ? document.exitFullscreen() : this.requestFullscreen();
    }

    if (code === "KeyP" && altKey && ctrlKey) {
      this._connectPuckJS();
    }

    if (code === "KeyR" && altKey && ctrlKey) {
      this._resetPuckJS();
    }
  }

  _onFullscreen() {
    if (document.fullscreenElement || document.webkitfullscreenElement) {
      this._broadcastChannel?.postMessage("entered-fullscreen");
    } else {
      this._broadcastChannel?.postMessage("exited-fullscreen");
    }
  }

  _connectPuckJS() {
    Puck.connect((connection) => {
      if (!connection) {
        return alert("Could not connect to device!");
      }

      connection.write(`
        reset();
        let ledTimeout;

        function press() {
          if (ledTimeout) {
            clearTimeout(ledTimeout);
          }

          const data = {};
          const movement = Puck.accel();
          if (movement.acc.z < 0) {
            LED1.set();
            LED2.reset();
            data.d = 'prev';
          } else {
            LED2.set();
            LED1.reset();
            data.d = 'next'
          }

          Bluetooth.write(JSON.stringify(data));

          ledTimeout = setTimeout(() => {
            LED1.reset();
            LED2.reset();
          }, 100);
        }

        setWatch(press, BTN, { repeat: true, debounce: 100 });
      `);

      connection.on("data", (data) => {
        if (!data || !data.startsWith("{")) {
          return;
        }

        const keyMap = {
          next: "ArrowRight",
          prev: "ArrowLeft",
        };

        try {
          const { d } = JSON.parse(data);

          window.dispatchEvent(new KeyboardEvent("keyup", { code: keyMap[d] }));
        } catch (e) {
          return;
        }
      });
    });
  }

  _resetPuckJS() {
    Puck.connect((connection) => {
      if (!connection) {
        return alert("Could not connect to device!");
      }

      connection.write(`reset();`);

      setTimeout(() => connection.close(), 2000);
    });
  }
}

customElements.define("presentation-app", PresentationApp);
