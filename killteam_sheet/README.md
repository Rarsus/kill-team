# Kill Team Character Sheet for Roll20

A custom character sheet for the Warhammer 40,000 Kill Team tabletop game, designed for use on Roll20.

## Overview

This character sheet provides three distinct view modes to support different aspects of Kill Team gameplay:

1. **Character Sheet** - Individual operative management with stats, weapons, abilities, and experience tracking
2. **Command Roster** - Team management with multiple operative entries and resource tracking
3. **Weapon Profile** - Quick reference for weapon statistics

## Features

### Character Sheet View
- **Operative Statistics**: M, WS, BS, S, T, W, A, Ld, Sv
- **Weapon Management**: Repeating weapons section with full stats (Range, Type, S, AP, D, Abilities)
- **Abilities Tracking**: Multiple abilities with descriptions
- **Experience System**: Visual XP tracker with 12 checkboxes
- **Wounds Tracking**: Visual wound counter
- **Special States**: Flesh Wound, Convalescence, New Recruit checkboxes
- **Points Calculation**: Operative points value display

### Command Roster View
- **Team Information**: Team name, faction, background, and morale
- **Squad Management**: Squad quirk and territory tracking
- **Operative Roster**: Repeating section for multiple operatives
- **Resource Tracking**: Equipment points and other team resources

### Weapon Profile View
- **Weapon Stats Display**: Range, Type, Strength, AP, Damage
- **Abilities Reference**: Quick lookup for weapon special rules
- **Comparative View**: Multiple weapons side-by-side

## Files

- **killteam.html** - Main HTML structure and sheet workers
- **killteam.css** - Styling and layout definitions
- **sheet.json** - Roll20 sheet metadata and configuration

## Technical Details

### Sheet Workers

The sheet includes JavaScript sheet workers that provide dynamic functionality:

#### XP Bar Worker
Automatically updates the XP display based on checked XP boxes. When any XP checkbox is toggled, the worker:
1. Reads all 12 XP checkbox values
2. Calculates the maximum checked value
3. Updates all checkboxes up to that value
4. Stores the final XP total

This ensures a progressive XP bar where all boxes up to the current level are checked.

#### Sheet Tab Selector
Manages switching between the three sheet views:
- Character Sheet
- Command Roster
- Weapon Profile

Clicking any view button updates the `sheetTab` attribute, which triggers CSS rules to show/hide the appropriate view.

### CSS Architecture

The stylesheet uses modern CSS features:

- **CSS Grid**: Flexible layout system for complex multi-column displays
- **Custom Checkboxes**: Styled checkbox replacements for wounds and XP tracking
- **Responsive Design**: Adapts to different Roll20 display sizes
- **Font Integration**: Custom fonts (Gunplay, Minion Pro) for thematic styling

### Attribute Naming Convention

All sheet attributes follow the pattern `attr_[name]`:
- `attr_character_name` - Operative name
- `attr_m`, `attr_ws`, etc. - Stat values
- `attr_weapon-name`, `attr_weapon-range`, etc. - Weapon properties
- `attr_xp1` through `attr_xp12` - XP checkboxes
- `attr_wounds1` through `attr_wounds5` - Wound checkboxes

## Installation

### For Roll20 Users

1. Go to Game Settings in your Roll20 game
2. Navigate to Character Sheet Template section
3. Select "Custom" from the dropdown
4. Copy the contents of `killteam.html` into the HTML Layout tab
5. Copy the contents of `killteam.css` into the CSS Styling tab
6. Save settings

### For Developers

1. Clone this repository
2. Make changes to the files in the `killteam_sheet` directory
3. Test changes in Roll20's Custom Sheet Sandbox
4. Submit pull requests for improvements

## Testing

See [TESTING.md](TESTING.md) for comprehensive testing procedures and test cases.

## Browser Compatibility

This sheet is designed for Roll20 and has been tested in:
- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Roll20 runs in a web browser, so modern browser features (CSS Grid, ES6 JavaScript) are supported.

## Development Guidelines

### Code Style

- **HTML**: All attributes should be quoted, consistent indentation
- **CSS**: Organize by section with clear comments, consistent spacing
- **JavaScript**: Use modern ES6+ syntax, clear variable names

### Making Changes

1. Test all three view modes after any changes
2. Verify repeating sections work correctly
3. Check that sheet workers function as expected
4. Validate HTML and CSS syntax
5. Test in Roll20 environment before submitting

### Adding New Features

When adding new features:
1. Follow existing naming conventions for attributes
2. Add appropriate CSS styling
3. Update documentation
4. Test thoroughly in all three view modes
5. Ensure mobile/tablet compatibility

## Accessibility

The sheet includes several accessibility features:
- Semantic HTML structure
- Label elements for form inputs
- Keyboard navigation support
- Clear visual hierarchy

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes following the code style guidelines
4. Test thoroughly
5. Submit a pull request with a clear description

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## Credits

- **Author**: Rarsus
- **Game**: Warhammer 40,000 Kill Team by Games Workshop
- **Platform**: Roll20

## License

See [LICENSE](../LICENSE) file for details.

## Support

For issues or questions:
1. Check the [Roll20 Wiki](https://wiki.roll20.net/Building_Character_Sheets) for general sheet development
2. Review [TESTING.md](TESTING.md) for common issues
3. Open an issue in the GitHub repository

## Version History

See git commit history for detailed changes.

## Additional Resources

- [Roll20 Character Sheet Documentation](https://wiki.roll20.net/Building_Character_Sheets)
- [Roll20 Sheet Author Tips](https://wiki.roll20.net/Sheet_Author_Tips)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Roll20 Sheet Workers](https://wiki.roll20.net/Sheet_Worker_Scripts)
