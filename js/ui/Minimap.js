/**
 * Minimap.js - Collapsible D3.js minimap overlay for 3D view
 * Shows traditional 2D network view while navigating 3D space
 */

class Minimap {
    constructor(nexusLabyrinth) {
        this.nexus = nexusLabyrinth;
        this.isOpen = true;
        this.container = null;
        this.svg = null;
        this.simulation = null;
        
        this.createMinimapUI();
    }

    createMinimapUI() {
        // Create minimap container - DRAGGABLE
        this.container = document.createElement('div');
        this.container.id = 'minimap';
        this.container.style.cssText = `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 300px;
            height: 250px;
            background: rgba(0, 20, 40, 0.95);
            border: 2px solid #0ff;
            border-radius: 8px;
            z-index: 150;
            display: none;
            overflow: hidden;
            cursor: move;
        `;

        // Create header with toggle
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 8px 12px;
            background: rgba(0, 40, 60, 0.95);
            border-bottom: 1px solid #0ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-size: 12px;
            color: #0ff;
        `;
        header.innerHTML = `
            <strong>🗺️ 2D MINIMAP</strong>
            <span id="minimap-toggle">▼</span>
        `;

        // Create content area
        const content = document.createElement('div');
        content.id = 'minimap-content';
        content.style.cssText = `
            width: 100%;
            height: calc(100% - 36px);
            position: relative;
        `;

        // Create SVG for D3 rendering
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.cssText = `
            width: 100%;
            height: 100%;
        `;
        content.appendChild(this.svg);

        this.container.appendChild(header);
        this.container.appendChild(content);
        document.body.appendChild(this.container);

        // Toggle functionality
        header.addEventListener('click', (e) => {
            // Only toggle if not dragging
            if (!this.isDragging) {
                this.toggle();
            }
        });
        
        // Make draggable
        this.makeDraggable(header);
    }

    makeDraggable(handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        this.isDragging = false;
        let dragStartTime = 0;
        
        handle.onmousedown = (e) => {
            e.preventDefault();
            dragStartTime = Date.now();
            this.isDragging = false;
            
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
                
                // If drag was very short, it's a click
                setTimeout(() => {
                    this.isDragging = false;
                }, 10);
            };
            
            document.onmousemove = (e) => {
                e.preventDefault();
                
                // If moved more than 5px, it's a drag
                if (Math.abs(e.clientX - pos3) > 5 || Math.abs(e.clientY - pos4) > 5) {
                    this.isDragging = true;
                }
                
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                const newTop = this.container.offsetTop - pos2;
                const newLeft = this.container.offsetLeft - pos1;
                
                // Keep within viewport
                const maxTop = window.innerHeight - 50;
                const maxLeft = window.innerWidth - 50;
                
                this.container.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
                this.container.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
                this.container.style.transform = 'none'; // Remove centering transform when dragging
            };
        };
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        const content = document.getElementById('minimap-content');
        const toggleIcon = document.getElementById('minimap-toggle');
        
        if (this.isOpen) {
            content.style.display = 'block';
            toggleIcon.textContent = '▼';
            this.container.style.height = '250px';
        } else {
            content.style.display = 'none';
            toggleIcon.textContent = '▶';
            this.container.style.height = '36px';
        }
    }

    /**
     * Render the minimap with current node/connection data
     */
    render(nodes, connections, visibilityManager) {
        // Clear existing content
        d3.select(this.svg).selectAll('*').remove();

        const width = 300;
        const height = 214; // Minus header (250 - 36)

        // Filter visible nodes
        const visibleNodes = nodes.filter(n => 
            !visibilityManager || visibilityManager.getNodeVisibility(n.id) !== 'hidden'
        );

        // Filter connections where both nodes are visible
        const visibleConnections = connections.filter(c => {
            const sourceVisible = visibleNodes.find(n => n.id === c.source);
            const targetVisible = visibleNodes.find(n => n.id === c.target);
            return sourceVisible && targetVisible;
        });

        // Create D3 force simulation (simplified version)
        this.simulation = d3.forceSimulation(visibleNodes)
            .force('link', d3.forceLink(visibleConnections)
                .id(d => d.id)
                .distance(30))
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(10));

        const svg = d3.select(this.svg);

        // Draw connections
        const links = svg.append('g')
            .selectAll('line')
            .data(visibleConnections)
            .join('line')
            .attr('stroke', '#0ff')
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', 1);

        // Draw nodes
        const nodeGroups = svg.append('g')
            .selectAll('g')
            .data(visibleNodes)
            .join('g')
            .attr('cursor', 'pointer')
            .on('click', (event, d) => this.onNodeClick(d));

        // Node circles
        nodeGroups.append('circle')
            .attr('r', 4)
            .attr('fill', d => this.getDimensionColor(d.dimension))
            .attr('stroke', '#0ff')
            .attr('stroke-width', 0.5);

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            nodeGroups
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }

    /**
     * Handle node click in minimap - fly to it in 3D view
     */
    onNodeClick(nodeData) {
        console.log('📍 Minimap node clicked:', nodeData.id);
        
        // Dispatch event to fly camera to node
        const event = new CustomEvent('minimap-node-selected', {
            detail: { nodeData }
        });
        window.dispatchEvent(event);
    }

    /**
     * Highlight a node in the minimap
     */
    highlightNode(nodeId) {
        d3.select(this.svg)
            .selectAll('circle')
            .attr('stroke-width', d => d.id === nodeId ? 2 : 0.5)
            .attr('r', d => d.id === nodeId ? 6 : 4);
    }

    /**
     * Get color based on dimension (matches ThreeDRenderer)
     */
    getDimensionColor(dimension) {
        const colors = {
            '1D': '#ff0000',
            '2D': '#ff4400',
            '3D': '#ff8800',
            '4D': '#ffcc00',
            '5D': '#ffff00',
            '6D': '#ccff00',
            '7D': '#88ff00',
            '8D': '#00ff00',
            '9D': '#00ff88',
            '10D': '#00ffcc',
            '11D': '#00ccff',
            '12D': '#00ffff'
        };
        return colors[dimension] || '#00ffff';
    }

    /**
     * Show/hide the minimap
     */
    setVisible(visible) {
        this.container.style.display = visible ? 'block' : 'none';
    }

    /**
     * Clean up simulation
     */
    destroy() {
        if (this.simulation) {
            this.simulation.stop();
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
