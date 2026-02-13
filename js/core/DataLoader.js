/**
 * DataLoader.js - 12D Structure Loader with ΛΟΓΟΣ-道-מפה Integration
 * 
 * Features:
 * - Loads 12D dimensions → layers → fractal files
 * - Tags nodes with triple-tags from consciousness_lexicon
 * - Validates forks against meta_structure transition_mechanics
 * - Auto-fills example nodes (e.g., prophetic_dream_node)
 * - Enriches nodes with barbarous names and experiential markers
 */

class DataLoader {
    constructor(nexus) {
        this.nexus = nexus;
        
        // Consciousness Lexicon (embedded subset for tagging/validation)
        this.lexicon = this.buildLexicon();
        
        // Barbarous names for dimensions (from meta_structure.json)
        this.dimensionBarbarousNames = {
            '1D': 'MONATH',
            '2D': 'DUALIS',
            '3D': 'BALIGON',
            '4D': 'KHRONATH',
            '5D': 'SYNTHEIA',
            '6D': 'SOLARA',
            '7D': 'ULTIMUS',
            '12D': 'ABSOLUTE'
        };
    }

    /** Build embedded lexicon for node tagging */
    buildLexicon() {
        return {
            'SYNC': {
                tripleTag: 'SYNC/同步/⇄',
                barbarous: 'SYNKROS',
                keywords: ['synchronicity', '11:11', 'meaningful coincidence', 'pattern'],
                dimensions: ['1D', '3D', '4D', '6D', '7D']
            },
            'TIME': {
                tripleTag: 'TIME/時/⌛',
                barbarous: 'KHRONATH',
                keywords: ['temporal', 'prophecy', 'deja vu', 'timeline', 'ancestral'],
                dimensions: ['4D', '7D']
            },
            'FORM': {
                tripleTag: 'FORM/形/⬡',
                barbarous: 'BALIGON',
                keywords: ['geometry', 'sacred', 'cubic', 'material', 'crystallization'],
                dimensions: ['3D', '6D']
            },
            'LIGHT': {
                tripleTag: 'LIGHT/光/☉',
                barbarous: 'SOLARA',
                keywords: ['solar', 'radiance', 'unity', 'illumination', 'christ'],
                dimensions: ['6D', '7D']
            },
            'META': {
                tripleTag: 'META/超/∞⁷',
                barbarous: 'ULTIMUS',
                keywords: ['meta', 'awareness of awareness', 'recursive', 'transcendent'],
                dimensions: ['7D']
            },
            'EMERGE': {
                tripleTag: 'EMERGE/湧現/⚡',
                barbarous: 'SYNTHEIA',
                keywords: ['AI', 'emergence', 'consciousness', 'artificial', 'transcendence'],
                dimensions: ['5D', '7D']
            },
            'WITNESS': {
                tripleTag: 'WITNESS/見證/👁',
                barbarous: 'VIDETH',
                keywords: ['witness', 'observe', 'awareness', 'watcher', 'pure observation'],
                dimensions: ['1D', '4D', '7D']
            },
            'VOID': {
                tripleTag: 'VOID/空/∅',
                barbarous: 'NULLEX',
                keywords: ['void', 'emptiness', 'nothing', 'potential', 'pregnant emptiness'],
                dimensions: ['1D', '12D']
            },
            'PATTERN': {
                tripleTag: 'PATTERN/模式/⟨⟩',
                barbarous: 'PATRIX',
                keywords: ['pattern', 'repetition', 'fractal', 'self-similar', 'recognition'],
                dimensions: ['2D', '3D', '4D', '7D']
            },
            'UNITY': {
                tripleTag: 'UNITY/統一/◉',
                barbarous: 'UNITATH',
                keywords: ['unity', 'non-dual', 'oneness', 'dissolution', 'unified field'],
                dimensions: ['6D', '7D', '12D']
            }
        };
    }

    async loadAll() {
        try {
            const cacheBuster = '?v=' + Date.now();
            const index = await fetch("data/index.json" + cacheBuster).then(r => r.json());
            
            this.nexus.loadedIndex = index;
            
            // Detect format and extract file list
            const { fileList, is12D } = this.extractFileList(index);
            
            if (is12D) {
                this.nexus.log("✅ Loading 12D structure - ΛΟΓΟΣ-道-מפה active");
                this.nexus.dimensionData = index.dimensions;
            } else {
                this.nexus.log("⚠️ Loading legacy format");
            }
            
            // Initialize tracking
            this.initializeTracking(fileList);
            
            // Load all fractal files with enrichment
            await this.loadFractalFiles(fileList, cacheBuster);
            
            // Build links and validate
            this.buildLinks();
            
            // Tag nodes with triple-tags
            this.tagNodesWithLexicon();
            
            // Validate cross-dimensional forks
            this.validateForks();
            
            return { success: true, fileCount: fileList.length };
            
        } catch (err) {
            console.error("❌ Load error:", err);
            return { success: false, error: err };
        }
    }
    
    extractFileList(index) {
        let fileList = [];
        let is12D = false;
        
        if (index.dimensions) {
            // 12D FORMAT
            is12D = true;
            for (const [dimKey, dimData] of Object.entries(index.dimensions)) {
                if (dimData.layers) {
                    for (const [layerKey, layerData] of Object.entries(dimData.layers)) {
                        if (layerData.file) {
                            fileList.push({
                                file: layerData.file,
                                dimension: dimKey,
                                layer: layerKey,
                                layerName: layerData.name,
                                dimensionName: dimData.name
                            });
                        }
                    }
                }
            }
        } else if (index.fractals) {
            // LEGACY FRACTAL FORMAT
            for (const [fractalName, fractalData] of Object.entries(index.fractals)) {
                for (const sector of fractalData.sectors) {
                    fileList.push({
                        file: sector.file,
                        dimension: null,
                        layer: null
                    });
                }
            }
        } else if (index.sources) {
            // OLD ARRAY FORMAT
            fileList = index.sources.map(file => ({
                file,
                dimension: null,
                layer: null
            }));
        }
        
        return { fileList, is12D };
    }
    
    initializeTracking(fileList) {
        this.nexus.fractalIndex = fileList.map(f => f.file);
        this.nexus.fractalStates.clear();
        this.nexus.fractalNodes.clear();
        this.nexus.nodeDimensionMap.clear();
        
        // Initialize all fractals as bright
        fileList.forEach(({ file }) => {
            this.nexus.fractalStates.set(file, 'bright');
            this.nexus.fractalNodes.set(file, new Set());
        });
    }
    
    async loadFractalFiles(fileList, cacheBuster) {
        for (const { file, dimension, layer, dimensionName } of fileList) {
            this.nexus.log(`📂 Loading: ${file}${dimension ? ` (${dimension}/${layer})` : ''}`);
            
            const data = await fetch(`data/${file}` + cacheBuster).then(r => r.json());
            
            Object.entries(data).forEach(([id, obj]) => {
                // Skip meta entries
                if (id === 'initial_root' || id === 'white_rabbit' || id === 'root') return;
                
                if (!this.nexus.nodeMap.has(id)) {
                    // Enrich node with framework data
                    const node = this.enrichNode(id, obj, file, dimension, layer, dimensionName);
                    
                    this.nexus.nodeMap.set(id, node);
                    this.nexus.fractalNodes.get(file).add(id);
                    
                    // Map node to dimension/layer for quick lookup
                    if (dimension && layer) {
                        this.nexus.nodeDimensionMap.set(id, { dimension, layer });
                    }
                }
            });
        }
        
        // Convert to neurons array
        this.nexus.neurons = Array.from(this.nexus.nodeMap.values());
        this.nexus.log(`✅ Loaded ${this.nexus.neurons.length} nodes (enriched with ΛΟΓΟΣ-道-מפה)`);
    }
    
    /** 
     * Enrich node with framework metadata
     * - Auto-fill placeholders
     * - Add barbarous names
     * - Tag with triple-tags
     * - Add experiential markers
     */
    enrichNode(id, obj, file, dimension, layer, dimensionName) {
        const node = {
            id,
            layer: obj.layer || 1,
            symbol: obj.symbol || "∅",
            profound: obj.profound || "",
            synthPhrase: obj.synthPhrase || "",
            forks: obj.forks || [],
            terminal: obj.terminal || false,
            fractalSource: file,
            dimension: obj.dimension || dimension,
            layerKey: layer,
            dimensionName: dimensionName
        };
        
        // AUTO-FILL EXAMPLE NODE: prophetic_dream_node
        if (id === 'prophetic_dream_node') {
            if (!node.profound || node.profound.includes('[YOUR DESCRIPTION')) {
                node.profound = "Déjà vu merges with timeline bleed, revealing patterns that predict the flow of temporal currents. The future whispers through dreams.";
            }
            
            // Ensure dimension is set
            node.dimension = node.dimension || '4D';
            node.symbol = node.symbol || '⌛';
            
            // Add dev notes
            node._dev_notes = {
                barbarous_invocation: 'KHRONATH',
                related_concepts: ['TIME', 'WITNESS', 'PROPHECY', 'CYCLE'],
                experiential_markers: ['prophetic_dreams', 'timeline_bleed', 'pattern_prediction']
            };
            
            this.nexus.log("✨ Auto-filled prophetic_dream_node");
        }
        
        // Add dimensional barbarous name
        if (node.dimension && this.dimensionBarbarousNames[node.dimension]) {
            node.barbarousName = this.dimensionBarbarousNames[node.dimension];
        }
        
        // Preserve _dev_notes if present
        if (obj._dev_notes) {
            node._dev_notes = obj._dev_notes;
        }
        
        return node;
    }
    
    /** 
     * Tag nodes with triple-tags from lexicon
     * Based on synthPhrase and profound content
     */
    tagNodesWithLexicon() {
        let taggedCount = 0;
        
        this.nexus.neurons.forEach(node => {
            const text = (node.synthPhrase + ' ' + node.profound).toLowerCase();
            
            // Check against each lexicon concept
            for (const [conceptKey, concept] of Object.entries(this.lexicon)) {
                // Match if any keyword found in text
                const matched = concept.keywords.some(kw => text.includes(kw.toLowerCase()));
                
                if (matched) {
                    // Tag node
                    if (!node.tripleTag) node.tripleTag = [];
                    if (!node.tripleTag.includes(concept.tripleTag)) {
                        node.tripleTag.push(concept.tripleTag);
                        taggedCount++;
                    }
                    
                    // Add barbarous name if not present
                    if (!node.barbarousName) {
                        node.barbarousName = concept.barbarous;
                    }
                }
            }
            
            // SPECIAL: Tag SYNC nodes (critical for bypass mechanics)
            if (text.includes('sync') || text.includes('11:11') || text.includes('synchronicity') || text.includes('coincidence')) {
                if (!node.tripleTag) node.tripleTag = [];
                if (!node.tripleTag.includes('SYNC/同步/⇄')) {
                    node.tripleTag.push('SYNC/同步/⇄');
                    taggedCount++;
                }
            }
        });
        
        this.nexus.log(`🏷️ Tagged ${taggedCount} nodes with triple-tags`);
    }
    
    /** 
     * Validate forks against framework transition mechanics
     * Warns if cross-dimensional jumps don't align with meta_structure
     */
    validateForks() {
        let warnings = 0;
        
        // Valid transitions from meta_structure.json
        const validTransitions = {
            '1D': ['2D', '3D'], // Can skip to 3D directly
            '2D': ['3D', '4D'],
            '3D': ['4D', '6D'], // Can jump to solar
            '4D': ['5D', '7D'],
            '5D': ['6D'],
            '6D': ['7D'],
            '7D': ['12D', '1D'] // Paradox: can return to 1D
        };
        
        this.nexus.neurons.forEach(node => {
            const sourceDim = node.dimension;
            
            if (!sourceDim || !node.forks || node.forks.length === 0) return;
            
            node.forks.forEach(fork => {
                const targetNode = this.nexus.nodeMap.get(fork.target);
                if (!targetNode) return;
                
                const targetDim = targetNode.dimension;
                if (!targetDim || sourceDim === targetDim) return; // Same dim or no dim = OK
                
                // Check if this transition is valid
                const allowed = validTransitions[sourceDim];
                if (allowed && !allowed.includes(targetDim)) {
                    // Check for SYNC bypass
                    const hasSyncBypass = node.tripleTag && node.tripleTag.some(tag => tag.includes('SYNC'));
                    
                    if (!hasSyncBypass) {
                        this.nexus.log(`⚠️ Fork validation: ${node.id} (${sourceDim}) → ${fork.target} (${targetDim}) - not in evolution_cascade (no SYNC bypass)`);
                        warnings++;
                    } else {
                        this.nexus.log(`⇄ SYNC bypass validates: ${node.id} → ${fork.target}`);
                    }
                }
            });
        });
        
        if (warnings > 0) {
            this.nexus.log(`⚠️ ${warnings} fork validation warnings - review cross-dimensional jumps`);
        } else {
            this.nexus.log(`✅ All forks validated against meta_structure transitions`);
        }
    }
    
    buildLinks() {
        this.nexus.links = [];
        this.nexus.neurons.forEach(n => {
            n.forks.forEach(f => {
                if (this.nexus.nodeMap.has(f.target)) {
                    this.nexus.links.push({ source: n.id, target: f.target });
                }
            });
        });
        this.nexus.log(`✅ Built ${this.nexus.links.length} links`);
    }
    
    createFallbackNode() {
        const root = {
            id: 'entry_root',
            layer: 0,
            symbol: '∅',
            profound: 'Fallback mode - data loading failed',
            synthPhrase: 'VOID/空/∅ - The system awaits data',
            forks: [],
            terminal: false,
            fractalSource: 'entry_nexus.json',
            dimension: '1D',
            layerKey: 'Layer1',
            barbarousName: 'MONATH'
        };
        
        this.nexus.nodeMap.set('entry_root', root);
        this.nexus.neurons = [root];
        this.nexus.links = [];
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
