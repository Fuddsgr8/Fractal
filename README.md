# Nexus Labyrinth

A **research vessel** for exploring large, branching node graphs. Add JSON data, scale to thousands of nodes, and use built-in developer tools to build and inspect the map. The public-facing side is a game-like experience (progression, choices); the dev side is full visibility and manual control.

---

## What this is

- **Data-driven:** Structure and content live in JSON. No code changes needed to add or edit nodes and paths.
- **Scalable:** Built to grow to thousands of nodes across many dimensions, layers, and fractal files.
- **Dual use:**  
  - **Developer:** Fullbright view, show/hide/dim by dimension/layer/fractal, manual traversal.  
  - **Public / game:** Tease or player view, progression, reach limits—the “front” experience.

Tools are in place and evolving; this README describes the model and how to work with data.

---

## Run it

Open `index.html` in a browser (or serve the project folder and open the root). No build step or extra scripts.

---

## Data model

### Index: `data/index.json`

Defines the **12D** layout: dimensions → layers → fractal files.

- **Dimensions** (1D–12D): each can have multiple **layers**.
- Each layer points to a **file** (e.g. `entry_nexus.json`, `cube_fractal.json`).
- That file is a **fractal**: a graph of nodes and forks.

To add content: add or edit entries under `dimensions` → `"nD"` → `layers` → `"LayerN"` → `file`, and create the corresponding JSON file in `data/`.

### Fractal files: `data/*.json`

Each fractal file is a flat object: **node id → node object**.

**Node object:**

- `symbol`, `profound`, `synthPhrase` — display text.
- `forks` — array of `{ label, target, unlock }` (target = node id in any loaded file).
- `terminal` — optional; `layer` optional for ordering.
- Skip keys: `initial_root`, `white_rabbit`, `root` (reserved).

**Example:**

```json
{
  "entry_root": {
    "symbol": "∅",
    "profound": "...",
    "synthPhrase": "...",
    "forks": [
      { "label": "Path A", "target": "other_node_id", "unlock": true }
    ],
    "terminal": false
  },
  "other_node_id": { ... }
}
```

Links are built from `forks`: each `target` must exist in `nodeMap` (any loaded fractal). Cross-file links are fine—reference node ids from other JSON files.

---

## Adding and scaling data

1. **New fractal file:** Add a JSON file in `data/` with the node-id → node-object structure above.
2. **Register it:** In `data/index.json`, add (or reuse) a dimension/layer and set `"file": "your_file.json"`.
3. **Cross-link:** In any node’s `forks`, use `"target": "node_id"` from any loaded fractal.

To scale to thousands of nodes: add more dimensions/layers and more fractal files; keep the same pattern. The app loads everything referenced from the index and builds one graph.

---

## Developer tools (right-hand panel)

Used while building and researching:

- **View mode**
  - **Fullbright** — All nodes visible and clickable. Main dev view for building and inspecting.
  - **Tease** — Unlocked bright, reachable dimmed, rest faint.
  - **Player Sim** — Only entry, current, and a few reachable nodes (game-like preview).

- **Dimensions / Fractals** — Expand to show each dimension or fractal file. Per item: **Bright** (visible, clickable), **Shadow** (dimmed, not clickable), **Hidden** (not drawn). Lets you focus on one dimension or fractal at a time and manually step through.

- **Reach limit** — How many “next” nodes are shown in player-style views.

- **Progression / Ghost Click / Show Reachable** — Toggles for how strict progression and visibility are during development.

Fullbright + dimension/fractal show/hide/dim is the main workflow for building and walking the map manually.

---

## Public / game side

The same data powers a game-like front:

- **Player** view: only current location and reachable next steps.
- **Progression:** nodes unlock by following forks; visibility and “reachable” respect that.
- **Tease** view: hints at locked content (dimmed/faint) without allowing clicks.

So: one data set, one codebase—dev tools for you, progression and tease for the public.

---

## Project layout (high level)

- **`index.html`** — Entry; loads scripts in order and creates the nexus.
- **`data/`** — `index.json` (12D structure + file list) and fractal JSON files.
- **`js/core/`** — `NexusLabyrinth` (orchestrator), `DataLoader` (index + fractals), `Renderer` (D3 force graph).
- **`js/ui/`** — `Modal` (node detail + forks), `DevPanel` (view mode, dimensions, fractals, toggles).
- **`js/utils/`** — `VisibilityManager` (dimension/layer/fractal visibility and clickability).

Implementation details change; the above is the stable mental model.

---

*README from this point forward: research vessel, ease of adding JSON, scale to 1000s of nodes, dev tools to build it, public front as game.*
