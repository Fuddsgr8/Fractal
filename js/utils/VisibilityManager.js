// VisibilityManager.js - 3-tier visibility (Dimension > Layer > Fractal)

class VisibilityManager {
    constructor(nexus) {
        this.nexus = nexus;
    }

    initializeDimensions() {
        for (let i = 1; i <= 12; i++) {
            this.nexus.dimensionStates.set(`${i}D`, 'bright');
        }
    }

    setDimensionState(dimension, state) {
        this.nexus.dimensionStates.set(dimension, state);
        this.nexus.log(`🌐 Dimension ${dimension}: ${state}`);
        this.nexus.render();
    }

    setLayerState(dimension, layer, state) {
        const key = `${dimension}_${layer}`;
        this.nexus.layerStates.set(key, state);
        this.nexus.log(`📊 Layer ${dimension}/${layer}: ${state}`);
        this.nexus.render();
    }

    setFractalState(fractalFile, state) {
        this.nexus.fractalStates.set(fractalFile, state);
        this.nexus.log(`📄 Fractal ${fractalFile}: ${state}`);
        this.nexus.render();
    }

    getNodeVisibility(nodeId) {
        const node = this.nexus.nodeMap.get(nodeId);
        if (!node) return 'bright';

        const mode = this.nexus.getEffectiveViewMode();
        if (mode === 'player' && this.nexus.dev.progressionEnabled) {
            const nodeDim = parseInt(node.dimension);
            if (!isNaN(nodeDim) && nodeDim > this.nexus.player.dimensionalLevel) {
                return 'hidden';
            }
        }

        if (node.dimension) {
            const dimState = this.nexus.dimensionStates.get(node.dimension);
            if (dimState === 'hidden') return 'hidden';
            if (dimState === 'shadowed') return 'shadowed';
        }

        if (node.dimension && node.layerKey) {
            const layerKey = `${node.dimension}_${node.layerKey}`;
            const layerState = this.nexus.layerStates.get(layerKey);
            if (layerState === 'hidden') return 'hidden';
            if (layerState === 'shadowed') return 'shadowed';
        }

        return this.getFractalVisibility(nodeId);
    }

    getFractalVisibility(nodeId) {
        const node = this.nexus.nodeMap.get(nodeId);
        if (!node || !node.fractalSource) return 'bright';
        return this.nexus.fractalStates.get(node.fractalSource) || 'bright';
    }

    isNodeClickable(nodeId) {
        const mode = this.nexus.getEffectiveViewMode();
        const visibility = this.getNodeVisibility(nodeId);

        if (visibility === 'hidden' || visibility === 'shadowed') return false;

        return this.nexus.unlockedNodes.has(nodeId) ||
            this.nexus.isReachable(nodeId) ||
            (this.nexus.DEV_MODE && (!this.nexus.dev.progressionEnabled || this.nexus.dev.ghostClick));
    }

    getVisibilityStats() {
        const stats = {
            dimensions: { bright: 0, shadowed: 0, hidden: 0 },
            layers: { bright: 0, shadowed: 0, hidden: 0 },
            fractals: { bright: 0, shadowed: 0, hidden: 0 }
        };

        this.nexus.dimensionStates.forEach(s => stats.dimensions[s]++);
        this.nexus.layerStates.forEach(s => stats.layers[s]++);
        this.nexus.fractalStates.forEach(s => stats.fractals[s]++);

        return stats;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisibilityManager;
}
