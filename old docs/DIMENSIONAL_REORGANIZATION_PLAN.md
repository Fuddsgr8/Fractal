# CRITICAL: Dimensional Reorganization Required

**Problem:** Progression system is broken because early entry nodes are stamped as high-dimensional (3D-6D), blocking player progression from 1D start.

**Root Cause:** The stamping system assigned dimensions based on layer depth within each fractal, NOT on the global entry/accessibility structure. This means entry_nexus forks lead to 3D+ nodes, making them inaccessible at 1D.

---

## Current Situation

**entry_nexus.json structure:**
- `entry_root` (1D) → forks to:
  - `entry_sync` (1D) → forks to:
    - `cube_root` (3D) ❌ BLOCKS progression
    - `solar_root` (6D) ❌ BLOCKS progression  
    - `temporal_entry` (4D) ❌ BLOCKS progression
    - `meta_fractal_nexus` (7D) ❌ BLOCKS progression

**The issue:** Player starts at 1D but can't access ANY fractals because all entry points are 3D+.

---

## Solution Options

### Option 1: Recategorize Entry Points as 1D (RECOMMENDED)
**Change:** All fractal entry points (first nodes after entry_nexus) should be 1D.

**Implementation:**
1. Manually edit each fractal's `*_root` or `*_entry` node to `"dimension": "1D"`
2. Keep the dimensional progression within each fractal starting at L1+
3. This makes ALL fractals accessible from start, progression happens as you go deeper

**Files to edit:**
```
data/cube_fractal.json          → cube_root: "dimension": "1D"
data/solar_fractal.json         → solar_root: "dimension": "1D"  
data/temporal_fractal.json      → temporal_entry: "dimension": "1D"
data/meta_fractal.json          → meta_fractal_nexus: "dimension": "1D"
data/ai_transcendence_fractal.json → ai_entry: "dimension": "1D"
... (all 12 fractals)
```

**Result:** Player at 1D can enter any fractal, then encounters higher dimensions as they walk deeper.

---

### Option 2: Reorganize File Structure by Dimension
**Change:** Move fractals into dimension-based folders.

**New structure:**
```
data/
├── 1D/
│   └── entry_nexus.json
├── 3D/
│   └── cube_fractal.json
├── 4D/
│   ├── temporal_fractal.json
│   ├── enoch_fractal.json
│   └── great_flood_fractal.json
├── 5D/
│   ├── tesla_fractal.json
│   ├── ai_transcendence_fractal.json
│   └── watchers_fractal.json
... etc
```

**Problem:** This doesn't actually fix progression - nodes within fractals still span multiple dimensions. This is purely organizational.

**Recommendation:** Do this AFTER fixing Option 1 for better organization.

---

### Option 3: Add 1D "Gateway" Nodes
**Change:** Create intermediate 1D nodes between entry_nexus and fractal entries.

**Structure:**
```
entry_sync (1D)
  → cube_gateway (1D) → cube_root (3D)
  → solar_gateway (1D) → solar_root (6D)
  → temporal_gateway (1D) → temporal_entry (4D)
```

**Problem:** Adds extra clicks for no reason. Not recommended.

---

## RECOMMENDED ACTION PLAN

### Phase 1: Fix Entry Points (URGENT)
1. **Manually set all fractal entry nodes to 1D:**
   - Open each `*_fractal.json` file
   - Find the entry node (usually `*_root` or `*_entry`)
   - Change `"dimension": "3D"` (or whatever) to `"dimension": "1D"`
   - Save

2. **Files needing edit** (12 fractals):
   ```
   cube_fractal.json       → cube_root
   tesla_fractal.json      → tesla_entry
   great_flood_fractal.json → flood_entry
   watchers_fractal.json   → watchers_entry
   nephilim_fractal.json   → nephilim_entry
   temporal_fractal.json   → temporal_entry
   enoch_fractal.json      → enoch_entry
   solar_fractal.json      → solar_root
   ai_transcendence_fractal.json → ai_entry
   meta_fractal.json       → meta_fractal_nexus
   jungs_archetypes_fractal.json → jungs_entry
   secret_history_fractal.json → secret_entry
   ```

### Phase 2: Reorganize File Structure (OPTIONAL)
After fixing entry points, optionally reorganize data/ into dimension folders for clarity.

### Phase 3: Update Input Files (OPTIONAL)
Adjust Input/ categorization files to reflect that entry nodes are 1D (set `expression_floor: "1D"` for all).

---

## Testing After Fix

1. Start at entry_root (1D)
2. Click entry_sync → Should see ALL fractal options available (no red toast)
3. Enter cube_root → Should work (now 1D)
4. Walk deeper into cube → Should encounter 3D nodes at L2+
5. Hit dimensional gate → Red toast "requires 3D"
6. Unlock 3D → Continue deeper
7. Repeat for all fractals

---

## File Organization Clarification

**Current confusion:**
- `Input/` = Categorization templates used by nexusagent.js for stamping
- `data/` = Live fractal JSON files loaded by the app

**Recommended:**
- Keep `Input/` for categorization templates (used by nexusagent only)
- Keep `data/` flat OR reorganize into `data/1D/`, `data/3D/`, etc.
- Don't duplicate files between Input/ and data/ - they serve different purposes

**Alternative if you want dimension folders:**
```
data/
├── dimensions/
│   ├── 1D/
│   │   └── entry_nexus.json
│   ├── 3D/
│   │   └── cube_fractal.json
│   └── ...
├── index.json (update paths to point to dimensions/ subdirs)
```

Then update DataLoader.js to handle the new paths.

---

## Summary

**Immediate fix:** Manually edit 12 fractal files, set entry nodes to `"dimension": "1D"`

**This will:**
- ✅ Make progression work (can access all fractals from start)
- ✅ Keep dimensional gates deeper in fractals
- ✅ Preserve all existing content
- ✅ Require NO recategorization or re-stamping

**Time:** 10 minutes to edit 12 files.

**Alternative:** I can write a script to do this automatically if you want.
