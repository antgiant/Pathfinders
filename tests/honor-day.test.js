/**
 * Tests for Honor Day Attendance Report
 * 
 * Run with: npx jest tests/honor-day.test.js
 */

const fs = require('fs');
const path = require('path');

describe('Honor Day Attendance Report', () => {
    let html;

    beforeAll(() => {
        const htmlPath = path.join(__dirname, '../reports/honor-day.html');
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
            expect(html).toMatch(/<title>Honor Day Attendance - Pathfinders<\/title>/);
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
            expect(html).toMatch(/<input type="file".*accept="\.csv"/);
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
            expect(html).toMatch(/class="upload-btn"/);
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

        test('should have isHonorColumn function to identify honor columns', () => {
            expect(html).toMatch(/function isHonorColumn\(/);
        });

        test('should have cleanColumnName function to remove unwanted text', () => {
            expect(html).toMatch(/function cleanColumnName\(/);
        });

        test('should have getTimeOrder function for sorting', () => {
            expect(html).toMatch(/function getTimeOrder\(/);
        });

        test('should filter columns starting with lunch', () => {
            expect(html).toMatch(/startsWith\(['"]lunch['"]\)/i);
        });

        test('should filter columns starting with time pattern', () => {
            expect(html).toMatch(/\\d\{1,2\}:\\d\{2\}/);
        });

        test('should remove click instructions from column names', () => {
            expect(html).toMatch(/Click on time to see options for honors/i);
        });

        test('should sort members by first name then last name', () => {
            expect(html).toMatch(/firstName\.localeCompare/);
            expect(html).toMatch(/lastName\.localeCompare/);
        });
    });

    describe('Print Styles', () => {
        test('should have print media query', () => {
            expect(html).toMatch(/@media print/);
        });

        test('should have page break styles', () => {
            expect(html).toMatch(/break-after:\s*page|page-break-after/);
        });

        test('should hide navigation when printing', () => {
            expect(html).toMatch(/nav.*display:\s*none/s);
        });
    });

    describe('Accessibility', () => {
        test('should have semantic HTML elements', () => {
            expect(html).toMatch(/<nav>/);
            expect(html).toMatch(/<h1/);
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
            expect(html).toMatch(/\.group-header\s*\{/);
        });

        test('should include row numbers', () => {
            expect(html).toMatch(/row-number/);
        });

        test('should include checkboxes', () => {
            expect(html).toMatch(/checkbox/);
        });

        test('should include shirt emoji checkbox', () => {
            expect(html).toMatch(/shirt-emoji/);
            expect(html).toMatch(/👕/);
        });

        test('should include attendee name', () => {
            expect(html).toMatch(/attendee-name/);
        });

        test('should include page footer with date', () => {
            expect(html).toMatch(/page-footer/);
            expect(html).toMatch(/printDate/);
        });

        test('should add blank write-in rows at end of each group', () => {
            expect(html).toMatch(/write-in-row/);
        });

        test('should have write-in line CSS styling', () => {
            expect(html).toMatch(/\.write-in-line\s*\{/);
        });

        test('should skip empty groups', () => {
            expect(html).toMatch(/members\.length === 0.*return/s);
        });
    });

    describe('PDF Filename', () => {
        test('should set document title with date for PDF filename', () => {
            expect(html).toMatch(/document\.title.*Honor Day/);
        });

        test('should format date as yyyy-mm-dd', () => {
            expect(html).toMatch(/padStart\(2, '0'\)/);
        });
    });
});

describe('Index Page - Honor Day', () => {
    let indexHtml;

    beforeAll(() => {
        const indexPath = path.join(__dirname, '../index.html');
        indexHtml = fs.readFileSync(indexPath, 'utf8');
    });

    test('should link to honor-day report', () => {
        expect(indexHtml).toMatch(/href="reports\/honor-day\.html"/);
    });

    test('should display Honor Day Attendance title', () => {
        expect(indexHtml).toMatch(/Honor Day Attendance/);
    });

    test('should have report date', () => {
        expect(indexHtml).toMatch(/January 24, 2026/);
    });
});
