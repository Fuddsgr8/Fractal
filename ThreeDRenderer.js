/**
 * ThreeDRenderer.js - ULTIMATE COSMIC EDITION
 * Advanced 3D visualization with particle systems, post-processing, physics simulation,
 * volumetric lighting, shader effects, and mind-blowing visual enhancements
 * 
 * Features:
 * - Advanced particle systems and cosmic effects
 * - Post-processing pipeline with bloom, blur, distortion
 * - Volumetric lighting and dynamic shadows
 * - Physics simulation for dynamic interactions
 * - Shader-based materials and procedural textures
 * - Advanced animations and morphing effects
 * - Audio-reactive capabilities
 * - Real-time parameter control panel
 */

class ThreeDRenderer {
    constructor(containerSelector = 'body') {
        this.container = document.querySelector(containerSelector);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.nodes = [];
        this.connections = [];
        this.dimensionalPlanes = [];
        this.fractalGroups = new Map();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Advanced effect systems
        this.particleSystems = [];
        this.postProcessing = null;
        this.composer = null;
        this.bloomPass = null;
        this.noisePass = null;
        this.chromaticAberrationPass = null;
        this.volumetricLights = [];
        this.physicsWorld = null;
        this.audioAnalyser = null;
        this.shaderMaterials = new Map();
        this.morphingGroups = [];
        this.cosmicField = null;
        this.wormholeEffects = [];
        this.hologramProjectors = [];
        
        // Visual settings - ENHANCED
        this.nodeSize = 1.5;
        this.connectionOpacity = 0.6;
        this.planeSpacing = 30; // Increased for better visibility
        this.planeSize = 120;
        
        // Advanced configuration
        this.config = {
            particlesEnabled: true,
            postProcessingEnabled: true,
            physicsEnabled: true,
            audioReactive: false,
            volumetricLighting: true,
            shaderEffects: true,
            cosmicBackground: true,
            realtimeMorphing: true,
            wormholeConnections: true,
            hologramEffects: true,
            
            // Particle settings
            particleCount: 5000,
            particleSpeed: 0.02,
            particleSize: 0.1,
            
            // Post-processing
            bloomStrength: 2.5,
            bloomRadius: 0.8,
            chromaticAberration: 0.003,
            noiseIntensity: 0.1,
            
            // Physics
            gravity: -0.001,
            damping: 0.98,
            attractionForce: 0.0001,
            
            // Audio
            audioSensitivity: 1.0,
            bassBoost: 2.0,
            trebleBoost: 1.5,
            
            // Animation
            morphSpeed: 0.02,
            rotationSpeed: 0.005,
            pulseIntensity: 0.5
        };
        
        this.init();
    }

    init() {
        // Initialize physics world
        if (this.config.physicsEnabled) {
            this.initPhysics();
        }
        
        // Create scene with cosmic background
        this.scene = new THREE.Scene();
        if (this.config.cosmicBackground) {
            this.createCosmicBackground();
        } else {
            this.scene.background = new THREE.Color(0x000510);
            this.scene.fog = new THREE.FogExp2(0x000510, 0.0015);
        }

        // Create camera - angled view to see multiple planes
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(80, 100, 120);

        // Create renderer with post-processing support
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            stencil: true,
            depth: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Create canvas container
        this.canvasContainer = document.createElement('div');
        this.canvasContainer.id = 'threejs-container';
        this.canvasContainer.style.position = 'absolute';
        this.canvasContainer.style.top = '0';
        this.canvasContainer.style.left = '0';
        this.canvasContainer.style.width = '100%';
        this.canvasContainer.style.height = '100%';
        this.canvasContainer.style.display = 'none';
        this.canvasContainer.appendChild(this.renderer.domElement);
        this.container.appendChild(this.canvasContainer);

        // Add orbit controls - FREE NAVIGATION
        if (typeof window.THREEOrbitControls !== 'undefined') {
            this.controls = new window.THREEOrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 10;
            this.controls.maxDistance = 500;
            this.controls.enablePan = true;
        }

        // Enhanced lighting system
        this.setupAdvancedLighting();
        const ambientLight = new THREE.AmbientLight(0x404060, 1.2);
        this.scene.add(ambientLight);

        // Directional light from above
        const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
        topLight.position.set(0, 300, 0);
        this.scene.add(topLight);

        // Initialize advanced systems
        this.initPostProcessing();
        this.initParticleSystems();
        this.initVolumetricLighting();
        this.initShaderMaterials();
        this.initAudioSystem();
        this.createControlPanel();

        // Handle events
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));

        // Start animation
        this.animate();
    }

    /**
     * Initialize physics world for dynamic interactions
     */
    initPhysics() {
        // Simple physics simulation
        this.physics = {
            particles: [],
            forces: [],
            constraints: []
        };
    }

    /**
     * Create cosmic background with nebula and starfield
     */
    createCosmicBackground() {
        // Create starfield
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.3 + 0.5, 0.5, Math.random() * 0.5 + 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
        
        // Create nebula background
        const nebulaGeometry = new THREE.SphereGeometry(1000, 64, 64);
        const nebulaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                varying vec2 vUv;
                
                vec3 nebula(vec2 uv) {
                    vec2 p = uv * 5.0;
                    float a = atan(p.y, p.x);
                    float r = length(p);
                    
                    float color = sin(a * 3.0 + time * 0.5) * cos(r * 2.0 - time * 0.3);
                    color += sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time) * 0.1;
                    
                    vec3 finalColor = vec3(
                        0.5 + 0.5 * sin(color + time * 0.2),
                        0.3 + 0.3 * sin(color + time * 0.3 + 2.0),
                        0.7 + 0.3 * sin(color + time * 0.4 + 4.0)
                    );
                    
                    return finalColor;
                }
                
                void main() {
                    vec2 uv = gl_FragCoord.xy / resolution.xy;
                    vec3 color = nebula(uv);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        this.nebulaSphere = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        this.scene.add(this.nebulaSphere);
    }

    /**
     * Setup advanced lighting with volumetric effects
     */
    setupAdvancedLighting() {
        // Ambient light with color temperature
        const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
        this.scene.add(ambientLight);
        
        // Multiple directional lights for dramatic lighting
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(100, 200, 100);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 500;
        this.scene.add(mainLight);
        
        // Colored accent lights
        const colorLights = [
            { color: 0xff4444, position: [-150, 100, 150], intensity: 0.8 },
            { color: 0x44ff44, position: [150, -100, -150], intensity: 0.8 },
            { color: 0x4444ff, position: [0, 200, -100], intensity: 1.0 }
        ];
        
        colorLights.forEach(lightConfig => {
            const light = new THREE.PointLight(lightConfig.color, lightConfig.intensity, 300);
            light.position.set(...lightConfig.position);
            this.scene.add(light);
        });
        
        // Volumetric light rays
        if (this.config.volumetricLighting) {
            this.createVolumetricLights();
        }
    }

    /**
     * Create volumetric lighting effects
     */
    createVolumetricLights() {
        const volumetricGeometry = new THREE.ConeGeometry(20, 100, 32, 1, true);
        const volumetricMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x4444ff) }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float intensity = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0));
                    intensity = max(0.0, intensity);
                    
                    float flicker = sin(time * 2.0 + vPosition.x * 0.1) * 0.1 + 0.9;
                    
                    vec3 finalColor = color * intensity * flicker;
                    float alpha = intensity * 0.3 * flicker;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        
        for (let i = 0; i < 5; i++) {
            const volumetricLight = new THREE.Mesh(volumetricGeometry, volumetricMaterial.clone());
            volumetricLight.position.set(
                (Math.random() - 0.5) * 200,
                Math.random() * 150 + 50,
                (Math.random() - 0.5) * 200
            );
            volumetricLight.rotation.x = Math.PI;
            this.scene.add(volumetricLight);
            this.volumetricLights.push(volumetricLight);
        }
    }

    /**
     * Initialize post-processing pipeline
     */
    initPostProcessing() {
        if (!this.config.postProcessingEnabled) return;
        
        this.composer = new THREE.EffectComposer(this.renderer);
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Bloom pass for glowing effects
        this.bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.config.bloomStrength,
            this.config.bloomRadius,
            0.85
        );
        this.composer.addPass(this.bloomPass);
        
        // Chromatic aberration for psychedelic effect
        if (this.config.chromaticAberration > 0) {
            const chromaticAberrationShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    amount: { value: this.config.chromaticAberration }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D tDiffuse;
                    uniform float amount;
                    varying vec2 vUv;
                    
                    void main() {
                        vec2 uv = vUv;
                        vec4 colorR = texture2D(tDiffuse, uv + vec2(amount, 0.0));
                        vec4 colorG = texture2D(tDiffuse, uv);
                        vec4 colorB = texture2D(tDiffuse, uv - vec2(amount, 0.0));
                        
                        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, colorG.a);
                    }
                `
            };
            
            this.chromaticAberrationPass = new THREE.ShaderPass(chromaticAberrationShader);
            this.composer.addPass(this.chromaticAberrationPass);
        }
        
        // Noise pass for film grain effect
        if (this.config.noiseIntensity > 0) {
            const noiseShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    time: { value: 0 },
                    intensity: { value: this.config.noiseIntensity }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D tDiffuse;
                    uniform float time;
                    uniform float intensity;
                    varying vec2 vUv;
                    
                    float random(vec2 st) {
                        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                    }
                    
                    void main() {
                        vec4 color = texture2D(tDiffuse, vUv);
                        float noise = (random(vUv + time) - 0.5) * intensity;
                        color.rgb += noise;
                        gl_FragColor = color;
                    }
                `
            };
            
            this.noisePass = new THREE.ShaderPass(noiseShader);
            this.composer.addPass(this.noisePass);
        }
    }

    /**
     * Initialize particle systems
     */
    initParticleSystems() {
        if (!this.config.particlesEnabled) return;
        
        // Cosmic particle system
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = this.config.particleCount;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
            
            velocities[i * 3] = (Math.random() - 0.5) * this.config.particleSpeed;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * this.config.particleSpeed;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * this.config.particleSpeed;
            
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pointTexture: { value: this.createParticleTexture() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 velocity;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec3 pos = position + velocity * time;
                    
                    // Wrap around boundaries
                    if (pos.x > 200.0) pos.x -= 400.0;
                    if (pos.x < -200.0) pos.x += 400.0;
                    if (pos.y > 200.0) pos.y -= 400.0;
                    if (pos.y < -200.0) pos.y += 400.0;
                    if (pos.z > 200.0) pos.z -= 400.0;
                    if (pos.z < -200.0) pos.z += 400.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                
                void main() {
                    vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
                    gl_FragColor = vec4(vColor, 1.0) * textureColor;
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.cosmicParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.cosmicParticles);
        this.particleSystems.push(this.cosmicParticles);
        
        // Energy stream particles
        this.createEnergyStreams();
    }

    /**
     * Create particle texture
     */
    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.3)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    /**
     * Create energy stream particles
     */
    createEnergyStreams() {
        const streamCount = 12;
        
        for (let i = 0; i < streamCount; i++) {
            const streamGeometry = new THREE.BufferGeometry();
            const streamParticleCount = 100;
            const positions = new Float32Array(streamParticleCount * 3);
            const colors = new Float32Array(streamParticleCount * 3);
            
            const radius = 50 + i * 10;
            const height = (i + 1) * this.planeSpacing;
            
            for (let j = 0; j < streamParticleCount; j++) {
                const angle = (j / streamParticleCount) * Math.PI * 2;
                positions[j * 3] = Math.cos(angle) * radius;
                positions[j * 3 + 1] = height;
                positions[j * 3 + 2] = Math.sin(angle) * radius;
                
                const color = new THREE.Color();
                color.setHSL((i / streamCount) * 0.8 + 0.1, 1.0, 0.7);
                colors[j * 3] = color.r;
                colors[j * 3 + 1] = color.g;
                colors[j * 3 + 2] = color.b;
            }
            
            streamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            streamGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const streamMaterial = new THREE.PointsMaterial({
                size: 3,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const stream = new THREE.Points(streamGeometry, streamMaterial);
            this.scene.add(stream);
            this.particleSystems.push(stream);
        }
    }

    /**
     * Initialize shader materials
     */
    initShaderMaterials() {
        if (!this.config.shaderEffects) return;
        
        // Holographic shader material
        const hologramShader = {
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffcc) },
                opacity: { value: 0.8 }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                uniform float opacity;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float scanline = sin(vPosition.y * 50.0 + time * 5.0) * 0.5 + 0.5;
                    float flicker = sin(time * 10.0 + vPosition.x * 20.0) * 0.1 + 0.9;
                    float edge = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
                    
                    vec3 finalColor = color * scanline * flicker;
                    float alpha = opacity * (0.5 + edge * 0.5);
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `
        };
        
        this.shaderMaterials.set('hologram', new THREE.ShaderMaterial(hologramShader));
        
        // Plasma shader
        const plasmaShader = {
            uniforms: {
                time: { value: 0 },
                intensity: { value: 1.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float intensity;
                varying vec2 vUv;
                
                void main() {
                    vec2 p = vUv * 10.0 - vec2(5.0);
                    float r = length(p);
                    float a = atan(p.y, p.x);
                    
                    float plasma = sin(r * 10.0 - time * 3.0) * cos(a * 5.0 + time * 2.0);
                    plasma += sin(p.x * 20.0 + time * 4.0) * sin(p.y * 20.0 + time * 3.0) * 0.5;
                    
                    vec3 color = vec3(
                        0.5 + 0.5 * sin(plasma + time),
                        0.3 + 0.3 * sin(plasma + time + 2.0),
                        0.7 + 0.3 * sin(plasma + time + 4.0)
                    ) * intensity;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        };
        
        this.shaderMaterials.set('plasma', new THREE.ShaderMaterial(plasmaShader));
    }

    /**
     * Initialize audio system for audio-reactive features
     */
    initAudioSystem() {
        if (!this.config.audioReactive) return;
        
        // Create audio analyser placeholder
        this.audioAnalyser = {
            frequencyData: new Uint8Array(256),
            timeData: new Uint8Array(256),
            getFrequency: () => Math.random() * 255,
            getBass: () => Math.random() * 255,
            getTreble: () => Math.random() * 255
        };
    }

    /**
     * Create interactive control panel
     */
    createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'cosmic-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 20px;
            color: #00ffff;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-width: 300px;
            backdrop-filter: blur(10px);
            z-index: 1000;
        `;
        
        panel.innerHTML = `
            <h3 style="margin-top: 0; color: #ffffff; text-align: center;">🌌 COSMIC CONTROLS 🌌</h3>
            <div style="margin-bottom: 15px;">
                <label>🌟 Particles: <input type="checkbox" id="particles-toggle" checked></label><br>
                <label>✨ Post-Processing: <input type="checkbox" id="postprocessing-toggle" checked></label><br>
                <label>💡 Volumetric Light: <input type="checkbox" id="volumetric-toggle" checked></label><br>
                <label>🎵 Audio-Reactive: <input type="checkbox" id="audio-toggle"></label><br>
                <label>🌀 Physics: <input type="checkbox" id="physics-toggle" checked></label><br>
                <label>🌈 Shaders: <input type="checkbox" id="shaders-toggle" checked></label>
            </div>
            <div style="margin-bottom: 15px;">
                <label>Bloom Strength: <input type="range" id="bloom-strength" min="0" max="5" step="0.1" value="2.5" style="width: 100%;"></label><br>
                <label>Particle Speed: <input type="range" id="particle-speed" min="0" max="0.1" step="0.01" value="0.02" style="width: 100%;"></label><br>
                <label>Rotation Speed: <input type="range" id="rotation-speed" min="0" max="0.02" step="0.001" value="0.005" style="width: 100%;"></label>
            </div>
            <div style="text-align: center;">
                <button id="reset-camera" style="background: #444; color: #0ff; border: 1px solid #0ff; padding: 5px 10px; margin: 2px; cursor: pointer;">📷 Reset Camera</button>
                <button id="randomize-colors" style="background: #444; color: #0ff; border: 1px solid #0ff; padding: 5px 10px; margin: 2px; cursor: pointer;">🎨 Random Colors</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('particles-toggle').addEventListener('change', (e) => {
            this.config.particlesEnabled = e.target.checked;
            this.cosmicParticles.visible = e.target.checked;
        });
        
        document.getElementById('postprocessing-toggle').addEventListener('change', (e) => {
            this.config.postProcessingEnabled = e.target.checked;
        });
        
        document.getElementById('bloom-strength').addEventListener('input', (e) => {
            this.config.bloomStrength = parseFloat(e.target.value);
            if (this.bloomPass) {
                this.bloomPass.strength = this.config.bloomStrength;
            }
        });
        
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.resetCamera();
        });
    }

    /**
     * Build 12 dimensional planes with insane visual effects
     */
    buildDimensionalPlanes() {
        for (let dim = 1; dim <= 12; dim++) {
            const y = (dim - 1) * this.planeSpacing;
            const color = this.getDimensionColor(`${dim}D`);
            
            // Enhanced circular plane with shader effects
            const geometry = new THREE.CircleGeometry(this.planeSize, 128);
            let material;
            
            if (this.config.shaderEffects && this.shaderMaterials.has('plasma')) {
                material = this.shaderMaterials.get('plasma').clone();
                material.uniforms.color.value = new THREE.Color(color);
            } else {
                material = new THREE.MeshPhongMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.15,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    shininess: 100,
                    emissive: new THREE.Color(color),
                    emissiveIntensity: 0.2
                });
            }
            
            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = y;
            plane.receiveShadow = true;
            
            this.scene.add(plane);
            this.dimensionalPlanes.push(plane);
            
            // Enhanced glowing edge ring with pulsing effect
            const ringGeometry = new THREE.RingGeometry(
                this.planeSize - 2, 
                this.planeSize, 
                128
            );
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = y;
            this.scene.add(ring);
            
            // Energy pillars with particle effects
            if (dim > 1) {
                const pillarHeight = this.planeSpacing;
                const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.5, pillarHeight, 32);
                const pillarMaterial = new THREE.MeshStandardMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.4,
                    metalness: 0.7,
                    roughness: 0.3,
                    emissive: new THREE.Color(color),
                    emissiveIntensity: 0.3
                });
                const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
                pillar.position.y = y - pillarHeight / 2;
                pillar.castShadow = true;
                this.scene.add(pillar);
            }
            
            // Wormhole portals at plane centers
            if (this.config.wormholeConnections) {
                this.createWormholePortal(0, y, 0, color);
            }
        }
        
        // Enhanced axis helper with particle trail
        const axesHelper = new THREE.AxesHelper(25);
        axesHelper.position.y = 0;
        this.scene.add(axesHelper);
        
        // Cosmic field grid
        if (this.config.cosmicBackground) {
            this.createCosmicField();
        }
    }

    /**
     * Create wormhole portal effect
     */
    createWormholePortal(x, y, z, color) {
        const portalGroup = new THREE.Group();
        
        // Main portal ring
        const ringGeometry = new THREE.TorusGeometry(8, 1, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            metalness: 0.9,
            roughness: 0.1,
            emissive: new THREE.Color(color),
            emissiveIntensity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        portalGroup.add(ring);
        
        // Inner portal effect
        const innerGeometry = new THREE.CircleGeometry(6, 64);
        const innerMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(color) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vUv - 0.5;
                    float dist = length(center);
                    float angle = atan(center.y, center.x);
                    
                    float swirl = sin(angle * 5.0 + time * 2.0) * sin(dist * 20.0 - time * 3.0);
                    float vortex = 1.0 - smoothstep(0.0, 0.5, dist);
                    
                    vec3 finalColor = color * swirl * vortex;
                    float alpha = vortex * 0.8;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const innerPortal = new THREE.Mesh(innerGeometry, innerMaterial);
        portalGroup.add(innerPortal);
        
        portalGroup.position.set(x, y, z);
        this.scene.add(portalGroup);
        this.wormholeEffects.push({ group: portalGroup, ring, innerPortal, material: innerMaterial });
    }

    /**
     * Create cosmic field grid
     */
    createCosmicField() {
        const gridSize = 200;
        const divisions = 20;
        
        const gridHelper1 = new THREE.GridHelper(gridSize, divisions, 0x0088ff, 0x004488);
        gridHelper1.position.y = -50;
        gridHelper1.material.transparent = true;
        gridHelper1.material.opacity = 0.3;
        this.scene.add(gridHelper1);
        
        const gridHelper2 = new THREE.GridHelper(gridSize, divisions, 0xff0088, 0x884488);
        gridHelper2.position.y = 400;
        gridHelper2.rotation.y = Math.PI / 4;
        gridHelper2.material.transparent = true;
        gridHelper2.material.opacity = 0.2;
        this.scene.add(gridHelper2);
        
        this.cosmicField = { grid1: gridHelper1, grid2: gridHelper2 };
    }

    /**
     * Position node ON its dimensional plane
     * Distribute naturally across the plane surface
     */
    dimensionToPosition(dimension, layer, nodeId) {
        const dimNum = parseInt(dimension.replace('D', ''));
        
        // Y position = which plane
        const y = (dimNum - 1) * this.planeSpacing;
        
        // Hash node ID for consistent position
        const hash = nodeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Distribute across plane using layer rings
        const maxRadius = this.planeSize - 10; // Keep away from edge
        const layerRadius = Math.min(15 + (layer * 12), maxRadius);
        
        // Angle based on hash
        const angle = ((hash % 360) / 360) * Math.PI * 2;
        
        const x = Math.cos(angle) * layerRadius;
        const z = Math.sin(angle) * layerRadius;
        
        return new THREE.Vector3(x, y, z);
    }

    /**
     * Get color based on dimension
     */
    getDimensionColor(dimension) {
        const colors = {
            '1D': 0xff0000,  // Red
            '2D': 0xff4400,  
            '3D': 0xff8800,  
            '4D': 0xffcc00,  
            '5D': 0xffff00,  
            '6D': 0xccff00,  
            '7D': 0x88ff00,  
            '8D': 0x00ff00,  
            '9D': 0x00ff88,  
            '10D': 0x00ffcc, 
            '11D': 0x00ccff, 
            '12D': 0x00ffff  
        };
        return colors[dimension] || 0x00ffff;
    }

    /**
     * Load nodes as insane glowing spheres with advanced effects
     */
    loadFractalData(nodes, connections, visibilityManager) {
        this.clearScene();
        
        // Create enhanced sphere nodes with shader effects
        nodes.forEach((node, index) => {
            const isVisible = !visibilityManager || visibilityManager.getNodeVisibility(node.id) !== 'hidden';
            if (isVisible) {
                const position = this.dimensionToPosition(
                    node.dimension,
                    node.layer || 0,
                    node.id
                );
                
                const color = this.getDimensionColor(node.dimension);
                
                // Enhanced SPHERE node with multiple layers
                const geometry = new THREE.SphereGeometry(this.nodeSize, 32, 32);
                let material;
                
                if (this.config.shaderEffects && this.shaderMaterials.has('hologram')) {
                    material = this.shaderMaterials.get('hologram').clone();
                    material.uniforms.color.value = new THREE.Color(color);
                } else {
                    material = new THREE.MeshStandardMaterial({
                        color: color,
                        emissive: new THREE.Color(color),
                        emissiveIntensity: 2.0,
                        metalness: 0.3,
                        roughness: 0.2,
                        transparent: true,
                        opacity: 0.9
                    });
                }
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.copy(position);
                mesh.castShadow = true;
                mesh.userData = { 
                    nodeData: node,
                    originalPosition: position.clone(),
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.1
                    )
                };
                
                this.scene.add(mesh);
                this.nodes.push(mesh);
                
                // Add multiple glow layers
                this.addNodeGlowLayers(mesh, color);
                
                // Add particle trail
                if (this.config.particlesEnabled) {
                    this.addNodeParticleTrail(mesh, color);
                }
                
                if (!this.fractalGroups.has(node.fractal)) {
                    this.fractalGroups.set(node.fractal, []);
                }
                this.fractalGroups.get(node.fractal).push(mesh);
            }
        });

        // Enhanced connections with multiple visual styles
        connections.forEach(conn => {
            const sourceNode = this.nodes.find(n => n.userData.nodeData.id === conn.source);
            const targetNode = this.nodes.find(n => n.userData.nodeData.id === conn.target);
            
            if (sourceNode && targetNode) {
                const sourceDim = parseInt(sourceNode.userData.nodeData.dimension.replace('D', ''));
                const targetDim = parseInt(targetNode.userData.nodeData.dimension.replace('D', ''));
                
                let lineColor, lineOpacity;
                
                if (Math.abs(sourceDim - targetDim) > 1) {
                    // Cross-dimensional = wormhole effect
                    lineColor = 0xff00ff;
                    lineOpacity = 0.8;
                    
                    // Create wormhole tunnel
                    this.createWormholeTunnel(sourceNode, targetNode, lineColor, lineOpacity);
                } else {
                    // Same/adjacent dimension = energy stream
                    lineColor = 0x00ffff;
                    lineOpacity = 0.6;
                    
                    // Create energy stream with particles
                    this.createEnergyStreamConnection(sourceNode, targetNode, lineColor, lineOpacity);
                }
            }
        });

        console.log(`🌌 COSMIC DIMENSIONS: ${this.nodes.length} insane sphere nodes, ${this.connections.length} reality-bending connections`);
    }

    /**
     * Add multiple glow layers to nodes
     */
    addNodeGlowLayers(node, color) {
        // Inner glow
        const innerGlowGeometry = new THREE.SphereGeometry(this.nodeSize * 1.2, 16, 16);
        const innerGlowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
        node.add(innerGlow);
        
        // Outer glow
        const outerGlowGeometry = new THREE.SphereGeometry(this.nodeSize * 1.8, 16, 16);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        node.add(outerGlow);
        
        // Corona effect
        const coronaGeometry = new THREE.SphereGeometry(this.nodeSize * 2.5, 8, 8);
        const coronaMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        node.add(corona);
    }

    /**
     * Add particle trail to nodes
     */
    addNodeParticleTrail(node, color) {
        const trailGeometry = new THREE.BufferGeometry();
        const trailLength = 20;
        const positions = new Float32Array(trailLength * 3);
        const colors = new Float32Array(trailLength * 3);
        
        for (let i = 0; i < trailLength; i++) {
            const alpha = 1 - (i / trailLength);
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = -i * 0.5;
            
            const trailColor = new THREE.Color(color);
            colors[i * 3] = trailColor.r * alpha;
            colors[i * 3 + 1] = trailColor.g * alpha;
            colors[i * 3 + 2] = trailColor.b * alpha;
        }
        
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const trailMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleTrail = new THREE.Points(trailGeometry, trailMaterial);
        node.add(particleTrail);
        
        node.userData.particleTrail = particleTrail;
    }

    /**
     * Create wormhole tunnel connection
     */
    createWormholeTunnel(sourceNode, targetNode, color, opacity) {
        const midPoint = new THREE.Vector3().lerpVectors(sourceNode.position, targetNode.position, 0.5);
        const distance = sourceNode.position.distanceTo(targetNode.position);
        
        // Create tunnel segments
        const segments = 20;
        const tunnelGroup = new THREE.Group();
        
        for (let i = 0; i < segments; i++) {
            const t = i / segments;
            const segmentPos = new THREE.Vector3().lerpVectors(sourceNode.position, targetNode.position, t);
            
            // Add distortion to create tunnel effect
            const distortion = Math.sin(t * Math.PI) * 10;
            segmentPos.x += (Math.random() - 0.5) * distortion;
            segmentPos.z += (Math.random() - 0.5) * distortion;
            
            const segmentGeometry = new THREE.SphereGeometry(0.5, 8, 8);
            const segmentMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity * (1 - Math.abs(t - 0.5) * 2),
                blending: THREE.AdditiveBlending
            });
            
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.copy(segmentPos);
            tunnelGroup.add(segment);
        }
        
        this.scene.add(tunnelGroup);
        
        const tunnelData = {
            group: tunnelGroup,
            source: sourceNode,
            target: targetNode,
            animationPhase: 0
        };
        
        this.connections.push(tunnelData);
    }

    /**
     * Create energy stream connection with particles
     */
    createEnergyStreamConnection(sourceNode, targetNode, color, opacity) {
        const points = [];
        const segments = 50;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const point = new THREE.Vector3().lerpVectors(sourceNode.position, targetNode.position, t);
            
            // Add some wave distortion
            const wave = Math.sin(t * Math.PI * 4) * 2;
            point.x += wave;
            point.z += wave;
            
            points.push(point);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity
        });
        
        const line = new THREE.Line(geometry, material);
        line.userData = { 
            connectionData: { source: sourceNode.userData.nodeData.id, target: targetNode.userData.nodeData.id },
            sourceNode: sourceNode,
            targetNode: targetNode
        };
        
        this.scene.add(line);
        this.connections.push(line);
        
        // Add energy particles along the stream
        this.addEnergyParticlesToConnection(line, color);
    }

    /**
     * Add energy particles to connection
     */
    addEnergyParticlesToConnection(connection, color) {
        const particleCount = 10;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const point = new THREE.Vector3().lerpVectors(
                connection.userData.sourceNode.position,
                connection.userData.targetNode.position,
                t
            );
            
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
            
            const particleColor = new THREE.Color(color);
            colors[i * 3] = particleColor.r;
            colors[i * 3 + 1] = particleColor.g;
            colors[i * 3 + 2] = particleColor.b;
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        
        connection.userData.energyParticles = particles;
    }

    clearScene() {
        this.nodes.forEach(node => this.scene.remove(node));
        this.connections.forEach(conn => this.scene.remove(conn));
        this.nodes = [];
        this.connections = [];
        this.fractalGroups.clear();
    }

    updateVisibility(visibilityManager) {
        this.nodes.forEach(nodeMesh => {
            const node = nodeMesh.userData.nodeData;
            const visible = visibilityManager.getNodeVisibility(node.id) !== 'hidden';
            nodeMesh.visible = visible;
        });
        
        this.connections.forEach(connLine => {
            const conn = connLine.userData.connectionData;
            const sourceVisible = this.nodes.find(n => 
                n.userData.nodeData.id === conn.source && n.visible
            );
            const targetVisible = this.nodes.find(n => 
                n.userData.nodeData.id === conn.target && n.visible
            );
            connLine.visible = sourceVisible && targetVisible;
        });
    }

    setVisible(visible) {
        this.canvasContainer.style.display = visible ? 'block' : 'none';
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);
        
        this.nodes.forEach(node => node.scale.set(1, 1, 1));
        
        if (intersects.length > 0) {
            const hoveredNode = intersects[0].object;
            hoveredNode.scale.set(1.5, 1.5, 1.5);
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);
        
        if (intersects.length > 0) {
            const clickedNode = intersects[0].object;
            const nodeData = clickedNode.userData.nodeData;
            
            const event = new CustomEvent('node-selected-3d', {
                detail: { nodeData }
            });
            window.dispatchEvent(event);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Update shader uniforms
        if (this.nebulaSphere) {
            this.nebulaSphere.material.uniforms.time.value = time;
        }
        
        if (this.starField) {
            this.starField.rotation.y += 0.0002;
        }
        
        // Update cosmic particles
        if (this.cosmicParticles) {
            this.cosmicParticles.material.uniforms.time.value = time;
        }
        
        // Update volumetric lights
        this.volumetricLights.forEach((light, i) => {
            if (light.material.uniforms) {
                light.material.uniforms.time.value = time;
            }
            light.rotation.y += 0.01;
        });
        
        // Update wormhole effects
        this.wormholeEffects.forEach(wormhole => {
            if (wormhole.material.uniforms) {
                wormhole.material.uniforms.time.value = time;
            }
            wormhole.group.rotation.y += 0.02;
        });
        
        // Enhanced plane pulse with audio reactivity
        this.dimensionalPlanes.forEach((plane, i) => {
            let pulseIntensity = 0.03;
            
            if (this.config.audioReactive && this.audioAnalyser) {
                const audioIntensity = this.audioAnalyser.getFrequency() / 255;
                pulseIntensity += audioIntensity * 0.05;
            }
            
            const pulse = Math.sin(Date.now() * 0.0008 + i * 0.3) * pulseIntensity + 0.15;
            plane.material.opacity = pulse;
            
            // Rotate planes slightly
            if (this.config.realtimeMorphing) {
                plane.rotation.z += 0.001;
            }
        });
        
        // Animate nodes with physics and morphing
        this.nodes.forEach((node, i) => {
            if (this.config.physicsEnabled) {
                // Apply physics simulation
                const velocity = node.userData.velocity;
                node.position.add(velocity);
                
                // Apply damping
                velocity.multiplyScalar(this.config.damping);
                
                // Add some random motion
                velocity.add(new THREE.Vector3(
                    (Math.random() - 0.5) * 0.001,
                    (Math.random() - 0.5) * 0.001,
                    (Math.random() - 0.5) * 0.001
                ));
                
                // Boundary constraints
                const originalPos = node.userData.originalPosition;
                const distance = node.position.distanceTo(originalPos);
                if (distance > 10) {
                    const returnForce = originalPos.clone().sub(node.position).multiplyScalar(0.001);
                    velocity.add(returnForce);
                }
            }
            
            if (this.config.realtimeMorphing) {
                // Morphing animation
                const morphOffset = Math.sin(time * this.config.morphSpeed + i * 0.5) * this.config.pulseIntensity;
                node.scale.setScalar(1 + morphOffset);
                
                // Rotate nodes
                node.rotation.x += this.config.rotationSpeed;
                node.rotation.y += this.config.rotationSpeed * 0.7;
            }
            
            // Audio-reactive scaling
            if (this.config.audioReactive && this.audioAnalyser) {
                const audioScale = this.audioAnalyser.getFrequency() / 255;
                const currentScale = node.scale.x;
                node.scale.setScalar(currentScale + audioScale * 0.3);
            }
        });
        
        // Animate connections
        this.connections.forEach((conn, i) => {
            if (conn.userData && conn.userData.connectionData) {
                // Regular connection animation
                if (conn.material) {
                    const pulse = Math.sin(time * 2 + i * 0.5) * 0.2 + 0.8;
                    conn.material.opacity = pulse * this.config.connectionOpacity;
                }
            } else if (conn.group) {
                // Wormhole tunnel animation
                conn.group.children.forEach((segment, j) => {
                    if (segment.material) {
                        const phase = (Date.now() * 0.005 + j * 0.2) % (Math.PI * 2);
                        segment.material.opacity = Math.sin(phase) * 0.3 + 0.5;
                        segment.scale.setScalar(1 + Math.sin(phase * 2) * 0.3);
                    }
                });
            }
        });
        
        // Update cosmic field
        if (this.cosmicField) {
            this.cosmicField.grid1.rotation.y += 0.0005;
            this.cosmicField.grid2.rotation.y -= 0.0003;
        }
        
        // Update post-processing
        if (this.config.postProcessingEnabled && this.composer) {
            if (this.noisePass) {
                this.noisePass.uniforms.time.value = time;
            }
            
            if (this.controls) {
                this.controls.update();
            }
            
            this.composer.render();
        } else {
            if (this.controls) {
                this.controls.update();
            }
            
            this.renderer.render(this.scene, this.camera);
        }
    }

    flyToNode(nodeId) {
        const nodeMesh = this.nodes.find(n => n.userData.nodeData.id === nodeId);
        if (nodeMesh) {
            const targetPos = nodeMesh.position.clone();
            targetPos.x += 30;
            targetPos.y += 20;
            targetPos.z += 30;
            
            const duration = 1500;
            const startPos = this.camera.position.clone();
            const startTime = Date.now();
            
            const animateCamera = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                
                this.camera.position.lerpVectors(startPos, targetPos, eased);
                this.controls.target.lerp(nodeMesh.position, eased);
                
                if (progress < 1) {
                    requestAnimationFrame(animateCamera);
                }
            };
            
            animateCamera();
        }
    }

    /**
     * Reset camera to default position
     */
    resetCamera() {
        const defaultPosition = new THREE.Vector3(80, 100, 120);
        const targetPosition = new THREE.Vector3(0, 150, 0);
        
        this.camera.position.copy(defaultPosition);
        if (this.controls) {
            this.controls.target.copy(targetPosition);
            this.controls.update();
        }
    }

    /**
     * Randomize colors for insane visual effects
     */
    randomizeColors() {
        this.nodes.forEach(node => {
            const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            node.material.color = randomColor;
            node.material.emissive = randomColor;
            
            // Update glow layers
            node.children.forEach(child => {
                if (child.material && child.material.color) {
                    child.material.color = randomColor;
                }
            });
        });
        
        this.dimensionalPlanes.forEach(plane => {
            const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
            plane.material.color = randomColor;
            if (plane.material.emissive) {
                plane.material.emissive = randomColor;
            }
        });
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        
        // Apply changes that need immediate update
        if (this.bloomPass) {
            this.bloomPass.strength = this.config.bloomStrength;
        }
        
        if (this.chromaticAberrationPass) {
            this.chromaticAberrationPass.uniforms.amount.value = this.config.chromaticAberration;
        }
        
        if (this.noisePass) {
            this.noisePass.uniforms.intensity.value = this.config.noiseIntensity;
        }
    }
}
