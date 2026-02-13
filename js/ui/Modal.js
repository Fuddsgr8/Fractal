// Modal.js - Node detail modal display

class Modal {
    constructor(nexus) {
        this.nexus = nexus;
    }
    
    showNodeDetail(node) {
        this.nexus.log("📋 Showing node:", node.id);
        
        // Close any existing modal
        this.closeModal();
        
        // Create modal backdrop
        const modal = d3.select("body").append("div")
            .classed("modal", true)
            .style("position", "fixed")
            .style("top", "0")
            .style("left", "0")
            .style("width", "100vw")
            .style("height", "100vh")
            .style("background", "rgba(0,10,20,0.95)")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style("z-index", "10000");
        
        // Create content container
        const content = modal.append("div")
            .style("background", "rgba(10,20,40,0.98)")
            .style("padding", "20px")
            .style("border", "2px solid #0ff")
            .style("border-radius", "12px")
            .style("max-width", "90vw")
            .style("max-height", "80vh")
            .style("overflow", "auto")
            .style("color", "#0ff")
            .style("font-family", "Courier New");
        
        // Build modal HTML
        let html = `
            <div style="text-align:center;font-size:48px;margin:20px 0;word-wrap:break-word">
                ${node.symbol}
            </div>
            <div style="font-size:18px;line-height:1.8;color:#fff;text-align:center;font-style:italic;padding:20px">
                "${node.profound}"
            </div>
            <div style="color:#0ff;font-size:14px;text-align:center;margin:20px 0">
                ${node.synthPhrase}
            </div>
        `;
        
        // Add location info in dev mode
        if (this.nexus.DEV_MODE && node.dimension) {
            html += `
                <div style="font-size:11px;color:#888;text-align:center;margin:10px 0;padding:8px;background:rgba(0,255,255,0.1);border-radius:4px;">
                    📍 ${node.dimension} / ${node.layerKey} / ${node.id}
                </div>
            `;
        }
        
        // Add ALL forks (show locked and unlocked)
        if (node.forks && node.forks.length > 0) {
            html += `
                <div style="margin-top:40px;text-align:center">
                    <div style="color:#0ff;font-size:16px;margin-bottom:20px">↓ Paths Forward ↓</div>
                    ${node.forks.map(f => this.renderForkButton(f, node)).join("")}
                </div>
            `;
        }
        
        // Add return button
        html += `
            <div style="text-align:center;margin-top:30px">
                <button onclick="nexus.modal.closeModal()" 
                    style="padding:12px 24px;background:rgba(0,255,255,0.3);border:1px solid #0ff;color:#0ff;border-radius:6px;font-family:inherit;cursor:pointer;font-size:14px">
                    Return
                </button>
            </div>
        `;
        
        content.html(html);
        
        // Update location indicator if Controls12D exists
        if (this.nexus.controls12D) {
            this.nexus.controls12D.updateLocationIndicator(node);
        }
    }
    
    renderForkButton(fork, fromNode) {
        // Check if fork is locked
        const isLocked = fork.unlock === false;
        const isUnlocked = this.nexus.unlockedNodes.has(fork.target);
        const targetNode = this.nexus.nodeMap.get(fork.target);
        
        // Determine tooltip
        let tooltip = '';
        if (isLocked) {
            if (fork.locked_hint) {
                tooltip = `🔒 ${fork.locked_hint}`;
            } else {
                tooltip = '🔒 Locked - Continue exploring to unlock this path';
            }
        } else if (!isUnlocked) {
            tooltip = '✓ Click to explore this path';
        }
        
        // Build styles based on lock status
        let buttonStyle = 'margin:10px 0;padding:15px;border-radius:8px;font-size:16px;transition:all 0.3s;';
        let iconPrefix = '';
        let clickHandler = '';
        
        if (isLocked) {
            // LOCKED STYLING
            buttonStyle += `
                background:repeating-linear-gradient(
                    45deg,
                    rgba(100,100,100,0.15),
                    rgba(100,100,100,0.15) 10px,
                    rgba(50,50,50,0.15) 10px,
                    rgba(50,50,50,0.15) 20px
                );
                border:1px dashed #666;
                opacity:0.5;
                cursor:not-allowed;
                color:#888;
            `;
            iconPrefix = '🔒 ';
            clickHandler = ''; // No click handler for locked
        } else {
            // UNLOCKED STYLING
            buttonStyle += `
                background:rgba(0,255,255,0.1);
                border:1px solid #0ff;
                cursor:pointer;
                color:#0ff;
            `;
            // Hover effects handled by CSS class instead
            iconPrefix = '✓ ';
            clickHandler = `onclick="nexus.chooseFork('${fork.target}', true)"`;
        }
        
        const cssClass = isLocked ? 'fork-button-locked' : 'fork-button-unlocked';
        
        return `
            <div class="${cssClass}" style="${buttonStyle}" 
                 ${clickHandler}
                 title="${tooltip}"
                 onmouseover="if(!this.disabled) { this.style.background='rgba(0,255,255,0.25)'; this.style.borderWidth='2px'; }"
                 onmouseout="if(!this.disabled) { this.style.background='rgba(0,255,255,0.1)'; this.style.borderWidth='1px'; }">
                ${iconPrefix}${fork.label || fork.target}
            </div>
        `;
    }
    
    closeModal() {
        d3.selectAll(".modal").remove();
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}
