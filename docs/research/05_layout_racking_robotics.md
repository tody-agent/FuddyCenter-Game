# Warehouse Systems Engineering & Game Design Specification

This document provides the foundational engineering architecture, physical layout systems, robotics fleet logic, and core simulation mechanics for a 3D logistics management and tycoon simulation game.

```
       +-------------------------------------------------------------+
       |                  INBOUND LOGISTICS (DOCKS)                  |
       +-------------------------------------------------------------+
                                      |
                         [De-palletization & Sorting]
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v                                                         v
+------------------+                                     +------------------+
| PALLET HIGH-BAY  |                                     | MINI-LOAD / ACR  |
| (VNA / ASRS /    |                                     | (Totes / Cartons |
| Selective Racks) |                                     | Dynamic Storage) |
+------------------+                                     +------------------+
         |                                                         |
         +----------------------------+----------------------------+
                                      |
                              [Replenishment]
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v                                                         v
+--------------------+                                   +--------------------+
| CARTON FLOW / PICK |                                   | GOODS-TO-PERSON    |
| (Manual Pick Face) |                                   | (AMR Pod Stations) |
+--------------------+                                   +--------------------+
         |                                                         |
         +----------------------------+----------------------------+
                                      |
                     [Conveyor Spine & Consolidation]
                                      |
         +---------------------------------------------------------+
         |               PACKING, SORTATION & OUTBOUND             |
         +---------------------------------------------------------+
```

---

## 1. Core Engineering & Operational Workflows

### 1.1 Racking Typology & Density Specs

```
1. SELECTIVE (Single-Deep)          2. DOUBLE-DEEP
   +---+  [ AISLE ]  +---+             +---+---+  [ AISLE ]  +---+---+
   | P |    3.5m     | P |             | P | P |    3.5m     | P | P |
   +---+             +---+             +---+---+             +---+---+
   100% Selectivity / Low Density      50% Direct Access / Mid-High Density

3. VERY NARROW AISLE (VNA)          4. CARTON FLOW (Gravity Feed)
   +---+  [AISLE]  +---+               [Loading Rear] ===> [Picking Front]
   | P |   1.7m    | P |               | Carton | Carton | Carton | -> Roller
   +---+  (Wire)   +---+               High-velocity split-case picking
   Max Verticality / Guide Rails
```

The physical storage layout governs volumetric density, picking speed, and structural integrity. Every racking system utilizes standard steel roll-formed or structural upright frames, horizontal step beams, and safety accessories.

*   **Selective Pallet Racking (Single-Deep):**
    *   *Grid footprint:* $1 \times 2$ grid tiles ($1.2\text{ m} \times 2.4\text{ m}$ bay).
    *   *Aisle requirement:* Wide Aisle ($3.2\text{ m} - 3.8\text{ m}$).
    *   *Selectivity:* $100\%$ immediate access to every pallet SKU.
    *   *Density ratio:* Lowest ($35\% - 40\%$ footprint utilization).
    *   *Structural load limit:* $1,000 - 1,500\text{ kg}$ per pallet position; up to $4$ beam levels ($12,000\text{ kg}$ per frame upright).
    *   *Gameplay role:* Starter storage, high-cube items, fast-moving bulk buffer.
*   **Double-Deep Pallet Racking:**
    *   *Grid footprint:* $2 \times 2$ grid tiles configured in back-to-back pairs.
    *   *Aisle requirement:* Standard Reach Truck Aisle ($2.8\text{ m} - 3.2\text{ m}$).
    *   *Selectivity:* $50\%$ immediate access (requires stock-shuffling if non-identical SKUs are placed in back-to-back positions).
    *   *Density ratio:* Medium-High ($50\% - 60\%$ footprint utilization).
    *   *Mechanical constraints:* Requires reach trucks equipped with pantograph or telescopic fork attachments; load capacity degrades at reach extension by $20\% - 30\%$.
*   **Very Narrow Aisle (VNA) Racking:**
    *   *Grid footprint:* $1 \times 2$ grid tiles, scaling up to $15\text{ m} - 18\text{ m}$ vertically ($8 - 12$ tiers).
    *   *Aisle requirement:* Ultra-compact ($1.6\text{ m} - 1.8\text{ m}$).
    *   *Selectivity:* $100\%$ direct accessibility.
    *   *Density ratio:* Very High ($65\% - 75\%$ footprint utilization).
    *   *Engineering constraint:* Requires inductive in-floor guide wires or floor-mounted mechanical guide rails, plus super-flat concrete floors (DIN 18202 / ASTM E1155 $F_F/F_L \ge 50$).
*   **Carton Flow Racking (Gravity Feed Dynamic Storage):**
    *   *Grid footprint:* Variable modular bays ($1.5\text{ m} \times 2.5\text{ m}$).
    *   *Mechanism:* Integrated roller tracks inclined at a $3^\circ - 5^\circ$ angle. Loading occurs at the high rear replenishment aisle, while picking happens at the low front picking aisle (First-In, First-Out).
    *   *Operational throughput:* Fast split-case picking rates ($180 - 300\text{ picks/hour/worker}$).
    *   *Limitation:* Limited SKU dimensions, manual replenishment dependencies, and no raw pallet storage capability.
*   **Multi-Tier Mezzanine Steel Platforms:**
    *   *Structural engineering:* High-grade structural steel columns supporting cross-beams, cold-rolled joists, and heavy-duty corrugated steel decking with high-density wood overlays.
    *   *Load rating:* $350 - 1,000\text{ kg/m}^2$.
    *   *Footprint multiplier:* Multiplies physical floor plate by up to 3 to 4 vertical functional tiers.
    *   *Integration:* Requires integration with fire sprinkler drop-lines, egress stairwells, safety kick-plates, handrails, and Vertical Reciprocating Conveyor (VRC) shafts.

---

### 1.2 Material Handling Equipment (MHE) Fleet

```
+---------------------------------------------------------------------------------------+
| MHE Type            | Aisle Width | Max Lift | Travel Speed | Turn Radius | Relative  |
|                     | Requirement | Height   | (Loaded)     |             | Cost      |
+---------------------+-------------+----------+--------------+-------------+-----------+
| Manual Pallet Jack  | 1.8 m       | 0.2 m    | 1.2 m/s      | 1.2 m       | $         |
| Counterbalance Fork | 3.5 - 4.0 m | 4.5 m    | 3.5 m/s      | 2.5 m       | $$        |
| Reach Truck         | 2.7 - 3.0 m | 9.0 m    | 2.8 m/s      | 1.8 m       | $$$       |
| VNA Turret Truck    | 1.6 - 1.8 m | 16.0 m   | 2.0 m/s      | Fixed Rail  | $$$$      |
| VRC Lifts           | Static Bay  | 24.0 m   | 0.6 m/s (v)  | N/A (Fixed) | $$$$$     |
+---------------------------------------------------------------------------------------+
```

*   **Manual Pallet Jacks:**
    *   *Operational parameters:* Operates manually, requiring low initial investment.
    *   *Dynamics:* Acceleration is bounded by worker fatigue curves. Cannot lift loads above ground level ($0.2\text{ m}$).
    *   *Vulnerabilities:* Zero collision safety barriers, high long-term labor cost, and steep throughput drop-off over transit distances greater than $40\text{ meters}$.
*   **Counterbalance Forklifts (Electric / LPG):**
    *   *Operational parameters:* Heavy front-mounted counterweight for general load stabilization.
    *   *Dynamics:* Fast linear transit speed; large sweeping turning radius.
    *   *Functional domain:* Cross-dock operations, pallet transfer from flatbed trucks to staging areas, and servicing low-tier selective racks. Cannot operate inside narrow storage aisles.
*   **Reach Trucks:**
    *   *Operational parameters:* Moving-mast assembly with stabilizing outrigger legs.
    *   *Dynamics:* Capable of operating in aisles as narrow as $2.7\text{ meters}$.
    *   *Functional domain:* Lift heights up to $9 - 11\text{ meters}$. Optimal for Double-Deep and medium-to-high selective rack configurations. Slower transit speed relative to counterbalance forklifts.
*   **VNA Turret Trucks (Man-Up / Man-Down):**
    *   *Operational parameters:* Rotating forks capable of turning $180^\circ$ left or right without rotating the truck chassis.
    *   *Dynamics:* Highly restricted movement; can only change aisles via specialized transfer cars or wide end-of-aisle turning corridors ($4.5\text{ m}$).
    *   *Functional domain:* High-bay dense storage ($15\text{ m}+$); continuous vertical pick and put-away cycles.
*   **Vertical Reciprocating Conveyor (VRC) Lifts:**
    *   *Operational parameters:* Heavy-duty mechanical/hydraulic vertical platform lifts connecting ground floors with multi-tier mezzanine decks.
    *   *Dynamics:* Throughput is bounded by cycle times (acceleration, steady vertical speed, deceleration, mechanical locking, and loading/unloading).
    *   *Failure state:* Forms a severe single-point-of-failure (SPOF) bottleneck if not twinned across zones.

---

### 1.3 Robotics Systems Architecture

```
               [Central Warehouse Management System (WMS)]
                                   |
                   [Robotics Fleet Manager / RCS]
                                   |
         +-------------------------+-------------------------+
         |                         |                         |
         v                         v                         v
+------------------+     +-------------------+     +--------------------+
|  QR / SLAM AMR   |     | ACR TOTE RUNNER   |     | SHUTTLE ASRS       |
|  (Pod Carriers)  |     | (Case Pickers)    |     | (3D High-Velocity) |
+------------------+     +-------------------+     +--------------------+
         |                         |                         |
         v                         v                         v
[Goods-to-Person Station]  [Consolidation Hub]    [High-Speed Infeed/Out]
```

*   **QR-Grid Navigation vs. LiDAR SLAM AMRs:**
    *   *QR-Grid AMRs:* Navigate by scanning two-dimensional data-matrix codes affixed to the warehouse floor at exact $1.0\text{ m}$ intervals, supplemented by wheel odometry and inertial measurement units (IMUs). They offer low sensor cost, high positioning accuracy ($\pm 2\text{ mm}$), and high acceleration, but require floor maintenance and permit no ad-hoc routing off the grid.
    *   *LiDAR SLAM AMRs:* Construct natural feature point-cloud maps of the facility. They need no floor modifications and can dynamically pathfind around arbitrary obstacles, but carry a high sensor suite cost, run the risk of localization drift in wide-open symmetrical spaces, and demand high computing resources for real-time map matching.
*   **Shelf-to-Person (Goods-to-Person) Pod Movers:**
    *   *Kinematics:* Low-profile chassis slips underneath mobile racking pods ($1.0\text{ m} \times 1.0\text{ m} \times 2.4\text{ m}$), raises an internal hydraulic/lead-screw lift plate to elevate the entire storage unit, and drives it directly to an ergonomic pick station.
    *   *Cycle time:* Eliminates picker walk time completely. Upgrades pick rates from $60 - 80\text{ lines/hour}$ (manual walk-to-bin) to $350 - 600\text{ lines/hour}$ per operator station.
*   **Autonomous Case-handling Robots (ACR):**
    *   *Kinematics:* Tall vertical mast ($4\text{ m} - 10\text{ m}$) mounted on an AMR base, equipped with dynamic micro-telescopic retrieval forks.
    *   *Operation:* Picks, loads, and transports $4 - 8$ individual plastic storage totes/cartons per run. Provides carton-level inventory density without moving entire storage pods.
*   **Shuttle-Based Automated Storage & Retrieval Systems (ASRS):**
    *   *Kinematics:* 3D Cartesian storage matrices. Dedicated horizontal shuttles operate on integrated rack rails along each level; high-speed vertical lifts handle in-feed and out-feed across levels.
    *   *Throughput:* Delivers high velocity and volume ($>1,000\text{ tote retrievals/hour/aisle}$).
    *   *Constraint:* High capital expenditure and inflexible physical footprints.
*   **Automated Conveyor Spines & Sortation Loops:**
    *   *Sub-types:* Powered Roller Conveyors (MDR), Cross-Belt Sorters, and Sliding Shoe Sorters.
    *   *Role:* Acts as the central logistics spine moving consolidated orders across long distances from pick modules to pack stations and outbound shipping chutes.
    *   *Simulation impact:* Creates fixed path boundaries across the floor that block worker and forklift paths unless dedicated pedestrian crossover bridges or pop-up gates are installed.

---

### 1.4 Fleet Infrastructure, Charging Strategies & Traffic Orchestration

```
OPPORTUNITY CHARGING PROFILE (LiFePO4)
Battery %
100% |       +---+               +---+
 80% |       |   | (Opportunity) |   |
 60% |-------+   +---------------+   +------- (Floor Buffer)
 40% |
 20% | (Critical Threshold -> Divert to Depot)
  0% +---------------------------------------- Time

DEADLOCK AVOIDANCE: TIME-SPACE RESERVATION GRID
Grid (X,Y)
(4,8) |  [ AMR A @ t=12s ] ---> [ AMR A @ t=13s ]
(4,7) |  [ BLOCKED (Reserved by AMR A)          ]
(4,6) |                         [ AMR B @ t=13s ]
      +------------------------------------------
```

*   **Opportunity Fast-Charging vs. Centralized Battery Swap:**
    *   *Opportunity Fast-Charging:* Advanced lithium-iron-phosphate ($\text{LiFePO}_4$) and titanate chemistries accept high charge rates ($1\text{C} - 3\text{C}$). AMRs automatically drop onto floor-flush copper charge pads during idle times, buffer queuing, or tote-loading pauses. This setup eliminates manual intervention, but creates distributed power spikes across the grid.
    *   *Battery Swap Rooms:* Manual or automated robotic stations that physically eject depleted lead-acid or standard lithium battery packs and insert fully charged units within $90\text{ seconds}$. This allows continuous $24/7$ multi-shift utilization, but carries a high upfront CapEx footprint for spare battery banks and swap machinery.
*   **Deadlock Prevention Algorithms (Time-Space Window Reservations):**
    *   *Mechanism:* The Fleet Management System treats every grid intersection as a 4D node $(X, Y, Z, \text{Time})$. When an AMR calculates an optimal route via $A^*$ or Conflict-Based Search (CBS), it reserves arrival-and-departure time slices for every node along its path.
    *   *Deadlock Resolution:* If two AMRs attempt to enter the same intersection at identical time windows, the AMR carrying a lower-priority task or lower dynamic kinetic energy is assigned a hold status at the upstream deceleration node.
*   **Aisle Directionality Architecture:**
    *   *One-Way Loop Systems:* Enforcing single-direction travel in narrow aisles reduces intersection conflict frequency by $85\%$ and cuts routing compute overhead, but increases average travel distance by $15\% - 25\%$.
    *   *Dynamic Bi-Directional Switching:* Main transit corridors feature dynamic direction assignments based on real-time operational surges (e.g., all lanes switch to inward-bound flow during high-volume replenishment waves).

---

## 2. Game Mechanics & Simulation Systems

### 2.1 Grid-Based Building & Sandbox Mechanics

```
FLOOR GRID SPECIFICATION & OCCUPANCY MASK
+---------------------+---------------------+
| 1 Grid Tile = 1.2m x 1.2m (Standard Pallet Footprint)
+---------------------+---------------------+
| Layer 0: Subfloor   | Concrete Slab (PSI Load Rating, Inductive Wire)
| Layer 1: Floor Paint| Pedestrian Walkway, AGV Zone, Forklift Aisle
| Layer 2: Equipment  | Racks, Conveyors, Charging Stations, Pick Hubs
| Layer 3: Overhead   | Sprinklers, High-Bay Lighting, Mezzanines
+---------------------+---------------------+
```

*   **Tile System:** A discrete base grid where $1\text{ Tile} = 1.2\text{ m} \times 1.2\text{ m}$ (the standard footprint of an ISO/EUR pallet base including operational clearance margins).
*   **Structural Mechanics (Floor Load Ratings & Slabs):**
    *   Concrete sub-slabs have maximum structural load tolerances (e.g., Standard $3,000\text{ kg/m}^2$, Heavy Industrial $8,000\text{ kg/m}^2$, Reinforced Pile-Supported $15,000\text{ kg/m}^2$).
    *   Placing multi-tier high-bay VNA racks or mezzanine systems checks the sum of dead-loads (steel frames) and live-loads (stored inventory). Exceeding slab limits blocks construction or causes progressive foundation cracking, penalizing vehicle travel speeds.
*   **Dock Door Operations:**
    *   Inbound and outbound dock bays require external truck docking yards and dedicated internal staging zones ($3 \times 4\text{ tiles}$ per door).
    *   Miscalculating the ratio of inbound unloading docks to outbound shipping docks creates staging area blockages, backing up transport trucks into off-site queues that trigger municipal delay fines.

---

### 2.2 Space Density vs. Flow Velocity Trade-Offs

The core gameplay loop centers on balancing spatial storage efficiency against material handling velocity:

```
[Wide Aisle Selective]  <===================>  [Very Narrow Aisle / ASRS]
- Storage Density: Low (35%)                    - Storage Density: Extreme (85%)
- Vehicle Travel Speed: 100% (Two-Way)         - Vehicle Travel Speed: 40% (Single-File)
- Equipment CapEx: Low                          - Equipment CapEx: Very High
- Congestion Index: Minimal                     - Congestion Index: Fragile Bottlenecks
```

*   **Wide Aisles ($3.6\text{ m} / 3\text{ tiles}$):** Supports smooth two-way forklift movement and simultaneous pedestrian picking without collision checks. Sacrifices substantial cubic storage capacity, driving up facility lease costs per stored unit.
*   **VNA Configuration ($1.6\text{ m} - 1.8\text{ m} / 1.5\text{ tiles}$):** Maximizes volumetric density per square meter. However, each aisle becomes strictly single-file. If a turret truck picks inventory in an aisle, that aisle is completely locked to other traffic until the pick cycle finishes.
*   **Slotting Velocity Optimization (ABC Analysis):**
    *   *Fast-Movers (Class A - $20\%$ of SKUs, $80\%$ of picks):* Must be placed near dock staging areas at ergonomic golden-zone beam heights ($0.8\text{ m} - 1.4\text{ m}$).
    *   *Slow-Movers (Class C - $50\%$ of SKUs, $5\%$ of picks):* Routed to high-bay storage tiers or the deepest warehouse zones. Failure to run slotting optimization routines increases total fleet travel distance, escalating charging drain and SLA breach rates.

---

### 2.3 CapEx vs. OpEx Economic Model

The financial engine simulates the economic balance between manual labor operations and automated infrastructure:

```
Total Operational Cost (Monthly) =
    SUM(Worker Wages + Health Insurance + Fatigue Downtime)
  + SUM(Equipment Leases + Maintenance Service Level Agreements)
  + SUM(KWh Grid Energy Consumption * Peak Tariff Multiplier)
  + SUM(SLA Breach Penalties + Damaged Inventory Losses)
```

```
CUMULATIVE EXPENDITURE OVER TIME
Cost ($)
  |                                   / (Manual Route: High OpEx)
  |                                  /
  |                                 /
  |  ==============================+================ (Automated: High CapEx)
  |  | (Break-even Horizon)        /
  |  |                            /
  +--+---------------------------+------------------- Time (Months)
```

*   **Manual Fulfillment Profile (Low CapEx / High OpEx):**
    *   Low upfront costs (inexpensive standard selective racks, manual pallet jacks).
    *   High recurring operating expenses (hourly worker wages, shift premiums, worker compensation, human picking errors around $1\% - 3\%$).
*   **Automated Fulfillment Profile (High CapEx / Low OpEx):**
    *   High initial investment (ASRS cranes, AMRs, dynamic charging infrastructure, structural engineering, software licensing).
    *   Low marginal cost per picked item, zero picking error rates ($99.99\%$ accuracy), and continuous round-the-clock shift operation, bounded only by utility electrical tariffs and specialized maintenance service level agreements (SLAs).

---

### 2.4 Facility Progression & Upgrade Tiers

```
TIER 1: Manual Shed
- Wooden Pallets on Floor, Hand Trucks, Low Ceilings
- 100% Human-driven, high errors, tight capital constraints
       |
       v
TIER 2: High-Bay Racked Hub
- Selective Racks, Reach Trucks, Basic Warehouse Management Systems
- Distinct zones for staging, picking, and bulk storage
       |
       v
TIER 3: Multi-Level Mezzanine Facility
- Carton Flow, VRC Lifts, Overhead Gravity Conveyor Loops
- Multi-tier vertical picking, zone routing mechanics
       |
       v
TIER 4: Hybrid AMR Center
- Goods-to-Person Pods, Mixed Human-Cobot Picking Modules
- Dynamic traffic management, automatic opportunity charging
       |
       v
TIER 5: Lights-Out Fully Autonomous Mega-Hub
- High-Speed Shuttle ASRS, Robotic Articulated Arm Inductions
- Minimal lighting/HVAC requirements, high throughput density
```

---

### 2.5 Failure States, Crises & Disruption Mechanics

*   **Structural Rack Collapse (Domino Hazard):**
    *   *Trigger:* A forklift strikes an unprotected upright frame lacking anchor-bolted steel column protectors at a speed above $1.5\text{ m/s}$.
    *   *Impact:* The upright buckles, triggering progressive structural failure across the entire racking bay run. This destroys inventory, blocks the aisle, and issues heavy regulatory worker safety fines.
*   **AMR Gridlock & Dead Battery Stranding:**
    *   *Trigger:* Improper fleet path layout, missing turn clearance offsets, or unoptimized charging schedules during peak order surges.
    *   *Impact:* An AMR depletes its battery to $0\%$ in the middle of a high-traffic junction. The stationary chassis becomes a pathfinding obstacle, triggering cascading routing delays and fleet-wide gridlock.
*   **Power Grid Brownout:**
    *   *Trigger:* Total electrical load from fast-charging hubs, high-speed sorting conveyors, and vertical lifts exceeds the substation transformer capacity during peak operational hours.
    *   *Impact:* Automated equipment halts immediately. The player must install industrial battery energy storage systems (BESS), balance charging schedules across shifts, or invest in localized backup diesel generator banks.

---

### 2.6 Core Mathematical Formulas & KPIs

```
+------------------------------------+---------------------------------------------------------------+
| KPI Metric                         | Mathematical Formula                                          |
+------------------------------------+---------------------------------------------------------------+
| Volumetric Storage Efficiency (VSE)| VSE = (Sum of V_SKU / V_TotalWarehouse) * 100                 |
| MHE Fleet Utilization Rate (FUR)   | FUR = (Sum of T_Active / (N_Fleet * T_TotalShift)) * 100      |
| Traffic Bottleneck Index (TBI)     | TBI = (Sum of T_Wait / Sum of T_TravelNominal) * (N_Stop / L) |
| Floor Weight Load Margin (FLM)     | FLM = ((Slab_MaxCapacity - Load_TotalApplied) / Slab_Max) * 100|
+------------------------------------+---------------------------------------------------------------+
```

#### 1. Volumetric Storage Efficiency ($VSE$)
Measures the percentage of total cubic warehouse volume occupied by actual product payloads versus empty air and aisle access space:

$$VSE = \left( \frac{\sum_{i=1}^{n} V_{\text{SKU}, i}}{L_{\text{building}} \times W_{\text{building}} \times H_{\text{clear}}} \right) \times 100$$

Where $V_{\text{SKU}, i}$ is the true volume of individual stored SKU items, and the denominator represents the total internal building envelope.

#### 2. MHE Fleet Utilization Rate ($FUR$)
Measures the operational efficiency of transport equipment, tracking active loaded travel against idle, deadheading, and charging durations:

$$FUR = \left( \frac{\sum_{k=1}^{N_{\text{fleet}}} T_{\text{loaded}, k}}{N_{\text{fleet}} \times T_{\text{shift}}} \right) \times 100$$

Where $T_{\text{loaded}, k}$ is the productive loaded transit time of unit $k$, $N_{\text{fleet}}$ is total active units, and $T_{\text{shift}}$ is the total shift time.

#### 3. Traffic Bottleneck Index ($TBI$)
Identifies intersection congestion and travel delay within specific layout configurations:

$$TBI = \frac{1}{|E|} \sum_{e \in E} \left( \frac{\overline{t}_{\text{actual}, e} - t_{\text{free}, e}}{t_{\text{free}, e}} \right) \times \left( \frac{\rho_e}{\rho_{\max}} \right)$$

Where $E$ is the set of aisle segments/intersections, $\overline{t}_{\text{actual}, e}$ is the observed average traversal duration, $t_{\text{free}, e}$ is the unimpeded travel time at maximum rated speed, and $\frac{\rho_e}{\rho_{\max}}$ is the instantaneous vehicle density ratio on that segment.

#### 4. Floor Weight Load Margin ($FLM$)
Calculates the remaining structural safety buffer for concrete subfloor slabs to prevent floor failure:

$$FLM_j = \left( \frac{C_{\text{slab}, j} - \left( \frac{W_{\text{rack}} + \sum_{p=1}^{m} W_{\text{pallet}, p}}{A_{\text{footprint}, j}} \right)}{C_{\text{slab}, j}} \right) \times 100$$

Where $C_{\text{slab}, j}$ is the certified slab capacity in $\text{kg/m}^2$ at floor zone $j$, $W_{\text{rack}}$ is the static dead-weight of the steel racking frame, and $\sum W_{\text{pallet}, p}$ is the sum of dynamic inventory weights loaded across the vertical tiers supported by frame base area $A_{\text{footprint}, j}$.