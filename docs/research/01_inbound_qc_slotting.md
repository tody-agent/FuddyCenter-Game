# Operational and Systems Design Document: Inbound Logistics, QC Inspection & Putaway Slotting

---

## 1. Core Operational Workflows

### Dock Scheduling & Advanced Shipping Notices (ASN)

The inbound pipeline serves as the primary operational gateway for the facility. Supply chain predictability relies on electronic data interchange (EDI) and Advance Shipping Notices (ASN) submitted by suppliers prior to dispatch. The simulation operates an active scheduling engine that evaluates carrier punctuality, load profiles, and gate resource availability.

```
[Inbound Carrier En Route] 
          │
          ▼
[Gate Check-in & ASN Matching] ──(Variance Detected)──► [Discrepancy Resolution / Hold]
          │                                                       │
   (Valid Schedule)                                               │ (Resolved)
          ▼                                                       ▼
[Assigned Dock Door Buffer] ────────────────────────────► [Dock Door Backed In]
                                                                  │
                                                          [Unloading Cycle]
```

*   **Appointment Windows and Yard Queuing:** Inbound freight carriers are assigned discrete appointment windows (e.g., standard $45$-minute blocks for palletized loads or $180$-minute blocks for ocean containers). Yard management systems must balance physical gate capacity against yard truck (hostler) moves.
*   **Arrival Variance & Penalty Cascades:** Carriers arrive with a stochastic time variance modeled via a Gaussian distribution centered on their target appointment:
    
    $$\Delta t_{\text{arrival}} \sim \mathcal{N}(\mu, \sigma^2)$$

    Early arrivals are directed to holding buffers without penalty until their window opens. Late arrivals forfeit their priority slot, forcing the player to choose between queuing them in overflow staging or rolling the appointment to subsequent operational shifts.
*   **Demurrage and Detention Mechanics:** If a trailer dwells at a dock door or in the yard beyond its contractual grace period (e.g., $120$ minutes post-arrival), the facility incurs continuous financial demurrage penalties calculated per minute. Conversely, turning a truck around ahead of schedule yields carrier score improvements, lowering future inbound contract freight rates.

---

### Unloading Types & Inbound Handling

The physical transloading of cargo from trailer bed to the warehouse staging area is dictated by cargo packaging and available dock automation equipment.

```
                     ┌── [Palletized Unit Loads] ──► [Counterbalance Forklift / Electric Pallet Jack] ──┐
                     │                                                                                  │
[Inbound Trailer] ───┼── [Loose Floor-Loaded]    ──► [Telescopic Boom Conveyor / Manual Destuffing]   ──┼──► [Staging / Decant Buffer]
                     │                                                                                  │
                     └── [Mixed Parcel / Totes]  ──► [Infeed Singulator / Powered Roller System]      ──┘
```

*   **Floor-Loaded Container Destuffing:** Loose-carton shipping containers require manual unstacking (destuffing) or the deployment of extendable telescopic boom conveyors. This method exhibits high labor consumption and lower volumetric throughput per hour, but optimizes cubic space utilization inside the shipping vessel.
*   **Palletized Freight Handling:** Standardized wooden or composite pallets (e.g., $1200 \times 1000 \text{ mm}$ or $1200 \times 800 \text{ mm}$) permit rapid unit-load extraction utilizing walkie-stackers, electric pallet jacks, or dock-rated counterbalance forklifts. Throughput is significantly higher, but payloads are subject to transport tipping hazards if pallet wrap integrity is compromised.
*   **Decanting and Infeed Induction:** Floor-loaded items and non-standard master cartons must pass through a decant station where cases are opened, polybagged if required, and transferred into standardized internal handling totes or pallet footprints with License Plate Numbers (LPNs).

---

### Inbound Quality Control & Defect Quarantine

Incoming freight cannot be committed to general inventory without verifying physical authenticity, structural integrity, and regulatory compliance.

```
[Decanted / Palletized Freight]
               │
               ▼
   [Scan LPN / Optical Barcode]
               │
               ├─────────────────────────────────────────┐
               ▼                                         ▼
   [Standard Inline Inspection]               [High-Risk / Hazmat / Perishable]
   ├── Dimensional Weighing (Cubiscan)        ├── Expiration OCR Sweep
   └── Barcode Readability Verification       └── Lot / Serial / Seal Audit
               │                                         │
               ├───────────────┬─────────────────────────┤
               ▼               ▼                         ▼
      [Pass: Route to Putaway] [Rework / Relabel] [Quarantine Cage / Vendor Return]
```

*   **License Plate Number (LPN) Tracking:** Every incoming unit load (pallet, case, or tote) is dynamically married to a unique, machine-readable LPN tracking barcode. This token encapsulates SKU metadata, origin batch identifier, serial ranges, and timestamped custody logs.
*   **Optical Character Recognition (OCR) & Perishable Profiling:** For cold-chain or dated goods, vision systems and manual scanning stations verify dynamic parameters:
    *   Expiration dates and minimum remaining shelf-life thresholds ($RSL\%$).
    *   Batch/Lot numbers against recall databases.
    *   Country-of-origin markings and tamper-evident seal integrity.
*   **Defect Quarantine and Triage:** Items flagged for water damage, carton crush, missing barcodes, suspected counterfeit status, or hazardous material leakage are diverted via motor-driven roller spurs into a segregated Quarantine Cage. Quarantined stock remains non-sellable in the software inventory layer until an operator executes a triage action: *Return to Vendor (RTV)*, *Field Destroy*, or *Manual Repackaging/Relabeling*.

---

### Algorithmic Slotting & Dynamic Putaway

Once cleared through QC, the Warehouse Execution System (WES) assigns items to physical storage locations through multi-criteria optimization algorithms.

```
[Cleared Inventory (LPN Active)]
               │
               ▼
   [Algorithmic Slotting Engine]
   ├── ABC Velocity Classification (Pick Frequency Analysis)
   ├── Volumetric Cube Utilization (Dim-Weight Bin Matching)
   ├── Ergonomic Golden-Zone Weighting (Operator Safety)
   └── SKU Affinity Clustering (Co-Pick Probability Graphs)
               │
               ▼
[Directed Putaway Task Generation: System-Guided Routing to Aisle/Bay/Tier]
```

*   **ABC Velocity Classification:** Storage locations are segregated based on pick demand frequency:
    *   *Class A (Fast Movers):* Positioned at low-level rack elevations immediately adjacent to outbound sorting conveyors or packing matrices to minimize travel times.
    *   *Class B (Medium Velocity):* Positioned along main secondary transit aisles and intermediate rack levels.
    *   *Class C (Slow Movers / Long Tail):* Positioned in deep-reserve racking, upper rack tiers, or remote mezzanine areas.
*   **Volumetric Cube Optimization:** Software algorithms compute dynamic bin packing using product dimensional profiles ($X, Y, Z$) to maximize bin fill rates without exceeding structural shelf weight limits ($W_{\text{bin\_max}}$).
*   **Ergonomic "Golden Zone" Weighting:** Heavy SKUs ($> 15 \text{ kg}$) are forced into knee-to-waist height storage cells ($0.75 \text{ m} - 1.2 \text{ m}$ from the warehouse floor) to prevent operator physical strain, reducing algorithmic worker fatigue multipliers and workplace injury risk.
*   **High-Value & Hazardous Segregation:** High-theft items (consumer electronics, jewelry) automatically route to access-controlled wire-mesh security cages requiring authorized credential checks. Hazmat SKUs (lithium batteries, pressurized aerosols) route to sprinkler-dense, bunded retention zones to comply with fire safety regulations.

---

## 2. Game Mechanics & Player Decisions

### Risk/Reward Trade-Offs: Putaway Strategies

Players must constantly tune their inbound operational policy to match incoming volume bursts against outbound picking health.

```
┌──────────────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────┐
│ Strategy Profile                 │ Operational Benefit                      │ System Risk / Penalty Exposure           │
├──────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
│ Fast Dump / Chaotic Putaway      │ Clears inbound staging instantly;        │ Catastrophic drop in outbound picker     │
│                                  │ avoids dock congestion and demurrage.    │ pick-rates; exponential travel times.     │
├──────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
│ Rigorous Optimized Slotting      │ Maximizes pick efficiency and cube       │ High staging dwell times; vulnerable to  │
│                                  │ density; perfect inventory accuracy.     │ dock staging gridlock during surges.     │
├──────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
│ Direct Cross-Docking             │ Bypasses storage completely; drops       │ Zero safety stock buffer; delivery delay │
│                                  │ handling cost to near-zero.              │ directly breaks outbound fulfillment SLAs│
└──────────────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────┘
```

---

### Bottlenecks & Failure Cascades

When inbound capacity is mismanaged, failure cascades propagate through the entire facility:

```
[Inbound Processing Deficit]
             │
             ▼
[Staging Area Buffer Saturated (100% Capacity)]
             │
             ▼
[Unloading Halts: Material Handlers Cannot Deposit Cargo]
             │
             ▼
[Dock Doors Remain Occupied (Trailers Stranded)]
             │
             ▼
[Yard Reaches Maximum Queue Capacity]
             │
             ├─────────────────────────────────────────┐
             ▼                                         ▼
[Demurrage Penalties Drain Cash Flow]     [Outbound Starvation: Pickers Idle]
```

1.  **Staging Gridlock:** Inbound staging reaches $100\%$ capacity. Material handlers cannot set down pallets, causing them to wander or enter idle states.
2.  **Dock Door Freezes:** Unloading crews stop mid-trailer because the immediate set-down zone is blocked.
3.  **Yard Congestion:** Incoming trucks cannot pull into docks, forming long queues onto the exterior access road. Demurrage penalties compound exponentially per minute.
4.  **Downstream Outbound Starvation:** High-velocity SKUs trapped in un-docked trailers trigger stockouts in outbound picking zones, causing missed carrier departure cutoffs and customer SLA failures.

---

### Upgrade Tree: Inbound Logistics

Players progress through capital investment tiers to scale handling capacity, operational reliability, and inventory tracking speed.

```
                           [TIER 1: Manual Operations]
                         Manual Pallet Jacks & Scanners
                                       │
                                       ▼
                       [TIER 2: Powered Industrial Fleet]
                      Electric Pallet Trucks & Reach Trucks
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
     [TIER 3A: Fixed Conveyance]           [TIER 3B: Vision & Tracking]
   Telescopic Boom Unloaders &           Inline Cubiscan Profiling &
     Powered Roller Conveyors              Multi-Angle Camera Portals
                    └──────────────────┬──────────────────┘
                                       ▼
                     [TIER 4: Autonomous Intralogistics]
                  Inbound Automated Storage & Retrieval System
                     (ASRS) + Autonomous Mobile Robots (AMRs)
```

*   **Tier 1: Manual Operations:**
    *   *Equipment:* Manual hydraulic pallet jacks, handheld tethered 1D barcode scanners.
    *   *Profile:* Low capital cost; low throughput; high operator fatigue rate; prone to manual scanning errors ($2.5\%$ misplacement rate).
*   **Tier 2: Powered Industrial Fleet:**
    *   *Equipment:* Rider electric pallet jacks (EPJs), standard counterbalance reach trucks.
    *   *Profile:* Double-pallet transport speeds; reduced worker fatigue; requires continuous battery charging management and certified equipment drivers.
*   **Tier 3: Fixed Automation & Dimensioning:**
    *   *Equipment:* Telescopic boom extendable conveyors directly into trailers; inline Cubiscan laser dimensioning and automatic weigh-in-motion (DWS) scales.
    *   *Profile:* Eliminates manual case handling from trucks; instant volumetric registration; high initial capital expense; creates physical architectural barriers in the dock layout.
*   **Tier 4: Autonomous Intralogistics:**
    *   *Equipment:* Inbound high-bay Automated Storage and Retrieval Systems (ASRS), Autonomous Mobile Robots (AMRs) with pallet top-rollers, robotic arm container destuffers.
    *   *Profile:* Ultra-high throughput ($24/7$ continuous operation); near-zero inventory error rate; requires high maintenance budgets and specialized mechatronic technicians.

---

### Interactive Events & Operational Mini-Puzzles

*   **Damaged Inbound Load ("The Tipped Trailer"):** A carrier arrives after aggressive transit braking. Opening the rear roll-up door reveals a collapsed pallet load blocking the door opening. The player must dispatch a specialized manual recovery team to restack cases safely before dock unloading can proceed, tying up the bay for extended game time.
*   **Emergency Supplier Recall Audit:** A batch of high-value electronic components is flagged for counterfeit internal capacitors. The player must halt specific putaway missions, execute a real-time system freeze on the affected Lot ID, and manually isolate inventory units from mixed totes into the quarantine cage before they cross into pick paths.
*   **Dynamic Reslotting Puzzle:** Between operational shifts, the player can enter an optimization view to run a "Slotting Refactor." The UI displays heatmaps of pick-frequency shifts. Players execute move-chains (swapping slow-moving Class C SKUs in prime golden-zone locations with trending Class A SKUs) while minimizing the number of intermediate staging moves.

---

### Core Math & Key Metrics

```
+--------------------------------------------------------------------------------------------------+
|                                    KEY PERFORMANCE INDICATORS                                    |
+------------------------------------+-------------------------------------------------------------+
| Formula                            | Operational Application                                     |
+------------------------------------+-------------------------------------------------------------+
| $$T_{\text{turnaround}} =           | Measures total dock occupancy from check-in to clear.       |
| t_{\text{dock}} + t_{\text{unload}}| Used to evaluate carrier SLA performance and schedule       |
| + t_{\text{staging\_clear}}$$      | compliance.                                                 |
+------------------------------------+-------------------------------------------------------------+
| $$E_{\text{putaway}} =             | Calculates worker or automated system energy and travel     |
| \frac{\sum U_{\text{stored}}}      | efficiency per labor/operational unit.                      |
| {\sum d_{\text{travel}} \times t}$$|                                                             |
+------------------------------------+-------------------------------------------------------------+
| $$C_{\text{penalty}} =             | Computes movement speed reduction in staging zones based    |
| \max\left(0, \frac{N_{\text{curr}} | on physical unit density and congestion thresholds.         |
| - N_{\text{opt}}}{N_{\text{max}}   |                                                             |
| - N_{\text{opt}}}\right)^\gamma$$  |                                                             |
+------------------------------------+-------------------------------------------------------------+
```

#### Dock Turnaround Time ($T_{\text{turnaround}}$)
Tracks the real elapsed time between a carrier backing into the bay and the dock door returning to available status:

$$T_{\text{turnaround}} = t_{\text{docking}} + \left(\frac{V_{\text{load}}}{R_{\text{unload}} \times M_{\text{crew}}}\right) + t_{\text{manifest\_signoff}} + t_{\text{undocking}}$$

Where:
*   $V_{\text{load}}$ = Total unit volume (cartons or pallets) within the trailer.
*   $R_{\text{unload}}$ = Base equipment unloading rate (units per minute).
*   $M_{\text{crew}}$ = Crew skill and efficiency multiplier.

#### Putaway Efficiency Metric ($E_{\text{putaway}}$)
Evaluates how effectively the inbound stock is transitioned to storage without generating excess transit dead-heading:

$$E_{\text{putaway}} = \frac{\sum_{i=1}^{n} \text{Units Stored}_i}{\sum_{i=1}^{n} \left(d_{\text{travel}, i} \times t_{\text{handling}, i}\right)} \times \Phi_{\text{slot\_accuracy}}$$

Where:
*   $d_{\text{travel}}$ = Total physical distance traversed from staging buffer to target bin.
*   $t_{\text{handling}}$ = Total vertical and horizontal movement duration.
*   $\Phi_{\text{slot\_accuracy}}$ = Binary or fractional index penalizing mis-slotted items ($1.0$ = perfect placement, $0.0$ = lost stock).

#### Staging Congestion Multiplier ($C_{\text{penalty}}$)
Dynamic penalty applied to worker and vehicle transit speeds across staging floor nodes as the area approaches volumetric capacity:

$$C_{\text{penalty}} = \max\left(0, \; \frac{N_{\text{current}} - N_{\text{optimal}}}{N_{\text{capacity}} - N_{\text{optimal}}}\right)^\gamma$$

Where:
*   $N_{\text{current}}$ = Current number of active pallets/totes occupying staging floor tiles.
*   $N_{\text{optimal}}$ = High-efficiency staging limit threshold (typically $65\%$ of floor surface).
*   $N_{\text{capacity}}$ = Maximum physical footprint capacity of the staging zone.
*   $\gamma$ = Congestion scaling exponent (default $\gamma = 2.0$), producing non-linear slowdowns as the floor approaches absolute gridlock. Velocity is modified by multiplying base movement speed by $(1.0 - C_{\text{penalty}} \times 0.85)$.