interface FloatingButtonController {
  setActive: (active: boolean) => void;
  setVisible: (visible: boolean) => void;
}

const HOST_ID = 'webreader-ai-floating-host';

export const mountFloatingButton = (onOpen: () => void): FloatingButtonController => {
  const existingHost = document.getElementById(HOST_ID);
  existingHost?.remove();

  const host = document.createElement('div');
  host.id = HOST_ID;
  const shadowRoot = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
    }

    .wr-fab {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 40px;
      height: 40px;
      border: 0;
      border-radius: 999px;
      background: rgba(17, 24, 39, 0.72);
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.24);
      backdrop-filter: blur(10px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font: 600 18px/1 'Segoe UI', Roboto, sans-serif;
      transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
      opacity: 0.72;
      z-index: 2147483647;
    }

    .wr-fab:hover {
      opacity: 1;
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 16px 36px rgba(129, 62, 251, 0.35);
    }

    .wr-fab--active {
      background: linear-gradient(135deg, #0078d4, #813efb);
      animation: wr-pulse 1.4s ease-in-out infinite;
    }

    .wr-fab[hidden] {
      display: none;
    }

    @keyframes wr-pulse {
      0%,
      100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
  `;

  const button = document.createElement('button');
  button.className = 'wr-fab';
  button.type = 'button';
  button.title = '打开 WebReader AI 侧边栏';
  button.setAttribute('aria-label', '打开 WebReader AI 侧边栏');
  button.textContent = 'AI';
  button.addEventListener('click', onOpen);

  shadowRoot.append(style, button);
  document.documentElement.append(host);

  return {
    setActive(active: boolean) {
      button.classList.toggle('wr-fab--active', active);
    },
    setVisible(visible: boolean) {
      button.hidden = !visible;
    }
  };
};
