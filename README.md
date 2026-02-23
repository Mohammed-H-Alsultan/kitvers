# Kitvers (WIP)

Desktop stack lifecycle manager for modern web projects.

Kitvers helps you create, manage, and evolve web project stacks without repeating setup work every time.

It removes friction like:

- Running scaffold commands manually  
- Installing common libraries  
- Configuring Tailwind / UI systems  
- Remembering CLI flags  
- Managing dependency updates  

Kitvers is not just a project generator.  
It is designed as infrastructure for stack lifecycle management.

---

## Vision

Kitvers is built in two phases:

### Phase 1 — Project Creation
Create new Next.js or Vite projects with selected packs pre-installed and configured.

### Phase 2 — Project Management
Open existing projects, detect installed packs, safely add new ones, and manage dependency updates.

---

## Current Status

**v0.1 — UI Complete, Engine In Progress**

- ✅ Project creation interface complete  
- ✅ Pack selection system implemented  
- ✅ Run progress UI implemented  
- ⏳ Engine layer under development (`feature/engine-core`)  

The current focus is building the core engine that powers scaffolding and lifecycle management.

---

## Architecture

Kitvers is structured into three layers:

### 1. UI Layer (React + Vite)
Handles:
- Forms
- Configuration
- Pack selection
- Progress and logs

### 2. Tauri Layer (Rust)
Handles:
- Native OS integration
- Secure process execution
- Event streaming between UI and engine

### 3. Engine Layer (Node.js)
Handles:
- Project scaffolding
- Pack installation
- Configuration patching
- Metadata management (`.kitvers.json`)
- Dependency lifecycle management

---

## Roadmap

### Phase 1 — Project Creation Engine

- [x] UI foundation  
- [x] Pack system  
- [x] Run progress screen  
- [ ] Engine core (command runner + scaffold logic)  
- [ ] Pack installer logic  
- [ ] Config patching system  
- [ ] `.kitvers.json` metadata file  

### Phase 2 — Project Management

- [ ] Existing project detection  
- [ ] Installed pack scanning  
- [ ] Add packs to existing projects  
- [ ] Safe dependency updates  
- [ ] Git safety backup before mutations  

> Phase 2 development begins after Phase 1 engine stabilizes.
---

## Development

```bash
npm install
npx tauri dev