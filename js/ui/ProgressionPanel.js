// ProgressionPanel.js - Left-side progression tracker for player mode

class ProgressionPanel {
    constructor(nexus) {
        this.nexus = nexus;
        this.panel = null;
    }

    build() {
        this.panel = d3.select("body").append("div")
            .attr("class", "progression-panel")
            .style("position", "fixed")
            .style("left", "10px")
            .style("top", "10px")
            .style("background", "rgba(0,20,40,0.97)")
            .style("border", "2px solid #0ff")
            .style("padding", "16px")
            .style("font-family", "'Courier New', monospace")
            .style("font-size", "12px")
            .style("z-index", "9998")
            .style("color", "#0ff")
            .style("max-height", "90vh")
            .style("overflow-y", "auto")
            .style("width", "280px")
            .style("border-radius", "8px")
            .style("backdrop-filter", "blur(10px)")
            .style("display", "none"); // Hidden by default

        this.updatePanel();
    }

    show() {
        if (this.panel) this.panel.style("display", "block");
    }

    hide() {
        if (this.panel) this.panel.style("display", "none");
    }

    updatePanel() {
        if (!this.panel || !this.nexus.player) return;

        const dimensionColors = {
            '1D': '#ffffff',
            '2D': '#ffeb3b',
            '3D': '#4caf50',
            '4D': '#2196f3',
            '5D': '#9c27b0',
            '6D': '#ff9800',
            '7D': '#f44336',
            '8D': '#00bcd4',
            '9D': '#ff5722',
            '10D': '#795548',
            '11D': '#607d8b',
            '12D': '#ffd700'
        };

        // Count nodes per dimension
        const dimCounts = {};
        const dimUnlocked = {};
        for (let i = 1; i <= 12; i++) {
            dimCounts[i + 'D'] = 0;
            dimUnlocked[i + 'D'] = 0;
        }

        Array.from(this.nexus.nodeMap.values()).forEach(node => {
            if (node.dimension) {
                dimCounts[node.dimension] = (dimCounts[node.dimension] || 0) + 1;
                if (this.nexus.unlockedNodes.has(node.id)) {
                    dimUnlocked[node.dimension] = (dimUnlocked[node.dimension] || 0) + 1;
                }
            }
        });

        let html = `
            <div style="text-align: center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(0,255,255,0.3);">
                <div style="font-size: 15px; font-weight: bold; color: #0ff;">🗺️ PROGRESSION MAP</div>
            </div>

            <div style="margin-bottom: 16px; padding: 10px; background: rgba(255,100,0,0.15); border-radius: 6px; border: 1px solid rgba(255,100,0,0.4);">
                <div style="font-size: 13px; font-weight: bold; color: #ffaa00; margin-bottom: 6px;">Current Clearance</div>
                <div style="font-size: 24px; font-weight: bold; color: #ffaa00; text-align: center;">${this.nexus.player.dimensionalLevel}D</div>
            </div>

            <div style="margin-bottom: 12px; font-size: 11px; font-weight: bold; color: #0ff;">DIMENSION COLORS:</div>
        `;

        // Color legend
        for (let i = 1; i <= 9; i++) {
            const dim = i + 'D';
            const color = dimensionColors[dim];
            const count = dimCounts[dim] || 0;
            const unlocked = dimUnlocked[dim] || 0;
            const isActive = this.nexus.player.dimensionalLevel >= i;
            
            if (count > 0) {
                html += `
                    <div style="margin: 4px 0; display: flex; align-items: center; opacity: ${isActive ? 1 : 0.4};">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${color}; border: 1px solid #000; margin-right: 8px;"></div>
                        <span style="flex: 1; font-size: 11px;">${dim}</span>
                        <span style="font-size: 10px; color: ${isActive ? '#0f0' : '#666'};">${unlocked}/${count}</span>
                    </div>
                `;
            }
        }

        html += `
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(0,255,255,0.3); font-size: 10px; color: #888;">
                Progress through dimensions by exploring nodes. Unlock higher tiers to reveal new content.
            </div>
        `;

        this.panel.html(html);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressionPanel;
}
window.ProgressionPanel = ProgressionPanel;
