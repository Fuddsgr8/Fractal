// DevPanel.js - SIMPLIFIED VERSION - Just fractal visibility controls

class DevPanel {
    constructor(nexus) {
        this.nexus = nexus;
        this.panel = null;
    }

    build() {
        this.panel = d3.select("body").append("div")
            .style("position", "fixed")
            .style("right", "10px")
            .style("top", "10px")
            .style("background", "rgba(0,20,40,0.97)")
            .style("border", "2px solid #0ff")
            .style("padding", "16px")
            .style("font-family", "'Courier New', monospace")
            .style("font-size", "13px")
            .style("z-index", "9999")
            .style("color", "#0ff")
            .style("max-height", "85vh")
            .style("overflow-y", "auto")
            .style("width", "300px")
            .style("border-radius", "8px")
            .style("backdrop-filter", "blur(10px)")
            .style("pointer-events", "none");

        this.updatePanel();
    }

    updatePanel() {
        if (!this.panel) return;

        let html = `
            <div style="text-align: center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(0,255,255,0.3); pointer-events: auto;">
                <div style="font-size: 16px; font-weight: bold; color: #0ff;">🌏 NEXUS LABYRINTH</div>
                <div style="font-size: 10px; color: #66ccff; margin-top: 4px;">Visibility Control</div>
            </div>

            <div style="margin-bottom: 16px; padding: 10px; background: rgba(0,255,255,0.05); border-radius: 6px; pointer-events: auto;">
                <strong>📍 Location:</strong><br>
                <span style="font-size: 11px; color: #fff;">${this.getCurrentLocation()}</span>
            </div>
            
            <div style="margin-bottom: 16px; font-size: 11px; color: #888; pointer-events: auto;">
                Nodes: <strong style="color: #0ff;">${this.nexus.nodeMap.size}</strong> · Links: <strong style="color: #0ff;">${this.nexus.links.length}</strong>
            </div>
        `;

        // Focus node
        html += `
            <div style="margin-bottom: 16px; pointer-events: auto;">
                <label style="font-size: 11px;">Focus Node:</label>
                <div style="display: flex; gap: 4px; margin-top: 4px;">
                    <input type="text" id="focusNodeId" placeholder="node_id" style="flex: 1; font-size: 11px; padding: 4px;">
                    <button type="button" id="focusNodeBtn" style="padding: 4px 8px; cursor: pointer; font-size: 11px;">Go</button>
                </div>
            </div>
        `;

        // Reach limit
        html += `
            <div style="margin-bottom: 20px; pointer-events: auto;">
                <label style="font-size: 11px;">Reach Limit:</label>
                <input type="number" id="reachLimit" value="${this.nexus.dev.reachableLimit}" min="1" max="10" style="width: 50px; margin-left: 8px; font-size: 11px; padding: 4px;">
            </div>
        `;

        // Master controls
        html += `
            <div style="margin-bottom: 16px; padding-top: 12px; border-top: 1px solid rgba(0,255,255,0.3); pointer-events: auto;">
                <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">FRACTAL VISIBILITY</div>
                <button type="button" id="allBrightBtn" style="padding: 5px 10px; cursor: pointer; margin-right: 4px; font-size: 11px; background: #0ff; color: #000; border: none; border-radius: 3px;">☀ All Bright</button>
                <button type="button" id="allHideBtn" style="padding: 5px 10px; cursor: pointer; font-size: 11px; background: #f00; color: #fff; border: none; border-radius: 3px;">✖ All Hide</button>
            </div>
        `;

        // Fractal list with 3-state buttons
        const fractals = Array.from(this.nexus.fractalNodes.keys()).sort();
        fractals.forEach(file => {
            const state = this.nexus.fractalStates.get(file) || 'bright';
            const displayName = file.replace('_fractal.json', '').replace(/_/g, ' ').replace('.json', '');
            
            html += `
                <div style="margin: 8px 0; padding: 8px; background: rgba(0,255,255,0.03); border-radius: 4px; pointer-events: auto;">
                    <div style="font-size: 10px; color: #0ff; margin-bottom: 4px; text-transform: capitalize;">${displayName}</div>
                    <div class="fractal-controls" data-file="${file}" style="display: flex; gap: 3px;">
                        <button class="state-btn" data-state="bright" 
                                style="flex: 1; padding: 4px 2px; cursor: pointer; font-size: 9px; font-weight: ${state === 'bright' ? 'bold' : 'normal'}; 
                                background: ${state === 'bright' ? '#0ff' : '#333'}; color: ${state === 'bright' ? '#000' : '#666'}; 
                                border: 1px solid #0ff; border-radius: 3px;">
                            ☀
                        </button>
                        <button class="state-btn" data-state="shadowed" 
                                style="flex: 1; padding: 4px 2px; cursor: pointer; font-size: 9px; font-weight: ${state === 'shadowed' ? 'bold' : 'normal'};
                                background: ${state === 'shadowed' ? '#0ff' : '#333'}; color: ${state === 'shadowed' ? '#000' : '#666'}; 
                                border: 1px solid #0ff; border-radius: 3px;">
                            🌑
                        </button>
                        <button class="state-btn" data-state="hidden" 
                                style="flex: 1; padding: 4px 2px; cursor: pointer; font-size: 9px; font-weight: ${state === 'hidden' ? 'bold' : 'normal'};
                                background: ${state === 'hidden' ? '#f00' : '#333'}; color: ${state === 'hidden' ? '#fff' : '#666'}; 
                                border: 1px solid ${state === 'hidden' ? '#f00' : '#666'}; border-radius: 3px;">
                            ✖
                        </button>
                    </div>
                </div>
            `;
        });

        this.panel.html(html);
        this.attachEventHandlers();
    }

    attachEventHandlers() {
        // Focus node
        this.panel.select("#focusNodeBtn").on("click", () => {
            const id = this.panel.select("#focusNodeId").property("value").trim();
            if (id) this.nexus.focusNode(id);
        });
        this.panel.select("#focusNodeId").on("keydown", (e) => {
            if (e.key === "Enter") {
                const id = this.panel.select("#focusNodeId").property("value").trim();
                if (id) this.nexus.focusNode(id);
            }
        });

        // Reach limit
        this.panel.select("#reachLimit").on("change", e => {
            this.nexus.dev.reachableLimit = +e.target.value;
            this.nexus.render();
        });

        // All bright
        this.panel.select("#allBrightBtn").on("click", () => {
            this.nexus.fractalStates.forEach((_, file) => this.nexus.fractalStates.set(file, 'bright'));
            this.nexus.render();
            this.updatePanel();
        });

        // All hide
        this.panel.select("#allHideBtn").on("click", () => {
            this.nexus.fractalStates.forEach((_, file) => this.nexus.fractalStates.set(file, 'hidden'));
            this.nexus.render();
            this.updatePanel();
        });

        // Fractal state buttons
        this.panel.selectAll(".fractal-controls").each(function() {
            const controls = d3.select(this);
            const file = controls.attr("data-file");
            
            controls.selectAll(".state-btn").on("click", function(e) {
                const state = d3.select(this).attr("data-state");
                this.nexus.fractalStates.set(file, state);
                this.nexus.render();
                this.updatePanel();
            }.bind(this));
        }.bind(this));
    }

    getCurrentLocation() {
        const dim = this.nexus.currentDimension || 'D1';
        const layer = this.nexus.currentLayer || 'L0';
        const node = this.nexus.currentNode || 'entry_root';
        return `${dim} / ${layer} / ${node}`;
    }
}

// Export
window.DevPanel = DevPanel;
