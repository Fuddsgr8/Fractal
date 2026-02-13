/**
 * NEXUS LABYRINTH - 12D Consciousness Map Orchestrator
 * ΛΟΓΟΣ-道-מפה Protocol Integration
 * 
 * Dual-Gate Progression System:
 * - Gate 1: Dimensional Clearance (progression.dimensionalLevel)
 * - Gate 2: Fractal Depth (progression.depthReached per fractal)
 * 
 * Framework-Informed Exceptions:
 * - Eternal Return: 1D always accessible (LINEAR/一/|)
 * - Sync Bypass: SYNC/同步/⇄ tagged nodes allow dimension jumps
 * - Anchor Tracking: Must complete key dimensions (1D, 3D, 6D, 7D)
 * - Multi-Path: Non-linear progression per evolution_cascade
 */

class NexusLabyrinth {
    constructor(DEV_MODE = true, DEBUG = true) {
        this.DEV_MODE = DEV_MODE;
        this.DEBUG = DEBUG;

        this.svg = d3.select("svg");
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.zoomG = this.svg.append("g");

        this.zoom = d3.zoom()
            .scaleExtent([0.1, 8])
            .filter(e => !(e.target.closest && e.target.closest(".node")))
            .on("zoom", (event) => {
                this.zoomG.attr("transform", event.transform);
            });
        this.svg.call(this.zoom);

        this.nodeMap = new Map();
        this.links = [];
        this.neurons = [];

        this.fractalNodes = new Map();
        this.fractalIndex = [];
        this.loadedIndex = null;

        this.dimensionData = null;
        this.dimensionStates = new Map();
        this.layerStates = new Map();
        this.nodeDimensionMap = new Map();
        this.fractalStates = new Map();

        this.originNode = null;
        this.currentNode = null;
        this.unlockedNodes = new Set();

        this.currentDimension = null;
        this.currentLayer = null;

        // DUAL-GATE PROGRESSION SYSTEM (Framework-Aligned)
        this.progression = {
            dimensionalLevel: 1,              // Current dimensional clearance (1-12)
            depthReached: {},                 // Map: fractalName → maxLayerReached
            anchorsCompleted: new Set(),      // Set of completed anchor dimensions ['1D', '3D', '6D', '7D']
            syncBypassActive: true,           // SYNC/同步/⇄ bypass enabled
            eternalReturnActive: true,        // 1D always accessible (LINEAR/一/|)
            
            // Anchor requirements (from meta_structure.json evolution_cascade)
            anchorRequirements: {
                '6D': ['1D', '3D'],           // Solar Unity requires Linear + Cubic foundations
                '7D': ['6D'],                 // Meta Enlightenment requires Solar
                '12D': ['7D']                 // Absolute Unity requires Meta
            },
            
            // Dimension number cache (optimization for 1000s nodes)
            _dimCache: new Map()
        };

        this.dev = {
            viewMode: "tease",                // fullbright | tease | player
            progressionEnabled: false,        // Toggle dual-gate system
            ghostClick: false,                // Bypass all gates for testing
            showReachableOverlay: false,
            reachableLimit: 3,
            syncBypassEnabled: true,          // Toggle SYNC bypass
            logBarbarousNames: true           // Log invocations (e.g., KHRONATH)
        };

        /** DEBUG-gated log with barbarous name support */
        this.log = (msg, ...args) => { 
            if (this.DEBUG) console.log(msg, ...args); 
        };

        this.layerColors = [
            "#ffffff", "#ffeb3b", "#4caf50", "#2196f3",
            "#ff9800", "#9c27b0", "#f44336", "#ffd700"
        ];

        // Subsystems
        this.visibilityManager = new VisibilityManager(this);
        this.dataLoader = new DataLoader(this);
        this.renderer = new Renderer(this);
        this.modal = new Modal(this);
        this.devPanel = new DevPanel(this);
        this.dimensionLegend = new DimensionLegend(this);

        // Initialize visibility
        this.visibilityManager.initializeDimensions();
        this.devPanel.build();
        this.dimensionLegend.build();
        this.log("DevPanel and DimensionLegend built");

        try {
            this.devPanel.updatePanel();
        } catch (e) {
            console.error("DevPanel update failed:", e);
        }

        this.dataLoader.loadAll().then(() => {
            this.currentNode = 'entry_root';
            this.originNode = 'entry_root';
            this.unlockedNodes.add('entry_root');
            this.initializeProgression();
            this.render();
            this.dimensionLegend.updatePanel();
            
            // Reset view to entry point
            setTimeout(() => {
                this.focusNode('entry_root');
            }, 500);
            
            this.log("✅ Nexus Labyrinth ready - ΛΟΓΟΣ-道-מפה protocol active");
        });
    }

    /** Center the view on a node by id with smooth transition */
    focusNode(id, duration = 800) {
        const node = this.nodeMap.get(id);
        if (!node) return;
        if (node.x == null || node.y == null) {
            this.log("Focus: node not in view; switch to Fullbright or ensure node is visible.");
            return;
        }
        const t = d3.zoomTransform(this.svg.node());
        const k = t.k;
        const newT = d3.zoomIdentity
            .translate(this.width / 2 - node.x * k, this.height / 2 - node.y * k)
            .scale(k);
        
        // Smooth transition instead of instant snap
        this.svg.transition()
            .duration(duration)
            .ease(d3.easeCubicInOut)
            .call(this.zoom.transform, newT);
    }

    /** Set all dimension, layer, and fractal visibility to bright */
    setAllBright() {
        for (let i = 1; i <= 12; i++) this.dimensionStates.set(`${i}D`, 'bright');
        this.layerStates.clear();
        this.fractalStates.forEach((_, file) => this.fractalStates.set(file, 'bright'));
        this.render();
    }

    getEffectiveViewMode() {
        return this.DEV_MODE ? this.dev.viewMode : "player";
    }

    getReachableNodes() {
        const reachable = [];
        const current = this.nodeMap.get(this.currentNode);

        if (current?.forks) {
            current.forks.forEach(f => {
                if (!this.unlockedNodes.has(f.target) && f.unlock !== false) {
                    const targetNode = this.nodeMap.get(f.target);
                    // In progression mode, only show reachable if accessible
                    if (this.dev.progressionEnabled) {
                        if (this.isNodeAccessible(targetNode)) {
                            reachable.push(f.target);
                        }
                    } else {
                        reachable.push(f.target);
                    }
                }
            });
        }
        return [...new Set(reachable)].slice(0, this.dev.reachableLimit);
    }

    isReachable(id) {
        return this.getReachableNodes().includes(id);
    }

    /** Forks from a specific node that are still locked (for modal display) */
    getReachableFromNode(node) {
        if (!node?.forks) return [];
        return node.forks
            .filter(f => !this.unlockedNodes.has(f.target) && f.unlock !== false)
            .map(f => f.target);
    }

    isShadowed(id) {
        return !this.unlockedNodes.has(id) && !this.isReachable(id);
    }

    /** 
     * DUAL-GATE ACCESSIBILITY CHECK
     * Framework-informed with exceptions:
     * - Eternal Return: 1D always passes
     * - Sync Bypass: SYNC tagged nodes bypass dimensional gates
     * - Anchor Gates: Higher dimensions require completed anchors
     */
    isNodeAccessible(node) {
        if (!node) return false;
        
        // Ghost mode: dev override bypasses all gates
        if (this.dev.ghostClick) return true;
        
        // Progression disabled: all accessible
        if (!this.dev.progressionEnabled) return true;
        
        // ETERNAL RETURN: 1D always accessible (LINEAR/一/|)
        if (this.progression.eternalReturnActive && this.extractDimensionFromNode(node) === '1D') {
            return true;
        }
        
        // GATE 1: Dimensional Clearance
        const nodeDimension = this.extractDimensionFromNode(node);
        const nodeDimLevel = this.dimensionToNumber(nodeDimension);
        
        // Check anchor requirements for higher dimensions
        const anchorReqs = this.progression.anchorRequirements[nodeDimension];
        if (anchorReqs) {
            const missingAnchors = anchorReqs.filter(a => !this.progression.anchorsCompleted.has(a));
            if (missingAnchors.length > 0) {
                this.log(`🔒 Anchor gate: ${nodeDimension} requires ${anchorReqs.join(', ')} - missing: ${missingAnchors.join(', ')}`);
                return false;
            }
        }
        
        // SYNC BYPASS: SYNC/同步/⇄ tagged nodes allow dimension jumps
        if (this.progression.syncBypassActive && this.dev.syncBypassEnabled) {
            if (node.tripleTag && node.tripleTag.includes('SYNC')) {
                this.log(`⇄ SYNC bypass active for ${node.id}`);
                return true;
            }
            // Also check synthPhrase for SYNC markers
            if (node.synthPhrase && (node.synthPhrase.includes('SYNC') || node.synthPhrase.includes('同步') || node.synthPhrase.includes('⇄'))) {
                this.log(`⇄ SYNC bypass via synthPhrase for ${node.id}`);
                return true;
            }
        }
        
        // Standard dimensional gate
        if (nodeDimLevel > this.progression.dimensionalLevel) {
            return false;
        }
        
        // GATE 2: Fractal Depth
        const fractalName = node.fractalSource;
        if (!fractalName) return true; // No fractal source = no depth restriction
        
        const maxDepth = this.progression.depthReached[fractalName] || 0;
        if (node.layer != null && node.layer > maxDepth + 1) {
            // Allow one layer ahead (for progression), block beyond that
            this.log(`📊 Depth gate: ${node.id} layer ${node.layer} > max ${maxDepth}`);
            return false;
        }
        
        return true;
    }

    /** 
     * Extract dimension from node with priority:
     * 1. node.dimension (explicit)
     * 2. Derive from nodeDimensionMap
     * 3. Fallback to layer-based estimation
     */
    extractDimensionFromNode(node) {
        if (!node) return '1D';
        
        // Priority 1: Explicit dimension field
        if (node.dimension) return node.dimension;
        
        // Priority 2: Check nodeDimensionMap
        const mapEntry = this.nodeDimensionMap.get(node.id);
        if (mapEntry && mapEntry.dimension) return mapEntry.dimension;
        
        // Priority 3: Layer-based fallback (conservative)
        if (node.layer != null) {
            if (node.layer <= 2) return '1D';
            if (node.layer <= 4) return '2D';
            if (node.layer <= 6) return '3D';
            return '4D';
        }
        
        return '1D'; // Ultra-safe default
    }

    /** Convert dimension string to number (cached for performance) */
    dimensionToNumber(dimStr) {
        if (!dimStr) return 1;
        
        // Check cache first
        if (this.progression._dimCache.has(dimStr)) {
            return this.progression._dimCache.get(dimStr);
        }
        
        const num = parseInt(dimStr.replace('D', '')) || 1;
        this.progression._dimCache.set(dimStr, num);
        return num;
    }

    /** PUBLIC: Test node click (for dev testing) */
    testNodeClick(targetId) {
        this.chooseFork(targetId, true);
    }

    render() {
        if (this.renderer) {
            const currentTransform = this.zoom ? d3.zoomTransform(this.svg.node()) : null;
            this.renderer.render();
            if (this.zoom && currentTransform) {
                this.svg.call(this.zoom.transform, currentTransform);
            }
        }
    }

    showNodeDetail(node) {
        if (this.modal) {
            this.modal.showNodeDetail(node);
        }
    }

    /**
     * FORK SELECTION with Dual-Gate Enforcement
     * Checks progression gates unless dev override active
     */
    chooseFork(targetId, canUnlock = true) {
        const mode = this.getEffectiveViewMode();
        const targetNode = this.nodeMap.get(targetId);

        if (!targetNode) {
            this.log(`⚠️ Target node ${targetId} not found`);
            return;
        }

        // Check progression gates if enabled
        if (this.dev.progressionEnabled && !this.dev.ghostClick && !this.isNodeAccessible(targetNode)) {
            const nodeDim = this.extractDimensionFromNode(targetNode);
            this.showBlockedToast(targetNode, nodeDim);
            this.log(`❌ Access denied: ${targetId} - dimension ${nodeDim}, player at ${this.progression.dimensionalLevel}D`);
            return;
        }

        // Player mode strict unlock check
        if (mode === "player" && !canUnlock && !this.unlockedNodes.has(targetId)) {
            return;
        }

        // UNLOCK AND TRACK PROGRESSION
        if (!this.unlockedNodes.has(targetId)) {
            this.unlockedNodes.add(targetId);
            
            // Log barbarous invocation if enabled
            if (this.dev.logBarbarousNames && targetNode.barbarousName) {
                this.log(`🜏 ${targetNode.barbarousName} invoked`);
            }
            
            // Update fractal depth tracking
            if (targetNode.fractalSource && targetNode.layer != null) {
                const currentMax = this.progression.depthReached[targetNode.fractalSource] || 0;
                if (targetNode.layer > currentMax) {
                    this.progression.depthReached[targetNode.fractalSource] = targetNode.layer;
                    this.log(`📈 Fractal depth: ${targetNode.fractalSource} → L${targetNode.layer}`);
                    
                    // Check if this completes an anchor dimension
                    this.checkAnchorCompletion(targetNode);
                }
            }
        }

        this.currentNode = targetId;

        const loc = this.nodeDimensionMap.get(targetId);
        if (loc) {
            this.currentDimension = loc.dimension;
            this.currentLayer = loc.layer;
        }

        this.closeModal();
        this.render();
        
        // AUTO-PAN: Camera follows current node with smooth animation
        setTimeout(() => {
            this.focusNode(targetId, 600); // 600ms smooth glide
        }, 100);

        // Wait for camera to arrive before showing modal
        setTimeout(() => this.showNodeDetail(targetNode), 750);
    }

    /**
     * Check if reaching this node completes an anchor dimension
     * Anchors: 1D, 3D, 6D, 7D (from evolution_cascade)
     */
    checkAnchorCompletion(node) {
        const dimension = this.extractDimensionFromNode(node);
        
        // Only certain dimensions are anchors
        if (!['1D', '3D', '6D', '7D'].includes(dimension)) return;
        
        // Check if this is max layer in dimension's primary fractal
        // (Simplified: mark complete when reaching layer 3+ in dimension)
        if (node.layer >= 3 && !this.progression.anchorsCompleted.has(dimension)) {
            this.progression.anchorsCompleted.add(dimension);
            this.log(`⚓ ANCHOR COMPLETE: ${dimension} - ${this.getBarbarousName(dimension)}`);
            
            // Auto-unlock next dimensional level if anchors allow
            this.evaluateDimensionalUnlock();
            
            // Update UI
            if (this.devPanel) {
                this.devPanel.updatePanel();
            }
        }
    }

    /**
     * Evaluate if player should unlock next dimensional level
     * Based on completed anchors
     */
    evaluateDimensionalUnlock() {
        // Evolution cascade: 1D → 3D → 6D → 7D → 12D
        if (this.progression.anchorsCompleted.has('1D') && this.progression.dimensionalLevel < 3) {
            this.progression.dimensionalLevel = 3; // Unlock to 3D
            this.log(`🔓 Dimensional unlock: 3D (BALIGON)`);
        }
        
        if (this.progression.anchorsCompleted.has('3D') && this.progression.dimensionalLevel < 6) {
            this.progression.dimensionalLevel = 6; // Unlock to 6D
            this.log(`🔓 Dimensional unlock: 6D (SOLARA)`);
        }
        
        if (this.progression.anchorsCompleted.has('6D') && this.progression.dimensionalLevel < 7) {
            this.progression.dimensionalLevel = 7; // Unlock to 7D
            this.log(`🔓 Dimensional unlock: 7D (ULTIMUS)`);
        }
        
        if (this.progression.anchorsCompleted.has('7D') && this.progression.dimensionalLevel < 12) {
            this.progression.dimensionalLevel = 12; // Unlock to 12D
            this.log(`🔓 Dimensional unlock: 12D (ABSOLUTE)`);
        }
    }

    /** Get barbarous name for dimension (from meta_structure.json) */
    getBarbarousName(dimension) {
        const names = {
            '1D': 'MONATH',
            '2D': 'DUALIS',
            '3D': 'BALIGON',
            '4D': 'KHRONATH',
            '5D': 'SYNTHEIA',
            '6D': 'SOLARA',
            '7D': 'ULTIMUS'
        };
        return names[dimension] || dimension;
    }

    closeModal() {
        if (this.modal) {
            this.modal.closeModal();
        }
    }

    /** Initialize progression tracking for all fractals */
    initializeProgression() {
        this.fractalIndex.forEach(fractalFile => {
            this.progression.depthReached[fractalFile] = 0;
        });
        this.log("✅ Progression initialized - Player at 1D (MONATH)");
    }

    /** DEV: Manual dimensional unlock */
    unlockDimension(targetDim) {
        const dimNum = this.dimensionToNumber(targetDim);
        if (dimNum > this.progression.dimensionalLevel && dimNum <= 12) {
            this.progression.dimensionalLevel = dimNum;
            this.log(`🔓 Manual unlock: ${targetDim} (${this.getBarbarousName(targetDim)})`);
            this.render();
            
            if (this.devPanel) {
                this.devPanel.updatePanel();
            }
        }
    }

    /** Show toast notification when access is blocked */
    showBlockedToast(node, requiredDim) {
        // Remove any existing toast
        d3.select('.progression-toast').remove();
        
        // Determine block reason
        const anchorReqs = this.progression.anchorRequirements[requiredDim];
        const missingAnchors = anchorReqs ? anchorReqs.filter(a => !this.progression.anchorsCompleted.has(a)) : [];
        
        let blockReason = '';
        if (missingAnchors.length > 0) {
            blockReason = `Complete anchors: ${missingAnchors.join(', ')}`;
        } else {
            blockReason = `Your clearance: ${this.progression.dimensionalLevel}D`;
        }
        
        // Get experiential hint from node if available
        const hint = node._dev_notes?.experiential_markers?.[0] || 'Explore deeper to unlock';
        
        const toast = d3.select('body')
            .append('div')
            .attr('class', 'progression-toast')
            .style('position', 'fixed')
            .style('top', '50%')
            .style('left', '50%')
            .style('transform', 'translate(-50%, -50%)')
            .style('background', 'rgba(30, 30, 30, 0.98)')
            .style('color', '#ffeb3b')
            .style('padding', '24px 32px')
            .style('border-radius', '16px')
            .style('border', '2px solid #ffeb3b')
            .style('font-family', "'Courier New', monospace")
            .style('font-size', '15px')
            .style('z-index', '99999')
            .style('text-align', 'center')
            .style('box-shadow', '0 0 40px rgba(255,235,59,0.4)')
            .style('backdrop-filter', 'blur(12px)')
            .style('max-width', '400px');
        
        toast.html(`
            <div style="font-weight: bold; font-size: 22px; margin-bottom: 12px;">⊢ THRESHOLD NOT CROSSED</div>
            <div style="margin-bottom: 8px; font-size: 16px;">${node.symbol || '🜏'} <strong>${node.id}</strong></div>
            <div style="opacity: 0.9; margin-bottom: 10px;">Requires: <strong>${requiredDim}</strong></div>
            <div style="opacity: 0.8; font-size: 14px; margin-bottom: 12px;">${blockReason}</div>
            <div style="font-size: 13px; opacity: 0.7; font-style: italic; border-top: 1px solid rgba(255,235,59,0.3); padding-top: 10px; margin-top: 10px;">Await: ${hint}</div>
        `);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            toast.transition().duration(400).style('opacity', 0).remove();
        }, 4000);
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = NexusLabyrinth;
}
