/**
 * Close Card — v1.0.0
 * Mushroom-stijl kaart met icoon, naam en sluitknop.
 * Sluitknop navigeert naar een instelbaar pad.
 *
 * Configuratie:
 *   type: custom:close-card
 *   icon: mdi:speaker
 *   name: Sonos
 *   navigate: /lovelace/home
 */

const VERSION = '1.0.0';

/* ══════════════════════════════════════════════════
   KAART
   ══════════════════════════════════════════════════ */

class CloseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass  = null;
    this._config = null;
  }

  static getConfigElement() { return document.createElement('close-card-editor'); }
  static getStubConfig() {
    return { icon: 'mdi:speaker', name: 'Sonos', navigate: '/lovelace/home' };
  }

  getCardSize() { return 1; }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _navigate() {
    const path = this._config?.navigate;
    if (!path) return;
    history.pushState(null, '', path);
    window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true }));
  }

  _render() {
    if (!this._config) return;
    const { icon = 'mdi:speaker', name = '' } = this._config;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }

        ha-card {
          display: flex;
          align-items: center;
          padding: 0 8px 0 12px;
          height: 56px;
          box-sizing: border-box;
          border-radius: 12px;
          gap: 12px;
        }

        /* Icoon cirkel — mushroom stijl */
        .icon-wrap {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(var(--rgb-primary-color, 3,169,244), 0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .icon-wrap ha-icon {
          --mdc-icon-size: 20px;
          color: var(--primary-color);
          display: flex;
        }

        /* Naam */
        .name {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Sluitknop */
        .close-btn {
          width: 32px; height: 32px;
          border: none; background: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          color: var(--secondary-text-color);
          flex-shrink: 0;
          --mdc-icon-size: 18px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          transition: background .15s, color .15s;
        }
        .close-btn:hover {
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
        }
        .close-btn:active {
          background: rgba(var(--rgb-primary-color, 3,169,244), 0.12);
        }
      </style>

      <ha-card>
        <div class="icon-wrap">
          <ha-icon icon="${icon}"></ha-icon>
        </div>
        <span class="name">${name}</span>
        <button class="close-btn" id="close" title="Sluiten">
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </ha-card>
    `;

    this.shadowRoot.getElementById('close').addEventListener('click', () => this._navigate());
  }
}

customElements.define('close-card', CloseCard);


/* ══════════════════════════════════════════════════
   EDITOR
   ══════════════════════════════════════════════════ */

class CloseCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass   = null;
    this._ready  = false;
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    this.querySelectorAll('ha-icon-picker').forEach(p => { p.hass = hass; });
    if (first) this._init();
  }

  setConfig(config) {
    this._config = { ...config };
    if (!this._ready) return;

    // Nooit re-renderen — alleen waarden stil bijwerken zodat focus behouden blijft
    const iconPicker = this.querySelector('ha-icon-picker');
    if (iconPicker) iconPicker.value = this._config.icon || '';

    ['name', 'navigate'].forEach(field => {
      const input = this.querySelector(`input[data-field="${field}"]`);
      if (input && input !== document.activeElement) {
        input.value = this._config[field] || '';
      }
    });
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this._config } },
      bubbles: true, composed: true,
    }));
  }

  async _init() {
    if (window.loadCardHelpers) await window.loadCardHelpers();
    await customElements.whenDefined('ha-icon-picker');
    this._ready = true;
    this._render();
  }

  _render() {
    if (!this._hass || !this._ready) return;
    const cfg = this._config;

    this.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        .row { margin-bottom: 16px; }
        .label {
          display: block; font-size: 12px; font-weight: 500;
          letter-spacing: .06em; text-transform: uppercase;
          color: var(--secondary-text-color); margin-bottom: 6px;
        }
        input[type=text] {
          width: 100%; padding: 8px 10px;
          border: 1px solid var(--divider-color, #ddd); border-radius: 8px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color); font-size: 14px;
        }
        input[type=text]:focus { outline: none; border-color: var(--primary-color); }
        .hint { font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; }
      </style>

      <div class="row">
        <label class="label">Icoon</label>
        <div id="icon-slot"></div>
      </div>

      <div class="row">
        <label class="label">Naam</label>
        <input type="text" data-field="name"
               placeholder="bijv. Sonos" value="${cfg.name || ''}">
      </div>

      <div class="row">
        <label class="label">Navigatie pad (sluitknop)</label>
        <input type="text" data-field="navigate"
               placeholder="bijv. /lovelace/home" value="${cfg.navigate || ''}">
        <p class="hint">Het pad waar naartoe genavigeerd wordt bij het sluiten.</p>
      </div>
    `;

    // HA icon picker
    const iconSlot = this.querySelector('#icon-slot');
    const iconPicker = document.createElement('ha-icon-picker');
    iconPicker.hass  = this._hass;
    iconPicker.value = cfg.icon || '';
    iconPicker.style.cssText = 'display:block;width:100%';
    iconPicker.addEventListener('value-changed', e => {
      this._config.icon = e.detail.value || undefined;
      this._fire();
    });
    iconSlot.appendChild(iconPicker);

    // Tekstvelden
    ['name', 'navigate'].forEach(field => {
      this.querySelector(`input[data-field="${field}"]`).addEventListener('input', e => {
        this._config[field] = e.target.value;
        this._fire();
      });
    });
  }
}

customElements.define('close-card-editor', CloseCardEditor);


/* ══════════════════════════════════════════════════
   REGISTRATIE
   ══════════════════════════════════════════════════ */

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'close-card',
  name:        'Close Card',
  description: 'Mushroom-stijl kaart met icoon, naam en sluitknop die navigeert naar een pad.',
  preview:     true,
});

console.info(
  `%c CLOSE-CARD %c v${VERSION} `,
  'background:#37474f;color:#fff;padding:2px 5px;border-radius:3px 0 0 3px;font-weight:700',
  'background:#eceff1;color:#37474f;padding:2px 5px;border-radius:0 3px 3px 0;font-weight:700'
);
