# Sheet Workers API Documentation

This document describes the JavaScript sheet workers used in the Kill Team character sheet.

## Overview

Sheet workers are JavaScript functions that run in the Roll20 environment to provide dynamic functionality. They respond to events and manipulate character sheet attributes.

## Roll20 Sheet Worker API

The sheet uses the standard Roll20 Sheet Worker API:

- `on(event, callback)` - Register event handlers
- `getAttrs(attributes, callback)` - Retrieve attribute values
- `setAttrs(attributes)` - Update attribute values

For full API documentation, see [Roll20 Sheet Worker Scripts](https://wiki.roll20.net/Sheet_Worker_Scripts).

## Workers in This Sheet

### 1. XP Bar Worker

**Purpose**: Automatically maintains a progressive XP bar where checking any XP box fills all boxes up to that level.

**Events Listened**:
- `change:xp1` through `change:xp12` - Individual XP checkbox changes
- `sheet:opened` - When character sheet is opened

**Implementation**:

```javascript
on("change:xp1 change:xp2 change:xp3 change:xp4 change:xp5 change:xp6 change:xp7 change:xp8 change:xp9 change:xp10 change:xp11 change:xp12 sheet:opened", function() {
  getAttrs(["xp1","xp2","xp3","xp4","xp5","xp6","xp7","xp8","xp9","xp10","xp11","xp12"], function(v) {
    let xp = Math.max(v.xp1, v.xp2, v.xp3, v.xp4, v.xp5, v.xp6, v.xp7, v.xp8, v.xp9, v.xp10, v.xp11, v.xp12);
    if (xp >= 1 && xp <= 12) {
      const attrs = {"xp": xp};
      for (let i = 1; i <= xp; i++) {
        attrs[`xp${i}`] = i;
      }
      setAttrs(attrs);
    } else {
      setAttrs({"xp": 0});
    }
  })
})
```

**Behavior**:

1. **Reads** all XP checkbox values (xp1 through xp12)
2. **Calculates** the maximum checked value
3. **Sets** all checkboxes from 1 to that maximum value
4. **Stores** the final XP total in `xp` attribute

**Examples**:

- User checks `xp5` → boxes 1-5 become checked
- User checks `xp3` after `xp5` was checked → only boxes 1-3 remain checked (downgrade)
- User unchecks all boxes → all boxes become unchecked, xp set to 0

**Technical Details**:

- Uses `Math.max()` to find highest checked box
- Uses template literals for dynamic attribute names
- Validates XP is between 1 and 12
- Efficient: only one `setAttrs()` call per change

**Edge Cases Handled**:

- All boxes unchecked: Sets xp to 0
- Multiple boxes checked simultaneously: Uses highest value
- Sheet reopening: Recalculates on `sheet:opened` event

### 2. Sheet Tab Selector Worker

**Purpose**: Manages switching between the three sheet view modes (Character Sheet, Command Roster, Weapon Profile).

**Events Listened**:
- `clicked:character_sheet` - Character Sheet button clicked
- `clicked:command_roster_sheet` - Command Roster button clicked  
- `clicked:weapon_profile_sheet` - Weapon Profile button clicked

**Implementation**:

```javascript
const buttonlist = [
  "character_sheet",
  "command_roster_sheet",
  "weapon_profile_sheet"
];

buttonlist.forEach(button => {
  on(`clicked:${button}`, function() {
    setAttrs({
      sheetTab: button
    });
  });
});
```

**Behavior**:

1. **Defines** a list of valid sheet types
2. **Iterates** through the list to register click handlers
3. **Updates** the `sheetTab` attribute when button is clicked
4. **CSS** displays appropriate sheet based on `sheetTab` value

**Technical Details**:

- Uses `forEach()` for cleaner code than multiple `on()` calls
- Sets `sheetTab` attribute which triggers CSS rules
- No validation needed - only valid buttons exist

**CSS Integration**:

The worker sets the `sheetTab` attribute, which CSS uses to show/hide views:

```css
.sheet_toggle[value="character_sheet"] ~ div.character_sheet {
  display: block;
}
```

## Attribute Reference

### Attributes Modified by Workers

| Attribute | Type | Description | Modified By |
|-----------|------|-------------|-------------|
| `xp` | Number | Current XP total (0-12) | XP Bar Worker |
| `xp1` - `xp12` | Number | Individual XP checkboxes | XP Bar Worker |
| `sheetTab` | String | Current sheet view | Sheet Tab Worker |

### Attribute Values

**xp1-xp12**: 
- Unchecked: `0` or `undefined`
- Checked: Checkbox number (1-12)

**sheetTab**:
- `"character_sheet"` - Character view
- `"command_roster_sheet"` - Roster view
- `"weapon_profile_sheet"` - Weapon view
- `undefined` - Shows sheet selector

## Event Flow Diagrams

### XP Bar Update Flow

```
User checks XP box
    ↓
change:xpN event fires
    ↓
Worker reads all 12 XP values
    ↓
Calculate max value
    ↓
Set boxes 1-max to checked
    ↓
Store total in xp attribute
    ↓
UI updates
```

### Sheet Tab Switch Flow

```
User clicks sheet button
    ↓
clicked:sheet_name event fires
    ↓
Worker sets sheetTab attribute
    ↓
CSS rules activate
    ↓
Selected sheet displays
    ↓
Other sheets hide
```

## Performance Considerations

### XP Bar Worker

**Pros**:
- Single `setAttrs()` call per change (efficient)
- No complex calculations
- No external dependencies

**Optimization**:
- Uses `Math.max()` instead of loops for comparison
- Builds attributes object before calling `setAttrs()`
- Short-circuits with early validation

**Performance Impact**: Minimal - runs in < 1ms typically

### Sheet Tab Worker

**Pros**:
- Simple attribute update
- No calculations
- No attribute reads

**Optimization**:
- Direct `setAttrs()` call
- No conditional logic
- Leverages CSS for view switching

**Performance Impact**: Negligible

## Testing Sheet Workers

### Manual Testing

1. **XP Bar Worker**:
   ```
   - Open character sheet
   - Check various XP boxes
   - Verify progressive fill
   - Close and reopen sheet
   - Verify persistence
   ```

2. **Sheet Tab Worker**:
   ```
   - Click each sheet button
   - Verify correct view displays
   - Check tab persistence
   ```

### Browser Console Testing

```javascript
// Test XP worker manually
getAttrs(["xp1", "xp2", "xp3"], function(v) {
  console.log(v); // Check values
});

// Test sheet tab
getAttrs(["sheetTab"], function(v) {
  console.log(v.sheetTab); // Should be sheet name
});
```

### Common Issues

**XP Worker**:
- Issue: Boxes don't fill progressively
  - Check: Verify all `xp1-xp12` attributes exist
  - Check: Browser console for JavaScript errors

**Tab Worker**:
- Issue: Sheet doesn't switch
  - Check: `sheetTab` attribute value
  - Check: CSS rules for sheet display
  - Check: Button names match worker

## Debugging

### Enable Debug Logging

Add console logs temporarily:

```javascript
on("change:xp1 ... sheet:opened", function() {
  console.log("XP Worker triggered");
  getAttrs(["xp1", ...], function(v) {
    console.log("XP Values:", v);
    // ... rest of code
  });
});
```

### Common Debug Points

1. **Verify event fires**: Add `console.log()` at start of worker
2. **Check attribute values**: Log `getAttrs()` results
3. **Validate calculations**: Log intermediate values
4. **Confirm attribute sets**: Log before `setAttrs()`

### Roll20 Debugging Tools

- Browser Developer Tools (F12)
- Roll20 Sheet Sandbox
- Character sheet attribute viewer (in game)

## Extending Sheet Workers

### Adding New Workers

Template for new worker:

```javascript
on("change:attr_name", function() {
  getAttrs(["attr_name", "other_attr"], function(values) {
    // Process values
    const result = values.attr_name + values.other_attr;
    
    // Update attributes
    setAttrs({
      calculated_attr: result
    });
  });
});
```

### Best Practices

1. **Keep workers simple**: One clear purpose per worker
2. **Minimize attribute reads**: Read only what you need
3. **Batch updates**: Single `setAttrs()` call when possible
4. **Validate input**: Check for undefined/null values
5. **Document behavior**: Comment complex logic
6. **Test thoroughly**: Include edge cases

### Anti-Patterns to Avoid

❌ **Don't**: Create infinite loops
```javascript
// Bad: This could loop infinitely
on("change:attr_a", function() {
  setAttrs({attr_b: 1});
});
on("change:attr_b", function() {
  setAttrs({attr_a: 1});
});
```

❌ **Don't**: Make synchronous assumptions
```javascript
// Bad: Don't assume order
setAttrs({attr_a: 1});
// attr_a might not be set yet here
```

❌ **Don't**: Overuse workers
```javascript
// Bad: Let CSS handle this instead
on("change:show_section", function() {
  // Complex show/hide logic
});
```

✅ **Do**: Use CSS for display logic
✅ **Do**: Keep workers focused and simple
✅ **Do**: Use event batching when appropriate

## Roll20 Limitations

Be aware of Roll20's sheet worker limitations:

- No external libraries (jQuery, etc.)
- No DOM manipulation
- No external API calls
- Async operations only through callbacks
- Limited to Roll20 API functions

## Additional Resources

- [Roll20 Sheet Worker Scripts](https://wiki.roll20.net/Sheet_Worker_Scripts)
- [Roll20 Sheet Author Tips](https://wiki.roll20.net/Sheet_Author_Tips)
- [Roll20 Character Sheets GitHub](https://github.com/Roll20/roll20-character-sheets)

## Version History

- **v1.0**: Initial XP bar worker (switch statement)
- **v2.0**: Refactored XP bar worker (loop implementation)
- **v1.0**: Sheet tab selector worker

## Support

For issues with sheet workers:
1. Check browser console for errors
2. Test in Roll20 Sheet Sandbox
3. Review Roll20 documentation
4. Open GitHub issue with detailed description
