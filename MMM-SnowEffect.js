/* MagicMirror²
 * Module: MMM-SnowEffect
 * 
 * By Christian Gillinger
 * MIT Licensed.
 * 
 * v2.0.1
 * 
 * Changelog:
 * v2.0.1 (2024-12-16)
 * - Removed performance presets system
 * - Simplified configuration with direct values
 * - Updated validation logic
 * 
 * v2.0.0 (2024-12-16)
 * - Moved all configuration to config.js
 * - Added comprehensive validation
 * - Improved error handling
 * 
 * v1.0.0 (2024-12-01)
 * - Initial release
 */

Module.register("MMM-SnowEffect", {
    // Default configuration - all can be overridden in config.js
    defaults: {
        snow: true,           // Enable/disable snow effect
        flakeCount: 25,       // Default count for light performance
        speed: 1.0,          // Speed multiplier (1 = normal speed)
        minSize: 0.8,        // Default minimum size
        maxSize: 1.5,        // Default maximum size
        characters: ['*', '+'], // Default characters (light mode style)
        sparkleEnabled: false  // Sparkle effect disabled by default
    },

    // Initialize the module
    start: function() {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.snowflakes = [];
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 5;

        // Apply configuration logic
        this.applyConfigurationLogic();
    },

    // Apply and validate all configuration settings
    applyConfigurationLogic: function() {
        // Validate numeric values
        this.config.flakeCount = Math.max(1, Math.min(100, this.config.flakeCount));
        this.config.speed = Math.max(0.1, Math.min(5.0, this.config.speed));
        
        // Validate size values
        this.config.minSize = Math.max(0.1, Math.min(5.0, this.config.minSize));
        this.config.maxSize = Math.max(0.1, Math.min(5.0, this.config.maxSize));
        
        // Ensure minSize is always smaller than maxSize
        if (this.config.minSize >= this.config.maxSize) {
            const temp = this.config.minSize;
            this.config.minSize = Math.min(temp, this.config.maxSize);
            this.config.maxSize = Math.max(temp, this.config.maxSize);
        }

        // Ensure we have valid characters
        if (!Array.isArray(this.config.characters) || this.config.characters.length === 0) {
            Log.warn("Invalid characters configuration, using default");
            this.config.characters = ['*', '+'];
        }

        // Validate boolean values
        this.config.snow = !!this.config.snow;
        this.config.sparkleEnabled = !!this.config.sparkleEnabled;
    },

    // Cleanup on module stop
    stop: function() {
        this.clearTimers();
        this.snowflakes = [];
    },

    // Clear any running timers
    clearTimers: function() {
        if (this.initTimer) {
            clearInterval(this.initTimer);
            this.initTimer = null;
        }
    },

    // Get styles
    getStyles: function() {
        return ["MMM-SnowEffect.css"];
    },

    // Get the DOM content for the module
    getDom: function() {
        try {
            const wrapper = document.createElement("div");
            wrapper.className = "snow-effect-wrapper";
            wrapper.id = "snow-effect-container";

            if (!this.config.snow) return wrapper;

            // Only create new snowflakes if not initialized
            if (!this.initialized) {
                this.createSnowflakes(wrapper);
                this.initialized = true;
            }

            return wrapper;
        } catch (e) {
            Log.error("Error in getDom: " + e.toString());
            return document.createElement("div");
        }
    },

    // Create snowflake elements
    createSnowflakes: function(wrapper) {
        const toCreate = this.config.flakeCount;
        
        for (let i = 0; i < toCreate; i++) {
            const snowflake = document.createElement("div");
            snowflake.className = "snow-effect-flake";
            
            // Add blue color randomly to some flakes
            if (Math.random() > 0.5) {
                snowflake.classList.add("blue");
            }
            
            // Calculate size and position
            const size = this.config.minSize + (Math.random() * (this.config.maxSize - this.config.minSize));
            const left = Math.random() * 98 + 1;
            const initialY = -(Math.random() * 100);
            const animationDuration = (8 + Math.random() * 4) / this.config.speed;
            
            // Select random character from configured set
            const flakeType = this.config.characters[Math.floor(Math.random() * this.config.characters.length)];

            // Apply styles
            snowflake.style.left = left + '%';
            snowflake.style.top = initialY + '%';
            snowflake.style.fontSize = size + 'rem';
            
            // Set up animations
            let animation = `snow-effect-fall ${animationDuration}s linear infinite`;
            
            if (this.config.sparkleEnabled) {
                const sparkleDelay = Math.random() * 2;
                snowflake.classList.add('sparkle');
                animation += `, snow-effect-sparkle ${1.5 + Math.random()}s ease-in-out ${sparkleDelay}s infinite`;
            }
            
            snowflake.style.animation = animation;
            snowflake.innerHTML = flakeType;
            wrapper.appendChild(snowflake);
            this.snowflakes.push(snowflake);
        }
    },

    // Handle notifications
    notificationReceived: function(notification) {
        if (notification === "MODULE_DOM_CREATED") {
            this.initTimer = setInterval(() => {
                const wrapper = document.getElementById("snow-effect-container");
                if (wrapper) {
                    if (!this.initialized || wrapper.children.length === 0) {
                        Log.info("Reinitializing snow effect...");
                        this.initialized = false;
                        wrapper.innerHTML = '';
                        this.createSnowflakes(wrapper);
                        this.initialized = true;
                    }
                    
                    wrapper.style.position = 'fixed';
                    wrapper.style.top = '0';
                    wrapper.style.left = '0';
                    wrapper.style.width = '100%';
                    wrapper.style.height = '100%';
                    wrapper.style.pointerEvents = 'none';
                    wrapper.style.zIndex = '99999999';

                    this.retryCount++;
                    if (this.retryCount >= this.maxRetries) {
                        clearInterval(this.initTimer);
                        this.initTimer = null;
                    }
                }
            }, 1000);
        }
    }
});