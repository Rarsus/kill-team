# Kill Team Roll20 Character Sheet - Code Analysis Report

**Date:** 2025-12-18  
**Repository:** Rarsus/kill-team  
**Analyzed Files:**
- killteam_sheet/killteam.html
- killteam_sheet/killteam.css
- killteam_sheet/sheet.json

---

## Executive Summary

This report provides a comprehensive analysis of the Kill Team Roll20 character sheet codebase. The sheet is a custom Roll20 character sheet for the Warhammer 40,000 Kill Team tabletop game, featuring three distinct views: Character Sheet, Command Roster, and Weapon Profile.

**Overall Assessment:** The codebase is functional and well-structured for a Roll20 character sheet, but contains several issues that should be addressed to improve code quality, accessibility, and maintainability.

---

## 1. HTML Analysis (killteam.html)

### 1.1 Critical Issues

#### 1.1.1 Missing Quotes on Input Attributes
**Severity:** High  
**Lines:** 32-40, 55-60, 71, 79-80, and many more

Multiple input elements are missing quotes around the `type` and `name` attribute values.

**Examples:**
```html
<!-- Current (incorrect) -->
<input type=number name=attr_m />
<input type=text name="attr_weapon-name" />

<!-- Should be -->
<input type="number" name="attr_m" />
<input type="text" name="attr_weapon-name" />
```

**Impact:** While browsers are generally forgiving, this violates HTML5 standards and can cause parsing issues in strict validators.

**Recommendation:** Add quotes to all attribute values for consistency and standards compliance.

#### 1.1.2 Inconsistent Attribute Quoting
**Severity:** Medium  
**Lines:** Throughout the file

The code mixes quoted and unquoted attributes inconsistently, which reduces code readability.

**Example:**
```html
<input type=number min=0 step=1 value=0 name="attr_points" />
```

### 1.2 Code Quality Issues

#### 1.2.1 Inconsistent Spacing in HTML Tags
**Severity:** Low  
**Lines:** 60, 103

Extra spaces in tags reduce consistency.

**Example:**
```html
<!-- Line 103 -->
<input  type=checkbox name="attr_wounds3" value=3>
```

#### 1.2.2 Typo in Attribute Name
**Severity:** Medium  
**Line:** 110

The attribute name has a typo: `attr_covalenscense` should likely be `attr_convalescence`.

**Current:**
```html
<input type=checkbox name="attr_covalenscense" />
```

**Impact:** This may be intentional if data already exists with this name, but it appears to be a misspelling of "convalescence."

#### 1.2.3 Another Typo in Attribute Name
**Severity:** Medium  
**Line:** 155

The attribute name `attr_quirck` appears to be a typo of "quirk."

**Current:**
```html
<input type="text" name="attr_quirck">
```

### 1.3 Accessibility Issues

#### 1.3.1 Missing Alt Text and Accessibility Labels
**Severity:** Medium

While the sheet uses labels, some interactive elements could benefit from better accessibility attributes.

#### 1.3.2 Empty Span Elements
**Severity:** Low  
**Lines:** 62-63, 73-74, 217-218

The pattern of using paired span/textarea elements for auto-expansion is functional but not clearly documented.

**Example:**
```html
<span name="attr_weapon-abilities"></span>
<textarea name="attr_weapon-abilities" ></textarea>
```

### 1.4 Structure and Organization

#### 1.4.1 Good Practices Observed
- Clear section comments (e.g., `<!-- #SHEETSELECTOR START -->`)
- Logical grouping of related elements
- Consistent use of CSS classes for styling
- Good separation of three distinct sheet types

#### 1.4.2 Suggestions for Improvement
- Consider adding more inline comments explaining the purpose of complex sections
- The repeating fieldset sections could benefit from more documentation

---

## 2. CSS Analysis (killteam.css)

### 2.1 Critical Issues

#### 2.1.1 Invalid CSS Selector
**Severity:** High  
**Line:** 5

The selector `.div.sheet_selector` is invalid CSS syntax.

**Current:**
```css
.div.sheet_selector {display: block;}
```

**Should be:**
```css
div.sheet_selector {display: block;}
```

**Impact:** This rule will not apply as intended because `.div` would look for an element with class "div" rather than a `div` element.

### 2.2 Code Quality Issues

#### 2.2.1 Commented Out Code
**Severity:** Low  
**Lines:** 23, 163-166

There are sections of commented-out code that should either be removed or documented.

**Example:**
```css
.charsheet label {
    /* display: inline-block; */
    text-transform: uppercase;
    font-size: 1em;
    margin: 0;
}
```

**Recommendation:** Remove dead code or add comments explaining why it's kept for reference.

#### 2.2.2 Inconsistent Property Ordering
**Severity:** Low

CSS properties are not consistently ordered within rules. Consider adopting a consistent ordering convention (e.g., alphabetical or grouped by type).

### 2.3 Best Practices

#### 2.3.1 Good Practices Observed
- Clear section comments
- Logical grouping of related styles
- Good use of CSS Grid for layout
- Custom checkbox styling is well-implemented
- Font imports at the top of the file

#### 2.3.2 Suggestions for Improvement
- Consider using CSS custom properties (variables) for repeated colors like `#ff4400`, `lightgray`, etc.
- Grid template areas are string-quoted but some have unnecessary quotes in the CSS

**Example Improvement:**
```css
:root {
  --primary-orange: #ff4400;
  --background-gray: lightgray;
  --border-white: white solid 3px;
}
```

---

## 3. JavaScript/Sheet Workers Analysis

### 3.1 Code Quality Issues

#### 3.1.1 Console.log in Production
**Severity:** Low  
**Line:** 233

The code includes a console.log statement that should be removed for production.

**Current:**
```javascript
console.log("starting xp_bar_worker");
```

**Recommendation:** Remove debug statements or use them conditionally.

#### 3.1.2 Repetitive Code in XP Worker
**Severity:** Medium  
**Lines:** 236-252

The switch statement is very repetitive. This could be refactored for better maintainability.

**Current approach:**
```javascript
switch (xp) {
    case 1:  setAttrs({"xp":xp,"xp1":1}); break;
    case 2:  setAttrs({"xp":xp,"xp1":1,"xp2":2});break;
    // ... 10 more similar cases
}
```

**Suggested refactor:**
```javascript
if (xp >= 1 && xp <= 12) {
    const attrs = {"xp": xp};
    for (let i = 1; i <= xp; i++) {
        attrs[`xp${i}`] = i;
    }
    setAttrs(attrs);
} else {
    setAttrs({"xp": 0});
}
```

### 3.2 Good Practices Observed
- Good use of Roll20 sheet worker API
- Clear event handlers for button clicks
- Proper use of forEach for button list iteration

---

## 4. General Code Quality

### 4.1 Positive Aspects
1. **Clear Structure:** The code is well-organized with clear sections
2. **Consistent Naming:** Attribute names follow a consistent pattern
3. **Responsive Design:** Good use of CSS Grid for flexible layouts
4. **Custom Styling:** Nice custom checkbox implementation
5. **Multiple Views:** Clean implementation of three different sheet types
6. **Documentation:** Good use of section comments

### 4.2 Areas for Improvement

#### 4.2.1 Code Standards Compliance
- Add quotes to all HTML attributes
- Fix invalid CSS selector
- Remove or document commented-out code

#### 4.2.2 Maintainability
- Reduce code repetition in JavaScript
- Consider using CSS variables for colors
- Add more inline documentation for complex sections

#### 4.2.3 Error Handling
- No visible error handling in sheet workers
- Consider adding validation for numeric inputs

---

## 5. Security Considerations

### 5.1 Assessment
No major security issues identified. The sheet:
- Does not use external data sources
- Does not execute user-provided code
- Properly uses Roll20's attribute system

### 5.2 Recommendations
- Ensure numeric inputs have proper min/max constraints where appropriate
- The weapon profile AP input has max=0 min=-6, which is good

---

## 6. Testing Recommendations

### 6.1 Functional Testing
1. Test all three sheet types (Character, Command Roster, Weapon Profile)
2. Verify XP bar functionality with all 12 checkboxes
3. Test repeating sections (weapons, abilities, roster entries)
4. Verify auto-expanding textareas work correctly

### 6.2 Browser Testing
1. Test in Roll20's environment
2. Verify CSS Grid support
3. Test custom checkbox styling across browsers

### 6.3 Accessibility Testing
1. Test with screen readers
2. Verify keyboard navigation
3. Check color contrast ratios

---

## 7. Priority Recommendations

### High Priority (Should Fix)
1. **Fix CSS selector on line 5:** Change `.div.sheet_selector` to `div.sheet_selector`
2. **Add quotes to HTML attributes:** Standardize all attribute values to be quoted
3. **Fix typos:** Correct `attr_covalenscense` to `attr_convalescence` (if data migration is possible)

### Medium Priority (Should Consider)
1. **Refactor XP worker:** Reduce code repetition in JavaScript
2. **Remove console.log:** Clean up debug statements
3. **Document or remove commented code:** Clean up CSS comments
4. **Fix typo:** Correct `attr_quirck` to `attr_quirk` (if data migration is possible)

### Low Priority (Nice to Have)
1. **Add CSS variables:** For repeated color values
2. **Consistent code formatting:** Standardize spacing and property ordering
3. **Additional documentation:** Add more inline comments
4. **Remove extra spaces:** Clean up formatting inconsistencies

---

## 8. Conclusion

The Kill Team Roll20 character sheet is a well-structured and functional piece of code. The primary issues are:

1. **Standards compliance** (missing quotes, invalid CSS selector)
2. **Code quality** (typos, repetitive code)
3. **Maintainability** (commented code, hardcoded values)

These issues are relatively minor and don't affect core functionality, but addressing them would improve code quality, maintainability, and standards compliance.

**Estimated Effort to Address Issues:**
- High Priority: 2-3 hours
- Medium Priority: 3-4 hours  
- Low Priority: 2-3 hours
- Total: 7-10 hours

The codebase demonstrates good understanding of Roll20 sheet development and provides a solid foundation for future enhancements.

---

## 9. File-by-File Summary

### killteam.html
- **Lines of Code:** 270
- **Critical Issues:** 2 (missing quotes, typos)
- **Medium Issues:** 3
- **Low Issues:** 2
- **Overall Grade:** B+

### killteam.css  
- **Lines of Code:** 351
- **Critical Issues:** 1 (invalid selector)
- **Medium Issues:** 1
- **Low Issues:** 2
- **Overall Grade:** B+

### sheet.json
- **Lines of Code:** 9
- **Issues:** None
- **Overall Grade:** A

### JavaScript (within HTML)
- **Lines of Code:** ~40
- **Critical Issues:** 0
- **Medium Issues:** 1
- **Low Issues:** 1
- **Overall Grade:** B+

**Overall Project Grade: B+**

---

## Appendix A: Detailed Issue List

| ID | File | Line | Severity | Issue | Fix Time |
|----|------|------|----------|-------|----------|
| 1 | CSS | 5 | High | Invalid selector `.div.` | 1 min |
| 2 | HTML | Multiple | High | Missing quotes on attributes | 30 min |
| 3 | HTML | 110 | Medium | Typo: covalenscense | 5 min |
| 4 | HTML | 155 | Medium | Typo: quirck | 5 min |
| 5 | JS | 233 | Low | Console.log in production | 1 min |
| 6 | JS | 236-252 | Medium | Repetitive code | 30 min |
| 7 | CSS | Multiple | Low | Commented code | 15 min |

---

**End of Report**
