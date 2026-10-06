# System Design Document: Automated Sortation, Outbound Staging & Carrier Dispatch

**Document Version:** 1.0.4  
**Module Classification:** Core Operations & Simulation Mechanics  
**Target Systems:** 3D Fulfillment Center Simulation Engine & Tycoon Game Framework  

---

## 1. Core Operational Workflows & Engineering

### Sorter Technologies & Topology

High-speed parcel sortation serves as the central nervous system of any modern tier-1 fulfillment facility. The architecture splits primarily into two topological categories: continuous closed-loop systems and linear divergence systems.

```
[Infeed Induction Stations] ──> [Dynamic Gapping Belts] ──> [6-Sided Scan Tunnel & Dimensioner]
                                                                        │
        ┌───────────────────────────────────────────────────────────────┘
        ▼
[Continuous Loop Sorter: Cross-Belt / Tilt-Tray]
   ├── [Diverted: Primary Chutes (Carrier / Postal Hubs)] ──> [Staging & Palletizing]
   ├── [Diverted: Overflow / Reject Spur] ──────────────────> [Manual Exception Handling]
   └── [Undiverted: Recirculation Loop] ────────────────────> [Re-induction Merge Node]
```

#### Loop Sorters (Continuous Path)
*   **Cross-Belt Loop Sorters:** Individual motorized belt carriers linked in a continuous oval or multi-tier closed loop. They physically drive parcels off the carrier laterally at speeds exceeding $2.5\text{ m/s}$ to $3.0\text{ m/s}$. They handle diverse package shapes, polybags, and envelopes with millimeter-level discharge accuracy.
*   **Tilt-Tray Sorters:** Mechanical trays driven by linear induction motors that tilt mechanically or pneumatically to slide parcels into destination chutes via gravity. They are cost-effective for rigid parcels and cartons, though they exhibit higher slide variances with thin polybags.

#### Linear Sorters (Single-Direction Flow)
*   **Sliding Shoe Sorters:** Slat conveyors equipped with divert shoes that glide diagonally across slats to push parcels smoothly onto outbound spurs. They are ideal for high-throughput, medium-to-large carton handling.
*   **Steerable Wheel & Pop-Up Diverters:** Banks of motorized wheels that pivot dynamically when a package passes over them, vectoring the parcel off the main line. They are modular and cheaper, but exhibit lower max cycle rates and higher wear-and-tear profiles.

#### Infeed, Induction & Identification
1.  **Semi-Automated / High-Speed Induction:** Parcels arrive from picking/packing lines onto metering belts. Servo-controlled dynamic gapping belts calculate parcel dimensions, accelerating or decelerating individual items to inject them into empty carrier pitches (or dynamic "virtual windows" on linear lines) without collision.
2.  **6-Sided Scan Tunnels:** Multi-camera industrial line-scan vision arrays capture barcodes on all six sides of a cube regardless of orientation, coupled with top-mounted time-of-flight or 3D laser dimensioners (measuring volume, weight verification via in-line checkweighers, and center-of-gravity detection).

---

### Dynamic Chute & Spur Allocation Strategies

Spurs and chutes are finite topological assets. The allocation engine maps dynamic downstream demand to physical chute geometry based on carrier dispatch schedules, geographic routing, and service-level agreements (SLAs).

```
   [Main Sorter Infeed]
            │
            ├─► Chute #1: [Express Tier] ─── SLA: 2-Hour Window (High Dynamic PPH)
            ├─► Chute #2: [Same-Day City] ── SLA: Local Node Routing (High Density)
            ├─► Chute #3: [National Hub A] ─ SLA: Bulk Long-Haul (Pallet Build)
            ├─► Chute #4: [National Hub B] ─ SLA: Bulk Long-Haul (Fluid Load)
            └─► Chute #5: [Dynamic Flex] ─── SLA: Auto-Reassigned on Hub Jam
```

*   **Express 2-Hour / Urgent Cutoffs:** Assigned to chutes closest to dynamic packing nodes and staging zones, featuring high-speed optical indicators to prompt rapid clearance by dock operators.
*   **Same-Day / Next-Day Regional Hubs:** Chutes are grouped topologically by localized logistics zones. If a local route spikes, the allocation engine dynamically clusters two adjacent chutes to the same destination (chute pooling).
*   **Standard Ground / Long-Haul Bulk:** Assigned to high-capacity spiral gravity chutes or extended dynamic accumulator spurs capable of holding high parcel buffers prior to fluid truck loading.
*   **Dynamic Chute Reassignment Engine:** When a scheduled carrier trailer departs, the Warehouse Execution System (WES) purges remaining residual items, runs an automated visual confirmation, and reallocates the chute address to the next upcoming carrier arrival window within milliseconds.

---

### Chute Jamming, Recirculation Loops & Overflow Purge

Chute physics and accumulation mechanics dictate line stability. When outbound capacity fails to match sorter infeed rates, failure modes manifest systematically:

```
[Chute Photo-Eye Blocked > 4s] ──> [Chute State: FULL]
                │
                ├──► WES Redirects Next Parcels to Recirculation Loop
                │          │
                │          ▼
                │    [Loop Saturation > 85%] ──► [Infeed Induction Gapping Throttled]
                │          │
                │          ▼
                │    [Loop Saturation = 100%] ─► [EMERGENCY STOP / Upstream Backpressure]
                │
                └──► [Secondary Overflow Spur Engaged] ──► [Manual Purge Floor Buffer]
```

1.  **Sensor Triggers & Chute Saturation:** Low, mid, and high photo-eyes monitor accumulation height. If the high photo-eye is occluded continuously for more than $4.0\text{ seconds}$, the chute status switches to `BLOCKED/FULL`.
2.  **Immediate Divert Invalidation:** The sorter controller invalidates diversion for subsequent parcels bound for that chute. The parcels remain on their carriers and ride the closed loop around for a secondary pass.
3.  **Conveyor Backpressure & Upstream Throttling:** Every recirculating parcel consumes a usable carrier cell. As loop occupancy rises past critical thresholds, induction stations are forced to pause injection. This creates conveyor backpressure that stalls upstream packing stations and accumulation conveyors.
4.  **Overflow Purge Strategy:** Sorter systems incorporate a designated "Reject & Overflow Spur." If a package completes a threshold number of loops (typically 2 or 3) without discharge, it is forcefully ejected onto the overflow spur for manual exception re-labeling or buffer carting.

---

### Outbound Staging, Palletizing & Fluid Truck Loading

```
   [Chute Discharge]
          │
          ├───────────────┬───────────────┐
          ▼               ▼               ▼
   [Fluid Loading]   [Palletizing]   [Cages / Totes]
   (Extendable Boom) (Robotic Cell)  (Manual Roll)
          │               │               │
          ▼               ▼               ▼
     Trailer Bed    Staging Lanes   Trailer Bed
    (Cube-Filled)  (Forklift Load) (Sorted by Hub)
```

#### Outbound Staging Operations
*   **Floor Staging Lanes:** Yellow-marked floor lanes behind dock doors. Pallets, wire roll cages, and gaylords are staged here ahead of trailer backing, sequenced strictly by departure cutoff time.
*   **Buffer Density Management:** Staging lanes act as shock absorbers between variable sorting speeds and fixed truck arrival cadences.

#### Fluid Loading via Telescopic Boom Conveyors
*   **Direct-to-Trailer Loading:** Extendable, motorized cantilever boom conveyors drive directly into the interior nose of a 53-foot trailer or intermodal container.
*   **Wall-Building Ergonomics:** Operators (or automated robotic container loaders) stack packages from floor-to-ceiling in interlocking "walls." This maximizes volumetric cube utilization ($85\%\text{–}92\%$ volume efficiency vs. $50\%\text{–}65\%$ for palletized trailers).

#### Reverse Delivery Sequence (LIFO / Route-Sequenced Staging)
*   For multi-stop urban delivery vans or multi-hub long-haul trucks, parcel sequencing follows Last-In, First-Out (LIFO).
*   The sorter schedules and diverts parcels corresponding to the final delivery stop *first*, staging them at the deep nose of the trailer, while the first delivery stop packages are sorted *last* and loaded directly at the trailer tail.

---

### Carrier Handover, Electronic Manifests & Cutoff Deadlines

The outbound interface represents a critical handoff point where internal material flow transitions to contracted third-party logistics (3PL) transport networks.

```
[Carrier Yard Check-In] ──> [Dock Door Assignment] ──> [High-Speed Fluid Load]
                                                              │
[Electronic Manifest Sign-off (EDI 214 / ASNs)] ◄─────────────┤ (Cutoff Timer Reaches 00:00)
                                                              ▼
                                                   [Trailer Seal Applied]
                                                              │
                                                              ▼
                                                   [Yard Dispatch Departure]
```

*   **The Cutoff Clock:** Every carrier contract dictates precise departure cutoff times (e.g., Regional Express departure at 19:30:00). Packages loaded at 19:30:01 miss the injection window for next-day air sorting at the destination airport.
*   **Yard Arrival Variance:** Carrier trucks do not arrive deterministically; they experience stochastic traffic and yard delays. If a trailer arrives late, the dock crew must engage high-speed loading protocols to compress loading time before the non-negotiable highway dispatch window closes.
*   **Electronic Manifest Handoff:** Upon completion of loading, the WES closes the shipping manifest. An Electronic Data Interchange (EDI 856 / ASN - Advance Shipping Notice) batch payload is transmitted to the carrier's logistics network, locking the chain-of-custody data and calculating billing weights and volume totals instantly.

---

## 2. Game Mechanics & Simulation Systems

### High-Tension Gameplay Loops: "Beat the Clock"

The core tension of the outbound sortation loop revolves around matching variable sorting capacity to immovable carrier dispatch departure deadlines.

```
+------------------------------------------------------------------------------------+
|  CARRIER OUTBOUND SLA DASHBOARD                                 CLOCK: 19:14:22    |
+------------------------------------------------------------------------------------+
|  DOOR 12: National Postal Service (Ground Hub)       [ COUNTDOWN: 00:15:38 ]       |
|  Status: [ LOADING... ]                                                            |
|  Parcels Remaining: 342 / 2,400        Target Flow: 22.0 PDM | Actual: 14.5 PDM   |
|  Volume Bar: [|||||||||||||||||||||||||||||||||||||||..........] 85.7% Cube        |
|  WARNING: Chute #4 Backpressure Detected - Inductions Throttling!                 |
|                                                                                    |
|  >> ACTIONS: [OVERTIME RUSH] [CALL YARD TRUCK] [DYNAMIC CHUTE REASSIGN]           |
+------------------------------------------------------------------------------------+
```

#### The Sprint Cycle
1.  **Countdown Phase ($T-45\text{ mins}$ to $T-10\text{ mins}$):** Player balances packing line outputs to ensure all packages with upcoming carrier tags reach sorter inducts. Chutes fill rapidly; staging lanes become crowded.
2.  **The Critical Window ($T-10\text{ mins}$ to $T-0\text{ mins}$):** Visual and auditory alarms escalate. Chutes allocated to the closing carrier glow yellow/red. Any remaining items on the loop must clear immediately.
3.  **Dispatch or Fail ($T=0$):** The dock door seals. The player must choose:
    *   *Release Truck on Time:* Unloaded parcels are left behind, incurring severe merchant backlog penalties and SLA failure fees.
    *   *Hold Carrier Late:* Carrier charges hefty detention fees per minute ($C_{\text{detention}}$), risking cancellation of downstream air-hub landing slots.

---

### Failure Cascades & Bottlenecks

The game simulates accurate physics-driven failure chains where local hiccups compound exponentially into facility-wide shutdowns.

```
[Chute Jammed] 
     │
     ▼
[Parcel Recirculates on Loop Sorter] 
     │
     ▼
[Loop Saturation Reaches 90%] 
     │
     ▼
[Infeed Induction Pauses to Avoid Physical Crashes] 
     │
     ▼
[Pack Station Takeaway Belts Halt via Backpressure] 
     │
     ▼
[Pack Stations Saturated: Pack Buffers Full] 
     │
     ▼
[Workers Idle + Pickers Blocked at Drop Zones] 
     │
     ▼
[Facility-Wide Output Drops to 0 PPH]
```

*   **Mitigation Actions:** The player must quickly detect jams, deploy maintenance mechanics to unjam spurs, activate dynamic overflow divert belts, or order yard hostlers to rapidly hot-swap full trailers at the dock.

---

### Upgrade Progression Tree

Players invest operational capital, research points, and space to progress through technological eras:

```
[Tier 1: Manual Rollers & Hand Scanners]
       │
       ▼
[Tier 2: Linear Steerable Pop-Up Wheel Sorters]
       │
       ▼
[Tier 3: High-Speed Cross-Belt Loop Sorters + 6-Sided Scan Tunnels]
       │
       ▼
[Tier 4: Telescopic Motorized Booms + Auto-Gapping Inductions]
       │
       ▼
[Tier 5: Lights-Out Loading: Robotic Articulated Arm Palletizing & Autonomous Yard Shunters]
```

```
+--------+------------------------------------+---------------+------------------------+------------------------------------------------+
|  Tier  | Sorter / Outbound Technology       | Max Flow Rate | Jam / Error Base Rate  | Labor Requirements & Traits                    |
+--------+------------------------------------+---------------+------------------------+------------------------------------------------+
| Tier 1 | Gravity Roller Chutes & Staging    |   1,500 PPH   | 8.5% (High Drop Jam)   | 100% Manual Floor Crew; High Fatigue           |
| Tier 2 | Linear Pop-up Diverter Spurs       |   4,500 PPH   | 4.0% (Medium Friction) | Manual Infeed + Manual Trailer Stacking        |
| Tier 3 | Cross-Belt Loop Sorter + Scan 360  |  15,000 PPH   | 1.2% (Low Spin Error)  | Automated Induct; Manual Fluid Telescopic Load |
| Tier 4 | Dual-Loop Cross-Belt + Auto-Booms  |  30,000 PPH   | 0.3% (Laser Guided)    | Semi-Automated Fluid Loading Operations        |
| Tier 5 | Full Robotic Induction & Auto-Load |  50,000 PPH   | 0.05% (Vision AI Sync) | Autonomous AGVs, Robot Loaders & Yard Shunters |
+--------+------------------------------------+---------------+------------------------+------------------------------------------------+
```

---

### Interactive Events & Crises

*   **The Unreadable Label Wave:** A high-speed print-and-apply labeler runs low on thermal transfer ribbon, generating faint barcodes. 
    *   *Effect:* 6-sided scan tunnel read rate plummets from $99.7\%$ to $62.0\%$. Sorter enters high-recirculation state; reject spur overflows onto warehouse floor.
    *   *Player Response:* Trigger manual inspection stations, order printhead cleaning, and dynamically route no-read items to manual exception rework benches.
*   **Carrier Yard Gridlock:** Inbound carrier trucks experience a localized traffic spike outside the gates. 
    *   *Effect:* Scheduled replacement trailers cannot dock; chutes reach $100\%$ capacity with nowhere to load.
    *   *Player Response:* Convert empty standard floor lanes into temporary overflow pallet buffers; activate manual floor staging to avoid sorter loop shutdowns.
*   **Flash Sale Regional Surge:** A viral merchant campaign triggers a massive volume spike targeting a single postal district code.
    *   *Effect:* Chute #3 receives $400\%$ of its nominal parcel flow rate, threatening instant jam cascade.
    *   *Player Response:* Reconfigure the WES software matrix to dynamically allocate three neighboring idle chutes to the same target postal hub.

---

### Mathematical Formulas & Key Performance Indicators (KPIs)

#### 1. Theoretical vs. Actual Sorter Throughput ($PPH$)

Theoretical maximum throughput based on belt velocity and pitch spacing:

$$\text{PPH}_{\text{theoretical}} = \left( \frac{v_{\text{belt}}}{L_{\text{pitch}}} \right) \times 3600$$

Where:
*   $v_{\text{belt}}$ is carrier belt speed in meters per second ($\text{m/s}$).
*   $L_{\text{pitch}}$ is center-to-center carrier pitch length in meters ($\text{m}$).

Actual effective throughput considering unassigned carriers and recirculation occupancy:

$$\text{PPH}_{\text{actual}} = \text{PPH}_{\text{theoretical}} \times (1 - R_{\text{loop}}) \times \eta_{\text{induct}}$$

Where:
*   $R_{\text{loop}}$ is the Recirculation Ratio ($0.0 \le R_{\text{loop}} \le 1.0$).
*   $\eta_{\text{induct}}$ is the induction gapping efficiency index ($0.0 \le \eta_{\text{induct}} \le 1.0$).

---

#### 2. Recirculation Ratio ($R_{\text{loop}}$)

Quantifies sorter loop saturation and operational inefficiencies:

$$R_{\text{loop}} = \frac{N_{\text{recirc}}}{N_{\text{induct}} + N_{\text{recirc}}}$$

Where:
*   $N_{\text{recirc}}$ is the number of parcels passing the infeed point without diversion per minute.
*   $N_{\text{induct}}$ is the number of newly inducted parcels introduced per minute.

---

#### 3. Chute Volumetric Accumulation & Jam Probability ($P_{\text{jam}}$)

Dynamic fill rate of an outbound accumulator chute:

$$\frac{dV_{\text{chute}}}{dt} = \dot{V}_{\text{in}} - \dot{V}_{\text{clear}}$$

Where:
*   $\dot{V}_{\text{in}}$ is the incoming volume rate of parcels diverted into the chute ($\text{m}^3/\text{s}$).
*   $\dot{V}_{\text{clear}}$ is the physical clearance rate of workers or telescopic conveyors at the chute base ($\text{m}^3/\text{s}$).

Probability of physical parcel jam at chute throat increases non-linearly with fill ratio:

$$P_{\text{jam}}(t) = P_{\text{base}} + \alpha \left( \frac{V_{\text{chute}}(t)}{V_{\text{max}}} \right)^\beta$$

Where:
*   $P_{\text{base}}$ is the base mechanical jam rate of the chute hardware.
*   $V_{\text{max}}$ is the physical volumetric limit of the chute.
*   $\alpha, \beta$ are system sensitivity coefficients (typically $\alpha = 0.15, \beta = 3.0$).

---

#### 4. Outbound Carrier SLA Performance Metric ($\text{SLA}_{\text{carrier}}$)

Evaluates parcel fulfillment accuracy against non-negotiable dispatch deadlines:

$$\text{SLA}_{\text{carrier}} = \left( \frac{\sum_{i=1}^{M} \mathbb{I}(t_{\text{loaded}, i} \le T_{\text{cutoff}, k})}{M} \right) \times 100\%$$

Where:
*   $M$ is the total parcel volume assigned to carrier departure run $k$.
*   $t_{\text{loaded}, i}$ is the timestamp at which parcel $i$ is scanned into the truck.
*   $T_{\text{cutoff}, k}$ is the hard gate departure cutoff timestamp for run $k$.
*   $\mathbb{I}(\cdot)$ is the indicator function ($1$ if true, $0$ if false).

---

#### 5. Financial Penalty Calculation for Delayed Dispatch

Direct economic consequence applied to player funds upon missed dispatch SLA windows:

$$\text{Cost}_{\text{penalty}} = \sum_{j=1}^{U} C_{\text{late\_parcel}, j} + \max\left(0, (t_{\text{depart}} - T_{\text{cutoff}}) \times C_{\text{detention}}\right) + \Delta \text{Reputation}$$

Where:
*   $U$ is the number of stranded parcels missing the cutoff deadline.
*   $C_{\text{late\_parcel}, j}$ is the contract penalty per delayed parcel.
*   $C_{\text{detention}}$ is the carrier yard idle fine per minute past cutoff.
*   $\Delta \text{Reputation}$ is the calculated decay in commercial client trust metrics.