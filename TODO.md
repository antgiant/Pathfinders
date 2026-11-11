# TODO

## Print footer (printed date / pagination) shows in print preview but not on paper

**Status:** Fix implemented (bottom `@page` margin raised to 0.6in, footer now 9pt black with `print-color-adjust: exact`). **Still needs confirmation on a real printer/paper** before the checklist below can be closed; page numbers are not yet added.

**Symptom:** The footer line at the bottom of each page (`Printed: <date>` and pagination info) is visible in the browser's print preview but does not appear on the physical printout.

**Affected files:** `reports/attendance-sheets.html`, `reports/honor-day.html` (both use a `.page-footer` element; `reports/honor-day-student-cards.html` explicitly sets `@page` margin boxes to `content: none`).

**Current setup (for reference):**
- `@page { size: letter; margin: 0.3in; }`
- `@media print { .page-footer { position: fixed; bottom: 0; padding: 0.1in 0; font-size: 7pt; ... } }`
- Footer is injected per page in JS: `<div class="page-footer">Printed: ${printDate}</div>`

### Investigation checklist

- [ ] **Reproduce on real paper** (and "Save as PDF" + open the PDF) to confirm whether the footer is lost at the printer or already missing from the PDF.
- [ ] **Printer unprintable margin** — most printers cannot print within ~0.25in of the page edge. With a 0.3in `@page` margin and the footer pinned at `bottom: 0` plus 0.1in padding, the text may land in or near the hardware dead zone. Test with a larger bottom margin (e.g. 0.5in) and move the footer up.
- [ ] **`position: fixed` in print** — fixed elements repeat on every printed page and are positioned relative to the page box, but browsers differ (Chrome vs Safari vs Firefox). Check whether the footer is clipped, overlapped by table content, or pushed to an overflow page. Compare with a non-fixed layout (e.g. footer in normal flow at the bottom of each `.page` container, using `margin-top: auto` in a flex column with fixed page height).
- [ ] **Color / contrast** — footer is `color: #666` at `7pt`. Check whether "Background graphics" or the printer's ink-saver/grayscale mode drops light text. Try `color: #000` and `-webkit-print-color-adjust: exact; print-color-adjust: exact;`.
- [ ] **Font size** — 7pt may be too small/light to render on some drivers. Try 8–9pt.
- [ ] **Content overlap** — check whether the last table row or the page container's height reaches the footer area and covers/clips it (`overflow: hidden` on `.page`, fixed heights, `page-break-after`).
- [ ] **Print dialog settings** — test with "Headers and footers" on vs off, "Margins: Default / None / Custom", and "Scale: Default vs 100%". The preview may apply different scaling than the actual print job.
- [ ] **Browser/OS matrix** — Chrome, Edge, Safari, Firefox on macOS/Windows; note which combinations fail and whether it's tied to a specific printer driver.
- [ ] **Alternative: `@page` margin boxes** (`@bottom-center { content: "Printed " ... " Page " counter(page) " of " counter(pages) }`) — only supported in Chromium-based browsers; evaluate as a progressive enhancement for real page numbers instead of a fixed element.

### Possible fixes to evaluate

1. Raise the `@page` bottom margin (≥ 0.5in) and place the footer fully inside the printable area.
2. Replace `position: fixed` with an in-flow footer inside each `.page` container.
3. Use darker/larger footer text with `print-color-adjust: exact`.
4. Add true pagination via `@page` margin boxes where supported, falling back to the in-flow footer.

### Done when

- [ ] Footer prints on paper in the supported browsers/printers identified above, matching the print preview.
- [ ] Fix applied consistently to `attendance-sheets.html` and `honor-day.html`.
- [ ] Tests in `tests/attendance-sheets.test.js` and `tests/honor-day.test.js` updated to cover the footer print styles.
