# Tycoon Economy, Multi-Client 3PL Contracts, Dynamic Crisis Event Engine & Financial Balance

---

## 1. Core Financial & 3PL Economic Models

A Tier-1 Third-Party Logistics (3PL) fulfillment facility operates on thin unit margins multiplied by high throughput volumes. The financial backbone balances variable handling fees, recurring cubic storage rents, value-added services (VAS), and risk-adjusted penalty models.

```
+-----------------------------------------------------------------------------------+
|                                   3PL REVENUE ENGINE                              |
+-----------------------------------------------------------------------------------+
|  Storage Revenue    |  Throughput Intake  |  Pick / Pack Handling |  VAS / Returns|
|  - CBM / Pallet/Day |  - Unloading (FLT)  |  - Base Dispatch Fee  |  - Kitting    |
|  - Long-Term Aging  |  - De-palletization |  - Order Line Pick Fee|  - RMA Triage |
|  - Cold Zone Prem.  |  - QA & Putaway     |  - Custom Packaging   |  - Relabeling |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ (Gross Revenue)
+-----------------------------------------------------------------------------------+
|                           OPERATIONAL EXPENDITURES (OPEX)                         |
+-----------------------------------------------------------------------------------+
|  Facility & Energy  |  Labor & Shifts     |  MHE Fleet Costs      |  Risk & Loss  |
|  - Base Lease / m²  |  - Base Base Wages  |  - AGV/FLT Lease      |  - SLA Breach |
|  - HVAC/Cold Load   |  - Overtime (1.5x)  |  - PM Schedules       |  - Shrinkage  |
|  - Peak kW Demand   |  - Agency Temp Surge|  - Li-ion Degradation |  - Insurance  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
                   [ NET OPERATING INCOME (NOI) / DAILY CASHFLOW ]
```

---

### Revenue Streams & Monetization Mechanics

The simulation monetizes every touchpoint of a stock-keeping unit (SKU) as it moves across the fulfillment center threshold:

```
[Inbound Dock] ---> [Storage / Aging] ---> [Pick & Pack Station] ---> [Outbound Stage]
   (Unload/QA)        (CBM/Pallet/Day)        (Base + Pick Line +        (Carrier Hand-off)
                                              Consumable Margin)
```

#### Storage Rental ($R_{\text{storage}}$)
Storage revenue is billed daily on a per-pallet or per-Cubic-Meter (CBM) basis. A progressive aging multiplier disincentivizes clients from using operational fulfillment racking as long-term dead storage:
* **Standard Dry Racking:** Billed at a baseline rate of $0.45/\text{CBM/day}$.
* **Temperature-Controlled (Cold Chain / Chilled):** Billed at $1.25/\text{CBM/day}$ to offset continuous cooling utilities.
* **Long-Term Storage Surcharges (Aging Penalties):**
  * $0\text{--}30 \text{ Days}:$ Baseline rate ($1.0\times$).
  * $31\text{--}60 \text{ Days}:$ $1.5\times$ multiplier.
  * $61\text{--}90 \text{ Days}:$ $2.5\times$ multiplier.
  * $91+ \text{ Days}:$ $5.0\times$ punitive rate (drives merchant clearance decisions or automated stock liquidation events).

#### Inbound Receiving & Putaway Fees ($R_{\text{inbound}}$)
* **Standard Palletized Inbound:** $4.50/\text{pallet}$ (covers offloading via Counterbalance Forklift, visual inspection, and barcode registration).
* **Floor-Loaded Container Destuffing:** $18.00/\text{CBM}$ or manual carton piece-rate ($0.12/\text{carton}$) requiring dedicated manual labor unloader crews.
* **Inbound Inspection & QA Sampling:** $0.05/\text{unit}$ for high-defect-risk verticals.

#### Outbound Order Processing Fees ($R_{\text{outbound}}$)
Every customer parcel consists of a base dispatch fee plus variable pick fees reflecting human or robotic travel time:
* **Base Order Dispatch Fee:** $1.75/\text{order}$ (covers dispatch slip printing, packing station baseline allocation, carton assembly, and carrier manifest hand-off).
* **Pick Line Fee:** $0.25/\text{primary pick} + 0.10/\text{each additional unit pick}$ in the same order.
* **Batch Multi-Line Surcharge:** High-density pick-to-light/tote consolidation adds $0.05/\text{line item}$.

#### Packaging Consumables & Custom Packaging Margin ($R_{\text{pack}}$)
Players purchase packing supplies in bulk (corrugated cartons, void fill, thermal labels, tamper-evident tape) and bill clients at marked-up rates:
* **Small / Medium / Large Carton:** Player cost ($0.20 / $0.45 / $0.85); Billed to client at $0.50 / $1.10 / $2.10 (yielding a $60\%$ margin).
* **Custom Branded Packaging / Eco-Inserts:** Special client contract add-on generating $0.35/\text{order}$ net profit, but requiring dedicated mezzanine bin capacity.

#### Value-Added Services (VAS) & Kitting ($R_{\text{VAS}}$)
* **Multi-Pack Bundling / Polybagging:** $0.40/\text{bundle}$ (combining distinct SKUs into promotional sets).
* **Security Tagging / Serial Number Scanning:** $0.15/\text{unit}$ for high-value tech.
* **Apparel De-wrinkling / Steaming / Hanger Swap:** $1.10/\text{garment}$.

#### Reverse Logistics & RMA Processing ($R_{\text{returns}}$)
* **Return Intake & Grading Fee:** $2.50/\text{returned parcel}$ (covers visual check, grade-A/B/C sorting, sanitization, repackaging, and system restocking).
* **Scrap / Liquidation Processing Fee:** $0.75/\text{item}$ for non-salvageable inventory diverted to salvage haulers.

---

### Cost Structures & Operational Burn Rate

Operational expenses (OPEX) run continuously against the player's capital balance, split between fixed facility overhead and variable handling costs.

```
Total Daily Costs = Fixed Overhead + Variable Labor + MHE Running Costs + Penalties
```

#### Facility Footprint & Real Estate Lease ($C_{\text{facility}}$)
* Base footprint lease billed at $\$18.00/\text{m}^2/\text{month}$ (amortized to daily billing).
* Expansion zones require capital upfront investments (lease security deposits + rack structural buildout) and increase recurring square-meter overhead.

#### Energy & Utility Load Balance ($C_{\text{energy}}$)
Power consumption directly models warehouse operations:
* **Base Load:** $0.05\text{ kW}/\text{m}^2$ for base lighting, IT infrastructure, and low-draw systems.
* **Dynamic MHE & Sorter Draw:** High-speed cross-belt sorters ($45\text{ kW/hr}$ active), dynamic conveyor networks ($1.5\text{ kW/meter/hr}$ under load), automated storage and retrieval systems (ASRS) cranes ($25\text{ kW/crane}$).
* **HVAC & Cold-Chain Compressors:** Dynamic thermal system dependent on outdoor ambient temperature simulation ($120\text{ kW/hr}$ baseline for a $2,000\,\text{m}^3$ cold chamber at $-18^{\circ}\text{C}$, scaling up by $3.5\%$ per degree Celsius above $25^{\circ}\text{C}$ external temperature).
* **Utility Pricing:** Base rate $\$0.14/\text{kWh}$, with a $2.2\times$ surge tariff applied during regional peak hours ($14:00\text{--}19:00$).

#### Labor Costs & Shift Modifiers ($C_{\text{labor}}$)
* **Shift 1 (Day: 08:00 - 16:00):** $1.0\times$ base wage ($\$18.00/\text{hr}$).
* **Shift 2 (Swing: 16:00 - 00:00):** $1.15\times$ base wage ($\$20.70/\text{hr}$).
* **Shift 3 (Graveyard: 00:00 - 08:00):** $1.35\times$ night-differential wage ($\$24.30/\text{hr}$).
* **Overtime Trigger:** Workers pushed beyond their 8-hour shift sustain an immediate $1.5\times$ overtime multiplier and suffer a progressive fatigue penalty reducing movement speed and scan accuracy by $-5\%$ per hour.
* **Agency Temp Workers:** Can be called during fulfillment surges with a 2-hour delay at a premium rate ($1.6\times$ base flat), but feature higher baseline error rates ($+4\%$ mis-pick probability).

#### Material Handling Equipment (MHE) Fleet Leasing & Upkeep ($C_{\text{MHE}}$)
* **Manual Pallet Jacks:** Purchase: $\$350$; Daily wear/maintenance: $\$1.50/\text{day}$.
* **Electric Reach Trucks / Forklifts:** Lease: $\$45.00/\text{day}$; Lithium-ion battery charging cycles consume $8\text{ kWh/day}$; PM maintenance cycle required every $120$ operating hours.
* **Autonomous Mobile Robots (AMRs):** Lease: $\$22.00/\text{day}$; Fleet management server overhead: $\$150.00/\text{day}$; Zero human fatigue, but require dedicated floor grid maintenance.

#### SLA Failure Costs ($C_{\text{penalties}}$)
Direct contractual chargebacks incurred when service level agreements fail (e.g., late dispatch, inventory damage, or cross-shipment errors).

---

### Multi-Client Contract Tiers & Verticals

The player manages a portfolio of clients across diverse market sectors. Balancing these vertical requirements is the primary logistics challenge:

```
+---------------------------------------------------------------------------------------------------------+
|                                CLIENT VERTICAL OPERATIONAL PROFILES                                     |
+-------------------+---------------+------------------+-----------------------+--------------------------+
| Vertical          | Return Rate   | Defect Tolerance | Storage / Pick Focus  | Special Constraint       |
+-------------------+---------------+------------------+-----------------------+--------------------------+
| Fast Fashion      | 30% - 40%     | Medium (0.8%)    | High SKU count / CBM  | Huge reverse QA / Garment|
| High-Value Tech   | < 3%          | 0.00% Zero-Def   | Secure cage / Small   | Serial track / High theft|
| FMCG / Cosmetics  | < 2%          | Low (0.1%)       | FIFO/FEFO / Palletized| Expiry batch enforcement |
| Flash-Sale Viral  | 10% - 15%     | High (2.0%)      | Extreme wave surges   | Rigid 4-hour dispatch SLA|
+-------------------+---------------+------------------+-----------------------+--------------------------+
```

#### Fast Fashion
* **Characteristics:** Extremely high catalog turnover, moderate inventory value, seasonal swings.
* **Key Challenge:** Massive return stream (up to $40\%$). If the returns processing area is undersized, returned items back up on the dock, blocking new inbound stock.
* **Revenue Sweetspot:** VAS relabeling, garment inspection, high outbound pick volume.

#### High-Value Electronics
* **Characteristics:** Microchips, smartphones, smart accessories. High capital inventory value.
* **Key Challenge:** Requires dedicated High-Value Security Cages (fenced off, badge-access only). Zero-tolerance defect policy ($0.00\%$ pick accuracy margin). Every parcel requires continuous serial number validation.
* **Risk Factor:** Internal inventory shrinkage risk is elevated ($4\times$ base probability). Missing inventory triggers full claim liability against the warehouse.

#### Fast-Moving Consumer Goods (FMCG) & Beauty
* **Characteristics:** Lot-tracked, batch-managed items with fixed expiration dates.
* **Key Challenge:** Strict **FEFO (First-Expired, First-Out)** picking logic. If an inventory lot expires inside the warehouse due to poor slotting or unoptimized picking paths, the warehouse is charged the full wholesale cost of the spoiled lot.
* **Revenue Sweetspot:** Consistent high-volume pallet throughput and dynamic zone replenishment fees.

#### Flash-Sale / Social Commerce Merchants
* **Characteristics:** Low order volume on normal days, followed by unpredictable, massive demand spikes triggered by marketing campaigns.
* **Key Challenge:** Extreme peak-to-average volume ratios ($12\times$ surge over baseline). Strict **4-hour Same-Day Dispatch SLA** on promotional days. Failure to clear backlog causes order cancellations and client attrition.

---

## 2. Game Mechanics & Simulation Systems

### Client Acquisition, SLA Performance & Merchant Satisfaction

The Client Lifecycle governs how contracts are signed, retained, and upgraded.

```
       [ Client Marketplace ]
                  │ (Bid / Sign Contract)
                  ▼
       [ Active Fulfillment ] ──(Daily SLA Audit)──► [ SLA Score: 0-100% ]
                  │                                         │
        ┌─────────┴─────────┐                               ▼
        │                   │                   Merchant Satisfaction (MSI)
   (Passed SLA)        (Failed SLA)                         │
        │                   │                   ┌───────────┴───────────┐
        ▼                   ▼                   ▼                       ▼
   +Reputation         -Reputation         High MSI (>85)          Low MSI (<40)
   +Bonus Payout       -Penalty Fees            │                       │
                                                ▼                       ▼
                                         Tier Promotion          Contract Default
                                       (Bronze -> Enterprise)     (Client Churns)
```

Clients evaluate warehouse performance daily across three operational vectors:
1. **On-Time Dispatch Rate ($SLA_{\text{OTD}}$):** Orders packed and staged before carrier cut-off times.
2. **Order Picking Accuracy ($SLA_{\text{ACC}}$):** Percentage of dispatches with matching SKUs, serials, and quantities.
3. **Inventory Record Accuracy ($SLA_{\text{IRA}}$):** Discrepancy between system inventory levels and physical cycle count audits.

#### Merchant Satisfaction Index ($MSI$)
The $MSI$ is a dynamic rolling metric ($0\text{--}100$) tracked individually for each merchant contract:
* **Enterprise Tier Requirements:** $MSI > 90$ for 30 consecutive operating days. Enterprise clients unlock long-term anchor leases, high volume guarantees, and lower payment default risk, but enforce strict penalty matrices.
* **Peak Season Performance Multipliers:** During high-volume seasonal campaigns, clearing $100\%$ SLA targets grants a $1.25\times$ reputation point surge and high-tier enterprise contract opportunities.

---

### Dynamic Crisis / Event Engine

Crises trigger procedural and scheduled challenges, testing facility design, workforce depth, and operational redundancy.

```
+---------------------------------------------------------------------------------------------------+
|                                 DYNAMIC CRISIS DECISION MATRIX                                    |
+--------------------------+------------------------------------+-----------------------------------+
| Crisis Type              | Immediate Impact Mechanics         | Player Mitigation Strategies      |
+--------------------------+------------------------------------+-----------------------------------+
| Mega Campaign Surge      | +1000% Order Ingestion in 6 hours; | - Authorize Emergency Overtime    |
| (11.11 / Black Friday)   | Carrier drop-lots congest.         | - Deploy Temp Agency Workers      |
|                          | Pick-face congestion slows picking.| - Reconfigure picking to batching |
+--------------------------+------------------------------------+-----------------------------------+
| Power Grid Brownout /    | Sorters & conveyors halt instantly;| - Engage Diesel Backup Gens       |
| Generator Failure        | Cold-storage temp rises +0.5°C/min;| - Route manual push-trolleys      |
|                          | High-bay ASRS cranes lock in place.| - Shed non-critical zones         |
+--------------------------+------------------------------------+-----------------------------------+
| WMS Server Outage        | RF Scanners disconnect;            | - Switch to physical pick sheets  |
| (Cyberattack / Network)  | Automated routing drops to 0%;     | - Deploy IT Recovery Team         |
|                          | High mis-pick rate (+15%).         | - Throttle intake docks           |
+--------------------------+------------------------------------+-----------------------------------+
| Structural Roof Leak     | Racking bays 14-18 hit by water;   | - Emergency Pallet Relocation     |
| (Torrential Weather)     | Cartons degrade; inventory water-  | - Deploy tarps / isolate bays     |
|                          | damage loss ticks every 30 sec.    | - Call Structural Repair Service  |
+--------------------------+------------------------------------+-----------------------------------+
| Internal Shrinkage Ring  | Discrepancy detected in tech cage; | - Run Physical Cycle Count Audit  |
| (Theft / Fraud)          | Value bleeding silently off books; | - Install Security Scanners       |
|                          | Client trust drops exponentially.  | - Subpoena Staff / Fire Bad Actors|
+--------------------------+------------------------------------+-----------------------------------+
```

#### Event Mechanics Deep Dive

##### Mega Campaign (11.11 / Peak Season)
* **Mechanics:** Inbound orders surge to $10\times$ baseline. Outbound packing lines congest. If the staging zone reaches $100\%$ capacity, pickers halt due to lack of drop space.
* **Actionable Gameplay:** The player must activate dynamic wave picking, assign bulk picking zones, contract auxiliary carrier fleets, and convert staging buffers into active sorting zones.

##### Power Grid Brownout
* **Mechanics:** Main facility power drops to zero. Automated sorters, high-speed lines, and ASRS cranes lock. Cold rooms begin losing refrigeration.
* **Actionable Gameplay:** Players must manually manage emergency generator fuel, divert power priorities (e.g., Cold Chain prioritized over dry goods sorters), and switch staff to manual push-trolleys.

##### WMS Outage
* **Mechanics:** Handheld barcode scanners stop working. Automated pick paths are disabled. Staff revert to paper pick lists, cutting base operational speed by $60\%$ and increasing human picking error rates from $0.2\%$ to $15\%$.
* **Actionable Gameplay:** Prioritize network patch routing via senior IT techs, or halt outbound operations to avoid mis-shipment chargebacks.

##### Structural Roof Leak
* **Mechanics:** Rainstorms breach specific roof nodes. A physical hazard ring appears on the warehouse floor. Racked inventory inside the ring sustains continuous structural water damage, converting pristine inventory into zero-value scrap every 30 seconds.
* **Actionable Gameplay:** Dispatch counterbalance forklift operators to evacuate high-bay pallets to dry holding areas while routing maintenance crews to seal the ceiling leak.

##### Internal Inventory Shrinkage Investigation
* **Mechanics:** Periodic reconciliation reveals missing high-value tech inventory. Client issues an ultimatum: find the cause or pay the full replacement value and sustain a severe reputation penalty.
* **Actionable Gameplay:** Review security camera blind spots, upgrade turnstiles with metal detectors, conduct full manual stock counts, and terminate compromised personnel.

---

### Cashflow Management, Bank Credit Lines & Facility Expansion Financing

Warehouse expansion requires long-term capital planning:

```
[ Facility Cash Reserves ]
         │
         ├── Negative Cashflow Emergency ──► [ Revolving Credit Line ] (High Interest Rate: 12-18%)
         │
         └── Capital Expansion Project ────► [ Term Capex Loan ] (Low Interest Rate: 6-8%)
                                                   │
                                                   ▼
                                         [ Expand Real Estate / Buy ASRS ]
```

#### Credit Facilities
* **Revolving Credit Line:** Automatically funds working capital shortfalls when operational cash hits $\$0$. Carries an aggressive variable interest rate ($12\text{--}18\%$ APR, compounded daily). If unpaid for 14 continuous days, the warehouse faces operational administration (Game Over condition).
* **Term CAPEX Loans:** Multi-tier loans unlocked by facility reputation and credit score. Used to finance major capital investments such as automated conveyor loops, ASRS high-bay builds, and mezzanines.
* **Equipment Sale-and-Leaseback:** Players can liquidate owned MHE fleets to institutional lessors during liquidity crises, securing immediate cash at the cost of ongoing daily leasing charges.

---

### Mathematical Formulas & Economic Equations

```
+----------------------------------------------------------------------------------------------------+
|                                    KEY SIMULATION FORMULAS                                         |
+-----------------------------------+----------------------------------------------------------------+
| Metric                            | Formal Mathematical Equation                                   |
+-----------------------------------+----------------------------------------------------------------+
| Daily Net Profit                  | NP = (R_stor + R_in + R_out + R_pack + R_VAS + R_ret)          |
|                                   |      - (C_fac + C_energy + C_labor + C_MHE + C_pen + C_maint)  |
+-----------------------------------+----------------------------------------------------------------+
| Client Churn Probability          | P(Churn) = 1 / (1 + e^(k * (MSI - MSI_mid)))                   |
+-----------------------------------+----------------------------------------------------------------+
| Dynamic SLA Penalty               | C_pen = Sum [ O_failed * (Fee_base * M_delay + V_order * L_pen)|
|                                   |         + Q_dam * V_item ]                                     |
+-----------------------------------+----------------------------------------------------------------+
| Long-term Storage Aging Surcharge | Fee_stor(t) = Fee_base * (1 + alpha * (t / T_thresh)^gamma)    |
+-----------------------------------+----------------------------------------------------------------+
```

#### 1. Daily Net Profit Function ($NP$)
The primary daily economic reconciliation equation is formulated as:

$$NP = \sum_{c \in \text{Clients}} \left( R_{\text{storage}, c} + R_{\text{inbound}, c} + R_{\text{outbound}, c} + R_{\text{pack}, c} + R_{\text{VAS}, c} + R_{\text{returns}, c} \right) - \left( C_{\text{facility}} + C_{\text{energy}} + C_{\text{labor}} + C_{\text{MHE}} + C_{\text{penalties}} + C_{\text{maintenance}} \right)$$

*Where:*
* $R_{\text{storage}, c} = \sum_{p \in \text{Pallets}} \text{Rate}(p) \times \text{AgingMultiplier}(t_p)$
* $R_{\text{outbound}, c} = \sum_{o \in \text{Orders}} \left( \text{BaseFee}_c + (\text{Lines}_o - 1) \times \text{PickFee}_c + \text{Margin}_{\text{packaging}} \right)$
* $C_{\text{labor}} = \sum_{w \in \text{Workers}} \left( \text{Hours}_{\text{reg}} \times \text{Wage}_w + \text{Hours}_{\text{OT}} \times \text{Wage}_w \times 1.5 \right) \times \text{ShiftMultiplier}$
* $C_{\text{energy}} = \int_{0}^{24} \left( \text{Load}_{\text{base}} + \text{Load}_{\text{MHE}}(t) + \text{Load}_{\text{HVAC}}(t) \right) \times \text{Tariff}(t) \, dt$

---

#### 2. Client Churn Probability Function ($P(\text{Churn})$)
Client churn follows a logistic sigmoid curve driven by the Merchant Satisfaction Index ($MSI_c$):

$$P(\text{Churn}_c) = \frac{1}{1 + e^{k \cdot (MSI_c - MSI_{\text{threshold}})}}$$

*Where:*
* $MSI_c \in [0, 100]$ is the rolling satisfaction index of client $c$.
* $MSI_{\text{threshold}} = 50.0$ (the critical inflection point where churn probability equals $50\%$).
* $k = 0.12$ (steepness parameter governing how fast a dissatisfied client leaves).

```
   1.0 |---------------------\
       |                      \
P(Churn|                       \
   0.5 |                        \  <-- Inflection Point (MSI = 50)
       |                         \
   0.0 |--------------------------\--------
       0                         50       100
                            MSI Score
```

*When $MSI_c = 20$, $P(\text{Churn}_c) \approx 97.3\%$. When $MSI_c = 80$, $P(\text{Churn}_c) \approx 2.7\%$.*

---

#### 3. Dynamic SLA Penalty Function ($C_{\text{penalties}}$)
Contractual failure penalties scale based on fulfillment lateness and cargo value:

$$C_{\text{penalties}} = \sum_{o \in \text{FailedOrders}} \left( \text{BaseProcessingFee}_o \times \left( \frac{\Delta t_{\text{delay}}}{T_{\text{grace}}} \right)^{\beta} + \text{OrderWholesaleValue}_o \times \lambda_{\text{liability}} \right) + \sum_{i \in \text{Damaged}} \text{UnitValue}_i$$

*Where:*
* $\Delta t_{\text{delay}}$ is the elapsed time beyond the agreed carrier cutoff window.
* $T_{\text{grace}}$ is the contract grace buffer (e.g., $1.0\text{ hour}$).
* $\beta = 1.6$ is the non-linear late penalty exponent (punishing cascading systemic delays).
* $\lambda_{\text{liability}} = 0.05$ ($5\%$ client value compensation penalty for late dispatch; escalates to $1.0$ for lost/damaged parcels).

---

#### 4. Long-Term Storage Aging Surcharge Function ($S_{\text{aging}}(t)$)
To model space management incentives, aging inventory cost accelerates over dwell time:

$$S_{\text{aging}}(t) = \text{Rate}_{\text{base}} \times \left( 1 + \alpha \cdot \left( \frac{\max(0, t - T_{\text{free}})}{T_{\text{standard}}} \right)^{\gamma} \right)$$

*Where:*
* $\text{Rate}_{\text{base}} = \$0.45/\text{CBM/day}$.
* $T_{\text{free}} = 30\text{ days}$ (standard free dwell period).
* $T_{\text{standard}} = 30\text{ days}$ (scaling interval).
* $\alpha = 1.5$ (scaling factor).
* $\gamma = 2.0$ (quadratic aging penalty exponent).

```
Daily Rate ($/CBM)
    |
$3.50 |                                              /--- Punitive Aging Zone
$2.50 |                                         /---'
$1.50 |                                   /----'
$0.45 |-----------------------------/----'
      +-----------------------------+--------------+--------------->
     Day 0                         Day 30         Day 60        Dwell Days
```

*At Day 15 ($t \le 30$), daily cost $= \$0.45/\text{CBM}$.*  
*At Day 60 ($t = 60$), daily cost $= \$0.45 \times (1 + 1.5 \times (1.0)^2) = \$1.125/\text{CBM}$.*  
*At Day 90 ($t = 90$), daily cost $= \$0.45 \times (1 + 1.5 \times (2.0)^2) = \$3.15/\text{CBM}$ ($7\times$ the baseline rate).*

---

## 3. Financial Simulation Balancing & Implementation Loops

To ensure systemic balance in the tycoon game engine, all financial modules connect via a deterministic sub-tick simulation loop:

```
[ Tick Begin: Ingest Orders & Receipts ]
                   │
                   ▼
[ Step 1: Execute Movement & Processing (Labor + MHE) ]
                   │
                   ▼
[ Step 2: Calculate Operating Costs (Energy + Lease + Wages) ]
                   │
                   ▼
[ Step 3: Audit SLA Cutoffs & Compute Penalties ]
                   │
                   ▼
[ Step 4: Accrue Aging & Storage Fees ]
                   │
                   ▼
[ Tick End: Reconcile Cashflow & Update Client MSI Scores ]
```

* **Positive Feedback Loops (Engine Building):** Higher efficiency $\rightarrow$ High SLA performance $\rightarrow$ Improved reputation ($MSI \uparrow$) $\rightarrow$ Access to high-tier Enterprise contracts $\rightarrow$ Higher revenue density $\rightarrow$ Capital investments in ASRS, robotic sorters, and high-density racking.
* **Negative Feedback Loops (Counter-Balancing Drag):** Rapid facility expansion $\rightarrow$ Higher structural lease & base electrical loads $\rightarrow$ Fleet maintenance degradation $\rightarrow$ Complex inventory travel paths $\rightarrow$ Potential bottleneck congestion $\rightarrow$ Risk of SLA misses and compounding daily penalty charges during crisis events.