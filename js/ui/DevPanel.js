/**
 * Enhanced DevPanel with ΛΟΓΟΣ-道-מפה Progression Controls
 * 
 * New Features:
 * - Progression toggle (enable/disable dual-gate system)
 * - Dimensional unlock controls
 * - Anchor status display
 * - Sync bypass toggle
 * - Ghost mode (bypass all gates for testing)
 * - Test jump interface
 */

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
                <div style="font-size: 16px; font-weight: bold; color: #0ff;">🜏 NEXUS</div>
                <div style="font-size: 10px; color: #66ccff; margin-top: 4px;">ΛΟΓΟΣ-道-מפה</div>
            </div>

            <div style="margin-bottom: 14px; padding: 8px; background: rgba(0,255,255,0.05); border-radius: 4px; pointer-events: auto;">
                <div style="font-size: 10px; color: #888;">Current:</div>
                <div style="font-size: 11px; color: #fff; margin-top: 2px;">${this.getCurrentLocation()}</div>
            </div>
            
            <div style="margin-bottom: 14px; font-size: 10px; color: #888; pointer-events: auto;">
                Nodes: <span style="color: #0ff;">${this.nexus.nodeMap.size}</span> · Links: <span style="color: #0ff;">${this.nexus.links.length}</span>
                <br>
                Explored: <span style="color: #0ff;">${this.nexus.unlockedNodes.size}</span> / ${this.nexus.nodeMap.size}
            </div>
        `;

        // PROGRESSION CONTROLS SECTION
        html += this.buildProgressionControls();

        // Focus node
        html += `
            <div style="margin-bottom: 14px; padding-top: 14px; border-top: 1px solid rgba(0,255,255,0.3); pointer-events: auto;">
                <label style="font-size: 10px; color: #888;">Focus/Test Node:</label>
                <div style="display: flex; gap: 4px; margin-top: 4px;">
                    <input type="text" id="focusNodeId" placeholder="node_id" style="flex: 1; font-size: 10px; padding: 4px; background: #111; border: 1px solid #0ff; color: #0ff;">
                    <button type="button" id="focusNodeBtn" style="padding: 4px 8px; cursor: pointer; font-size: 10px; background: #0ff; color: #000; border: none; border-radius: 3px;">📍</button>
                    <button type="button" id="testJumpBtn" style="padding: 4px 8px; cursor: pointer; font-size: 10px; background: #ff6600; color: #fff; border: none; border-radius: 3px;">🧪</button>
                </div>
            </div>
        `;

        // Reach limit
        html += `
            <div style="margin-bottom: 14px; pointer-events: auto;">
                <label style="font-size: 10px; color: #888;">Reach Limit:</label>
                <input type="number" id="reachLimit" value="${this.nexus.dev.reachableLimit}" min="1" max="10" style="width: 40px; margin-left: 6px; font-size: 10px; padding: 4px; background: #111; border: 1px solid #0ff; color: #0ff;">
            </div>
        `;

        // Reset button
        html += `
            <div style="margin-bottom: 18px; pointer-events: auto;">
                <button type="button" id="resetBtn" style="width: 100%; padding: 6px; cursor: pointer; font-size: 10px; background: #f00; color: #fff; border: none; border-radius: 3px; font-weight: bold;">🔄 Reset Map</button>
            </div>
        `;

        // Master controls
        html += `
            <div style="margin-bottom: 14px; padding-top: 14px; border-top: 1px solid rgba(0,255,255,0.3); pointer-events: auto;">
                <div style="font-size: 11px; font-weight: bold; margin-bottom: 8px; color: #0ff;">FRACTAL VISIBILITY</div>
                <button type="button" id="allBrightBtn" style="padding: 4px 8px; cursor: pointer; margin-right: 4px; font-size: 10px; background: #0ff; color: #000; border: none; border-radius: 3px;">☀ All On</button>
                <button type="button" id="allHideBtn" style="padding: 4px 8px; cursor: pointer; font-size: 10px; background: #f00; color: #fff; border: none; border-radius: 3px;">✖ All Off</button>
            </div>
            
            <div style="margin-bottom: 14px; pointer-events: auto;">
                <button type="button" id="highlightAllBtn" style="width: 100%; padding: 5px; cursor: pointer; font-size: 10px; background: #ffa500; color: #000; border: none; border-radius: 3px; font-weight: bold;">✨ Highlight All Nodes</button>
            </div>
        `;

        // Fractal list
        const fractals = Array.from(this.nexus.fractalNodes.keys()).sort();
        fractals.forEach(file => {
            const state = this.nexus.fractalStates.get(file) || 'bright';
            const displayName = file.replace('_fractal.json', '').replace(/_/g, ' ').replace('.json', '');
            const nodes = this.nexus.fractalNodes.get(file) || [];
            const nodeCount = nodes.size || nodes.length || 0;
            
            html += `
                <div style="margin: 6px 0; padding: 6px; background: rgba(0,255,255,0.02); border-radius: 4px; border: 1px solid rgba(0,255,255,0.1); pointer-events: auto;">
                    <div style="font-size: 9px; color: #0ff; margin-bottom: 4px; text-transform: capitalize;">
                        ${displayName} <span style="color: #888;">(${nodeCount})</span>
                    </div>
                    <div class="fractal-controls" data-file="${file}" style="display: flex; gap: 3px;">
                        <button class="state-btn" data-state="bright" 
                                style="flex: 1; padding: 3px; cursor: pointer; font-size: 9px; 
                                background: ${state === 'bright' ? '#0ff' : '#1a1a1a'}; 
                                color: ${state === 'bright' ? '#000' : '#555'}; 
                                border: 1px solid ${state === 'bright' ? '#0ff' : '#333'}; 
                                border-radius: 2px; font-weight: ${state === 'bright' ? 'bold' : 'normal'};">
                            ☀
                        </button>
                        <button class="state-btn" data-state="shadowed" 
                                style="flex: 1; padding: 3px; cursor: pointer; font-size: 9px;
                                background: ${state === 'shadowed' ? '#888' : '#1a1a1a'}; 
                                color: ${state === 'shadowed' ? '#000' : '#555'}; 
                                border: 1px solid ${state === 'shadowed' ? '#888' : '#333'}; 
                                border-radius: 2px; font-weight: ${state === 'shadowed' ? 'bold' : 'normal'};">
                            🌑
                        </button>
                        <button class="state-btn" data-state="hidden" 
                                style="flex: 1; padding: 3px; cursor: pointer; font-size: 9px;
                                background: ${state === 'hidden' ? '#f00' : '#1a1a1a'}; 
                                color: ${state === 'hidden' ? '#fff' : '#555'}; 
                                border: 1px solid ${state === 'hidden' ? '#f00' : '#333'}; 
                                border-radius: 2px; font-weight: ${state === 'hidden' ? 'bold' : 'normal'};">
                            ✖
                        </button>
                    </div>
                </div>
            `;
        });

        this.panel.html(html);
        this.attachEventHandlers();
    }

    buildProgressionControls() {
        const prog = this.nexus.progression;
        const dev = this.nexus.dev;
        
        let html = `
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(255,235,59,0.1); border-radius: 4px; border: 1px solid rgba(255,235,59,0.3); pointer-events: auto;">
                <div style="font-size: 11px; font-weight: bold; margin-bottom: 8px; color: #ffeb3b;">⚓ PROGRESSION SYSTEM</div>
                
                <!-- Toggle Progression -->
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <label style="font-size: 10px; color: #fff;">Progression Enabled:</label>
                    <input type="checkbox" id="progressionToggle" ${dev.progressionEnabled ? 'checked' : ''} 
                           style="cursor: pointer; width: 16px; height: 16px;">
                </div>
                
                <!-- Dimensional Level -->
                <div style="margin-bottom: 8px;">
                    <div style="font-size: 10px; color: #888;">Dimensional Clearance:</div>
                    <div style="display: flex; gap: 4px; margin-top: 4px; align-items: center;">
                        <select id="dimUnlockSelect" style="flex: 1; font-size: 10px; padding: 4px; background: #111; border: 1px solid #ffeb3b; color: #ffeb3b; cursor: pointer;">
                            ${this.buildDimensionOptions()}
                        </select>
                        <button type="button" id="unlockDimBtn" style="padding: 4px 8px; cursor: pointer; font-size: 10px; background: #ffeb3b; color: #000; border: none; border-radius: 3px;">🔓</button>
                    </div>
                </div>
                
                <!-- Anchors -->
                <div style="margin-bottom: 8px;">
                    <div style="font-size: 10px; color: #888;">Anchors Completed:</div>
                    <div style="font-size: 10px; color: #fff; margin-top: 2px;">
                        ${this.buildAnchorStatus()}
                    </div>
                </div>
                
                <!-- Toggles -->
                <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px;">
                    <label style="font-size: 9px; display: flex; align-items: center; gap: 3px; cursor: pointer;">
                        <input type="checkbox" id="syncBypassToggle" ${dev.syncBypassEnabled ? 'checked' : ''} style="cursor: pointer;">
                        <span>⇄ Sync Bypass</span>
                    </label>
                    <label style="font-size: 9px; display: flex; align-items: center; gap: 3px; cursor: pointer;">
                        <input type="checkbox" id="ghostModeToggle" ${dev.ghostClick ? 'checked' : ''} style="cursor: pointer;">
                        <span>👻 Ghost Mode</span>
                    </label>
                    <label style="font-size: 9px; display: flex; align-items: center; gap: 3px; cursor: pointer;">
                        <input type="checkbox" id="barbarousLogToggle" ${dev.logBarbarousNames ? 'checked' : ''} style="cursor: pointer;">
                        <span>🜏 Log Names</span>
                    </label>
                </div>
            </div>
        `;
        
        return html;
    }

    buildDimensionOptions() {
        const current = this.nexus.progression.dimensionalLevel;
        let options = '';
        for (let i = 1; i <= 12; i++) {
            const name = this.nexus.getBarbarousName ? this.nexus.getBarbarousName(`${i}D`) : `${i}D`;
            const selected = i === current ? 'selected' : '';
            options += `<option value="${i}" ${selected}>${i}D - ${name}</option>`;
        }
        return options;
    }

    buildAnchorStatus() {
        const anchors = ['1D', '3D', '6D', '7D'];
        const completed = this.nexus.progression.anchorsCompleted;
        
        return anchors.map(dim => {
            const done = completed.has(dim);
            const icon = done ? '⚓' : '○';
            const color = done ? '#0f0' : '#555';
            return `<span style="color: ${color};">${icon} ${dim}</span>`;
        }).join(' · ');
    }

    attachEventHandlers() {
        const self = this;

        // Progression toggle
        this.panel.select("#progressionToggle").on("change", function() {
            self.nexus.dev.progressionEnabled = this.checked;
            self.nexus.log(`Progression ${this.checked ? 'ENABLED' : 'DISABLED'}`);
            self.nexus.render();
            self.updatePanel();
        });

        // Dimension unlock
        this.panel.select("#unlockDimBtn").on("click", () => {
            const dim = parseInt(this.panel.select("#dimUnlockSelect").property("value"));
            this.nexus.unlockDimension(`${dim}D`);
            this.updatePanel();
        });

        // Sync bypass toggle
        this.panel.select("#syncBypassToggle").on("change", function() {
            self.nexus.dev.syncBypassEnabled = this.checked;
            self.nexus.log(`⇄ Sync bypass ${this.checked ? 'ENABLED' : 'DISABLED'}`);
        });

        // Ghost mode toggle
        this.panel.select("#ghostModeToggle").on("change", function() {
            self.nexus.dev.ghostClick = this.checked;
            self.nexus.log(`👻 Ghost mode ${this.checked ? 'ENABLED' : 'DISABLED'}`);
        });

        // Barbarous names log toggle
        this.panel.select("#barbarousLogToggle").on("change", function() {
            self.nexus.dev.logBarbarousNames = this.checked;
        });

        // Focus node
        this.panel.select("#focusNodeBtn").on("click", () => {
            const id = this.panel.select("#focusNodeId").property("value").trim();
            if (id) this.nexus.focusNode(id);
        });

        // Test jump (tests progression gates)
        this.panel.select("#testJumpBtn").on("click", () => {
            const id = this.panel.select("#focusNodeId").property("value").trim();
            if (id) {
                this.nexus.log(`🧪 Testing node click: ${id}`);
                this.nexus.testNodeClick(id);
            }
        });

        this.panel.select("#focusNodeId").on("keydown", (event) => {
            if (event.key === "Enter") {
                const id = event.target.value.trim();
                if (id) this.nexus.focusNode(id);
            }
        });

        // Reach limit
        this.panel.select("#reachLimit").on("change", function() {
            self.nexus.dev.reachableLimit = +this.value;
            self.nexus.render();
        });

        // Reset map
        this.panel.select("#resetBtn").on("click", () => {
            if (confirm('🔄 Reset map to entry point?')) {
                this.nexus.unlockedNodes.clear();
                this.nexus.unlockedNodes.add('entry_root');
                this.nexus.currentNode = 'entry_root';
                this.nexus.originNode = 'entry_root';
                
                // Reset progression
                this.nexus.progression.depthReached = {};
                this.nexus.initializeProgression();
                
                this.nexus.render();
                this.updatePanel();
                
                setTimeout(() => {
                    this.nexus.focusNode('entry_root');
                }, 300);
            }
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

        // Highlight all
        this.panel.select("#highlightAllBtn").on("click", () => {
            const allNodes = Array.from(this.nexus.nodeMap.keys());
            const allUnlocked = allNodes.every(id => this.nexus.unlockedNodes.has(id));
            
            if (allUnlocked) {
                this.nexus.unlockedNodes.clear();
                this.nexus.unlockedNodes.add('entry_root');
            } else {
                this.nexus.nodeMap.forEach((node, id) => {
                    this.nexus.unlockedNodes.add(id);
                });
            }
            
            this.nexus.render();
            this.updatePanel();
        });

        // Fractal state buttons
        this.panel.selectAll(".fractal-controls").each(function() {
            const controls = d3.select(this);
            const file = controls.attr("data-file");
            
            controls.selectAll(".state-btn").on("click", function() {
                const state = d3.select(this).attr("data-state");
                self.nexus.fractalStates.set(file, state);
                self.nexus.render();
                self.updatePanel();
            });
        });
    }

    getCurrentLocation() {
        const node = this.nexus.currentNode || 'entry_root';
        const dim = this.nexus.currentDimension || '1D';
        const layer = this.nexus.currentLayer !== null ? `L${this.nexus.currentLayer}` : 'L0';
        const barbarous = this.nexus.getBarbarousName ? this.nexus.getBarbarousName(dim) : '';
        return `${node} (${dim}${barbarous ? '/' + barbarous : ''})`;
    }
}

window.DevPanel = DevPanel;
