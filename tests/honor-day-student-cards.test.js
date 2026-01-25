/**
 * Tests for Honor Day Student Cards Report
 * 
 * Run with: npx jest tests/honor-day-student-cards.test.js
 */

const fs = require('fs');
const path = require('path');

describe('Honor Day Student Cards Report', () => {
    let html;

    beforeAll(() => {
        const htmlPath = path.join(__dirname, '../reports/honor-day-student-cards.html');
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
            expect(html).toMatch(/<title>Honor Day Student Cards - Pathfinders<\/title>/);
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

        test('should have cards container for generated content', () => {
            expect(html).toMatch(/id="cardsContainer"/);
        });
    });

    describe('Info Sections', () => {
        test('should have info section container', () => {
            expect(html).toMatch(/class="info-section"/);
        });

        test('should have "What does this report do?" section', () => {
            expect(html).toMatch(/What does this report do\?/);
        });

        test('should have "Required CSV columns" section', () => {
            expect(html).toMatch(/Required CSV columns/);
        });

        test('should have "Sample output" section', () => {
            expect(html).toMatch(/Sample output/);
        });

        test('should have three details elements', () => {
            const detailsCount = (html.match(/<details>/g) || []).length;
            expect(detailsCount).toBe(3);
        });

        test('should document required columns', () => {
            expect(html).toMatch(/<code>First Name<\/code>/);
            expect(html).toMatch(/<code>Last Name<\/code>/);
            expect(html).toMatch(/<code>Club<\/code>/);
        });

        test('should have sample card output', () => {
            expect(html).toMatch(/sample-card/);
        });
    });

    describe('User Instructions', () => {
        test('should display drop file instruction', () => {
            expect(html).toMatch(/Drop your Planning Center Registration Exported CSV file here/i);
        });

        test('should have upload button', () => {
            expect(html).toMatch(/class="upload-btn"/);
        });

        test('should display Student Cards in title', () => {
            expect(html).toMatch(/Honor Day Student Cards/);
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

        test('should have extractTimeSlot function', () => {
            expect(html).toMatch(/function extractTimeSlot\(/);
        });

        test('should have createCardHTML function', () => {
            expect(html).toMatch(/function createCardHTML\(/);
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

        test('should sort students by first name then last name', () => {
            expect(html).toMatch(/firstName\.localeCompare/);
            expect(html).toMatch(/lastName\.localeCompare/);
        });

        test('should sort schedule by time', () => {
            expect(html).toMatch(/schedule\.sort/);
        });

        test('should limit to 9 schedule items', () => {
            expect(html).toMatch(/maxItems = 9/);
        });
    });

    describe('Card Layout', () => {
        test('should have card-page class for page layout', () => {
            expect(html).toMatch(/\.card-page\s*\{/);
        });

        test('should have 4 cards per page (2x2 grid)', () => {
            expect(html).toMatch(/grid-template-columns:\s*1fr 1fr/);
            expect(html).toMatch(/grid-template-rows:\s*1fr 1fr/);
        });

        test('should have student-card class', () => {
            expect(html).toMatch(/\.student-card\s*\{/);
        });

        test('should have card-header class for "Honor Day Schedule"', () => {
            expect(html).toMatch(/\.card-header\s*\{/);
        });

        test('should display "Honor Day Schedule" header', () => {
            expect(html).toMatch(/Honor Day Schedule/);
        });

        test('should have card-attendee-name class', () => {
            expect(html).toMatch(/\.card-attendee-name\s*\{/);
        });

        test('should have card-club-name class', () => {
            expect(html).toMatch(/\.card-club-name\s*\{/);
        });

        test('should have card-schedule class', () => {
            expect(html).toMatch(/\.card-schedule\s*\{/);
        });

        test('should have schedule-item class', () => {
            expect(html).toMatch(/\.schedule-item\s*\{/);
        });

        test('should have schedule-time class', () => {
            expect(html).toMatch(/\.schedule-time\s*\{/);
        });

        test('should have schedule-honor class', () => {
            expect(html).toMatch(/\.schedule-honor\s*\{/);
        });

        test('should have schedule-initial class for teacher initials', () => {
            expect(html).toMatch(/\.schedule-initial\s*\{/);
        });

        test('should have underlined initial line', () => {
            expect(html).toMatch(/schedule-initial[\s\S]*border-bottom/);
        });

        test('should have empty card placeholder style', () => {
            expect(html).toMatch(/\.student-card\.empty\s*\{/);
        });
    });

    describe('Print Styles', () => {
        test('should have print media query', () => {
            expect(html).toMatch(/@media print/);
        });

        test('should have landscape page orientation', () => {
            expect(html).toMatch(/size:\s*letter\s*landscape/);
        });

        test('should have page break styles', () => {
            expect(html).toMatch(/break-after:\s*page|page-break-after/);
        });

        test('should hide navigation when printing', () => {
            expect(html).toMatch(/nav.*display:\s*none/s);
        });

        test('should hide print controls when printing', () => {
            expect(html).toMatch(/\.print-controls[\s\S]*display:\s*none/);
        });
    });

    describe('Accessibility', () => {
        test('should have semantic HTML elements', () => {
            expect(html).toMatch(/<nav>/);
            expect(html).toMatch(/<h1/);
        });

        test('should have button elements for actions', () => {
            expect(html).toMatch(/<button/);
        });
    });

    describe('PDF Filename', () => {
        test('should set document title with date for PDF filename', () => {
            expect(html).toMatch(/document\.title.*Honor Day Student Cards/);
        });

        test('should format date as yyyy-mm-dd', () => {
            expect(html).toMatch(/padStart\(2, '0'\)/);
        });
    });
});

describe('Index Page - Honor Day Student Cards', () => {
    let indexHtml;

    beforeAll(() => {
        const indexPath = path.join(__dirname, '../index.html');
        indexHtml = fs.readFileSync(indexPath, 'utf8');
    });

    test('should link to honor-day-student-cards report', () => {
        expect(indexHtml).toMatch(/href="reports\/honor-day-student-cards\.html"/);
    });

    test('should display Honor Day Student Cards title', () => {
        expect(indexHtml).toMatch(/Honor Day Student Cards/);
    });
});
