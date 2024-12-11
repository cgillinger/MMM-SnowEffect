/* Magic Mirror
 * Module: MMM-SnowEffect
 * By Christian Gillinger
 * MIT Licensed.
 */

Module.register("MMM-SnowEffect", {
    // Default configuration
    defaults: {
        snow: true,           // Enable/disable snow effect
        performance: 'rich', // 'light' for Raspberry Pi and low-power devices, 'rich' for powerful devices
        flakeCount: 25,       // Default count optimized for Raspberry Pi
        speed: 1.0,          // Speed multiplier (1 = normal speed)
        minSize: 0.8,        // Minimum size of snowflakes
        maxSize: 1.5,        // Maximum size of snowflakes
    },

    // Performance presets
    performancePresets: {
        light: {
            flakeCount: 25,
            characters: ['*', '+'],     // Simple ASCII characters for better performance
            sparkleEnabled: false,      // Disable sparkle effect for performance
            size: {min: 0.8, max: 1.5}  // Smaller size range for performance
        },
        rich: {
            flakeCount: 50,
            characters: ['❄', '❆'],     // Unicode snowflakes for better visuals
            sparkleEnabled: true,       // Enable sparkle effect
            size: {min: 1.0, max: 2.0}  // Larger size range for better visuals
        }
    },

    // Initialize the module
    start: function() {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.snowflakes = [];
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 5;

        // Apply performance preset
        const preset = this.performancePresets[this.config.performance] || this.performancePresets.light;
        this.activePreset = preset;

        // Override flakeCount if user specified it
        if (this.config.flakeCount === this.defaults.flakeCount) {
            this.config.flakeCount = preset.flakeCount;
        }
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

    createSnowflakes: function(wrapper) {
        const toCreate = this.config.flakeCount;
        const preset = this.activePreset;
        
        for (let i = 0; i < toCreate; i++) {
            const snowflake = document.createElement("div");
            snowflake.className = "snow-effect-flake";
            
            // Add blue color randomly to some flakes
            if (Math.random() > 0.5) {
                snowflake.classList.add("blue");
            }
            
            // Use preset values for sizing
            const size = preset.size.min + (Math.random() * (preset.size.max - preset.size.min));
            const left = Math.random() * 98 + 1;
            const initialY = -(Math.random() * 100);
            const animationDuration = (8 + Math.random() * 4) / this.config.speed;
            
            // Use preset characters
            const flakeType = preset.characters[Math.floor(Math.random() * preset.characters.length)];

            snowflake.style.left = left + '%';
            snowflake.style.top = initialY + '%';
            snowflake.style.fontSize = size + 'rem';
            
            // Base animation
            let animation = `snow-effect-fall ${animationDuration}s linear infinite`;
            
            // Add sparkle if enabled in preset
            if (preset.sparkleEnabled) {
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
    notificationReceived: function(notification, payload, sender) {
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