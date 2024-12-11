# MMM-SnowEffect

A MagicMirror² module that adds gentle falling snow to your mirror. Perfect for creating a winter atmosphere! The module automatically adapts to your device's capabilities through two performance modes.

## Effect Preview
[Screenshot coming soon]

## Key Features
- Beautiful falling snowflakes (white and light blue mix)
- Two performance modes for different devices
- Minimal impact on other modules
- Simple configuration

## Important: About Performance Modes

This module has two performance modes to work well on different devices:

### Light Mode (Default)
- Optimized for Raspberry Pi and similar devices
- Uses simple snowflake symbols (* and +)
- Lower resource usage
- Perfect for 24/7 operation

### Rich Mode
- For more powerful devices (desktop computers, powerful single-board computers)
- Uses proper Unicode snowflakes (❄ and ❆)
- More snowflakes and visual effects
- Enhanced visual experience

## Important Note About This Module
Unlike typical MagicMirror modules that display in specific positions (like `top_right` or `bottom_left`), this module works differently:
- It covers your entire mirror surface
- The snow falls across all other modules
- It doesn't interfere with other modules' functionality
- It must be set to `position: "fullscreen_above"` to work properly

Think of it as an overlay that adds a snowy atmosphere to your entire MagicMirror.

## Installation

### Step 1: Clone the Module
```bash
cd ~/MagicMirror/modules
git clone https://github.com/cgillinger/MMM-SnowEffect.git
```

### Step 2: Add to Config
Add this to your `config/config.js` file:
```javascript
{
    module: "MMM-SnowEffect",
    position: "fullscreen_above"    // This position is required!
}
```

### Step 3: Choose Performance Mode
1. Navigate to the module folder:
```bash
cd ~/MagicMirror/modules/MMM-SnowEffect
```

2. Open MMM-SnowEffect.js in your favorite text editor
3. Find the "defaults" section at the top:
```javascript
    defaults: {
        snow: true,           // Enable/disable snow effect
        performance: 'light', // 'light' for Raspberry Pi, 'rich' for powerful devices
        flakeCount: 25,       // Number of snowflakes
        speed: 1.0,          // Speed multiplier (1 = normal speed)
        minSize: 0.8,        // Minimum snowflake size
        maxSize: 1.5,        // Maximum snowflake size
    },
```

4. Change `performance: 'light'` to `performance: 'rich'` if you have a powerful device
5. Save the file and restart MagicMirror

### Step 4: Restart MagicMirror
```bash
pm2 restart MagicMirror  // If using pm2
```
or
```bash
npm run start  // If running directly
```

## Performance Guide

### Light Mode (Default)
Optimized for:
- Raspberry Pi (all models)
- Similar single-board computers
- Devices with limited resources

Features:
- 25 snowflakes
- Simple ASCII characters (* and +)
- Minimal animations
- Low CPU usage

### Rich Mode
Suitable for:
- Desktop computers
- Powerful single-board computers
- Devices with good performance

Features:
- 50 snowflakes
- Unicode snowflake characters (❄ and ❆)
- Enhanced visual effects
- More dynamic movement

## Settings Reference

| Setting | Values | Effect | Default | Notes |
|---------|--------|--------|---------|-------|
| `performance` | 'light' or 'rich' | Sets performance mode | 'light' | 'light' for Raspberry Pi |
| `snow` | true/false | Turns effect on/off | true | For temporary disable |
| `speed` | 0.5 to 2.0 | Fall speed | 1.0 | Higher = faster falling |
| `flakeCount` | 1 to 100 | Number of flakes | 25 | Affects performance |

## Troubleshooting

### Common Issues

1. **High CPU Usage**
   - Make sure you're using 'light' mode on Raspberry Pi
   - Reduce `flakeCount` if needed
   - Check that no other modules are causing high CPU usage

2. **Snow Not Visible**
   - Verify `position: "fullscreen_above"` in config
   - Check if the module is listed in your config
   - Make sure snow: true is set

3. **Choppy Animation**
   - Switch to 'light' mode
   - Reduce `flakeCount`
   - Ensure your device isn't overheating

4. **Module Crashes**
   - Start with 'light' mode
   - Use default settings first
   - Update MagicMirror to latest version

## Compatibility
- MagicMirror²: >= 2.20.0
- Works on all devices (performance varies)
- Major browsers supported

## Contributing
Found a bug or want to suggest improvements? Please [create an issue](https://github.com/cgillinger/MMM-SnowEffect/issues).

## Credits
- Created by Christian Gillinger
- Based on MagicMirror² by Michael Teeuw (https://github.com/MichMich)

## License
MIT License - see the [LICENSE](LICENSE) file for details.