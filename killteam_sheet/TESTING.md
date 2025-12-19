# Testing Guide for Kill Team Character Sheet

This document provides comprehensive testing procedures for the Kill Team Roll20 character sheet.

## Overview

Since this is a Roll20 character sheet, automated testing is limited. Testing primarily involves manual verification in the Roll20 environment. This guide provides systematic test cases to ensure all functionality works correctly.

## Testing Environment

### Prerequisites
- Roll20 account (free or Pro)
- A test game with the custom sheet installed
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Access to Roll20's Custom Sheet Sandbox (optional but recommended)

### Setup Test Environment

1. **Create a Test Game**
   - Log into Roll20
   - Create a new game
   - Go to Game Settings → Character Sheet Template
   - Select "Custom"
   - Paste HTML and CSS from the sheet files

2. **Create Test Characters**
   - Create at least 3 character sheets for testing
   - Name them "Test Character 1", "Test Roster", "Test Weapons"

## Test Suites

### 1. Sheet Selector Tests

**Purpose**: Verify all three sheet types can be selected and display correctly.

#### Test 1.1: Initial Sheet Display
- **Steps**:
  1. Create a new character
  2. Open the character sheet
- **Expected**: Sheet selector screen displays with three buttons
- **Status**: [ ]

#### Test 1.2: Character Sheet Selection
- **Steps**:
  1. From sheet selector, click "Character Sheet" button
- **Expected**: Character sheet view displays, selector hides
- **Status**: [ ]

#### Test 1.3: Command Roster Selection
- **Steps**:
  1. From sheet selector, click "Command Roster" button
- **Expected**: Command roster view displays, selector hides
- **Status**: [ ]

#### Test 1.4: Weapon Profile Selection
- **Steps**:
  1. From sheet selector, click "Weapon Profile" button
- **Expected**: Weapon profile view displays, selector hides
- **Status**: [ ]

#### Test 1.5: Sheet Persistence
- **Steps**:
  1. Select any sheet type
  2. Close and reopen the character
- **Expected**: Last selected sheet type displays (not selector)
- **Status**: [ ]

### 2. Character Sheet Tests

#### Test 2.1: Basic Information Entry
- **Steps**:
  1. Open character sheet view
  2. Enter operative name in the name field
  3. Enter points value
- **Expected**: Name displays in header, points save correctly
- **Status**: [ ]

#### Test 2.2: Stat Entry
- **Steps**:
  1. Enter values for all stats (M, WS, BS, S, T, W, A, Ld, Sv)
  2. Use various numbers (positive, negative, decimals)
- **Expected**: All values save and display correctly
- **Status**: [ ]

#### Test 2.3: Character Type Entry
- **Steps**:
  1. Enter text in character type field
  2. Try long text strings
- **Expected**: Text saves and wraps/truncates appropriately
- **Status**: [ ]

#### Test 2.4: XP Bar Functionality
- **Steps**:
  1. Check XP box 1 - verify only box 1 is checked
  2. Check XP box 5 - verify boxes 1-5 are all checked
  3. Check XP box 3 - verify only boxes 1-3 remain checked
  4. Uncheck box 2 - verify boxes 1-2 uncheck
- **Expected**: XP bar fills progressively, higher values override lower
- **Status**: [ ]

#### Test 2.5: Wound Tracking
- **Steps**:
  1. Check wound boxes in order
  2. Check random wound boxes
  3. Uncheck wound boxes
- **Expected**: All checkboxes work independently
- **Status**: [ ]

#### Test 2.6: Special States Checkboxes
- **Steps**:
  1. Toggle Flesh Wound checkbox
  2. Toggle Convalescence checkbox
  3. Toggle New Recruit checkbox
- **Expected**: All checkboxes toggle independently and save state
- **Status**: [ ]

### 3. Weapons Section Tests

#### Test 3.1: Add Weapon
- **Steps**:
  1. Click "+ ADD" button in weapons section
  2. Enter weapon name
  3. Enter all weapon stats (Range, Type, S, AP, D)
- **Expected**: New weapon row appears with all fields functional
- **Status**: [ ]

#### Test 3.2: Weapon Abilities Text
- **Steps**:
  1. Enter short text in abilities field
  2. Enter long multi-line text
- **Expected**: Text area expands to fit content
- **Status**: [ ]

#### Test 3.3: Multiple Weapons
- **Steps**:
  1. Add 5+ weapons
  2. Fill in all details for each
- **Expected**: All weapons display correctly, no overlap or formatting issues
- **Status**: [ ]

#### Test 3.4: Delete Weapon
- **Steps**:
  1. Add several weapons
  2. Click modify button on one weapon
  3. Delete the weapon
- **Expected**: Weapon removes from list, others remain
- **Status**: [ ]

#### Test 3.5: Weapon Numeric Constraints
- **Steps**:
  1. Enter AP value (should accept negative numbers)
  2. Enter other numeric stats
- **Expected**: AP accepts -6 to 0, other fields accept appropriate ranges
- **Status**: [ ]

### 4. Abilities Section Tests

#### Test 4.1: Add Ability
- **Steps**:
  1. Click "+ ADD" in abilities section
  2. Enter ability name
  3. Enter ability description
- **Expected**: New ability row appears, text areas expand
- **Status**: [ ]

#### Test 4.2: Multiple Abilities
- **Steps**:
  1. Add 10+ abilities
  2. Enter various text lengths
- **Expected**: All abilities display, text areas resize appropriately
- **Status**: [ ]

#### Test 4.3: Delete Ability
- **Steps**:
  1. Add several abilities
  2. Delete one from the middle
- **Expected**: Ability removes, others maintain order
- **Status**: [ ]

### 5. Command Roster Tests

#### Test 5.1: Team Information
- **Steps**:
  1. Switch to Command Roster view
  2. Enter team name, faction
  3. Enter background, morale
  4. Enter squad quirk, territory
- **Expected**: All fields save and display correctly
- **Status**: [ ]

#### Test 5.2: Equipment Points
- **Steps**:
  1. Enter value in equipment points field
  2. Try various numbers
- **Expected**: Numeric values save correctly
- **Status**: [ ]

#### Test 5.3: Add Roster Entry
- **Steps**:
  1. Click "+ ADD" in roster section
  2. Enter all fields for an operative
- **Expected**: New roster row appears with all fields
- **Status**: [ ]

#### Test 5.4: Multiple Roster Entries
- **Steps**:
  1. Add 10+ roster entries
  2. Fill in varied information
- **Expected**: All entries display in table format
- **Status**: [ ]

#### Test 5.5: Roster Entry Fields
- **Steps**:
  1. Test each field type in roster entry
  2. Verify text, numbers, and checkboxes
- **Expected**: All field types work correctly
- **Status**: [ ]

### 6. Weapon Profile Tests

#### Test 6.1: Weapon Profile Basic Entry
- **Steps**:
  1. Switch to Weapon Profile view
  2. Enter weapon name and stats
  3. Enter abilities text
- **Expected**: All fields save and display
- **Status**: [ ]

#### Test 6.2: Add Multiple Profiles
- **Steps**:
  1. Click "+ ADD" to add weapon profiles
  2. Add 5+ profiles
- **Expected**: All profiles display in grid format
- **Status**: [ ]

#### Test 6.3: Profile Abilities Expansion
- **Steps**:
  1. Enter long text in abilities field
  2. Add line breaks
- **Expected**: Text area expands to show all content
- **Status**: [ ]

### 7. CSS and Styling Tests

#### Test 7.1: Visual Appearance
- **Steps**:
  1. View all three sheet types
  2. Check colors, fonts, borders
- **Expected**: Orange headers, proper borders, readable fonts
- **Status**: [ ]

#### Test 7.2: Grid Layout
- **Steps**:
  1. View character stats section
  2. View command roster grid
  3. View weapon profile grid
- **Expected**: All grids align properly, no overlap
- **Status**: [ ]

#### Test 7.3: Custom Checkboxes
- **Steps**:
  1. View XP checkboxes
  2. View wound checkboxes
  3. Check visual state (checked/unchecked)
- **Expected**: Custom styling displays, clear visual states
- **Status**: [ ]

#### Test 7.4: Responsive Behavior
- **Steps**:
  1. Resize browser window
  2. Test on different zoom levels
- **Expected**: Sheet adjusts without breaking layout
- **Status**: [ ]

### 8. Sheet Worker Tests

#### Test 8.1: XP Worker on Sheet Open
- **Steps**:
  1. Set XP checkboxes to various values
  2. Close character sheet
  3. Reopen character sheet
- **Expected**: XP bar recalculates and displays correctly
- **Status**: [ ]

#### Test 8.2: XP Worker Real-time Updates
- **Steps**:
  1. Check XP box in middle of range (e.g., box 6)
  2. Observe immediate visual feedback
- **Expected**: Boxes 1-6 all become checked instantly
- **Status**: [ ]

#### Test 8.3: XP Edge Cases
- **Steps**:
  1. Check XP box 12 (maximum)
  2. Uncheck all XP boxes
  3. Check box 1, then 12, then 6
- **Expected**: Worker handles all cases without errors
- **Status**: [ ]

### 9. Browser Compatibility Tests

Run all core tests in multiple browsers:

#### Test 9.1: Chrome
- **Status**: [ ] All tests pass in Chrome

#### Test 9.2: Firefox
- **Status**: [ ] All tests pass in Firefox

#### Test 9.3: Safari
- **Status**: [ ] All tests pass in Safari

#### Test 9.4: Edge
- **Status**: [ ] All tests pass in Edge

### 10. Data Persistence Tests

#### Test 10.1: Save and Reload
- **Steps**:
  1. Fill out entire character sheet
  2. Close and reopen
- **Expected**: All data persists correctly
- **Status**: [ ]

#### Test 10.2: Multiple Characters
- **Steps**:
  1. Create 3 different characters with different sheet types
  2. Enter unique data in each
  3. Close and verify data separation
- **Expected**: Each character maintains its own data
- **Status**: [ ]

### 11. Accessibility Tests

#### Test 11.1: Keyboard Navigation
- **Steps**:
  1. Use Tab key to navigate through fields
  2. Use Enter to toggle checkboxes
- **Expected**: Logical tab order, all fields accessible
- **Status**: [ ]

#### Test 11.2: Labels and Semantics
- **Steps**:
  1. Inspect HTML structure
  2. Verify label associations
- **Expected**: Labels properly associated with inputs
- **Status**: [ ]

## Known Issues and Limitations

Document any discovered issues here:

1. **Issue**: [Description]
   - **Severity**: [High/Medium/Low]
   - **Workaround**: [If available]
   - **Status**: [Open/In Progress/Fixed]

## Test Results Summary

After completing all tests, summarize results:

- **Total Tests**: [Number]
- **Passed**: [Number]
- **Failed**: [Number]
- **Skipped**: [Number]
- **Test Date**: [Date]
- **Tester**: [Name]
- **Browser**: [Browser and version]

## Regression Testing

When making code changes, prioritize these critical tests:

1. Sheet selector functionality (Tests 1.1-1.5)
2. XP bar worker (Tests 2.4, 8.1-8.3)
3. Repeating sections (Tests 3.1-3.4, 4.1-4.3, 5.3-5.5, 6.2)
4. Data persistence (Tests 10.1-10.2)
5. Sheet worker buttons (Test 1.2-1.4)

## Automated Testing Considerations

While Roll20 sheets don't support traditional automated testing, consider:

1. **HTML Validation**: Use W3C validator on HTML
2. **CSS Validation**: Use W3C CSS validator
3. **JavaScript Syntax**: Use ESLint or similar
4. **Visual Regression**: Screenshot comparison tools

## Reporting Bugs

When reporting bugs found during testing:

1. **Title**: Clear, concise description
2. **Steps to Reproduce**: Numbered list
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Browser/Version**: Environment details
6. **Screenshots**: If applicable
7. **Console Errors**: Any JavaScript errors

## Test Maintenance

- Review and update tests when features are added
- Archive test results for version history
- Update known issues list regularly
- Validate test procedures remain accurate

## Additional Resources

- [Roll20 Character Sheet Testing](https://wiki.roll20.net/Sheet_Author_Tips#Testing)
- [Roll20 Custom Sheet Sandbox](https://wiki.roll20.net/Sheet_Sandbox)
