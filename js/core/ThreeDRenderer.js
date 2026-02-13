/**
 * ThreeDRenderer.js - METATRONIC CONE GEOMETRY
 * 12 dimensional planes expanding from singularity (1D) to godhead (12D)
 * Central pillar with branches, ascending consciousness visualization
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
        
        // Visual settings - CONE GEOMETRY
        this.nodeSize = 1.0;
        this.connectionOpacity = 0.4;
        this.planeSpacing = 20; // Vertical space between dimensions
        this.basePlaneSize = 40; // 1D bigger base (not tiny singularity)
        this.topPlaneSize = 140; // 12D is vast (godhead)
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000510);
        this.scene.fog = new THREE.FogExp2(0x000510, 0.0012);

        // Create camera - view the cone from outside
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(100, 120, 140);

        // Create renderer with improvements from Genspark
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
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

        // Add orbit controls - COMPLETELY FREE
        if (typeof window.THREEOrbitControls !== 'undefined') {
            this.controls = new window.THREEOrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 10;
            this.controls.maxDistance = 500;
            this.controls.enablePan = true;
            this.controls.screenSpacePanning = true;
            
            // REMOVE ALL ANGLE RESTRICTIONS
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI;
            this.controls.minAzimuthAngle = -Infinity;
            this.controls.maxAzimuthAngle = Infinity;
            
            // Start looking at middle of cone
            this.controls.target.set(0, 110, 0);
            this.controls.update();
        }

        // Enhanced lighting
        this.setupLighting();

        // Build the metatronic structure
        this.buildConeGeometry();
        this.buildCentralPillar();

        // Handle events
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));

        // Start animation
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404060, 1.0);
        this.scene.add(ambientLight);

        // Top light (from godhead)
        const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
        topLight.position.set(0, 300, 0);
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 2048;
        topLight.shadow.mapSize.height = 2048;
        this.scene.add(topLight);

        // Bottom light (from singularity) - dimmer
        const bottomLight = new THREE.PointLight(0xff0000, 0.8, 200);
        bottomLight.position.set(0, -10, 0);
        this.scene.add(bottomLight);

        // Accent lights around the cone
        const accentColors = [0xff00ff, 0x00ffff, 0xffff00];
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const light = new THREE.PointLight(accentColors[i], 0.6, 150);
            light.position.set(
                Math.cos(angle) * 80,
                110, // Mid-height
                Math.sin(angle) * 80
            );
            this.scene.add(light);
        }
    }

    /**
     * Build expanding cone geometry - planes grow from 1D to 12D
     */
    buildConeGeometry() {
        for (let dim = 1; dim <= 12; dim++) {
            const t = (dim - 1) / 11; // 0 to 1
            const y = t * 11 * this.planeSpacing;
            const color = this.getDimensionColor(`${dim}D`);
            
            // CONE EXPANSION - size grows with dimension
            const planeSize = this.basePlaneSize + (t * (this.topPlaneSize - this.basePlaneSize));
            
            // Circular plane
            const geometry = new THREE.CircleGeometry(planeSize, 64);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.12,
                side: THREE.DoubleSide,
                depthWrite: false,
                shininess: 100
            });
            
            const plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = y;
            plane.receiveShadow = true;
            
            this.scene.add(plane);
            this.dimensionalPlanes.push(plane);
            
            // Glowing edge ring
            const ringGeometry = new THREE.RingGeometry(
                planeSize - 1, 
                planeSize, 
                64
            );
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = y;
            this.scene.add(ring);
            
            // Add dimension label at edge
            this.addDimensionLabel(dim, y, planeSize, color);
        }
    }

    /**
     * Add subtle dimension labels
     */
    addDimensionLabel(dim, y, radius, color) {
        // Create small marker sphere at edge
        const markerGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(radius, y, 0);
        this.scene.add(marker);
    }

    /**
     * Build central pillar with branches reaching to dimensional planes
     */
    buildCentralPillar() {
        const totalHeight = 11 * this.planeSpacing;
        
        // CENTRAL TRUNK - Pillar of Light
        const trunkGeometry = new THREE.CylinderGeometry(
            1.5, // Top radius
            3.0, // Bottom radius (thicker at base)
            totalHeight,
            32
        );
        const trunkMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a3728,
            emissive: 0x2a1718,
            emissiveIntensity: 0.3,
            shininess: 50
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = totalHeight / 2;
        trunk.castShadow = true;
        this.scene.add(trunk);
        
        // Glowing core (1000 braids of light)
        const coreGeometry = new THREE.CylinderGeometry(0.8, 1.5, totalHeight, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.7
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = totalHeight / 2;
        this.scene.add(core);
        
        // BRANCHES - reaching to each dimensional plane
        for (let dim = 1; dim <= 12; dim++) {
            const t = (dim - 1) / 11;
            const y = t * 11 * this.planeSpacing;
            const color = this.getDimensionColor(`${dim}D`);
            const planeSize = this.basePlaneSize + (t * (this.topPlaneSize - this.basePlaneSize));
            
            // Number of branches scales with dimension size
            const branchCount = Math.max(4, Math.floor(4 + dim * 0.5));
            
            for (let b = 0; b < branchCount; b++) {
                const angle = (b / branchCount) * Math.PI * 2;
                const branchLength = planeSize * 0.6; // Reach 60% out to edge
                
                const endX = Math.cos(angle) * branchLength;
                const endZ = Math.sin(angle) * branchLength;
                
                // Curved branch
                const branchStart = new THREE.Vector3(0, y, 0);
                const branchMid = new THREE.Vector3(endX * 0.3, y + 1, endZ * 0.3);
                const branchEnd = new THREE.Vector3(endX, y, endZ);
                
                const branchCurve = new THREE.QuadraticBezierCurve3(branchStart, branchMid, branchEnd);
                const branchPoints = branchCurve.getPoints(20);
                const branchGeometry = new THREE.TubeGeometry(
                    new THREE.CatmullRomCurve3(branchPoints),
                    20,
                    0.25,
                    8,
                    false
                );
                
                const branchMaterial = new THREE.MeshPhongMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 0.4,
                    transparent: true,
                    opacity: 0.6
                });
                
                const branch = new THREE.Mesh(branchGeometry, branchMaterial);
                this.scene.add(branch);
            }
            
            // Junction node on trunk
            const junctionGeometry = new THREE.SphereGeometry(1.0, 16, 16);
            const junctionMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            const junction = new THREE.Mesh(junctionGeometry, junctionMaterial);
            junction.position.y = y;
            this.scene.add(junction);
        }
        
        // Root system at singularity
        const rootCount = 6;
        for (let r = 0; r < rootCount; r++) {
            const angle = (r / rootCount) * Math.PI * 2;
            const rootEnd = new THREE.Vector3(
                Math.cos(angle) * 12,
                -5,
                Math.sin(angle) * 12
            );
            
            const rootCurve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(rootEnd.x * 0.5, -2, rootEnd.z * 0.5),
                rootEnd
            );
            const rootPoints = rootCurve.getPoints(15);
            const rootGeometry = new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3(rootPoints),
                15,
                0.4,
                8,
                false
            );
            const rootMaterial = new THREE.MeshPhongMaterial({
                color: 0x3a2818,
                emissive: 0x1a0808,
                emissiveIntensity: 0.2
            });
            const root = new THREE.Mesh(rootGeometry, rootMaterial);
            this.scene.add(root);
        }
    }

    /**
     * Position node on expanding cone surface
     */
    dimensionToPosition(dimension, layer, nodeId) {
        const dimNum = parseInt(dimension.replace('D', ''));
        const t = (dimNum - 1) / 11;
        
        // Y position on cone
        const y = t * 11 * this.planeSpacing;
        
        // Plane size at this dimension
        const planeSize = this.basePlaneSize + (t * (this.topPlaneSize - this.basePlaneSize));
        
        // Better distribution - use percentage of plane size
        const maxRadius = planeSize * 0.8; // Use 80% of plane radius
        
        // Layer determines ring distance from center (as percentage)
        const layerPercent = Math.min(0.2 + (layer * 0.15), 0.9); // 20% to 90%
        const layerRadius = maxRadius * layerPercent;
        
        // Angle from hash + some variation
        const hash = nodeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const angle = ((hash % 360) / 360) * Math.PI * 2;
        
        // Add slight vertical variation so nodes don't overlap perfectly
        const yVariation = ((hash % 100) / 100 - 0.5) * 2; // -1 to +1
        
        const x = Math.cos(angle) * layerRadius;
        const z = Math.sin(angle) * layerRadius;
        
        return new THREE.Vector3(x, y + yVariation, z);
    }

    /**
     * Get color based on dimension
     */
    getDimensionColor(dimension) {
        const colors = {
            '1D': 0xff0000,  // Red - singularity
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
            '12D': 0x00ffff  // Cyan - godhead
        };
        return colors[dimension] || 0x00ffff;
    }

    /**
     * Load nodes as glowing consciousness spheres on cone
     */
    loadFractalData(nodes, connections, visibilityManager) {
        this.clearScene();
        
        // Create sphere nodes with glow
        nodes.forEach(node => {
            const isVisible = !visibilityManager || visibilityManager.getNodeVisibility(node.id) !== 'hidden';
            if (isVisible) {
                const position = this.dimensionToPosition(
                    node.dimension,
                    node.layer || 0,
                    node.id
                );
                
                const color = this.getDimensionColor(node.dimension);
                
                // Main sphere
                const geometry = new THREE.SphereGeometry(this.nodeSize, 24, 24);
                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 1.5,
                    metalness: 0.2,
                    roughness: 0.4
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.copy(position);
                mesh.castShadow = true;
                mesh.userData = { nodeData: node };
                
                // GLOW EFFECT (from Genspark - actually good!)
                const glowGeometry = new THREE.SphereGeometry(this.nodeSize * 1.4, 16, 16);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.3
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                glow.userData = { nodeData: node }; // Copy userData so glow is also clickable
                mesh.add(glow);
                
                this.scene.add(mesh);
                this.nodes.push(mesh);
                
                if (!this.fractalGroups.has(node.fractal)) {
                    this.fractalGroups.set(node.fractal, []);
                }
                this.fractalGroups.get(node.fractal).push(mesh);
            }
        });

        // Create connections
        connections.forEach(conn => {
            const sourceNode = this.nodes.find(n => n.userData.nodeData.id === conn.source);
            const targetNode = this.nodes.find(n => n.userData.nodeData.id === conn.target);
            
            if (sourceNode && targetNode) {
                const sourceDim = parseInt(sourceNode.userData.nodeData.dimension.replace('D', ''));
                const targetDim = parseInt(targetNode.userData.nodeData.dimension.replace('D', ''));
                
                let lineColor, lineOpacity;
                
                // Cross-dimensional (ascension/descension paths)
                if (Math.abs(sourceDim - targetDim) > 1) {
                    lineColor = 0xff00ff; // Magenta
                    lineOpacity = 0.6;
                    
                    // Curve through center (pillar)
                    const midPoint = new THREE.Vector3(0, 
                        (sourceNode.position.y + targetNode.position.y) / 2, 
                        0
                    );
                    
                    const curve = new THREE.QuadraticBezierCurve3(
                        sourceNode.position,
                        midPoint,
                        targetNode.position
                    );
                    const points = curve.getPoints(50);
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({
                        color: lineColor,
                        transparent: true,
                        opacity: lineOpacity
                    });
                    const line = new THREE.Line(geometry, material);
                    line.userData = { connectionData: conn };
                    this.scene.add(line);
                    this.connections.push(line);
                } else {
                    // Same dimension
                    lineColor = 0x00ffff;
                    lineOpacity = 0.3;
                    
                    const points = [sourceNode.position, targetNode.position];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({
                        color: lineColor,
                        transparent: true,
                        opacity: lineOpacity
                    });
                    const line = new THREE.Line(geometry, material);
                    line.userData = { connectionData: conn };
                    this.scene.add(line);
                    this.connections.push(line);
                }
            }
        });

        console.log(`🌟 Metatronic Cone: ${this.nodes.length} consciousness nodes, ${this.connections.length} ascension paths`);
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
        console.log('🖱️ 3D Click detected', { mouseX: this.mouse.x, mouseY: this.mouse.y });
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.nodes);
        
        console.log(`🎯 Raycaster found ${intersects.length} intersections`);
        
        if (intersects.length > 0) {
            const clickedNode = intersects[0].object;
            const nodeData = clickedNode.userData?.nodeData;
            
            console.log('✅ Node clicked:', nodeData?.id);
            
            if (nodeData) {
                const customEvent = new CustomEvent('node-selected-3d', {
                    detail: { nodeData }
                });
                window.dispatchEvent(customEvent);
            }
        } else {
            console.log('❌ No nodes hit by raycaster');
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Subtle plane pulse
        this.dimensionalPlanes.forEach((plane, i) => {
            const pulse = Math.sin(Date.now() * 0.0008 + i * 0.3) * 0.03 + 0.12;
            plane.material.opacity = pulse;
        });
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
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
}
