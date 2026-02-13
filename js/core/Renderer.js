// Renderer.js - STABLE PLAYER MODE (fully fixed: no double dots)

class Renderer {
    constructor(nexus) {
        this.nexus = nexus;
        this.svg = nexus.zoomG;
        this.width = nexus.width;
        this.height = nexus.height;

        this.linkGroup = this.svg.append("g").attr("class", "links");
        this.nodeGroup = this.svg.append("g").attr("class", "nodes");

        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => d.id).distance(90))
            .force("charge", d3.forceManyBody().strength(-220))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        // Dimension color scheme
        this.dimensionColors = {
            '1D': '#ffffff',
            '2D': '#ffeb3b',
            '3D': '#4caf50',
            '4D': '#2196f3',
            '5D': '#9c27b0',
            '6D': '#ff9800',
            '7D': '#f44336',
            '8D': '#00bcd4',
            '9D': '#ff5722',
            '10D': '#8bc34a',
            '11D': '#e91e63',
            '12D': '#ffd700'
        };
    }

    render() {
        const nodes = Array.from(this.nexus.nodeMap.values());
        const links = this.nexus.links || [];
        const viewMode = this.nexus.getEffectiveViewMode();

        // PLAYER MODE: only origin + current + next 3 reachable nodes
        let visibleNodes;
        if (viewMode === "player") {
            const playerNodes = new Set([this.nexus.originNode, this.nexus.currentNode].filter(Boolean));
            const reachable = this.nexus.getReachableNodes();
            reachable.slice(0, 3).forEach(id => playerNodes.add(id));
            visibleNodes = nodes.filter(n => playerNodes.has(n.id));
        } else {
            visibleNodes = nodes.filter(n =>
                this.nexus.visibilityManager.getNodeVisibility(n.id) !== "hidden"
            );
        }

        const visibleIds = new Set(visibleNodes.map(n => n.id));
        const visibleLinks = links.filter(l => {
            const sid = typeof l.source === "object" ? l.source.id : l.source;
            const tid = typeof l.target === "object" ? l.target.id : l.target;
            return visibleIds.has(sid) && visibleIds.has(tid);
        });

        this.simulation.nodes(visibleNodes);
        this.simulation.force("link").links(visibleLinks);

        // LINKS
        const linkSel = this.linkGroup.selectAll("line")
            .data(visibleLinks, d => {
                const sid = typeof d.source === "object" ? d.source.id : d.source;
                const tid = typeof d.target === "object" ? d.target.id : d.target;
                return `${sid}-${tid}`;
            });
        linkSel.exit().remove();
        linkSel.enter().append("line").attr("class", "link").merge(linkSel);

        // NODES
        const nodeSel = this.nodeGroup.selectAll(".node")
            .data(visibleNodes, d => d.id);
        nodeSel.exit().remove();

        const nodeEnter = nodeSel.enter()
            .append("g")
            .attr("class", "node")
            .style("cursor", "pointer")
            .call(d3.drag()
                .on("start", e => this.dragStarted(e))
                .on("drag", e => this.dragged(e))
                .on("end", e => this.dragEnded(e))
            );

        // MAIN CIRCLE
        nodeEnter.append("circle")
            .attr("class", "main-circle")
            .attr("r", 10)
            .style("pointer-events", "all");

        // DIMENSION BADGE (skip origin/current & player mode)
        nodeEnter.append("circle")
            .attr("class", "dim-badge")
            .attr("cx", 18)
            .attr("cy", -18)
            .attr("r", 7)
            .style("stroke", "#000")
            .style("stroke-width", 1.5)
            .style("pointer-events", "none");

        // DIMENSION LABEL
        nodeEnter.append("text")
            .attr("class", "dim-label")
            .attr("x", 18)
            .attr("y", -15)
            .attr("text-anchor", "middle")
            .style("font-size", "9px")
            .style("font-weight", "bold")
            .style("fill", "#000")
            .style("pointer-events", "none");

        // NODE MERGE
        const nodeMerge = nodeEnter.merge(nodeSel);

        // CLICK HANDLER
        nodeMerge.on("click", (e, d) => {
            e.stopPropagation();
            e.preventDefault();
            if (d.__dragged) return;
            if (this.nexus.visibilityManager.isNodeClickable(d.id)) {
                this.nexus.showNodeDetail(d);
            }
        });

        // CLASS STYLING
        nodeMerge.classed("origin-node", d => d.id === this.nexus.originNode)
            .classed("current-node", d => d.id === this.nexus.currentNode)
            .classed("shadowed", d => this.nexus.isShadowed(d.id));

        // UPDATE DIMENSION BADGES (only for visible non-player nodes)
        nodeMerge.select(".dim-badge")
            .attr("fill", d => {
                if (d.id === this.nexus.originNode || d.id === this.nexus.currentNode) return "none";
                if (viewMode === "player" || viewMode === "tease") return "none";
                return d.dimension ? this.dimensionColors[d.dimension] : "none";
            })
            .attr("opacity", d => {
                if (d.id === this.nexus.originNode || d.id === this.nexus.currentNode) return 0;
                if (viewMode === "player" || viewMode === "tease") return 0;
                return d.dimension ? 1 : 0;
            });

        nodeMerge.select(".dim-label")
            .text(d => {
                if (d.id === this.nexus.originNode || d.id === this.nexus.currentNode) return '';
                if (viewMode === "player" || viewMode === "tease") return '';
                return d.dimension ? parseInt(d.dimension) : '';
            })
            .attr("opacity", d => {
                if (d.id === this.nexus.originNode || d.id === this.nexus.currentNode) return 0;
                if (viewMode === "player" || viewMode === "tease") return 0;
                return d.dimension ? 1 : 0;
            });

        // MAIN CIRCLE STYLING
        nodeMerge.select(".main-circle")
            .attr("fill", d => {
                if (d.id === this.nexus.originNode) return "#ffd700";
                if (d.id === this.nexus.currentNode) return "#00ffff";
                return this.dimensionColors[d.dimension] || '#0ff';
            })
            .attr("stroke", d => {
                if (d.id === this.nexus.originNode) return "#ffd700";
                if (d.id === this.nexus.currentNode) return "#00ffff";
                return this.dimensionColors[d.dimension] || '#0ff';
            })
            .attr("stroke-width", d =>
                d.id === this.nexus.originNode ? 4 :
                    d.id === this.nexus.currentNode ? 3 : 1
            )
            .attr("opacity", d => {
                const vis = this.nexus.visibilityManager.getNodeVisibility(d.id);
                
                if (viewMode === "player") {
                    if (this.nexus.unlockedNodes.has(d.id)) return 1;
                    if (this.nexus.isReachable(d.id)) return 0.4;
                    return 0; // hide unreachable nodes completely
                }
                if (viewMode === "tease") {
                    // Check fractal visibility state first
                    if (vis === "shadowed") return 0.15;
                    // Then check unlock state
                    if (this.nexus.unlockedNodes.has(d.id)) return 1;
                    return this.nexus.isReachable(d.id) ? 0.4 : 0.15;
                }
                if (viewMode === "fullbright") {
                    return vis === "shadowed" ? 0.35 : 1;
                }
                return 1;
            });

        nodeMerge.select("text")
            .text(d => d.id === this.nexus.originNode ? "ENTRY" : "");

        // TICK HANDLER (only once)
        if (!this.tickHandlerSet) {
            this.simulation.on("tick", () => {
                this.linkGroup.selectAll("line")
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                this.nodeGroup.selectAll(".node")
                    .attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
            });
            this.tickHandlerSet = true;
        }

        this.simulation.alpha(viewMode === "player" ? 0.1 : 1).restart();
    }

    dragStarted(e) {
        if (!e.active) this.simulation.alphaTarget(0.3).restart();
        e.subject.fx = e.subject.x;
        e.subject.fy = e.subject.y;
    }

    dragged(e) {
        e.subject.fx = e.x;
        e.subject.fy = e.y;
    }

    dragEnded(e) {
        if (!e.active) this.simulation.alphaTarget(0);
        e.subject.fx = null;
        e.subject.fy = null;
        setTimeout(() => { if (e.subject) e.subject.__dragged = false; }, 0);
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Renderer;
}
