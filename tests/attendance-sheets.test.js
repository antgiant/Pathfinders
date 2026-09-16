/**
 * Tests for Attendance Sheets Report
 * 
 * Run with: npx jest tests/attendance-sheets.test.js
 * Or open test-runner.html in a browser for visual testing
 */

const fs = require('fs');
const path = require('path');

describe('Attendance Sheets Report', () => {
    let html;

    beforeAll(() => {
        const htmlPath = path.join(__dirname, '../reports/attendance-sheets.html');
        html = fs.readFileSync(htmlPath, 'utf8');
    });

    describe('HTML Structure', () => {
        test('should have valid DOCTYPE', () => {
            expect(html).toMatch(/^<!DOCTYPE html>/i);
        });

        test('should have html lang attribute', () => {
            expect(html).toMatch(/<html lang="en">/);
        });

        test('should have proper meta charset', () => {
            expect(html).toMatch(/<meta charset="UTF-8">/);
        });

        test('should have viewport meta tag', () => {
            expect(html).toMatch(/<meta name="viewport"/);
        });

        test('should have title', () => {
            expect(html).toMatch(/<title>Attendance Sheets - Pathfinders<\/title>/);
        });
    });

    describe('Required Elements', () => {
        test('should have navigation with back link', () => {
            expect(html).toMatch(/<nav>/);
            expect(html).toMatch(/href="\.\.\/index\.html"/);
        });

        test('should have upload container', () => {
            expect(html).toMatch(/id="uploadContainer"/);
        });

        test('should have drop zone', () => {
            expect(html).toMatch(/id="dropZone"/);
        });

        test('should have file input accepting CSV', () => {
            expect(html).toMatch(/type="file"/);
            expect(html).toMatch(/accept="\.csv"/);
        });

        test('should have report container (hidden by default)', () => {
            expect(html).toMatch(/id="reportContainer"/);
        });

        test('should have sheets container for generated content', () => {
            expect(html).toMatch(/id="sheetsContainer"/);
        });

        test('should have checklist options section', () => {
            expect(html).toMatch(/id="optionsSection"/);
            expect(html).toMatch(/class="filter-section/);
        });

        test('should have controls for shirt checkbox and emoji', () => {
            expect(html).toMatch(/id="toggleShirt"/);
            expect(html).toMatch(/id="shirtEmojiInput"/);
        });

        test('should have controls for extra checkboxes', () => {
            expect(html).toMatch(/id="extraCheckboxLabel"/);
            expect(html).toMatch(/id="addExtraCheckboxBtn"/);
            expect(html).toMatch(/id="extraCheckboxList"/);
        });
    });

    describe('User Instructions', () => {
        test('should display drop file instruction', () => {
            expect(html).toMatch(/Drop your Planning Center Registration Exported CSV file here/i);
        });

        test('should have upload button', () => {
            expect(html).toMatch(/Choose File/);
        });
    });

    describe('JavaScript Functionality', () => {
        test('should have parseCSV function', () => {
            expect(html).toMatch(/function parseCSV\(/);
        });

        test('should have parseCSVLine function for proper CSV parsing', () => {
            expect(html).toMatch(/function parseCSVLine\(/);
        });

        test('should have generateReport function', () => {
            expect(html).toMatch(/function generateReport\(/);
        });

        test('should have renderReport function for regenerating output', () => {
            expect(html).toMatch(/function renderReport\(/);
        });

        test('should have resetReport function', () => {
            expect(html).toMatch(/function resetReport\(/);
        });

        test('should have getGradeOrder function for sorting', () => {
            expect(html).toMatch(/function getGradeOrder\(/);
        });

        test('should filter by Assignment Area: Pathfinders', () => {
            expect(html).toMatch(/Assignment Area: Pathfinders/);
        });

        test('should sort by first name then last name', () => {
            expect(html).toMatch(/firstName\.localeCompare/);
            expect(html).toMatch(/lastName\.localeCompare/);
        });

        test('should have configurable checklist options', () => {
            expect(html).toMatch(/reportOptions/);
            expect(html).toMatch(/extraCheckboxes/);
        });
    });

    describe('Print Styles', () => {
        test('should have print media query', () => {
            expect(html).toMatch(/@media print/);
        });

        test('should have page break styles', () => {
            expect(html).toMatch(/page-break-after/);
        });

        test('should hide navigation when printing', () => {
            expect(html).toMatch(/nav.*display:\s*none/s);
        });

        test('should hide options section when printing', () => {
            expect(html).toMatch(/@media print[\s\S]*filter-section[\s\S]*display:\s*none/);
        });

        test('should anchor page footer with fixed positioning so it repeats at the bottom of every physical page', () => {
            const printStart = html.indexOf('@media print');
            const pageRuleStart = html.indexOf('@page', printStart);
            expect(printStart).toBeGreaterThan(-1);
            expect(pageRuleStart).toBeGreaterThan(printStart);
            const printBlock = html.slice(printStart, pageRuleStart);

            const footerRuleMatch = printBlock.match(/\.page-footer\s*\{([\s\S]*?)\}/);
            expect(footerRuleMatch).toBeTruthy();
            const footerRule = footerRuleMatch[1];

            // position: fixed anchors to the page itself in print, so the
            // footer no longer depends on the page container being sized to
            // exactly one page's height to land at the bottom.
            expect(footerRule).toMatch(/position:\s*fixed/);
            expect(footerRule).toMatch(/bottom:\s*0/);
            expect(footerRule).not.toMatch(/margin-top:\s*auto/);
        });

        test('should not force the print page container to a fixed height, to avoid Safari printing each page twice', () => {
            const printStart = html.indexOf('@media print');
            const pageRuleStart = html.indexOf('@page', printStart);
            const printBlock = html.slice(printStart, pageRuleStart);

            const pageContainerMatch = printBlock.match(/\.attendance-page\s*\{([\s\S]*?)\}/);
            expect(pageContainerMatch).toBeTruthy();
            const pageContainerRule = pageContainerMatch[1];

            // Any explicit height on the page container (100vh, or even a
            // fixed inch value meant to match the page) risked being a hair
            // taller than the actual printable area, spilling onto a
            // spurious second page per report page. Letting the container
            // size to its own content and relying on break-after for page
            // separation avoids that entirely.
            expect(pageContainerRule).not.toMatch(/vh/);
            expect(pageContainerRule).not.toMatch(/height:/);
        });
    });

    describe('Accessibility', () => {
        test('should have semantic HTML elements', () => {
            expect(html).toMatch(/<nav>/);
            expect(html).toMatch(/<h1/);
            // Group headers use table th elements for semantic table structure
            expect(html).toMatch(/group-header/);
        });

        test('should have button elements for actions', () => {
            expect(html).toMatch(/<button/);
        });
    });

    describe('Report Output Format', () => {
        test('should have attendance-page CSS class defined', () => {
            expect(html).toMatch(/\.attendance-page\s*\{/);
        });

        test('should have group-header class for group names', () => {
            expect(html).toMatch(/class="group-header"/);
        });

        test('should include row numbers', () => {
            expect(html).toMatch(/class="row-number"/);
        });

        test('should include checkboxes', () => {
            expect(html).toMatch(/class="checkbox"/);
        });

        test('should include shirt emoji checkbox', () => {
            expect(html).toMatch(/👕/);
            expect(html).toMatch(/class="shirt-checkbox"/);
        });

        test('should include extra checkbox label styling', () => {
            expect(html).toMatch(/checkbox-label/);
            expect(html).toMatch(/extra-checkbox-cell/);
        });

        test('should include attendee name', () => {
            expect(html).toMatch(/class="attendee-name"/);
        });

        test('should include page footer with date', () => {
            expect(html).toMatch(/class="page-footer"/);
            expect(html).toMatch(/Printed:/);
        });

        test('should add blank write-in rows at end of each group', () => {
            expect(html).toMatch(/write-in-row/);
            expect(html).toMatch(/write-in-line/);
        });

        test('should have write-in line CSS styling', () => {
            expect(html).toMatch(/\.write-in-line\s*\{/);
        });
    });
});

describe('Index Page', () => {
    let indexHtml;

    beforeAll(() => {
        const indexPath = path.join(__dirname, '../index.html');
        indexHtml = fs.readFileSync(indexPath, 'utf8');
    });

    test('should link to attendance-sheets report', () => {
        expect(indexHtml).toMatch(/href="reports\/attendance-sheets\.html"/);
    });

    test('should display Attendance Sheets title', () => {
        expect(indexHtml).toMatch(/Attendance Sheets/);
    });
});
