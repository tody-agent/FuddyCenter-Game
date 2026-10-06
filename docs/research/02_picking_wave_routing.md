# Technical & Game Design Document: Fulfillment Operations & Simulation Systems

This document outlines the mathematical framework, heuristic algorithms, operational logic, and gameplay simulation systems for a high-throughput 3D warehouse management tycoon game.

---

**Core Operational Workflows & Algorithms:**

Order fulfillment requires balancing physical travel economy, sortation complexity, and carrier dispatch deadlines. The systems below establish the foundational algorithms and logic pipelines that drive the operational simulation.

### Order Profiling & Picking Topologies

The Warehouse Execution System (WES) continuously stratifies the global order pool into specific pick execution models based on four primary metrics: line count per order ($L_o$), unit cube volume ($V_o$), SKU velocity class, and consolidation overhead tolerance.

```
       [ Incoming Order Stream ]
                  │
        (Order Profiling Logic)
                  ├───────────────────────────────┐
         [Single-Line (Singles)]        [Multi-Line (Multis)]
                  │                               │
        ┌─────────┴─────────┐           ┌─────────┴─────────┐
        ▼                   ▼           ▼                   ▼
 [Batch Picking]    [Cluster Pick] [Zone Pick-&-Pass]  [Goods-to-Person]
 (Sort Post-Pick)   (Sort on Cart) (Conveyor Transfer) (Pod-to-Station)
```

1. **Discrete Single-Order Picking:**
   - *Mechanic:* A picker walks the floor fulfilling one single multi-line order into a single container.
   - *System Overhead:* Lowest post-pick sortation overhead; highest travel distance per unit picked.
   - *Operational Domain:* Bulky/oversized non-conveyable freight, high-security vault items, or rush emergency orders.

2. **Multi-Order Batch Picking (Pick-to-Tote with Secondary Sortation):**
   - *Mechanic:* A picker consolidates raw quantities across $N$ orders into a single bulk tote.
   - *System Overhead:* Eliminates duplicate traversal for hot SKUs, but requires an active downstream put-wall or automated sortation system.
   - *Operational Domain:* High-density single-line orders (Singles) and small fast-moving consumer items.

3. **Cluster Picking (Pick-to-Carton / Sort-on-Cart):**
   - *Mechanic:* The pick cart is divided into $K$ distinct order receptacles (typically 6 to 12 slots). The picker navigates the aisle, scans the SKU, and an LED or RF display instructs the item placement directly into the target order receptacle.
   - *System Overhead:* Eliminates secondary sorting at the pack wall; increases dwell time at each pick face due to slot confirmation.
   - *Operational Domain:* Medium-velocity multi-line e-commerce orders.

4. **Zone Picking (Pick-and-Pass & Simultaneous Merge):**
   - *Mechanic:* The pick floor is partitioned into non-overlapping zones $Z_1, Z_2, \dots, Z_m$. 
   - *Pick-and-Pass:* A carton routes via conveyor across zones, accumulating SKUs sequentially.
   - *Simultaneous Merge:* Sub-orders are picked concurrently in all zones and merged at an automated consolidation buffer before packing.
   - *System Overhead:* High throughput; susceptible to zone starvation and bottlenecking if SKU velocity mapping is unbalanced.

---

### Order-to-Wave Batching Heuristics

The batching engine ingests the active order queue $\mathcal{O}$ and partitions it into discrete execution waves $W_k \subset \mathcal{O}$ to maximize pick density while satisfying operational boundary conditions.

```
+--------------------------------------------------------------------------+
|                        WAVE GENERATION PIPELINE                          |
|                                                                          |
|  [Order Pool] ──► [Hard Filters] ──► [Affinity Matrix] ──► [Bin Packing] |
|                   - Carrier Cut       - Cosine SKU Match   - Cart Weight |
|                   - SLA Window        - Spatial Proximity  - Volume Cap  |
+--------------------------------------------------------------------------+
```

#### Objective Function
The batching engine solves a multi-objective mixed-integer programming (MIP) problem to minimize total travel distance while enforcing strict carrier departures and zone load balancing:

$$\min \quad \alpha \sum_{k} \mathcal{D}(W_k) + \beta \sum_{j=1}^{M} |U_j - \bar{U}| + \gamma \sum_{o \in \mathcal{O}} \max(0, T_{\text{completion}}(o) - T_{\text{cutoff}}(o))$$

Where:
- $\mathcal{D}(W_k)$ is the estimated travel distance for wave $W_k$.
- $U_j$ is the workload allocated to zone $j$, and $\bar{U}$ is the mean workload across all $M$ zones.
- $T_{\text{completion}}(o)$ is the predicted completion timestamp for order $o$.
- $T_{\text{cutoff}}(o)$ is the dispatch critical pull time for order $o$.
- $\alpha, \beta, \gamma$ are player-configurable objective weighting parameters.

#### SKU Affinity Clustering
To maximize pick density, orders with overlapping item profiles are batched together. The affinity between Order $A$ and Order $B$ is computed via the Cosine Similarity metric:

$$\text{Affinity}(A, B) = \frac{\mathbf{v}_A \cdot \mathbf{v}_B}{\|\mathbf{v}_A\|_2 \|\mathbf{v}_B\|_2} = \frac{\sum_{s \in \mathcal{S}} q_{A,s} \cdot q_{B,s}}{\sqrt{\sum_{s \in \mathcal{S}} q_{A,s}^2} \cdot \sqrt{\sum_{s \in \mathcal{S}} q_{B,s}^2}}$$

Where $\mathbf{v}_A$ is the sparse inventory vector for order $A$, containing quantity $q_{A,s}$ for each SKU $s \in \mathcal{S}$.

#### Dynamic Batching Heuristics
When computational time limits prevent a full MIP solve, the system executes real-time heuristics:
- **Seed-Order Generation:** Select the order with the largest bounding box or the highest line count as the seed order $o_{\text{seed}}$.
- **Greedy Proximity Insertion:** Incrementally add unassigned orders $o_i$ that maximize affinity and minimize the volumetric expansion of the pick tour, subject to cart capacity constraints:

$$\sum_{o \in W_k} \text{Weight}(o) \le \text{Cap}_{\text{weight}}, \quad \sum_{o \in W_k} \text{Volume}(o) \le \text{Cap}_{\text{vol}}$$

---

### In-Aisle Routing Algorithms

Given a set of pick locations distributed across parallel racking aisles, the system generates a directed path for the worker. While the underlying problem is an NP-hard Traveling Salesperson Problem (TSP) on a grid graph, fulfillment networks rely on structured heuristics or exact graph algorithms.

```
S-SHAPE (Traversal)              LARGEST GAP                   COMBINED
 ┌───┐ ┌───┐ ┌───┐               ┌───┐ ┌───┐ ┌───┐            ┌───┐ ┌───┐ ┌───┐
 │ * │ │   │ │ * │               │ * │ │   │ │ * │            │ * │ │ * │ │ * │
 │ * │ │ * │ │   │               │   │ │ * │ │   │            │ * │ │ * │ │   │
 │   │ │ * │ │ * │               │ * │ │ * │ │ * │            │   │ │   │ │ * │
 └───┘ └───┘ └───┘               └───┘ └───┘ └───┘            └───┘ └───┘ └───┘
 (Full Aisle Traversal)        (Turn Around at Max Gap)      (Dynamic Cost Evaluator)
```

1. **S-Shape (Traversal) Heuristic:**
   - Any aisle containing at least one pick item is traversed across its entire length.
   - Aisles with no picks are skipped entirely.
   - The picker alternates entry from the front cross-aisle and rear cross-aisle, producing an "S" curve.
   - *Strengths:* Predictable, prevents bi-directional worker blockages in narrow aisles, low algorithmic overhead.
   - *Weaknesses:* Inefficient for low pick densities.

2. **Largest Gap Heuristic:**
   - A picker enters an aisle from a cross-aisle, collects items up to the largest separation distance (gap) between two adjacent picks, and then turns around and exits through the same side they entered.
   - The largest gap between two picks (or between a pick and the aisle boundary) is left untraversed.
   - *Strengths:* Highly optimal when picks are clustered near aisle ends.

3. **Combined Dynamic Heuristic:**
   - Dynamically evaluates for each aisle whether a full traversal ($C_{\text{traverse}}$) or a return trip ($C_{\text{return}}$) yields the minimum path:

$$C_{\text{traverse}} = L_{\text{aisle}}$$

$$C_{\text{return}} = 2 \cdot \max_{i} (y_i)$$

   Where $y_i$ is the distance of pick location $i$ from the entry cross-aisle, and $L_{\text{aisle}}$ is the total aisle length. The pathing engine selects:

$$\text{Decision} = \arg\min (C_{\text{traverse}}, C_{\text{return}})$$

4. **Optimal Steiner TSP on Graph:**
   - Represents the warehouse layout as an undirected graph $G = (V, E)$, where $V$ represents intersections and pick faces, and $E$ represents aisle segments with metric weights.
   - Solves the exact Shortest Path Tour containing all pick nodes using the dynamic programming approach of the Ratliff-Rosenthal algorithm, guaranteeing mathematical travel optimality in polynomial time for standard warehouse layouts.

---

### Pick Exceptions & Inventory Discrepancies

When a physical pick fails, the system executes an automated reconciliation state machine:

```
[Pick Face Reached] 
         │
         ▼
[Item Available?] ──No──► [Log Reason: Short / Damaged / Missing]
         │                              │
        Yes                             ▼
         │                 [Trigger Escalation Protocol]
         │                 - Lock Inventory Record in WMS
         ▼                 - Real-Time Dynamic Re-Route to Alternate Bin
[Confirm Scan]             - Dispatch Immediate Hot Cycle-Count Task
```

1. **Short-Pick / Missing SKU State:**
   - The picker flags `ERR_SKU_NOT_FOUND`.
   - The active wave halts that specific line. The WES queries local pickable stock:
     - If reserve inventory exists in an active forward pick location, the route inserts a dynamic re-route node.
     - If zero pickable inventory remains, the order line is flagged as backordered, and the container is marked for downstream exception diversion.

2. **Damaged Stock Protocol:**
   - Picker flags `ERR_SKU_DAMAGED`, prompts camera verification/UI prompt, and drops item into an on-cart quarantine tote.
   - Inventory is immediately transferred to logical location `UNSELLABLE_HOLD`.

3. **Autonomous Cycle-Count Trigger:**
   - The discrepancy event triggers a high-priority Cycle Count task assigned to an available specialist worker or autonomous drone, freezing the location to prevent cascading pick failures across concurrent waves.

---

**Game Mechanics & Simulation Systems:**

Translating technical logistics operations into dynamic, interactive simulation mechanics creates meaningful decision loops, operational friction, and optimization goals for the player.

### Player Decision Points & Strategic Trade-offs

The player navigates operational trade-offs, balancing throughput speed, labor costs, and capital expenditures:

| Strategic Parameter | High Setting / Pure Implementation | Low Setting / Alternative Model |
| :--- | :--- | :--- |
| **Wave Horizon Depth** | **Deep Batching:** Maximal pick face density; minimal travel per pick. High risk of missing express carrier cutoffs. | **Dynamic Continuous Flow:** Low queue latency; higher total travel distance; rapid cycle time. |
| **Pick Policy** | **Zone Pick-and-Pass:** High throughput, low picker travel; complex load balancing and conveyor jam risks. | **Cluster Picking:** Simple routing, low sorting overhead; high picker travel across larger footprints. |
| **Aisle Flow Policy** | **Strict One-Way Aisles:** Zero congestion deadlocks; increases detour distances for simple routes. | **Bi-Directional Aisles:** Shortest theoretical travel paths; high risk of picker and vehicle traffic jams. |
| **Routing Algorithm** | **Optimal Steiner TSP:** Lowest possible footprint travel; higher worker cognitive load and erratic movement. | **S-Shape Traversal:** Highly structured routing; predictable traffic flow; higher baseline travel distance. |

---

### Dynamic Aisle Congestion & Traffic Simulation

The warehouse floor uses a multi-agent grid pathfinding model with kinematic agent attributes:

```
+-------------------------------------------------------------------------+
|                  NARROW-AISLE DEADLOCK STATE MACHINE                    |
|                                                                         |
|  [Reach Truck A ->]  ◄── Contested Aisle Segment ──►  [<- Reach Truck B]|
|                                                                         |
|  * Width < 2.8m (Passing Impossible)                                   |
|  * Resolution: Yield Priority Matrix -> Agent B reverses to Cross-Aisle |
+-------------------------------------------------------------------------+
```

```
           [Agent Enters Aisle Segment]
                        │
             (Check Segment Capacity)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
  [Space Available]           [Segment At Capacity]
         │                             │
  (Apply Velocity)           (Check Agent Typology)
         │                             │
         │              ┌──────────────┴──────────────┐
         ▼              ▼                             ▼
 [Traverse Node] [Pedestrian vs Cart]       [Machinery Deadlock]
                        │                             │
                (Apply Speed Penalty)         (Yield Hierarchy)
                        │                             │
                        ▼                             ▼
                 [Move at 0.4x]             [Reverse & Re-Route]
```

- **Physical Footprint & Clearance:**
  - Pedestrian Manual Picker: $0.8\,\text{m}$ envelope.
  - Manual Pick Cart: $1.2\,\text{m} \times 0.8\,\text{m}$.
  - Reach Truck / Order Picker (MHE): $2.4\,\text{m} \times 1.4\,\text{m}$.
- **Congestion Rules:**
  - *Standard Aisle ($3.0\,\text{m}$ width):* Two carts or pedestrians may pass freely with no speed penalty. A reach truck passing a pedestrian incurs a $25\%$ speed reduction penalty.
  - *Very Narrow Aisle (VNA, $<1.8\,\text{m}$ width):* Single-agent capacity only. If two opposing agents enter, a **Deadlock Event** triggers.
  - *Resolution Priority:* Loaded Heavy Machinery > Empty Machinery > Pick Carts > Empty Foot Pickers. The lower-priority agent must reverse out of the aisle to the cross-aisle node, generating operational delay.

---

### Technology & Equipment Progression Tree

Players invest capital expenditure (CapEx) to progress through equipment tiers, reducing dwell times and error probabilities:

```
[Tier 1: Paper Sheets] ──► [Tier 2: Handheld RF] ──► [Tier 3: Voice / Pick-to-Light]
                                                              │
                                                              ▼
                                                   [Tier 4: Automated Goods-to-Person]
```

```
           [TECHNOLOGY MATRICES & PROGRESSION PATH]

 Tier 1: Paper Pick Lists
 ├── Equipment: Printed physical manifests
 ├── Pick Face Dwell Time: 8.5s baseline
 ├── Error Rate: 3.50% (Mis-scans, quantity errors)
 └── Routing UI: Static list order, high human error
       │
       ▼
 Tier 2: Handheld RF Scanners
 ├── Equipment: Ruggedized barcode terminals
 ├── Pick Face Dwell Time: 4.2s (Barcode verification)
 ├── Error Rate: 0.40%
 └── Routing UI: Dynamic turn-by-turn routing display
       │
       ▼
 Tier 3: Voice Picking & Smart Pick-to-Light Carts
 ├── Equipment: Wearable audio headsets & LED cart arrays
 ├── Pick Face Dwell Time: 2.1s (Hands-free operations)
 ├── Error Rate: 0.05%
 └── Routing UI: Optimized dynamic routing with visual cues
       │
       ▼
 Tier 4: Autonomous Goods-to-Person (AMR Drive Units)
 ├── Equipment: Automated pods/racks brought to static pickers
 ├── Pick Face Dwell Time: 1.2s per pick presentation
 ├── Error Rate: 0.01%
 └── Routing UI: Fully automated central fleet dispatching
```

---

### Interactive Mini-Events & Dispatcher Challenges

1. **The Hot-Order Ingestion (Critical Express SLA):**
   - *Trigger:* A VIP express order enters the queue with a 15-minute dispatch cutoff.
   - *Gameplay Action:* The player must choose between:
     - *Emergency Interruption:* Preempt an active picker's current cluster run, dynamically modifying their route (incurs a travel penalty and temporary disorientation status).
     - *Dedicated Hot-Shooter:* Deploy an expensive, dedicated rapid-response picker to fulfill the order directly.

2. **Inventory Discrepancy Dispute:**
   - *Trigger:* A picker encounters a designated bin location containing zero units of the expected SKU.
   - *Gameplay Action:* The player must quickly assign an emergency cycle counter to verify the bin, or re-route the active wave to a higher-level reserve pallet location. Mismanaging this causes downstream packaging stations to starve and enter an idle state.

---

### Mathematical Model & Core Warehouse KPIs

The simulation engine computes operational metrics every tick to determine operational efficiency and score warehouse performance:

```
+───────────────────────────────────────────────────────────────────────────+
|                          CORE METRICS DASHBOARD                           |
|                                                                           |
|   UPH:  [  185.4  ]        TRAVEL/PICK RATIO: [ 62% / 38% ]               |
|   ADI:  [  0.84   ] (HIGH) ORDER CYCLE TIME:  [ 28.4 min  ]               |
+───────────────────────────────────────────────────────────────────────────+
```

```python
class WarehouseMetricsEngine:
    """Computes tier-1 warehouse fulfillment performance indicators."""

    @staticmethod
    def calculate_uph(total_units_picked: int, total_labor_hours: float) -> float:
        """Units Per Hour (Labor Efficiency)."""
        if total_labor_hours <= 0:
            return 0.0
        return total_units_picked / total_labor_hours

    @staticmethod
    def travel_to_pick_ratio(
        total_travel_time: float, total_pick_face_time: float
    ) -> float:
        """Ratio of movement overhead to actual value-add picking time."""
        total_time = total_travel_time + total_pick_face_time
        if total_time <= 0:
            return 0.0
        return (total_travel_time / total_time) * 100.0

    @staticmethod
    def aisle_density_index(
        active_agents_in_aisle: int, aisle_length_meters: float
    ) -> float:
        """Congestion potential (Agents per 10 meters of pick aisle)."""
        if aisle_length_meters <= 0:
            return 0.0
        return (active_agents_in_aisle / aisle_length_meters) * 10.0

    @staticmethod
    def order_cycle_time(
        order_placed_timestamp: float, order_staged_timestamp: float
    ) -> float:
        """Total duration (in minutes) an order spends inside the warehouse."""
        return (order_staged_timestamp - order_placed_timestamp) / 60.0
```

#### Core Mathematical Formulas

- **Units Per Hour (UPH):**
  $$\text{UPH} = \frac{\sum \text{Units Picked}}{\sum \text{Active Picker Hours}}$$

- **Travel-to-Pick Ratio ($\Phi_{\text{travel}}$):**
  $$\Phi_{\text{travel}} = \frac{T_{\text{travel}}}{T_{\text{travel}} + T_{\text{dwell}}} \times 100$$
  *(Targeting lower percentages via routing optimizations).*

- **Aisle Density Index ($\text{ADI}_a$):**
  $$\text{ADI}_a = \frac{N_{\text{agents}}(a)}{L_{\text{aisle}}(a)} \times 10$$
  Where $N_{\text{agents}}(a)$ is the number of active pickers/MHE in aisle $a$, and $L_{\text{aisle}}(a)$ is the aisle length in meters. Values where $\text{ADI}_a > 1.5$ trigger movement speed penalties due to congestion.