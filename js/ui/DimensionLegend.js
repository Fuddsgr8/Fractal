// DimensionLegend.js - Color legend for dimensions

class DimensionLegend {
    constructor(nexus) {
        this.nexus = nexus;
        this.panel = null;
        
        // SYNCED WITH 3D RENDERER - Metatronic spectrum
        this.dimensionColors = {
            '1D': { color: '#ff0000', name: 'Singularity' },
            '2D': { color: '#ff4400', name: 'Duality' },
            '3D': { color: '#ff8800', name: 'Material/Geometry' },
            '4D': { color: '#ffcc00', name: 'Time/Prophecy' },
            '5D': { color: '#ffff00', name: 'AI/Consciousness' },
            '6D': { color: '#ccff00', name: 'Solar/Hybrids' },
            '7D': { color: '#88ff00', name: 'Meta/Archetypes' },
            '8D': { color: '#00ff00', name: 'Quantum Shift' },
            '9D': { color: '#00ff88', name: 'Cosmic Harmony' },
            '10D': { color: '#00ffcc', name: 'Infinite Potential' },
            '11D': { color: '#00ccff', name: 'Dimensional Weave' },
            '12D': { color: '#00ffff', name: 'Absolute Unity' }
        };
    }

    build() {
        this.panel = d3.select("body").append("div")
            .style("position", "fixed")
            .style("left", "10px")
            .style("bottom", "10px")
            .style("background", "rgba(0,20,40,0.92)")
            .style("border", "1px solid rgba(0,255,255,0.4)")
            .style("padding", "8px 10px")
            .style("font-family", "'Courier New', monospace")
            .style("font-size", "9px")
            .style("z-index", "9997")
            .style("color", "#0ff")
            .style("max-width", "180px")
            .style("border-radius", "4px")
            .style("pointer-events", "none");

        this.updatePanel();
    }

    updatePanel() {
        if (!this.panel) return;
        
        // Don't show anything if nodeMap is empty
        if (this.nexus.nodeMap.size === 0) {
            this.panel.html('<div style="font-size: 10px; color: #888;">Loading...</div>');
            return;
        }

        // Count nodes per dimension
        const dimCounts = {};
        Array.from(this.nexus.nodeMap.values()).forEach(node => {
            if (node.dimension) {
                dimCounts[node.dimension] = (dimCounts[node.dimension] || 0) + 1;
            }
        });

        let html = `
            <div style="font-size: 10px; font-weight: bold; color: #0ff; margin-bottom: 6px;">
                DIMENSION COLORS:
            </div>
        `;

        // Show ALL dimensions with color dots (even if no nodes)
        Object.entries(this.dimensionColors).forEach(([dim, info]) => {
            const count = dimCounts[dim] || 0;
            const opacity = count > 0 ? 1 : 0.4; // Dim if no nodes
            
            html += `
                <div style="display: flex; align-items: center; margin: 3px 0; font-size: 10px; opacity: ${opacity};">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${info.color}; border: 1px solid #000; margin-right: 6px; flex-shrink: 0;"></div>
                    <span style="color: #ccc;">${dim}: ${info.name}</span>
                </div>
            `;
        });

        this.panel.html(html);
    }
}

// Export
window.DimensionLegend = DimensionLegend;
