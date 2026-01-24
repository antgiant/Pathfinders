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
    });

    describe('User Instructions', () => {
        test('should display drop file instruction', () => {
            expect(html).toMatch(/Drop your CSV file here/i);
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

    test('should have report date', () => {
        expect(indexHtml).toMatch(/January 24, 2026/);
    });
});
