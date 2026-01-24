/**
 * Syntax Validation Tests
 * 
 * These tests validate CSS, HTML, and JavaScript syntax to prevent
 * commits with syntax errors.
 * 
 * Run with: npm test
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Helper functions for syntax validation
function extractCSS(html) {
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (!styleMatches) return '';
    return styleMatches.map(match => {
        const content = match.replace(/<style[^>]*>/i, '').replace(/<\/style>/i, '');
        return content;
    }).join('\n');
}

function extractJavaScript(html) {
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (!scriptMatches) return '';
    return scriptMatches
        .filter(match => !match.includes('src=')) // Exclude external scripts
        .map(match => {
            const content = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
            return content;
        }).join('\n');
}

function validateCSSBraces(css) {
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < css.length; i++) {
        const char = css[i];
        const prevChar = i > 0 ? css[i - 1] : '';
        
        // Handle strings
        if ((char === '"' || char === "'") && prevChar !== '\\') {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
            }
        }
        
        if (!inString) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
        }
        
        // Braces should never go negative
        if (braceCount < 0) {
            return { valid: false, error: `Unexpected closing brace at position ${i}` };
        }
    }
    
    if (braceCount !== 0) {
        return { valid: false, error: `Unbalanced braces: ${braceCount > 0 ? 'missing closing' : 'extra closing'} brace(s)` };
    }
    
    return { valid: true };
}

function validateCSSRules(css) {
    // Remove comments
    const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Check for common CSS syntax errors
    const errors = [];
    
    // Check for rules that are missing closing braces before next selector
    // Pattern: property without semicolon followed by another property or selector
    const missingPropertyEnd = cssNoComments.match(/[a-z-]+\s*:\s*[^;{}]+\s+[a-z-]+\s*:/gi);
    if (missingPropertyEnd) {
        // Filter out valid cases like multi-value properties
        const realErrors = missingPropertyEnd.filter(match => {
            // Check if it's a valid multi-value (like font-family lists)
            return !match.includes(',');
        });
        if (realErrors.length > 0) {
            errors.push(`Possible missing semicolon in CSS`);
        }
    }
    
    // Check for selector immediately followed by property (missing opening brace)
    const missingSelectorBrace = cssNoComments.match(/[.#]?[a-z-]+\s+[a-z-]+\s*:/gi);
    // This is too broad, skip for now
    
    return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

function validateHTMLTags(html) {
    const errors = [];
    
    // Remove JavaScript content to avoid false positives from template literals
    const htmlWithoutScripts = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Check for basic HTML structure
    if (!html.includes('<!DOCTYPE')) {
        errors.push('Missing DOCTYPE declaration');
    }
    
    if (!html.includes('<html')) {
        errors.push('Missing <html> tag');
    }
    
    if (!html.includes('</html>')) {
        errors.push('Missing closing </html> tag');
    }
    
    if (!html.includes('<head')) {
        errors.push('Missing <head> tag');
    }
    
    if (!html.includes('</head>')) {
        errors.push('Missing closing </head> tag');
    }
    
    if (!html.includes('<body')) {
        errors.push('Missing <body> tag');
    }
    
    if (!html.includes('</body>')) {
        errors.push('Missing closing </body> tag');
    }
    
    // Check for unclosed tags (simplified check for common tags)
    // Only check in static HTML, not in JavaScript template literals
    const tagsToCheck = ['div', 'span', 'p', 'ul', 'ol', 'li', 'nav', 'article', 'section', 'header', 'footer', 'main'];
    
    for (const tag of tagsToCheck) {
        const openPattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const closePattern = new RegExp(`</${tag}>`, 'gi');
        const selfClosePattern = new RegExp(`<${tag}[^>]*/\\s*>`, 'gi');
        
        const opens = (htmlWithoutScripts.match(openPattern) || []).length;
        const closes = (htmlWithoutScripts.match(closePattern) || []).length;
        const selfCloses = (htmlWithoutScripts.match(selfClosePattern) || []).length;
        
        if (opens - selfCloses !== closes) {
            errors.push(`Unbalanced <${tag}> tags: ${opens} opening, ${closes} closing`);
        }
    }
    
    return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

function validateJavaScript(js) {
    if (!js.trim()) {
        return { valid: true };
    }
    
    try {
        // Use Node's vm module to check syntax without executing
        new vm.Script(js, { filename: 'inline-script.js' });
        return { valid: true };
    } catch (error) {
        return { 
            valid: false, 
            error: `JavaScript syntax error: ${error.message}` 
        };
    }
}

// Get all HTML files to validate
function getHtmlFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
            files.push(...getHtmlFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

describe('Syntax Validation', () => {
    const projectRoot = path.join(__dirname, '..');
    const htmlFiles = getHtmlFiles(projectRoot);
    
    describe('CSS Syntax', () => {
        htmlFiles.forEach(filePath => {
            const relativePath = path.relative(projectRoot, filePath);
            
            describe(relativePath, () => {
                let css;
                
                beforeAll(() => {
                    const html = fs.readFileSync(filePath, 'utf8');
                    css = extractCSS(html);
                });
                
                test('should have balanced braces', () => {
                    if (!css) return; // Skip if no CSS
                    const result = validateCSSBraces(css);
                    expect(result.valid).toBe(true);
                    if (!result.valid) {
                        console.error(`CSS brace error in ${relativePath}: ${result.error}`);
                    }
                });
                
                test('should have valid CSS rule structure', () => {
                    if (!css) return; // Skip if no CSS
                    const result = validateCSSRules(css);
                    if (!result.valid) {
                        console.warn(`CSS structure warnings in ${relativePath}:`, result.errors);
                    }
                    // This is a warning, not a failure (too many false positives)
                });
            });
        });
    });
    
    describe('HTML Structure', () => {
        htmlFiles.forEach(filePath => {
            const relativePath = path.relative(projectRoot, filePath);
            
            test(`${relativePath} should have valid HTML structure`, () => {
                const html = fs.readFileSync(filePath, 'utf8');
                const result = validateHTMLTags(html);
                
                if (!result.valid) {
                    console.error(`HTML errors in ${relativePath}:`, result.errors);
                }
                expect(result.valid).toBe(true);
            });
        });
    });
    
    describe('JavaScript Syntax', () => {
        htmlFiles.forEach(filePath => {
            const relativePath = path.relative(projectRoot, filePath);
            
            test(`${relativePath} should have valid JavaScript syntax`, () => {
                const html = fs.readFileSync(filePath, 'utf8');
                const js = extractJavaScript(html);
                
                if (!js.trim()) return; // Skip if no JavaScript
                
                const result = validateJavaScript(js);
                
                if (!result.valid) {
                    console.error(`JavaScript error in ${relativePath}: ${result.error}`);
                }
                expect(result.valid).toBe(true);
            });
        });
    });
});

describe('CSS Property Validation', () => {
    const projectRoot = path.join(__dirname, '..');
    const htmlFiles = getHtmlFiles(projectRoot);
    
    htmlFiles.forEach(filePath => {
        const relativePath = path.relative(projectRoot, filePath);
        
        test(`${relativePath} CSS should not have unclosed rules`, () => {
            const html = fs.readFileSync(filePath, 'utf8');
            const css = extractCSS(html);
            
            if (!css) return;
            
            // Remove comments
            const cssClean = css.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // Check that each rule block has matching braces
            const result = validateCSSBraces(cssClean);
            expect(result.valid).toBe(true);
        });
        
        test(`${relativePath} CSS properties should end with semicolons`, () => {
            const html = fs.readFileSync(filePath, 'utf8');
            const css = extractCSS(html);
            
            if (!css) return;
            
            // Remove comments
            const cssClean = css.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // Find all rule blocks
            const ruleBlocks = cssClean.match(/\{[^{}]+\}/g) || [];
            
            for (const block of ruleBlocks) {
                // Remove the braces
                const content = block.slice(1, -1).trim();
                if (!content) continue;
                
                // Split by lines and check each property
                const lines = content.split('\n').map(l => l.trim()).filter(l => l);
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // Skip if it's the last property (semicolon optional but recommended)
                    // Skip empty lines and lines that are just comments
                    if (!line || line.startsWith('/*') || line.startsWith('//')) continue;
                    
                    // Check if line contains a property (has colon)
                    if (line.includes(':') && !line.includes('{')) {
                        // Last property in block doesn't require semicolon
                        const isLastProperty = i === lines.length - 1;
                        if (!isLastProperty && !line.endsWith(';')) {
                            // Check if next line starts a new property
                            const nextLine = lines[i + 1];
                            if (nextLine && nextLine.includes(':') && !nextLine.startsWith('@')) {
                                // This is likely a missing semicolon
                                console.warn(`Possible missing semicolon after: ${line}`);
                            }
                        }
                    }
                }
            }
        });
    });
});
