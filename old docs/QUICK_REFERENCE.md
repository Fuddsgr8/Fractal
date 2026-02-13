# 🜏 NEXUS LABYRINTH - Quick Reference

## 🎯 What Is This?

A 12-dimensional consciousness map with dual-gate progression system, built using the ΛΟΓΟΣ-道-מפη (Logos-Dao-Mapa) protocol.

---

## 🚀 Quick Start

1. **Load the map:** Open `index.html` in browser
2. **Enable progression:** Check "Progression Enabled" in DevPanel (right side)
3. **Start exploring:** Begin at entry_root (1D)

---

## 📁 Directory Structure

```
MAP/
├── index.html                 ← Main entry point - LOAD THIS
├── js/                        ← JavaScript modules
│   ├── core/                  ← NexusLabyrinth, DataLoader, Renderer
│   ├── ui/                    ← DevPanel, Modal, DimensionLegend
│   └── utils/                 ← VisibilityManager, helpers
├── data/                      ← Node graph data (JSON)
│   ├── index.json             ← 12D structure definition
│   ├── entry_nexus.json       ← Entry point (1D)
│   ├── temporal_fractal.json  ← 4D temporal nodes
│   ├── enoch_fractal.json     ← 4D biblical/watchers
│   ├── cube_fractal.json      ← 3D sacred geometry
│   ├── solar_fractal.json     ← 6D solar unity
│   ├── meta_fractal.json      ← 7D meta-awareness
│   └── [14 total fractals]
├── research/                  ← ΛΟΓΟΣ-道-מפה framework
│   ├── meta_structure.json    ← Dimensional architecture
│   └── consciousness_lexicon.json ← Concept grimoire
└── claude_systems/            ← Claude's development tools
    ├── graph_analysis/        ← Health checks, orphan detection
    ├── testing/               ← Test suites
    └── documentation/         ← Integration docs, fixes
```

---

## 🎮 Essential Console Commands

```javascript
// Check system status
nexus.progression

// Test node access (checks progression gates)
nexus.testNodeClick('prophetic_dream_node')

// Manual dimension unlock
nexus.unlockDimension('4D')

// Enable ghost mode (bypass all gates)
nexus.dev.ghostClick = true

// Run graph health check
analyzeGraphHealth()

// View all nodes
nexus.neurons

// View all links
nexus.links
```

---

## 🔧 DevPanel Controls

**Located:** Right side of screen

**Progression Section:**
- ☑ Progression Enabled - Toggle dual-gate system
- Dimensional Clearance - Select dimension to unlock
- 🔓 Unlock Button - Apply unlock
- Anchors Completed - Shows ⚓ 1D · ○ 3D · ○ 6D · ○ 7D
- ⇄ Sync Bypass - Allow SYNC-tagged nodes to jump dimensions
- 👻 Ghost Mode - Bypass all gates for testing
- 🜏 Log Names - Show barbarous invocations in console

**Testing:**
- Focus Node Input + 📍 - Jump to specific node
- 🧪 Test Jump - Test progression gates

**Visibility:**
- Fractal toggles - Show/hide individual fractal files
- ☀ / 🌑 / ✖ - Bright / Shadow / Hidden states

---

## 📖 Key Concepts

### ΛΟΓΟΣ-道-מפה Protocol
**Triple-tag system for concepts:**
- ΛΟΓΟΣ (Logos) = English/clarity layer
- 道 (Dao) = Chinese/process layer  
- מפה (Mapa) = Symbol/spatial layer

**Example:** `SYNC/同步/⇄` or `TIME/時/⌛`

### Dual-Gate Progression
**Gate 1:** Dimensional Clearance (can't access 7D without clearing lower dimensions)
**Gate 2:** Fractal Depth (must go deep in current fractal before advancing)

**Exceptions:**
- **Eternal Return:** 1D (LINEAR/一/|) always accessible
- **SYNC Bypass:** Nodes tagged SYNC/同步/⇄ can jump dimensions
- **Anchor Gates:** Must complete 1D, 3D, 6D, 7D to unlock higher

### Barbarous Names
**Dimensional invocations:**
- 1D = MONATH (one/monad)
- 3D = BALIGON (cubic/form)
- 4D = KHRONATH (time/chronos)
- 6D = SOLARA (solar/light)
- 7D = ULTIMUS (ultimate/meta)

---

## 🧪 Testing & Tools

**Test Suite:**
```
claude_systems/testing/test_progression_system.html
```
Comprehensive tests for all progression mechanics.

**Graph Health Check:**
```javascript
// In browser console
<script src="claude_systems/graph_analysis/analyze_graph_health.js"></script>
analyzeGraphHealth()
```
Finds orphan nodes and broken links.

---

## 📚 Documentation

**Complete Integration Guide:**
```
claude_systems/documentation/INTEGRATION_COMPLETE.md
```

**Graph Health Fixes:**
```
claude_systems/documentation/GRAPH_HEALTH_FIXES.md
```

**Research Framework:**
```
research/meta_structure.json
research/consciousness_lexicon.json
```

**Claude's Tools:**
```
claude_systems/README.md
```

---

## ⚡ Common Tasks

### Adding a New Node
1. Open appropriate fractal file in `data/`
2. Consult `research/meta_structure.json` for dimension essence
3. Use `research/consciousness_lexicon.json` for concepts
4. Add node with proper structure:
   ```json
   "node_id": {
     "layer": 1,
     "dimension": "4D",
     "symbol": "⌛",
     "profound": "Description...",
     "synthPhrase": "CONCEPT/中文/Symbol",
     "forks": [...],
     "_dev_notes": {
       "barbarous_invocation": "KHRONATH",
       "related_concepts": ["TIME", "WITNESS"]
     }
   }
   ```

### Fixing Broken Links
1. Run `analyzeGraphHealth()` to find issues
2. Fix target IDs in fork arrays
3. Reload and verify

### Understanding Progression
1. Open DevPanel
2. Check "Progression Enabled"
3. Try clicking higher-dimension nodes
4. Watch console for gate blocks
5. Use unlock dropdown to advance

---

## 🎯 Current Status

**Nodes:** 270 across 14 fractals  
**Dimensions:** 1D-7D fully mapped, 8D-12D placeholder  
**Progression:** ✅ Operational  
**Graph Health:** ✅ All known issues fixed  
**Framework:** ✅ ΛΟΓΟΣ-道-מפה fully integrated  

---

## 🆘 Troubleshooting

**Map won't load:**
- Check console (F12) for errors
- Verify all data files present in `data/`
- Clear browser cache

**Nodes not connecting:**
- Run `analyzeGraphHealth()`
- Check fork targets match actual node IDs
- See `claude_systems/documentation/GRAPH_HEALTH_FIXES.md`

**Progression gates not working:**
- Check "Progression Enabled" in DevPanel
- Verify `nexus.dev.progressionEnabled === true`
- Try ghost mode to bypass for testing

**Can't find a node:**
- Use DevPanel "Focus Node" input
- Check which fractal it's in (look at fractalSource)
- Make sure fractal is set to "Bright" (☀)

---

## 🤝 Contributing

**For Developers:**
- Follow ΛΟΓΟΣ-道-מפה protocol
- Use research framework for guidance
- Run tests before committing
- Document in appropriate .md files

**For Content Creators:**
- See `research/meta_structure.json` for dimensional essence
- See `research/consciousness_lexicon.json` for concepts
- Follow `prophetic_dream_node` as example
- Maintain triple-tag format

**For Claude:**
- Create tools in `claude_systems/`
- Document in claude_systems/README.md
- Follow non-destructive principle
- Keep output human-readable

---

## 📞 Quick Links

- **Main Map:** `index.html`
- **Research Framework:** `research/`
- **Claude's Tools:** `claude_systems/`
- **Integration Docs:** `claude_systems/documentation/`
- **Test Suite:** `claude_systems/testing/`

---

**"To navigate consciousness, first build the map. To build the map, first understand the mapmaker."** 🜏
