# Contributing to Kill Team Character Sheet

Thank you for your interest in contributing to the Kill Team Roll20 character sheet! This document provides guidelines and instructions for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)

## Code of Conduct

- Be respectful and constructive in all interactions
- Focus on the code, not the person
- Accept constructive criticism gracefully
- Help maintain a welcoming environment for all contributors

## Getting Started

### Prerequisites

1. **Roll20 Account**: Free or Pro account
2. **Git**: Version control system
3. **Text Editor**: VS Code, Sublime, or similar
4. **Browser**: Modern browser (Chrome recommended)

### Setting Up Development Environment

1. **Fork the Repository**
   ```bash
   # On GitHub, click "Fork" button
   # Then clone your fork
   git clone https://github.com/YOUR_USERNAME/kill-team.git
   cd kill-team
   ```

2. **Create a Test Game on Roll20**
   - Log into Roll20
   - Create a new game for testing
   - Go to Game Settings → Character Sheet Template
   - Select "Custom"

3. **Install the Sheet**
   - Copy `killteam_sheet/killteam.html` content into HTML Layout tab
   - Copy `killteam_sheet/killteam.css` content into CSS Styling tab
   - Save changes

4. **Create Test Characters**
   - Create several test characters
   - Try all three sheet types
   - Verify everything works

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-weapon-stats` - New features
- `fix/xp-bar-bug` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/simplify-css` - Code refactoring

### 2. Make Your Changes

- Edit files in the `killteam_sheet` directory
- Follow the code style guidelines (see below)
- Keep changes focused and minimal
- Test thoroughly after each change

### 3. Test Your Changes

- Copy updated code to Roll20
- Run through relevant test cases in `TESTING.md`
- Test all three sheet types
- Verify repeating sections work
- Check browser console for errors

### 4. Commit Your Changes

```bash
git add killteam_sheet/
git commit -m "Brief description of changes"
```

Commit message guidelines:
- Use present tense ("Add feature" not "Added feature")
- Be concise but descriptive
- Reference issue numbers if applicable

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Detailed description of what and why
- Screenshots if UI changes
- Test results summary

## Code Style Guidelines

### HTML Style

```html
<!-- Good: Properly quoted, well-formatted -->
<input type="number" name="attr_strength" min="0" max="10" />
<label>Operative Name</label>

<!-- Bad: Missing quotes, inconsistent spacing -->
<input type=number name=attr_strength min=0 max=10/>
<label>Operative Name</LABEL>
```

**Rules**:
- Always quote attribute values
- Use lowercase for tags and attributes
- Use self-closing tags for void elements (`<input />`, `<br />`)
- Indent nested elements consistently (2 spaces)
- Use meaningful, descriptive attribute names
- Add comments for complex sections

### CSS Style

```css
/* Good: Clear organization, consistent formatting */
.character_sheet {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background-color: #ffffff;
}

/* Bad: Inconsistent spacing, unclear organization */
.character_sheet{display:grid;grid-template-columns:repeat(4,1fr);
gap:10px;background-color:#ffffff;}
```

**Rules**:
- One selector per line for multiple selectors
- Opening brace on same line as selector
- Properties indented (2 spaces)
- One property per line
- Space after colon, semicolon after every property
- Closing brace on its own line
- Use comments to mark major sections
- Group related styles together
- Consider alphabetical property ordering

**Naming Conventions**:
- Use semantic class names (`.weapon_info`, not `.box1`)
- Use lowercase with underscores for multi-word names
- Prefix Roll20-specific classes appropriately

### JavaScript Style

```javascript
// Good: Clear, modern JavaScript
on("change:xp1 change:xp2", function() {
  getAttrs(["xp1", "xp2"], function(values) {
    const maxXP = Math.max(values.xp1, values.xp2);
    setAttrs({xp: maxXP});
  });
});

// Bad: Unclear, old-style syntax
on("change:xp1 change:xp2",function(){
getAttrs(["xp1","xp2"],function(v){
var x=Math.max(v.xp1,v.xp2);setAttrs({xp:x});});});
```

**Rules**:
- Use `const` and `let`, not `var`
- Use descriptive variable names
- Use template literals for string interpolation
- Add comments for complex logic
- Use consistent indentation (2 spaces)
- Include semicolons
- Use modern ES6+ features where appropriate
- Follow Roll20 sheet worker best practices

### Attribute Naming

All Roll20 attributes should follow these conventions:

- Prefix with `attr_`: `attr_operative_name`
- Use lowercase with hyphens: `attr_weapon-range`
- Be descriptive: `attr_points` not `attr_pts`
- Group related attributes: `attr_xp1`, `attr_xp2`, etc.

## Testing Requirements

### Before Submitting

All contributions must:

1. **Pass Manual Testing**
   - Test in Roll20 environment
   - Complete relevant tests from `TESTING.md`
   - No console errors
   - All three sheet types work

2. **Validate Code**
   - HTML passes W3C validation
   - CSS passes W3C validation
   - JavaScript has no syntax errors

3. **Test Browser Compatibility**
   - Test in Chrome (minimum)
   - Verify in Firefox if possible
   - Check for any browser-specific issues

4. **Verify No Regressions**
   - Existing features still work
   - No data loss or corruption
   - Previous bugs remain fixed

### Documentation

If your change:
- Adds new features → Update README.md
- Changes behavior → Update TESTING.md
- Fixes bugs → Document in PR description
- Changes attributes → Update documentation

## Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Changes are tested in Roll20
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No commented-out code (unless documented)
- [ ] No console.log statements
- [ ] HTML/CSS are valid
- [ ] Changes are minimal and focused

### Pull Request Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Other (specify)

## Testing Done
- [ ] Tested in Roll20
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] All three sheet types work
- [ ] No console errors

## Screenshots
(If applicable)

## Related Issues
Fixes #123
Related to #456

## Additional Notes
Any other relevant information
```

## Review Process

### What to Expect

1. **Initial Review**: Within 1-2 weeks
2. **Feedback**: Reviewers may request changes
3. **Discussion**: Be prepared to discuss your approach
4. **Iteration**: Make requested changes
5. **Approval**: Once approved, changes will be merged

### Review Criteria

Reviewers will check:
- Code quality and style
- Functionality and correctness
- Test coverage
- Documentation completeness
- Performance impact
- Backward compatibility
- Security considerations

### Responding to Feedback

- Address all review comments
- Ask questions if anything is unclear
- Make requested changes promptly
- Update PR description if scope changes
- Be respectful and professional

## Common Mistakes to Avoid

1. **Breaking Changes**
   - Don't remove or rename existing attributes
   - Don't change attribute data types
   - Don't break existing functionality

2. **Performance Issues**
   - Avoid complex calculations in sheet workers
   - Don't create infinite loops
   - Minimize DOM manipulation

3. **Style Violations**
   - Don't mix styles (quoted/unquoted attributes)
   - Don't leave commented-out code
   - Don't use inline styles

4. **Testing Gaps**
   - Don't skip testing in Roll20
   - Don't ignore browser console errors
   - Don't assume features work without testing

## Advanced Topics

### Working with Repeating Sections

Repeating sections require special handling:
- Use `repcontainer` class correctly
- Include `itemcontrol` for modify buttons
- Test add/delete operations thoroughly
- Verify data persistence

### Sheet Workers Best Practices

- Keep workers simple and focused
- Avoid synchronous operations
- Use event-driven patterns
- Test edge cases thoroughly
- Document complex logic

### CSS Grid Tips

- Use named grid areas for clarity
- Test responsive behavior
- Ensure proper alignment
- Verify in Roll20's environment

## Getting Help

If you need assistance:

1. **Documentation**: Check Roll20 Wiki first
2. **Issues**: Search existing GitHub issues
3. **Discussion**: Comment on related issues
4. **Community**: Roll20 forums and Discord

## Resources

### Roll20 Documentation
- [Character Sheet Development](https://wiki.roll20.net/Building_Character_Sheets)
- [Sheet Worker Scripts](https://wiki.roll20.net/Sheet_Worker_Scripts)
- [Sheet Author Tips](https://wiki.roll20.net/Sheet_Author_Tips)

### Web Standards
- [HTML5 Specification](https://html.spec.whatwg.org/)
- [CSS Grid Layout](https://www.w3.org/TR/css-grid-1/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools
- [W3C HTML Validator](https://validator.w3.org/)
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
- [Roll20 Custom Sheet Sandbox](https://wiki.roll20.net/Sheet_Sandbox)

## Recognition

Contributors will be:
- Listed in commit history
- Mentioned in release notes (for significant contributions)
- Credited in documentation (for major features)

Thank you for contributing to the Kill Team character sheet! Your efforts help make this tool better for the entire community.
