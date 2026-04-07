# Close Card

Mushroom-stijl Lovelace-kaart met een icoon, naam en sluitknop. Bij het klikken op de sluitknop navigeert de kaart naar een instelbaar pad — ideaal als header op subpagina's en subviews.

---

## Installatie via HACS

1. Ga naar **HACS → Frontend → ⋮ → Aangepaste repositories**
2. Vul in:
   - **Repository:** `https://github.com/Sven2410/close-card`
   - **Categorie:** Lovelace
3. Zoek **Close Card** en klik **Installeren**
4. Hard refresh (Ctrl+Shift+R)

---

## Gebruik

Via de visuele editor selecteer je het icoon, vul je de naam in en stel je het navigatiepad in. Geen YAML nodig.

Of handmatig:

```yaml
type: custom:close-card
icon: mdi:speaker
name: Sonos
navigate: /lovelace/home
```

### Opties

| Optie      | Verplicht | Standaard          | Omschrijving                              |
|------------|-----------|--------------------|-------------------------------------------|
| `icon`     | Nee       | `mdi:speaker`      | MDI-icoon links in de kaart               |
| `name`     | Nee       | —                  | Naam/titel in het midden                  |
| `navigate` | Nee       | `/lovelace/home`   | Pad waar naartoe genavigeerd wordt bij sluiten |

---

## Licentie

MIT
