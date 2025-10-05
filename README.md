# Neutral Buoyancy Lab
*A Nova Clusters interactive physics experience.*

---

## Overview
The **Neutral Buoyancy Lab (NBL)** web app is an **interactive physics simulator** inspired by the real NASA facility where astronauts train underwater to mimic microgravity.  

This project — built entirely with **HTML, CSS, and Vanilla JavaScript** — demonstrates the physical balance between **gravitational force** and **buoyant force**, allowing users to manipulate environmental and suit parameters to reach a state of **neutral buoyancy**: a condition where an object neither sinks nor floats.

Developed under the **Nova Clusters** initiative, it blends realism, science, and artistic design into a clear, intuitive interface that makes physics tangible and beautiful.

---

## The Science Behind It

### 1. Archimedes’ Principle
The core of buoyancy is **Archimedes’ Principle**, which states that:

Mathematically:

Where:
- **F_b** — Buoyant force (upward)
- **ρ_fluid** — Density of the fluid (kg/m³)
- **V_object** — Volume of displaced fluid = volume of the object (m³)
- **g** — Acceleration due to gravity (m/s²)

---

### 2. Gravitational Force
Every object experiences a downward **weight force**:

- **ρ_object** — Density of the object (astronaut/suit)
- **V_object** — Volume of the object
- **g** — Gravitational acceleration

---

### 3. Net Force and Motion
The **net vertical force** on the astronaut is:
F_net = F_b - F_g
F_net = (ρ_fluid - ρ_object) × V × g

- If `F_net > 0` → astronaut floats upward.  
- If `F_net < 0` → astronaut sinks downward.  
- If `F_net ≈ 0` → astronaut achieves **neutral buoyancy**.

The app uses this relation to simulate vertical motion using Newton’s Second Law:

and integrates position and velocity over time through:
v = v + a × Δt
y = y + v × Δt

with additional **drag damping** to simulate viscous water resistance.

---

### 4. Fluid Density Model
The **density of water** changes slightly depending on:
- **Temperature**: warmer water is less dense.
- **Salinity**: saltier water is more dense.

The simulator approximates this relationship:
*(Where T = temperature in °C, S = salinity in ‰)*

So raising temperature makes the astronaut sink, while adding salinity makes them float.

---

### 5. Suit Inflation and Volume
Changing **inflation** affects the astronaut’s total volume:
Since buoyant force depends on volume (`F_b ∝ V`), inflating the suit increases the upward lift — making it easier to float.

---

### 6. Drag (Viscosity)
To make motion smooth and realistic, the simulation includes **drag**, proportional to velocity:
F_drag = -c × v
where `c` is the **drag coefficient**, adjustable via slider.

This slows motion gradually, reproducing how real astronauts move underwater — sluggishly but smoothly.

---

## Simulation Parameters

| Variable | Symbol | Unit | Description |
|-----------|---------|------|-------------|
| Water Temperature | T | °C | Affects density; warmer = less dense |
| Salinity | S | ‰ | Saltier = more dense |
| Gravity | g | m/s² | Controls gravitational acceleration |
| Drag Coefficient | c | — | Simulates fluid viscosity |
| Suit Inflation | — | × | Scales astronaut’s volume |
| Astronaut Density | ρ_object | kg/m³ | Defines total body/suit mass |
| Leak Factor | — | /s | Gradually increases density over time |
| Tilt Sensitivity | — | — | Controls rotation response |
| Lighting | — | — | Adjusts brightness (visual only) |
| Camera Sway | — | — | Creates underwater motion illusion |

---

## Neutral Zone Indicator
The **neutral zone** (a glowing horizontal line) represents **theoretical equilibrium** — the exact vertical position where:
ρ_object = ρ_fluid
The astronaut neither sinks nor rises — simulating microgravity inside the NBL pool.

---

## Controls & Interactions

| Control | Function |
|----------|-----------|
| **Sliders** | Adjust all environment & suit parameters |
| **Set Neutral** | Auto-tunes parameters for perfect balance |
| **Center Astronaut** | Resets position to middle of pool |
| **Pause** | Freezes simulation without reset |
| **Reset** | Restores defaults |
| **HUD Toggle** | Minimizes/expands control panel |

All changes happen in real-time — sliders directly modify physical variables in the equations above.

---

## Interface & Design
The interface uses **glassmorphism and CSS gradients** to create a vivid underwater effect:

- The **pool tiles** are built using `linear-gradient()` layers to form a glowing grid — no images required.  
- A **radial light gradient** simulates overhead lighting diffusion.  
- The HUD floats over the scene, blurred by `backdrop-filter`, giving a futuristic lab aesthetic.  
- All animations are optimized for **60fps** on desktop and mobile browsers.

This design mimics how astronauts perceive light distortion underwater in NASA’s real Neutral Buoyancy Lab.

---

## File Structure


When the astronaut stabilizes near that line, the system reaches perfect balance:
F_b ≈ F_g
v → 0
a → 0
