# 🎯 RBM Booking Widget

Web Component framework-agnostic per embedding del form di prenotazione.

## 🚀 Quick Start

### Installation

```bash
pnpm install
pnpm build
```

Il build genera `dist/widget.js` pronto per l'embedding.

### Usage

```html
<script type="module" src="https://cdn.example.com/widget.js"></script>

<rbm-booking
  tenant="demo"
  form-id="classic"
  locale="it"
  theme="auto"
  api-url="https://api.example.com"
></rbm-booking>
```

## 📋 Attributes

| Attribute      | Type   | Default  | Required | Description                 |
| -------------- | ------ | -------- | -------- | --------------------------- |
| `tenant`       | string | -        | ✅       | Tenant ID                   |
| `form-id`      | string | -        | ✅       | Form ID da caricare         |
| `locale`       | string | `"it"`   | ❌       | Lingua (it, en, es, fr, de) |
| `theme`        | string | `"auto"` | ❌       | Theme (auto, light, dark)   |
| `color-scheme` | JSON   | -        | ❌       | Custom colors (vedi sotto)  |
| `api-url`      | string | -        | ✅       | Base URL API                |

### Custom Colors

Puoi personalizzare completamente i colori del widget tramite l'attributo `color-scheme`:

```html
<rbm-booking
  color-scheme='{"primary":"#8b5cf6","success":"#10b981"}'
></rbm-booking>
```

#### Variabili CSS disponibili:

```css
--rbm-primary           /* Colore primario */
--rbm-primary-hover     /* Colore primario al hover */
--rbm-secondary         /* Colore secondario */
--rbm-success           /* Colore successo */
--rbm-danger            /* Colore errore */
--rbm-warning           /* Colore warning */
--rbm-info              /* Colore informativo */
--rbm-bg                /* Sfondo principale */
--rbm-surface           /* Sfondo secondario */
--rbm-border            /* Colore bordi */
--rbm-text              /* Colore testo principale */
--rbm-text-secondary    /* Colore testo secondario */
--rbm-radius            /* Border radius */
--rbm-font              /* Font family */
--rbm-font-size         /* Font size base */
```

## 🎪 Events

Il widget emette eventi personalizzati che puoi intercettare:

### `rbm:availability`

Emesso quando l'utente completa il form e richiede la disponibilità.

```javascript
widget.addEventListener("rbm:availability", (e) => {
  console.log("Form data:", e.detail.data);
});
```

### `rbm:booking:created`

Emesso quando la prenotazione è stata creata con successo.

```javascript
widget.addEventListener("rbm:booking:created", (e) => {
  console.log("Booking:", e.detail.booking);
  // { id, confirmationCode, status, ... }
});
```

### `rbm:booking:error`

Emesso quando si verifica un errore.

```javascript
widget.addEventListener("rbm:booking:error", (e) => {
  console.error("Error:", e.detail.error);
});
```

## ♿ Accessibility

Il widget è completamente **WCAG 2.2 AA compliant**:

- ✅ Shadow DOM isolato
- ✅ ARIA labels e live regions
- ✅ Keyboard navigation completa
- ✅ Screen reader friendly
- ✅ Focus indicators visibili
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Minimum touch target size (44x44px)

### Test Accessibilità

```bash
pnpm test:a11y
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Accessibility tests
pnpm test:a11y

# Type checking
pnpm typecheck
```

## 📦 Build

```bash
pnpm build
```

Genera:

- `dist/widget.js` - Bundle ESM minificato
- `dist/widget.css` - Stili embedded nel JS
- `dist/index.d.ts` - Type definitions

### Build Output

- **Size**: ~50KB minificato + gzip
- **Format**: ES Module
- **Browser**: ES2022+ required

## 🔧 Development

```bash
pnpm dev
```

Avvia Vite dev server su `http://localhost:5173`

Apri uno degli esempi:

- `/examples/demo.html` - Demo completo
- `/examples/theme-examples.html` - Varianti tema
- `/examples/iframe-fallback.html` - Embedding via iframe

## 🎨 Theming

### Light Theme

```html
<rbm-booking theme="light"></rbm-booking>
```

### Dark Theme

```html
<rbm-booking theme="dark"></rbm-booking>
```

### Auto Theme (System Preference)

```html
<rbm-booking theme="auto"></rbm-booking>
```

### Custom Palette

```html
<rbm-booking
  theme="light"
  color-scheme='{
    "primary": "#ec4899",
    "bg": "#fdf2f8",
    "surface": "#fce7f3"
  }'
></rbm-booking>
```

## 🌐 Internationalization

Lingue supportate:

- 🇮🇹 Italiano (it) - default
- 🇬🇧 English (en)
- 🇪🇸 Español (es)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)

```html
<rbm-booking locale="en"></rbm-booking>
```

## 📊 Browser Support

| Browser     | Version |
| ----------- | ------- |
| Chrome/Edge | 90+     |
| Firefox     | 88+     |
| Safari      | 14+     |
| Opera       | 76+     |

### Required Features

- ES2022 support
- Custom Elements v1
- Shadow DOM v1
- CSS Custom Properties
- Fetch API

## 🔐 Security

- ✅ No `eval()` usage
- ✅ Content Security Policy compatible
- ✅ XSS protection
- ✅ Input sanitization
- ✅ CORS headers required
- ✅ Timeout on network requests

## 📖 API Integration

### Config Endpoint

```
GET /v1/config?formId={formId}
Headers: X-Tenant-ID: {tenant}
```

### Availability Endpoint

```
POST /v1/availability
Headers: X-Tenant-ID: {tenant}
Body: { date, serviceId, venueId, partySize }
```

### Booking Endpoint

```
POST /v1/bookings
Headers: X-Tenant-ID: {tenant}
Body: { formData, slotId, serviceId, venueId }
```

## 🚀 Deployment

### CDN Deployment

Carica `dist/widget.js` sul tuo CDN:

```html
<script
  type="module"
  src="https://cdn.example.com/widget@1.0.0/widget.js"
></script>
```

### NPM Package

```bash
npm install @rbm/widget
```

```javascript
import "@rbm/widget";
```

### Iframe Fallback

Per CMS con restrizioni JavaScript:

```html
<iframe
  src="https://example.com/widget.html?tenant=demo&formId=classic"
  width="100%"
  height="600"
  frameborder="0"
></iframe>
```

## 🐛 Troubleshooting

### Widget non si carica

Verifica che:

1. Il browser supporti Custom Elements
2. L'URL API sia corretto
3. Il tenant e form-id siano validi

```javascript
// Check custom element registration
console.log(customElements.get("rbm-booking"));

// Check API endpoint
widget.setAttribute("api-url", "http://localhost:3000");
```

### Stili non applicati

1. Verifica che CSS sia iniettato in Shadow DOM
2. Controlla `data-theme` attribute
3. Ispeziona computed styles:

```javascript
const container = widget.shadowRoot.querySelector(".rbm-container");
const styles = getComputedStyle(container);
console.log(styles.getPropertyValue("--rbm-primary"));
```

### Form non valida

1. Controlla schema JSON in `/v1/config`
2. Verifica console per errori di validazione
3. Usa FormValidator direttamente:

```javascript
import { FormValidator } from "@rbm/widget";

const validator = new FormValidator();
const errors = validator.validate(data, schema);
```

## 📚 Riferimenti

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Shadow DOM Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)

## 📄 License

MIT

## 🤝 Contributing

Contributi benvenuti! Per favore:

1. Fork il repository
2. Crea un branch per la feature (`git checkout -b feature/amazing`)
3. Commit i cambiamenti (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing`)
5. Apri una Pull Request

## 📞 Support

Per supporto:

- 📧 Email: support@rbm.example.com
- 📝 Issues: [GitHub Issues](https://github.com/example/rbm-widget/issues)
- 📖 Docs: [Documentation](https://docs.rbm.example.com)

---

**✅ FASE-04 COMPLETATA** quando tutti i test passano e demo.html funziona end-to-end
