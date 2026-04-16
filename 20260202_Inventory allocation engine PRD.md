Inventory allocation engine PRD   
**Authors:** [Tanu Shri Sahu](mailto:tanushri.sahu@on.com)

**Contributors:** [Dilek Disci](mailto:dilek.disci@on-running.com)

**Last Updated**: Mar 26, 2026

**Review Deadline:** Mar 20, 2026

**Status:** Under review

[Approvals](#approvals)

[1\. Strategic Context](#strategic-context)

[1.1. Summary](#summary)

[1.2. Success Criteria & Scope](#success-criteria-&-scope)

[1.3. KPIs](#kpis)

[1.4. Out of Scope](#out-of-scope)

[1.5. Milestones](#milestones)

[Milestones](#milestones-1)

[2\. Acceptance criteria](#acceptance-criteria)

[3\. Target Audience & Journeys](#target-audience-&-journeys)

[3.1. User Personas](#user-personas-\(tbd\))

[3.2. User Journeys](#heading=h.xzqq1jf8kd8m)

[4\. Functional Requirements](#functional-requirements)

[5\. Technical and Non-Functional Requirements](#technical-and-non-functional-requirements)

[6\. Design and Assets](#design-and-assets)

[7\. Open Questions & Risks](#heading=h.31lwjxn2viwh)

[8\. Appendix](#appendix)

## Approvals {#approvals}

|  Reviewer | ![People][image1]![Dropdowns][image2] Status |  Domains ([source](https://technology.on.com/organisation/index.html)) | ![No type][image3] Notes |
| :---- | :---- | :---- | :---- |
| [Ergün Koray](mailto:ergun.delimehmed@on-running.com) | Approved | Operations |  |
| [Manleen Kaur Anand](mailto:manleen.anand@on-running.com) | Approved | Inventory, Sales order |  |
| [Lina Gialama](mailto:lina.gialama@on-running.com) | In progress | Sales Order |  |
| [Maxim Spasskiy](mailto:maxim.spasskiy_ext@on-running.com) | In progress | Planning |  |
| [Ester van der Pol](mailto:ester.vanderpol@on-running.com)[Lewis Osborne](mailto:lewis.osborne@on-running.com) | Approved | Data/Streaming platform, Data enablement |  |
| [Daniel Hill](mailto:daniel.hill@on-running.com) | Approved | Data & AI | Approving as we have agreed that:1\. There needs to be a KPI workstream as part of this initiative. This is a big risk otherwise. 2\. We likely won’t go with an optimization approach at first, but will do some work to evaluate whether that is the right option in future, and what we’d need for that, building on the work [Hsuan-Pin Wu](mailto:hsuan-pin.wu@on-running.com) has already done on this. |
| [Carl Banér](mailto:carl.baner@on-running.com) | Approved | Supply Chain Enablement |  |
| [Yvonne Meyer](mailto:yvonne@on-running.com) | Approved | Supply Chain Enablement | We reviewed and discussed with Tanu. You’ll probably come back with more detailed questions later on.  |
| [Manuel Wegmann](mailto:manuel.wegmann@on-running.com)[Patrick Bach](mailto:patrick.bach@on-running.com) | Approved | Supply Chain Enablement |  |
| [Kruthika Deepak](mailto:kruthika.deepak@on-running.com) | In progress | Supply Chain Enablement |  |
| [Martin Faßbender](mailto:martin.fassbender@on-running.com)[Marion Flaig](mailto:marion.flaig@on-running.com) | In progress | Commercial |  |
| [Stuart Howes](mailto:stuart.howes@on-running.com) | Not started | IBP |  |
| [Diana Garcia](mailto:diana.garcia@on-running.com) | Not started | IBP |  |

Please make sure to include at least one reviewer for each team/domain affected by these changes with a total minimum approval of 2 people.

1. ## Strategic Context {#strategic-context}

   1. ### Summary {#summary}

*Describe the "Why" behind this project. Connect it to a specific athlete/customer/user friction point or business opportunity. Why must we build this now?*

---

**The "Why"**

The company's current allocation setup and strategy is **inflexible, unstable, and lacks omnichannel synchronization**, leading to severe inefficiencies, data integrity issues, and a degraded customer experience. With the current growth of our company we must act now on this and redesign the allocation engine.

The initiative transforms inventory allocation from a rigid, external dependency into a core internal capability. Our current system is inflexible and lacks the synchronization required for a modern omnichannel business, resulting in operational inefficiencies and a compromised customer promise.

**The Friction & Opportunity**

* Customer Friction: Priority partners (such as EDI accounts) currently experience service delays because the system cannot maintain inventory commitments when orders are updated, forcing manual workarounds.   
* Business Opportunity: We can maximize revenue by replacing manual, inconsistent inventory placeholders with an automated engine that ensures high-value demand is always secured and fulfilled first.   
* Operational Friction: Shared stock pools currently cause significant channel conflict and data silos, leading to over-promising and a lack of clear visibility into true inventory availability.   
* Strategic Capability Gap: Scenario testing for "what-if" changes currently takes and requires a full day of a specialized SME.  
* Inflexible Rules: Allocation templates are currently applied uniformly across all item groups, ignoring differences in lead times and demand volatility  
* Channel Conflict: Multiple "placeholder methods" (Automatic Bulk Consumption, Pre-Order Preparations, etc.) are used inconsistently across regions to hold inventory, leading to allocation problems as well as reporting issues. 

**Why Must We Build This Now?**

* Scalability: The legacy solution is no longer scalable and has become a primary bottleneck for our growth.   
* Revenue Recovery: We are currently losing revenue through order cancellations caused by misallocation, even when inventory is physically available.   
* Performance Targets: To move our OTIF (On-Time In-Full) fulfillment rate from 78.5% to our 90%+ target, we must decouple allocation logic from legacy system constraints and use real-time data to drive commitments.

  2. ### Success Criteria & Scope {#success-criteria-&-scope}

*Define the "North Star" and the boundaries. What is the definition of "Done"? This protects the team from project drift.*

---

* **Decoupling Achieved:** Soft Allocation (SA) and Hard Allocation (HA) logic operates independently of downstream Warehouse Release (AOR) constraints.  
* **Configurable Logic Implemented:** Business users can update prioritization rules and templates via an **Admin Tool** with zero code changes.  
* **Segmentation Autonomy provided:** New channels, warehouses, or customer tiers can be onboarded and assigned specific segmentation rules via a self-service admin tool.  
* **Order Book Integrity Secured:** The system maintains existing allocations and priority rankings during order attribute modifications (e.g., quantity/date changes).  
* **Simulation Parity Provided:** The "Sandbox" environment produces the exact same allocation results as the "Live" environment when given the same data set.  
* **Intra-day Capability Enabled:** The engine or users can trigger a re-allocation "event" based on a **Supply Signal** (new stock) or **Demand Signal** (high-priority order) without waiting for a nightly batch.  
* **Auditability:** Every demand line has a visible **Priority Tag**, and all manual overrides have a timestamped audit trail.  
* **Governance Gatekeeping:** Soft Allocation (SA) is technically blocked from running until the **Forecast Netting** process is validated.  
* **Scalability Confirmed:** The system successfully processes peak-load volumes (e.g., high-velocity launch events) with zero latency degradation.

**In-Scope:** Demand sequencing, supply pegging, simulation sandboxes, and intra-day trigger logic.

3. ### KPIs  {#kpis}

*List the hard metrics used to measure impact. (e.g., Conversion Rate, Processing Time, Net Promoter Score).*

**Strategic Note on OTIF:** While the ultimate goal of the NextGen IA project is to support the company’s 90%+ OTIF target, OTIF itself is an End-to-End Business Outcome influenced by downstream physical execution (Warehouse Management, Labor and Carriers).

To ensure the project team remains focused on the technical performance of the engine, we have defined Allocation-Specific KPIs (Fill Rate, Transparency, and Latency). These represent the Leading Indicators that provide the warehouse with the 'Perfect Order' to ship, which is the necessary prerequisite for achieving OTIF goals.

| KPIs |  |  |  |  |  |
| :---- | :---- | :---- | :---- | :---- | :---- |
| ![No type][image4] Metric Name | Type | Measurement | Current State | Target State | ![No type][image4] Notes |
| Allocation Fill Rate (AFR) | Performance | % of demand units logically secured against available/inbound supply. | Not available, New KPI | 95%+ | Measures the engine's ability to maximize stock utilization before it ever reaches the warehouse. |
| Order Cancellation Rate (Allocation-Driven) | Revenue | % of orders cancelled due to misallocation despite inventory availability | Not available, New KPI | \<1% | Targets "Ghost Inventory" and allocation logic errors. |
| Decision Velocity (What-If) | Agility | % variance between Inventory Visibility Service (IVS) and Allocation Engine | High/Siloed | \<1% | Ensures the engine sees and allocates only true available stock. |
| Allocation Logic Transparency Rate | Reliability | % of allocation decisions with a system-generated "Reason Code" or "Priority Tag" | Not available, New KPI | \>90% | Teams should not spend hours or days saying, "We don't know why it didn't allocate; the logic is a black box." |
| Manual Override Frequency | Operational | % of total allocations requiring a manual intervention/re-assignment. | Not available, New KPI | \<2% | Measures the success of the automated prioritization logic). |

4. ### Out of Scope {#out-of-scope}

*The following items are explicitly **excluded** from this project scope and are the responsibility of other teams or future phases:*

---

* **Inventory Visibility Service (IVS):** The development, maintenance, or core feature addition to the IV platform itself is excluded unless some adjustments are critical and needed for this project.   
* **Warehouse / Fulfillment Center Assignment:** The logical selection of a specific shipping location (Sourcing Logic) is handled based on the “Customer \- Warehouse assignments” or  Order Management System (OMS) or Distributed Order Management (DOM) layer. The IA Engine receives a 'Sourced Order' and is responsible only for the inventory commitment at that pre-assigned location.  
* **Automated Order Release (AOR) Execution:** The IA engine stops at the Soft Allocation, Hard Allocation (HA), and Reservation stages. The physical trigger and logic to release those orders to the warehouse floor (AOR) is a separate downstream execution step.  
* **Physical Warehouse Execution**: The IA engine determines logical commitment. Physical warehouse activities (picking, packing, shipping) remain within the Warehouse Management System activities  
* **Historical Data Migration:** Migration of historical allocation data, beyond what is necessary to run the new solution (e.g., current open orders and reserves), is excluded. To be determined during solution development.  
* **Forecast Netting Logic:** The IA engine consumes the output of the Forecast Netting process. Any changes, improvements, or logic calculations for how forecast netting is performed are excluded  
* **Master Data & Date Harmonization:** The standardization of "Requested Delivery Dates" vs. "Planned Ship Dates" or other global master data attributes is a separate governance task and is not handled by the allocation logic.  
* All P3 prio tasks are out of scope and can be found here: [P3 prio requirement for Inventory allocation](https://docs.google.com/document/d/16C9J0AglVhD8YkGwsSdduPaqcxsHbp_HECmVWnoxjVs/edit?tab=t.0)


  5. ### Milestones {#milestones}

*Track the critical lifecycle phases from design lock to final launch. Provide links to project trackers or related files.*

| Milestones |  |  |  |  |  |
| :---- | :---- | :---- | :---- | :---- | :---- |
| ![No type][image4] Phase | ![Dropdowns][image5] Status | Key Deliverable | Value | ![Files][image6] Related files | ![No type][image4] Notes |
| Metrics and business requirement  | Launched |  |  | [NextGen-IA: Next Generation - Inventory Allocation Requirements gathering](https://docs.google.com/spreadsheets/d/1_keFIs8Zf89KL3D-PbQZyhB5f7Q2ZwFVhr_7QVqyvY8/edit?gid=1748429105#gid=1748429105) |  |
| Commercial Inventory prioritisation rules | In progress |  |  | [20260217\_On\_CLT Meeting\_Inventory Allocation and Prioritization\_PRESENTATION\_v06.pptx](https://docs.google.com/presentation/d/1rZ-K727mrEdKmcYhJU5bv3q3VSRPaWH5/edit?slide=id.p1#slide=id.p1) |  |
| PRD Sign-Off | In progress |  |  | [Inventory allocation engine PRD](https://docs.google.com/document/d/1K8vtEDoyBQGWyj0iwGkXDtwDMxV0WXXGouN7JClbW64/edit?tab=t.0) |  |
| RFC and Solution Design | Not started |  |  | File |  |
|  | Not started |  |  | File |  |
| Roll out  | Not started |  |  | File |  |

2. ## Acceptance criteria {#acceptance-criteria}

   1. **Core allocation engine fully operational**, delivering validated Soft and Hard Allocation logic across channels, warehouses, and time-based controls without critical defects.

   2. **Configurable rule/priority framework active**, enabling business-managed prioritization, freeze periods, and allocation templates without code changes.

   3. **Structured allocation outputs reliably consumed downstream**, powering Order Management, Planning, Forecasting, Data team and Reporting without manual intervention.  
        
   4. **Performance and scalability SLAs achieved**, including successful peak-volume and stress testing. The system must complete a full allocation cycle (e.g 100k demand lines) in **\<15-20 minutes** and maintain **99.9% uptime** during stress tests simulating **5x average daily volume**.

   5. **Governance and operational readiness validated**, including audit logging, role-based access control, monitoring/alerts, trained users, and no open critical defects.  
      

3. ## Target Audience & Journeys {#target-audience-&-journeys}

   1. ### User Personas (TBD) {#user-personas-(tbd)}

*Who are the primary and secondary users? Focus on their behaviors and motivations.*

---

* **Allocation Manager (Sales ops, Key accounts specialists)**  
  * Optimizes stock distribution.  
  * Needs flexibility and visibility.  
* **Inventory Manager**  
  * Ensures stock accuracy and prioritization.  
  * Needs inbound prioritization and netting.  
* **Planner**  
  * Plans supply and demand horizons.  
  * Needs simulation and long-term buckets.  
* **Retail Ops Manager**  
  * Prioritizes flagship stores and launches.  
* **Commercial Strategist**  
  * Defines channel priorities.

---

4. ## Functional Requirements {#functional-requirements}

***Description:** This section is the technical blueprint for the product. It translates the User Journey into specific, testable system behaviors. Requirements are organized by **Feature Groups** to provide context and grouped by **Priority** to ensure the most critical work (MLP) is completed first.* 

**Priority Framework** 

* ***P0 \- Blocker:** Essential functionality. Non-negotiable for launch.*  
* ***P1 \- Critical:** Essential for a premium experience. High-value build.*  
* ***P2 \- High:** Important features that add efficiency. Candidates for "Fast Follower" releases.*  
* ***P3 \- Low:** Nice-to-have enhancements, polish, or minor UI delight.*

---

1. ## ***Tactical Allocation Control*** 

**Primary Persona:** Allocation Manager  
**Supporting Personas:** Inventory Manager, Order Booking Specialist

*Group Narrative:* The system enables planners and operations teams to **intervene between allocation cycles**, allowing urgent allocations, exclusions, and reallocations to protect key orders and maintain service levels.

| \# | Feature Group | As a(n) | Story | Priority | Acceptance Criteria (Gherkin) | Jira link | Requirement Link |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| ***1.1*** | ***Soft-to-Hard Allocation Transition (Manual Force-Firm)*** | Order Book specialist /Key accounts specialist | I want to manually force a Soft Allocation to become a Hard Allocation to secure inventory for specific exceptions.  | P1 | ***Scenario:*** Manual override to secure stock for a VIP order **Given:** A Sales Order has a Soft Allocation (SA) **When:** A user manually selects "Force Hard Allocation" or "Firm Order" in the UI **Then:** The system immediately converts the SA into a Hard Allocation (HA) and flags it as **"Pinned"  And:** The automated allocation engine must not release or change this allocation in subsequent runs unless manually unpinned by a user. **IF:** Either credit check fails, or hard allocation exists longer than configurable period **Then:** Auto-release the allocation back  |  | ***Req-01*** |
| ***1.2*** | ***Manual Allocation Override (Authorized allocated stock transfer between specific Sales Orders, TOs, Forecasts)*** | Order book manager/Sales ops/Key account specialist | I want to manually transfer allocated stock between specific orders and "pin" the result so it is protected from the automated logic. | P1 | ***Scenario 1:*** Authorized allocated stock transfer between specific Sales Orders/Transfer Orders **Given:** Sales Order/TO A (Urgent) has no allocation and Sales Order/TO B (Source) has an existing Soft or Hard Allocation. **And:** The user has the **"Allocation Power User"** security role. **When:** The user selects a specific SKU/Location combination from SO-B and performs a "Transfer & Pin" to SO-A and provides an expiration date **Then:** The system must immediately un-peg the quantity from SO-B and peg it to SO-A. **And:** The system must generate a **Timestamped Audit Log** including: User ID, Source Order, Destination Order, SKU, Quantity, and Reason Code, Expiration date. **And:** This allocation must be marked as **"Pinned"** (exempt from all automated re-allocation logic).**Note:\-** All Outbound sales order type\- Outbound TO/TO shipment—------------------------------**Scenario 2: Cross-channel allocation reassignment (Trade Room) Given** Channel A has soft-allocated or reserved inventory for a SKU/location **And** A business decision approves transferring quantity to Channel B **And** The user has the required authorization role **When** The user executes the reassignment and provides the expiry date **Then** The system must: reduce the allocated/reserved quantity from Channel A allocate the quantity to eligible demand in Channel B based on existing ranking logic **And** The system must: not trigger a global re-ranking or reshuffling of unrelated allocations keep all other allocations unchanged **And** The system must generate a timestamped audit log including: User ID Source channel Target channel SKU Quantity Reason code Expiration date | *\[Link to Figma/JIRA/MIRO\]* | ***Req-04*** |
| ***1.3*** | ***Parent-Child Order Allocation Inheritance*** | Order book manager/Sales ops/Key account specialist | I want soft-allocated inventory from a Bulk SO to transfer to individual "Call-off" SOs while maintaining the original priority ranking. | P1 | **Scenario:** Seamless allocation transfer from Bulk to Call-off **Given:** A "Parent" Bulk Sales Order/Pre-orders in some region (Bulk-001) has a valid Soft Allocation (SA) for 1,000 units. **When:** An individual "Child" Sales Order (Child-A) is created/called-off against Bulk-001 for 100 units. **Then:** The system must immediately transfer 100 units of SA from the Parent to the Child. **And:** The Child order must inherit the **Original Creation Date** from the parent order for all future ranking calculations. **And:** The remaining 900 units on the Parent must remain soft-allocated and protected from other "Non-Child" demand. **IF:** The Child order is canceled or credit hold **Then:** The 100 units of SA must automatically "roll back" and be re-attached to the Parent Bulk SO. | *\[Link to Figma/JIRA/MIRO\]* | ***Req-02*** |
| ***1.4*** | ***Intra-day & Event-Driven (At-Once) Execution*** | Order Book Manager / Sales Ops specialist | I want the system to run every 2–4 hours (configurable) so that "At-Once" orders are secured and ready for the next AOR release cycle. | P2 | **Scenario: Intra-day run secures stock for immediate AOR release Given:** A new "At-Once" Sales Order (Requested Delivery Date \= Today) is in the system with **0** allocation. **And:** The **ATS (Available to Sell)** pool has sufficient stock. **When:** The scheduled **Intra-day Recursive Trigger** (e.g., 10:00 AM) or a **Manual Ad-hoc Trigger** occurs. **Then:** The system must perform a **Targeted Allocation Run** (processing only high-priority/At-Once demand). **And:** The system must immediately change the status of the order to **"Hard Allocated" (HA)** and peg it to specific physical inventory. **And:** The system must flip the **"Ready for AOR" Flag** to `TRUE`. **And:** This flag must be visible to the **AOR (Allocation Order Release)** service for its next scheduled release window (e.g., 10:30 AM). | *\[Link to Figma/JIRA/MIRO\]* | ***Req-16*** |
| ***1.5*** | ***Intra-day & Event-Driven (Warehouse Change) Execution*** | Order book manager/Sales ops/Key account specialist | I want the system to immediately drop the old allocation and attempt to secure stock from the new warehouse whenever a "Ship-From" location is updated. | P2 | **Scenario 1: Demand Rebalancing Given:** Sales Order (**\#404)** is currently "Soft-Allocated" (to 10 units in **Warehouse A**.) **And:** The **ATS (Available to Sell)** in **Warehouse B** is currently **20** units. **When:** A user (or an RPA bot) changes the "Ship-From Warehouse" on the Sales Order from **A** to **B** and saves the record. **Then:** The system must immediately: **Release** the 10 units back to the **pool** of **Warehouse A** and reallocated following the allocation rules **Trigger a Targeted Allocation Run** specifically for Order \#404 against the inventory in **Warehouse B**. **And:** If Warehouse B has the stock, the order must be **re-pegged** to Warehouse B inventory immediately. **And:** The order must retain its **Original Creation Date** (Seniority) so it doesn't lose its "place in line" in the new warehouse. **IF:** Warehouse B has **0** ATS, **Then:** The order status must change to **"Unallocated"** and it must wait for the next scheduled Intra-day or Nightly run. —-----------------------**Scenario 2: Supply Rebalancing (Inventory Transfer TO / PO Movement) Given** Supply exists and is allocated at Warehouse A **And** A supply movement is initiated: Transfer Order (TO) within the same legal entity or Purchase Order (PO) across legal entities **When** The supply is moved from Warehouse A to Warehouse B **Then** The system must: release the corresponding allocated quantity from Warehouse A update the Available-to-Sell (ATS) at Warehouse A make the transferred supply available (or inbound) at Warehouse B **And** The system must: trigger a targeted allocation run for affected SKU/Location at Warehouse B **And** If eligible demand exists at Warehouse B **Then** The system must: allocate the transferred supply according to the active Allocation Plan **And** The system must ensure: no double allocation occurs across Warehouse A and Warehouse B allocation integrity is maintained during the transfer | *\[Link to Figma/JIRA/MIRO\]* | ***Req-14*** |
| ***1.6*** | ***Intra-day & Event-Driven (Cancellation) Execution*** | Inventory Manager | I want an intra-day allocation run when an order/order line is cancelled/partially cancelled | P1 | **Scenario:** Cancellation triggers intra-day allocation  ***Given*** an order (**\#505)** or order line ***(SKU1)*** has \<allocated\_quantity\> ***(100 units)*** units allocated **And:** Sales Order **\#999** (High Priority) is currently "Unallocated" for "***SKU1***" due to 0 **ATS.** **When:** Order **\#505** is cancelled (Full or Partial)  **Then:** The system must immediately release the cancelled quantity back to the **ATS pool** in the **IVS (Inventory Visibility Service)** **And:** The system must trigger a **Targeted Allocation Event** specifically for that SKU/Location combination. **And:** The engine must only evaluate the released quantity against the existing "Wait-list" for that SKU. **And:** All other existing allocations in the system must remain **Locked/Unchanged** to prevent a "domino effect" (re-ranking) of the entire order book. **IF:** No pending demand exists for that SKU, **Then:** The stock simply remains in the **ATS pool** for the next general run. | *\[Link to Figma/JIRA/MIRO\]* | *Req-16* |
| ***1.9*** | ***Hard Allocation expiry & Release Control*** | Allocation manager | I want hard allocations to expire after a configurable time threshold so that inventory is not permanently locked and can be reallocated if fulfillment does not progress.  |  | ***Scenario*:** Hard allocation expires after configured time limit **Given** a demand line has a Hard Allocation assigned  **And** a configurable Hard Allocation Expiry Threshold is defined (e.g., 48 hours)   **When** the elapsed time since allocation exceeds the threshold   **Then** the system must release the hard allocation **And** the system must make the released inventory eligible for reallocation and trigger a targeted allocation run if required applying the rules defined  |  |  |

### 

### ***Priority & Segmentation-Driven Allocation*** 

**Primary Persona:** Commercial Strategist  
**Supporting Personas:** Retail Ops Manager, Planner, Allocation Manager

*Group Narrative:* Ensures inventory is distributed according to strategic priorities such as channel, customer tier, Order type etc.

| \# | Feature Group | As a(n) | Story | Priority | Acceptance Criteria (Gherkin) | Jira/UX link | Requirement Link |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| ***2.1*** | ***Demand Ranking Hierarchy (Sequence)*** | Order Book Manager | I want to configure a multi-level prioritization sequence per demand type, so that the allocation engine applies the appropriate business logic for each channel and produces a deterministic ranking when multiple orders compete for the same inventory. | P0 | **Scenario: Channel-Specific Ranking Sequences Given** the system supports multiple Demand Types **And** an Admin Tool exists to configure Ranking Templates per Demand Type with multiple prioritization levels **When** the allocation engine executes inventory allocation **Then** the system must apply the Ranking Template assigned to each order’s Demand Type **And** orders are ranked sequentially by the configured prioritization levels **And** available ATS and incoming \+ planned inbounds are  allocated following the resulting priority order **And** if multiple orders have identical values for all configured levels, the system must use the Sales Order Number created date time as a final deterministic tie-breaker **Example Templates (illustrative, configuration-driven)**: Retail: Segment → Seniority → Supply date (CSD/RRD) Wholesale: Customer Tier → Seniority → Supply date (CSD/RRD) D2C / Web: Shipping Method → Seniority → Total Order Value **Notes / Considerations:** Forecast demand should use **expected picking list volume per demand period** Tie-breaker rules per demand bucket are to be defined with Commercial |  | *Req-09, Req-15* |
| ***2.2*** | ***Clearance Demand Ranking Hierarchy (Drop-Out Item Priority)*** | Commercial Strategist | I want the allocation engine to recognize the Inventory State attribute of each item, so that "Drop-out" items are prioritized for clearance channels (e.g., Outlets) without disrupting the premium allocation logic used for "In-season" inventory. | P1 | ***Scenario:*** Allocation prioritizes clearance channels for drop-out items **Given** every SKU is assigned an Item Category and Inventory State attribute (e.g., In-season, Drop-out, Obsolete) **And** the Allocation Plan contains Demand Sequence Lines that can be assigned to Item Categories (e.g. Footware, apparel) **And** separate Demand Sequence Lines exist for: Drop-out / clearance demand In-season demand **And:** Two distinct Channel Priority Sequences exist: Demand Ranking Hierarchy: (1. D2C, 2\. Wholesale VIP). Clearance Hierarchy: (1. Outlets, 2\. Bulk Liquidators). For Clearance Channels (Retail/Outlet): Level 1 (Volume Capacity): Rank by Store segment (High-Volume Clearance \> Low-Volume Clearance). Level 2 (Seniority): If Tier is equal, rank by Original Creation Timestamp (Oldest first). Level 3 (Urgency): If Timestamp is equal, rank by Requested Delivery Date (Earliest first). For Wholesale Liquidators / Discount Partners: Level 1 (Contractual Priority): Rank by Partnership Tier (Strategic Liquidator \> Secondary Jobber). Level 2 (Bulk Efficiency): If Tier is equal, rank by Total Units Requested (Highest first to maximize pallet clearance). Level 3 (Seniority): If Units are equal, rank by Original Creation Timestamp. For D2C / Web (Last Season): Level 1 (Shipping): Rank by Shipping Method (Express \> Ground). Level 2 (Seniority): If Shipping is equal, rank by Original Creation Timestamp. Level 3 (Value): If Timestamp is equal, rank by Total Order Value (Highest first). **Then:** The system must perform a Line-Level Evaluation of the Inventory State.  **If:** The item state is "Drop-out", the system must instantly assign the ATS stock to the Clearance Hierarchy.  **Else (In-season):** The system must follow the Demand Ranking Hierarchy  **And:** The logic for one state must never "pollute" or override the logic for the other **Notes / Considerations for MVP Phase:** For MVP, Demand Sequence Lines may be configured by demand criteria and assigned Item Category. Full prioritization framework (Demand × Item Category × Inventory State) is for **post-MVP phase** Allocation must remain **deterministic** and **template-driven**, so new channels or item categories can be added later Tie-breaker logic (e.g., Sales Order created date time) applies only if all ranking levels are identical  | *\[Link to Figma/JIRA/MIRO\]* | *Req-06* |

### ***Demand And Supply Synchronisation***

**Primary Persona:** Supply and Demand Planner  
**Supporting Personas:** Inventory Manager, Allocation Manager

Group narrative: Ensure demand and supply remain synchronised by netting all demand types against available and inbound supply, enabling accurate allocation, reduced conflicts, and improved fulfillment reliability.

| \# | Feature Group | As a(n) | Story | Priority | Acceptance Criteria (Gherkin) | Jira/UX link | Requirement Link |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| ***3.1*** | ***Allocation Horizon Framework \- Product Category Level Template*** | Planner | I want to configure longer allocation time windows for specific product categories, or products. So that long lead-time inventory is allocated against future demand (Backlog \+ 180 days) correctly, while high-turnover items remain restricted to shorter windows. | P0 | ***Scenario:*** Allocation applies category-specific horizon templates **Given**: The system supports Allocation Horizon Templates (e.g., Period templates/Coverage groups)**And** each item or item category is assigned to a specific Allocation Horizon Template **When** the allocation run is executed **Then** the system applies the category-specific template (or SKU overrides) (e.g., Backlog \+ 180 days) instead of shorter lead-time templates used for other items **And** only demand within the configured horizon window must be considered eligible for allocation. **And** demand outside the defined horizon must not compete for supply in that run. **And** the allocation engine highlights **supply-demand mismatches or gaps** based on the lead-time group **And** flat horizon windows (e.g., 120 days, 180 days) can be configured per category as an alternative to dynamic lead-time calculation. | *\[Link to Figma/JIRA/MIRO\]* | *Req-07* |
| ***3.2*** | ***Configurable pegging windows/Pegging Window Alignment*** | Planner | I want to configure a flexible pegging window aligned to launch dates,so that supply is secured and prioritized for launch orders ahead of time, preventing it from being consumed by standard immediate demand. | P1 | ***Scenario:*** Pegging window evaluation during allocation (e.g. to capture WHSO launch order demand) **Given** Pegging windows define how far into the future demand can be considered eligible for matching with inbound supply. **And** Pegging windows can be configured per demand type (order type, channel, or other configured attributes) **And** Pegging Window configuration must support definition per Supply Type (e.g., On-hand inventory, Transfer Orders, Confirmed POs, Planned POs) **And** Pegging configuration supports the following options per Supply Type: A: Nearest Pegging / Safety Margin defining how tightly supply should align with demand B: Maximum allowed time difference for early supply (supply date ≤ demand date) C: Maximum allowed time difference for late supply (supply date \> demand date) **And** for MVP only Config A (Nearest Pegging / Safety Margin) is supported and Config B and Config C are out of scope and will be considered in later phases **And** the **Supply Availability Date and Demand Date used in this calculation are configurable fields**. **Then** the system must calculate the time difference between Supply Availability Date and Demand Date and apply the Pegging configuration for the corresponding Supply Type **And** only supply within the configured Pegging Window (Config A) is eligible for allocation **And** supply outside the configured Pegging Window must not be allocated **And** Pegging Window rules define supply eligibility only and do not affect demand eligibility | *\[Link to Figma/JIRA/MIRO\]* | *Req-18* |
| ***3.4*** | ***Configurable Supply Sequencing Framework***  | Inventory Manager | I want to configure the priority order in which eligible supply sources are consumed during allocation, so that the system consistently uses inventory according to our service level, aging, and strategic objectives. | P0 | ***Scenario:*** Configurable Supply Source Sequencing***Given*** The system supports multiple supply sources based on the configuration, including: On-hand inventory Transfer Orders (TOs) Confirmed inbound Purchase Orders (POs) Returns Planned POs  ***And*** Supply eligibility has already been determined via: [**Allocation Horizon logic](#bookmark=id.qx2mdmn4ycvy) [Pegging Window logic](#bookmark=id.5xs38ri2p0k) And** The Admin Tool allows configuration of a Supply Sequencing Template. **And** The Supply Sequencing Template defines the priority order in which eligible supply sources are consumed (e.g., On-hand → Transfer → Inbound POs ….) **And** Each supply type can be assigned a **reliability ranking or confidence score And** The Admin Tool allows configuration of **supply-specific rules**, including **safety lead time buffers (e.g., safety pegging days)** per supply type **When** The allocation engine executes a run. Multiple eligible supply sources exist for the same SKU and location. **Then** The system must consume supply strictly according to the configured Supply Sequencing Template. **And** the engine must apply any configured **safety lead time buffers** to the Supply Availability Date for supply types with lower reliability before determining supply eligibility **And** the engine must consider the configured [**supply reliability ranking**](#bookmark=id.hf1qgm5qw8z1) when evaluating eligible supply sources **And** the supply sequencing rule must be applied **before demand ranking logic determines which demand receives the inventory**  | *\[Link to Figma/JIRA/MIRO\]* | *Req-11* |

### ***Channel & Demand, Supply Type Flexibility***

**Primary Persona:** System Administrator  
**Supporting Personas:** Planner, Marketing Operations

Group narrative: Allow flexible onboarding of new channels and support different demand types.

| \# | Feature Group | As a(n) | Story | Priority | Acceptance Criteria (Gherkin) | Jira/UX link | Requirement Link |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| ***5.1*** | ***Configuration-Driven Allocation Dimensions Management (e.g New channel onboarding)*** | Sales Ops Manager or  System admin | I want to create new allocation dimensions (such as  new sales channels, new warehouse, new customer group) and configure its allocation-related attributes through an Admin Tool, so that the new dimension (new channel, new warehouse, new legal entity, new customer group) can participate in allocation without requiring system development or redeployment. | P1 | ***Scenario:*** *Admin Configures a New Allocation Dimension (or* onboards a new channel and configures segmentation for inventory allocation)  ***Given*** a new dimension is needed (new marketplace channel, new legal entity etc..l needs to be onboarded) **And** The system supports configurable Allocation Dimensions including: Channel Customer Group Warehouse (if applicable) Legal Entity (if applicable) (Future dimensions) **And** The system supports configurable Allocation rules (Ranking, Protection, Eligibility, Supply Sourcing) are configuration-driven. ***When*** The Admin creates a new dimension (e.g new channel) and defines: Channel type (e.g., Retail, Wholesale, Marketplace) Associated Demand Type Eligible Warehouses (if applicable) Segmentation attributes (e.g., region, product category) Applicable Ranking Template Protection Rules (if applicable) **And** assigns Demand Type classification Ranking Template Protection Rules (if applicable) Eligible Sourcing Rules Segmentation attributes (e.g. product category, order type) ***Then***:The new/updated dimension (e.g. new channel) becomes eligible to participate in Soft Allocation.  **And** The allocation engine must apply the configured ranking, eligibility, and protection rules.  **And** No code deployment or system restart is required.  **And** The configuration change must be logged with user and timestamp. | *\[Link to Figma/JIRA/MIRO\]* | *Req-05* |
| ***5.2*** | ***Demand Type Classification Framework*** | Allocation Manager | I want to define and configure Demand Type classification rules, so that demand lines are automatically assigned to the correct allocation logic framework. | P0 | ***Scenario*****:** *Allocation manager defines and applies Demand Types* **Given**The system supports a predefined set of Demand Types AndEach Demand Type is linked to: Demand Ranking Template Allocation Horizon Template Pegging Window configuration (if applicable) Protection Rules (if applicable) **And**Classification rules are defined based on simple attributes such as: Sales Orders Transfer Orders Forecast data Channel or Order Type **When**A demand line is ingested into the system **Then**The system must assign exactly one Demand Type to the demand line **And**The system must apply the associated: Demand Ranking Template Allocation Horizon Template Pegging Window configuration (if applicable) Protection Rules (if applicable) **And**If no classification rule matches, the system must assign a default Demand Type **And**The Demand Type assignment must be consistent for the same input conditions |  |  |
| ***5.3*** | **Supply Type Classification Framework** | Allocation Manager/Planner | **I** want the system to classify each supply line into a defined Supply Type so that allocation decisions can consistently reflect differences in supply availability, reliability, and business preference. | P0 | ***Scenario:*** *Allocation manager defines and applies Supply Types* **GivenT**he system supports a predefined set ofSupply Types: On-hand Transfer Orders Purchase Orders Returns **And**Each Supply Type reflects differences in: availability timing reliability business preference for consumption **And**Classification rules are defined based on simple attributes such as: supply source document type location **When**A supply line is ingested into the system **Then**The system must assign exactly one Supply Type to the supply line **And**The assigned Supply Type must influence: supply eligibility (e.g. pegging rules) supply consumption order (sequencing) **And**Supply Type assignment must be consistent for the same input conditions |  |  |

### ***Allocation Plan***

**Primary Persona:** Allocation Manager  
**Supporting Personas:** Sys admin, Sales ops/Order book Manager

Group narrative: Enable allocation managers to configure and execute allocation strategies using flexible, configuration-driven rules, supported by planners and operations teams to ensure accurate, efficient, and responsive inventory distribution without requiring code changes.

| \# | Feature Group | As a(n) | Story | Priority | Acceptance Criteria (Gherkin) | Jira/UX link | Requirement Link | Review comments |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| ***6.1*** | ***Allocation Plan Framework*** | Allocation Manager / Sales ops/Order book Manager | I want to configure and manage Allocation Plans so that allocation execution uses a consistent, configurable setup for demand sequencing, supply eligibility, and prioritization without requiring code changes.  | P0 | **Scenario: Allocation Plan governs allocation execution Given** the system supports configurable Allocation Plans **And** each allocation run must be executed under a specific Allocation Plan **And** an Allocation Plan defines demand sequencing, supply sequencing, horizon, pegging, and applicable rules **When** an Allocation Plan is selected and the allocation engine executes a run **Then** the system must apply the Allocation Plan to determine demand eligibility, supply eligibility, demand sequencing, and supply consumption order **And** the system must ensure that only eligible demand and supply participate in allocation **And** allocation results must be deterministic for identical inputs and configuration **And** the system must support both operational and simulation Allocation Plans  | *\[Link to Figma/JIRA/MIRO\]* |  |  |

### 

### ***Scenario Simulation and What \-if planning***

**Primary Persona:** IBP Planner  
**Supporting Personas:** Allocation Manager

Group narrative:  Enable planners to simulate allocation scenarios using current data to evaluate outcomes and support decision-making without impacting live allocation.

| \# | Feature Group | As a(n) | Story | Priority | Acceptance Criteria (Gherkin) | Jira/UX link | Requirement Link | Review comments |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| ***7.1*** | ***Allocation Simulation*** | IBP Manager/Allocation Manager/Sales ops | I want to modify allocation inputs and configuration (e.g., PO dates, prioritization rules) and run simulations so that I can evaluate the impact on allocation outcomes before applying changes to live allocation.  | P1 | ***Scenario 1:*** *Simulation executes without impacting live allocation ***Given** the system supports simulation capability for allocation scenarios. **And** The system creates a snapshot copy of the latest: Demand data Supply data (On-hand, Inbound, Planned) Allocation plan configuration (Ranking, Protection, Horizon, Pegging, Sequencing) **And** the IBP Manager / Allocation Manager selects or clones an Allocation Plan for simulation **And** The IBP Manager/Allocation Manager modifies one or more input parameters (e.g., PO dates, priority values, forecast quantities, sourcing rules). **When** IBP Manager/Allocation Manager executes the Simulation Run **Then** The system must run the full allocation engine logic using the selected allocation plan without affecting live allocation **And** the system re-calculates the supply availability and allocation outcomes to show the projected impact without affecting live allocations  **And** The live allocation state must remain unchanged. **And** The system must clearly label results as “Simulation – Not Applied.” **Scenario 2:** Simulation result comparison **Given** A simulation run has been completed using an allocation plan **When** The user reviews the results. **Then** The system must allow comparison between: Current live allocation Simulated allocation  **And** The system must display deltas including: Allocation quantity changes Newly unmet demand Service level changes Channel redistribution impact | *\[Link to Figma/JIRA/MIRO\]* | *Req-08* |  |

### ***Allocation Transparency & Traceability***

**Primary Persona:** Analyst  
**Supporting Persona:** Allocation Manager, Commercial Strategist, IBP Manager/Planner

Group narrative: Provide transparency and traceability into allocation decisions through snapshots, logs, data version tracking to ensure explainable outcomeEnsure transparency and traceability of allocation decisions by providing snapshots, logs, and data version tracking, leading to an explainable outcome.

| \# | Feature Group | As a(n) | Story | Priority | Acceptance Criteria (Gherkin) | Jira/UX link | Requirement Link |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| ***8.1*** | ***Allocation Run State Snapshot & Versioning*** | Analyst / Allocation Manager | I want every allocation run to generate an immutable, versioned snapshot of the allocation state and its governing inputs, so that allocation decisions can be traced, audited, and compared over time. | P1 | ***Scenario 1:*** *Each* allocation run creates immutable snapshot **Given** The allocation engine supports Nightly, Intra-day, Manual, and Simulation-Promotion runs.  ***When*** the allocation run completes successfully **Then** The system must create an immutable Allocation Run Snapshot containing: Allocation Result State Allocated quantity per demand line Unmet / partially met demand Supply consumption per supply source Hard vs Soft allocation status Allocation plan used Governing Input State (as of run time) Demand Ranking configuration Protection rules Allocation Horizon template Pegging Window configuration Supply Sequencing template Available supply (On-hand, Inbound, Planned if enabled) The snapshot must be stored with: Run ID Timestamp Trigger Type (Nightly / Intra-day / Manual / Simulation Promotion) User ID (if manually triggered) The snapshot must be read-only and cannot be modified after creation. **And** the snapshot enables comparison between the previous and current snapshots including changes in allocation and input data | *\[Link to Figma/JIRA/MIRO\]* | *Req-20* |
| ***8.2***  | ***Allocation Snapshot Comparison Capability*** | Analyst / Allocation Manager | I want to compare two allocation run snapshots, so that I can understand what changed between runs and identify the drivers behind allocation shifts.  | P1 | ***Scenario** Snapshot comparison capability * **Given** Two or more Allocation Run Snapshots exist.  **When** a user selects snapshots for comparison.  **Then** The system must display differences including: Allocation quantity changes per demand line Newly unmet demand Changes in supply utilization Channel-level allocation shifts Configuration differences between runs  **Then** The system must allow: High-level summary view (Channel / SKU level) Drill-down to order-line level granularity |  | *Req-20* |
| ***8.3*** | ***Snapshot retention & governance*** | System Administrator | I want allocation run snapshots to follow a configurable retention policy, so that storage is managed efficiently while meeting audit and compliance requirements. | P1 | ***Scenario** Snapshot and retention based on the policy* **Given** System allows to define a retention policy **And** policy is configured.  **When** Snapshots exceed the defined retention period.  **Then** The system must archive for purge snapshots according to policy.  **And** Archived snapshots must remain retrievable for audit purposes where required. |  | *Req-20* |

5. ## Technical and Non-Functional Requirements {#technical-and-non-functional-requirements}

   1. **Latency:** Intra-day allocation runs must trigger every 2-4 hours to support "At-Once" orders.

   2. **Scalability:** Support multi channel and multi \- region growth

   3. **Data Integrity:** Audit trails must log "Who/When/Old/New" for every demand sequence update.   
   4. Role \- based permissions to run the allocation engine, view logs etc.

   5. Omni-channel capability

   6. **Data Integration & Ingestion (Upstream)**: The engine must serve as the central orchestrator for allocation by consuming data from the following legacy and planning systems:  
      1. **Anaplan Integration:** **Requirement:** The engine must ingest **Demand Forecasts** and **Supply Forecasts** from Anaplan.  
         1. **Frequency:** Daily batch at agreed time or triggered via API upon plan publication in Anaplan.  
         2. **Integrity:** The system must validate that the total forecast volume matches the Anaplan "Export Summary" before initiating an allocation run.  
      2. **D365 Integration (Forecast Netting):**  
         1. **Requirement:** The engine must consume **Netting Logic results** from D365 to identify which portions of the forecast have already been "consumed" by existing sales orders.  
         2. **Logic:** Allocation must only occur against the *Unconsumed Forecast* to prevent double-booking inventory.

   7. **Downstream Data Impact & Reporting (Looker)**  
      This project marks a shift in the data architecture for Inventory Reporting.  
      1. **Source of Truth Shift:** The "Source of Truth" for allocated inventory will move from **D365** to the **New Allocation Engine**.  
      2. **Looker Compatibility:** All existing Global Inventory Dashboards in Looker must be updated to point to these new Engine-generated tables. Data parity must be maintained (i.e., the sum of allocations in the Engine must match the sum reported in Looker).

   8. **Operation tool dependency:**  
      1. If any changes needed on SOT tool. 

   9. **Inventory Visibility Service Compatibility (Req-26)** The allocation engine must consume ATS and inventory state from the Inventory Visibility Service as the source of truth for availability inputs. Allocation runs must not produce allocations that exceed the available ATS provided by IVS for the relevant variant/location.

   10. **Automated Order Release Compatibility (Req-25)** The allocation outputs must be consumable by downstream release processes (AOR/Sunrise) without requiring manual data transformation. The system must not cause duplicate or conflicting releases for the same Sales Order line across execution cycles.

   11. The allocation engine requires an updated **net demand signal** that reflects forecast consumption by actual orders and any adjustments for overconsumption.Because the allocation engine will support **intra-day runs**, the net demand signal must also be refreshed at a frequency compatible with the allocation cycle. 

   12. The system must provide a New relic/Ontology dashboard tracking 'Run Completion Time' and 'Inventory Sync Latency' to monitor SLA compliance in real-time.  
       

6. ### **Constraints**:

   1. **Req 1.5** \- same day order processing will depend on Warehouse deadline of receiving those orders and not necessarily tied to the allocation engine. For example if WH has a deadline of 9:00 AM to receive order for same day processing and an at-once order comes at 11:00 then even if allocation runs that cannot guarantee the same day order processing. Requires WH operation exception process improvement.   
      2. **Req 3.2** \- Demand date is always the picking list date, i.e. CSD today (may change with the Order Book Management project). We need to work closely with OBM team to make sure if this changes we are informed. 

 


7. ## Design and Assets {#design-and-assets}

*Visualizing the solution. Provide links to PM wireframes (ideation) and final high-fidelity Figma mocks. Include system architecture diagrams showing how data flows between On’s backend systems.*

---

**Step By Step Solution Design Considerations**

Inventory allocation engine has 3 critical tasks happening together:

- Decide what demand is allowed to compete (time \+ eligibility)  
- Protect what must not be stolen (guardrails)  
- Allocate supply to demand deterministically (ranking \+ sequencing \+ pegging)

Everything else (snapshots, logs, intra-day, simulation) supports these 3 jobs.

A Single Allocation Run: Order of Operations

Step 0 — Inputs are loaded

- The engine pulls the latest:  
- Demand lines (orders \+ forecast lines, etc.)  
- Supply lines (on-hand \+ TO \+ confirmed POs \+ planned POs if enabled)  
- Configurations (classification rules, protection rules, ranking templates, horizon templates, pegging windows, supply sequencing)

Step 1 — Demand Type Classification (Control-plane “router”)

- Goal: every demand line becomes exactly one Demand Type (with precedence).  
- Example:  
  - A line is Wholesale \+ Pre-order \+ Launch → precedence rule decides which “Demand Type” wins (e.g., Wholesale Launch Preorder or simply Launch depending on your chosen precedence)  
  - Outcome: each demand line now has a “routing label” that determines:   
    - which allocation horizon template  
    - which pegging window  
    - which ranking template  
    - which protection rules apply.

Step 2 — Allocation Horizon Filtering (Who is allowed to play?)

- Goal: remove demand that is too far in the future for this run.  
- For each demand line:  
  - Determine applicable horizon template via precedence (Demand Type → Product Category(or SKU override) → Global)  
  - Compute eligible demand window (Today → Today \+ Horizon)  
  - If demand date is outside → it does not compete this run  
- Outcome: you prevent “future demand” from stealing today’s supply (or vice versa), and you control bucket logic (rolling vs quarterly buckets).

Step 3 — Protection Rules (Pre-ranking guardrails)

- Goal: protect strategic demand (e.g., Wholesale Pre-orders) from being consumed by lower priority channels (e.g., D2C).  
- For each protection rule:  
  - Find matching demand lines (by channel/order type/tier/category/region etc.)  
  - Determine the “protected volume/threshold”  
  - “Lock” that amount so it can’t be taken by other competition pools during this run  
- Outcome: even if D2C has an urgent/large backlog, it cannot overconsume inventory that must remain available for protected Wholesale demand.

Step 4 — Pegging Window Eligibility for Inbound Supply (Timing guardrail)

- Goal: don’t match inbound supply that is too early or too late relative to demand date.  
- For each eligible demand line:  
  - Apply the pegging window configured for its Demand Type (or other configured dimension)  
  - Determine which inbound supplies are eligible to be matched to that demand (based on date distance)  
- Outcome: Launch demand 4 weeks out can be protected by inbound supply without being blocked by a default 14-day margin.  
- Important: this is NOT “pegging PO/TO to a specific SO”.

Step 5 — Supply Sequencing (Which supply is used first?)

- Goal: once supply is “eligible”, consume it in the correct order.  
  - Example template:  
    - On-hand → Transfer Orders → Confirmed POs → Returns → Planned POs  
  - This decides which supply gets spent first, but it does not decide who gets it.  
  - Outcome: prevents “inbound first even when on-hand exists” or other undesired behaviors.This is “which inbound supply is eligible to be used for this demand right now”.

Step 6 — Demand Ranking Hierarchy (Who wins within each pool?)

- Now we allocate across remaining demand by demand-type-specific ranking templates.  
  - Example Retail template: Segment → seniority → Demand date→ tie-breaker SO\#  
  - Example Wholesale template: Customer tier → seniority → Demand date→ tie-breaker  
- Clearance hierarchy is applied when Inventory State \= Drop-out.  
- Outcome: deterministic allocation. No randomness. Predictable business outcomes.

Step 7 — Allocation writes outcomes (Soft/Hard, pinned, ready flags)

- The run produces:  
  - Allocation results per demand line  
  - Supply consumption per supply source  
  - Statuses (soft allocated, hard allocated, unmet)  
  - Flags (ready for AOR, pinned, excluded, protected)

**How Tactical \+ Event-driven Pieces Fit In**

1. Intra-day run (At-once / cancellation / WH change) : These are not full reshuffles unless you explicitly allow it.

Typical behavior:

* Run targeted allocation for a subset (At-once demand / SKU-location released / a moved order)  
  * Keep other allocations locked to avoid domino effects  
2. Trade Room reassignment (manual cross-channel move) : This is a manual override layer that happens before normal allocation competition.  
   * Trade Room action:   
     1. Reduce reserved/forecast quantity from source channel  
     2. Immediately allocate to eligible target channel demand (using existing ranking)  
     3. Do NOT reshuffle unrelated allocations  
     4. Log it  
   * This is different from:  
     1. Channel peak prioritization (policy)  
     2. Dynamic partitioning (automated policy)  
3. Simulation \+ Promotion to Live  
   * Simulation run:   
     1. Copies data \+ configs into sandbox  
     2. Runs full logic  
     3. Produces deltas vs live  
   * Promotion:   
     1. Applies only approved input/config changes into live  
     2. Triggers a live execution to generate real live results  
     3. This prevents “copying simulated allocations directly into prod”.

8. ## Appendix {#appendix}

*Space to attach any extra context, documentation or support information to the PRD.*

- *[NextGen-IA: Next Generation - Inventory Allocation Requirements gathering](https://docs.google.com/spreadsheets/d/1_keFIs8Zf89KL3D-PbQZyhB5f7Q2ZwFVhr_7QVqyvY8/edit?gid=1748429105#gid=1748429105) (Final requirement tab is considered)*  
- *[Lean\_Business\_Case\_Inventory\_Allocation](https://docs.google.com/document/d/1BUFBBhA_u3rUN5rXK8BCHJ17_nSmPBh313CwqSNymFU/edit?usp=drive_open&ouid=100822162138295837240)*   
- Sunrise documentation: [Sunrise documentation](https://drive.google.com/drive/folders/1SPdIMRGMJBTG0A7Tv9kdbShlRFzuKD_s)  
- Process flow: [https://on-pp103495.boc-cloud.com/main.view\#0](https://on-pp103495.boc-cloud.com/main.view#0)   
- Miro diagram with requirements: [Next Gen. Inventory Allocation: Basic Re…](https://miro.com/app/board/uXjVJol_rzI=/?focusWidget=3458764648871101308)

### **8.1 Project Dependencies:**

**Planning Domain (Anaplan Team)**

1. **Demand & Supply Forecasts:** The engine requires a stable daily ingestion of the demand/forecast snapshot from Anaplan.  
   *Risk:* Failure in the Anaplan export process leaves the engine with outdated strategic targets.  
   2. **Forecast Netting Logic:** Access to the D365 netting results to ensure we don't double-allocate against the same demand pool.  
      *Risk:* Logic drift between D365 and the Engine leading to over-fulfillment.  
2. **Sales & Distribution Domain (ERP / D365 Team)**  
   1. **Sales Order (SO) Stream:** Real-time ingestion of customer demand, including cancellations and updates.  
      *Risk:* Delayed cancellation sync results in "trapped" inventory on dead orders.  
3. **POP and Inbound transportation Domain**  
   1. **Inbound Supply Streams (PO, IC PO):** Reliable streaming of Purchase Orders and Intercompany orders.  
      *Risk:* Incomplete visibility of inbound stock prevents the engine from fulfilling "At-Once" orders from future supply.  
4. **Data & Analytics Domain (Data Enablement Team)**  
   1. **Reporting Table Refactoring:** Refactoring of Looker models to consume data from the new engine instead of legacy D365 tables.  
      *Risk:* Global dashboards showing incorrect or stale inventory allocation data during the transition period.

### **8.2 Open Questions & Risks**

* **Decision Needed:** We need alignment and a formal decision on the [Demand Ranking Hierarchy](#bookmark=id.t3rk30lktal6). [Carl Banér](mailto:carl.baner@on-running.com)  
* **Decision Needed:** We need alignment and a formal decision on the [Clearance Demand Ranking Hierarchy](#bookmark=id.ahs6g4rxo4uj) [Carl Banér](mailto:carl.baner@on-running.com)  
* Alignment on terminologies is needed  
* **Dependency** on Sunrise’s existing AOR batch job.  
* **Risk:** The lack of defined allocation-specific KPIs introduces a risk in assessing the performance and success of the new allocation engine.

### **Questions**:

| *\#* | *Question* | *Asked by* | *Answer is expected by* | *Date answered* | *Comment* |
| :---- | :---- | :---- | :---- | :---- | :---- |
| ***1*** | What should be the configured Credit Check Failure Handling policy for Hard Allocations? **Immediate Release Delayed Release (Timeout-Based) Freeze and Alert No Automatic Action \-  remains until manually handled.** | *[Dilek Disci](mailto:dilek.disci@on-running.com)[Tanu Shri Sahu](mailto:tanushri.sahu@on-running.com)* | *[Carl Banér](mailto:carl.baner@on-running.com)/[Yvonne Meyer](mailto:yvonne@on-running.com)* |  |  |
| ***2*** | ***What should be the Hard Allocation Aging Threshold: 24 hours 48 hours 72 hours Channel-specific? Order-type-specific? This protects us from permanent stock lock.*** | *[Dilek Disci](mailto:dilek.disci@on-running.com)[Tanu Shri Sahu](mailto:tanushri.sahu@on-running.com)* | *[Carl Banér](mailto:carl.baner@on-running.com)* |  |  |
| ***3*** | Will there be any financial impact if we move from the sunrise allocation engine to the new one? | *[Tanu Shri Sahu](mailto:tanushri.sahu@on.com)[Dilek Disci](mailto:dilek.disci@on-running.com)* | *[Carl Banér](mailto:carl.baner@on-running.com)* |  |  |

### **8.3** Decision Log

### **Questions**:

| *Question* | *Asked by* | *Answer is expected by* | *Date answered* | *Comment* |
| :---- | :---- | :---- | :---- | :---- |
| ***Tie-Breakers:***  if two "Tier 1" customers want the same item, is the tie-breaker "Order Date" or "Order Value"? | *[Tanu Shri Sahu](mailto:tanushri.sahu@on.com) / Closed* |  |  | ***Dilek Comment:** It is Order Date, but it should be configurable \- please check* Demand Ranking Hierarchy |
| What fields are required in snapshot views? | *[Tanu Shri Sahu](mailto:tanushri.sahu@on.com)/ Closed* |  |  | ***Dilek Comment:** I defined some fields based on the best practices \- [Carl Banér](mailto:carl.baner@on-running.com)can confirm and add (here is the details: Allocation Run State Snapshot & Versioning)* |
| How should the engine handle two orders from the same Tier arriving in the same microsecond? Are we defaulting to 'FIFO' (First-In, First-Out) based on the database timestamp, or should we incorporate a secondary 'Order Value' weight?" | *Engineering/ Closed* |  |  | ***Dilek Comment:** The Demand Ranking Hierarchy resolves ties sequentially across configured ranking levels. If all configured ranking attributes are identical (including timestamp), the system applies a final deterministic tie-breaker (Sales Order Number) to guarantee stable and repeatable allocation results. No implicit weighting (e.g., Order Value) is applied unless explicitly configured in the Ranking Template.*  |
| In the event of an engine failure or 'over-allocation' bug during a high-heat drop, how do we manually bypass the NextGen engine and revert to the legacy allocation logic? | *Engineering/ Closed* |  |  | ***Dilek:** The NextGen allocation engine must include controlled operational fallback mechanisms, but we do not recommend reverting to legacy allocation logic during runtime unless explicitly designed as a supported rollback strategy.*  |
| Since we are decoupling allocation logic but keeping Sunrise for the physical AOR, how do we ensure Sunrise legacy jobs don't 'collision-course' with NextGen decisions? Specifically, do we have an API to 'Inject' release commands directly into the Sunrise AOR queue, bypassing its internal logic? | *Engineering/ Closed* |  |  | ***Dilek:** As part of the decoupling strategy, allocation decision authority resides exclusively in the NextGen allocation engine. Sunrise will act as the execution layer for physical AOR (Allocation Order Release) only. To prevent logic collision: Sunrise allocation decision logic must be disabled or bypassed for all flows governed by NextGen. Sunrise must consume the allocation state as a source of truth (e.g., Hard Allocation \+ Ready-for-AOR flag). Release instructions must be triggered based on allocation status events, not Sunrise internal ranking logic. Regarding API injection: The preferred architecture is event-driven orchestration rather than direct queue injection.*  |

### 

### **8.4** Terminology / Acronyms 

* **Soft Allocation**  
  A system-calculated assignment of available inventory to a demand line based on allocation logic. It reflects prioritization outcomes but remains adjustable by subsequent allocation runs unless converted to Hard Allocation or manually pinned allocation.

  * **Reservation**  
     A confirmed hold on inventory for a specific order, ensuring it is not used elsewhere, but not yet tied to physical fulfillment.

  * **Hard Allocation**  
     A non-reallocatable commitment of inventory to a specific demand line and may enable downstream fulfillment processes (such as AOR release). Hard Allocation prevents the allocation engine from modifying or consuming the quantity in subsequent runs and is typically synchronized with ERP reservation.

  * **Item Category**  
     A product classification used to apply allocation rules, priorities, or handling requirements based on characteristics such as perishability, value, or fulfillment method.

  * **D365 Reservation**  
     An inventory reservation recorded in Microsoft Dynamics 365 that represents the enterprise system’s committed stock and must remain synchronized with the allocation service.

  * **Pegging Window**  
    Pegging Window is a time-based eligibility rule defining the maximum allowable difference between Supply Availability Date and Demand Date for inbound supply to be considered matchable during allocation.

  * **Pegging (Supply-to-Demand Pegging Activity)** Pegging is the process of linking a specific supply line (e.g., Purchase Order, Transfer Order, or On-Hand quantity) to a specific demand line (e.g., Sales Order line), establishing a defined supply-to-demand relationship.

  * **Allocation Horizon:**Allocation Horizon defines the future demand time window eligible to participate in allocation competition (e.g., Today → Today \+ 180 days). Difference: Horizon → demand eligibility Pegging window → supply timing eligibility

  * **Trade Room:**Trade Room is a coordinated cross-channel decision process that may result in manual reallocation or reassignment of inventory between channels based on strategic business decisions.

  * **Drop-out Item**  
     An item that has been **removed from active in-season assortment** and is no  longer prioritized for regular sales channels, typically because it is discontinued, end-of-season, or underperforming.

  * **Intra-day allocation run (inventory)**    
     A scheduled or triggered process that reassigns available inventory to demands (orders, stores, warehouses, e-commerce channels etc) throughout the day. 

  * **Call-off:** An individual sales order created to consume a specific quantity from a pre-existing "Parent" Bulk Sales Order (Pre-order), typically inheriting the parent's seniority and priority

  * **O2C sales order:** An O2C (Order to cash) Order is any order where we are selling a product to a customer and expect to get paid for it. It distinguishes other types of inventory movements like:  Transfer Orders (TOs): Moving stock between two of your own warehouses. Or Purchase Orders (POs): Buying stock from a supplier.

  * **Seniority:** Seniority refers to the original creation timestamp of a demand line and is used as a deterministic tie-breaker within ranking hierarchies. Seniority always reflects the original order creation date, even in cases of re-submission (e.g., EDI transition).

  * **Supply Sequencing:**Supply Sequencing is the configurable priority order in which eligible supply sources (On-hand, Transfer Orders, Confirmed POs, Planned POs, Returns) are consumed during allocation.

  * **Protection Rule**: A pre-ranking allocation guardrail that reserves a defined quantity or percentage of inventory for specific demand segments before demand ranking is applied.

  * **ATS (Available to Sell):** Available to Sell (ATS) represents inventory available for allocation after accounting for existing hard commitments and exclusions.

  * **Eligible Demand:**Eligible Demand refers to demand lines that pass Allocation Horizon, exclusion rules, and protection filtering and are allowed to compete for available supply in a given run.

  * **Eligible Supply :** Eligible Supply refers to supply that passes Pegging Window rules and sourcing eligibility rules and can be consumed during allocation.

  * **Pinned Allocation:** Pinned Allocation is a manually enforced allocation state that prevents automated reallocation logic from modifying the assigned inventory.

  * **Tier (Ranking)**: A configurable business priority level (e.g., Gold, Silver, Bronze or Flagship, Chapter) assigned to customers or stores and used within the Demand Ranking Hierarchy to determine allocation precedence when demand competes for supply. Eg:

    * Customer Tier → Gold / Silver / Bronze (B2B accounts)

    * Store segment → Flagship / Chapter (Retail locations)

    * Partner Tier → Strategic Distributor / Secondary Jobber

    * Liquidator Tier → Tier 1 Liquidator / Tier 2 Jobber

  * **At-Once Order**: An At-Once order is a sales order that requires immediate fulfillment and shipment as soon as inventory becomes available, rather than being planned for a future delivery window.

  * **Unallocated (Demand State):** Unallocated refers to a demand line (e.g., Sales Order line) that did not receive any inventory assignment during an allocation run. (it is not free stock or it is not unallocated stock, so it is not stock state)

  * **Demand Ranking Hierarchy:** The Demand Ranking Hierarchy is the configurable, multi-level evaluation framework used by the allocation engine to determine the exact order in which competing demand lines are considered for available supply.

  * **Demand Type:** A Demand Type is a configurable classification assigned to a demand line that determines which allocation logic framework applies.

    * If → A Sales Order Line

      * Channel: Wholesale

      * Order Type: Pre-order

      * Strategic Flag: Launch

    * Then Demand Type → Wholesale Launch Pre-order

  * **Supply reliability ranking:** Defines the confidence level of each inbound supply type based on the accuracy of its expected arrival date. It ensures high-priority demand is allocated to more reliable supply sources rather than uncertain ones (e.g., consignment returns). Reliability scores can be dynamically updated based on supply progress, with higher confidence assigned as key milestones are reached (e.g., departure from origin, arrival at destination).

  * 

  * 

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAMAAAAhxq8pAAADAFBMVEUAAABAQEBERkZFR0ZER0ZDR0VISEhFRUVERkVER0ZDR0dDRkNESERDRkZER0VESEhESEZCR0RDR0ZER0dERkZGRkZDRkRARUVASEhERkVFSEhDR0VER0ZGRkZDR0VFSEVFRUVFR0VER0YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACxWeV0AAAAInRSTlMAEH/fz58gMO/vn1BAoL9AgHDfcIBQoDAgz2CQr19vYGBvGxXIWQAAAIJJREFUeF5jYKAIMMIYHFIMDE9/QthMUDFmqRevGKRhKqBASQhECEM4MJUM32EMIGCG0n/FvwhLMDyDcFiggp9YZBkYvkI5WAFMO6M04x9p9m9QDpiUZofKMTz5BRNUYnjG8gXE4BVl+Pwa5qTPP8BiDJ/vMfAywGznBTERAO54ZAAAT90XrfZ0HKwAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAx0lEQVR4Xu2TYRHCMAyFKwEJSEBCjyVpXIAEHIATJCBhEpCAhEkA0tEtTVcod/zku8ufvDR7fduc+/NTmHkNge6t1QU82x0TQHRMg8i4t7rGI266QJc0b3Xt7Gq1d3jvV69zQyZUn9QAMHg5K8vnpuTBtFNzXzEawj5rKL0AmE7pFku3KXrR8jPHeaRELy00m2NhuYIstT1hPB8OqoF9dKmDbQQD3ZZcTznIJ2S1GmlZ5k4DhENa3FrbDz+Bk5eTIqhVdFbJ8wG0lJX5M/zhmwAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQAQMAAAAs1s1YAAAABlBMVEUAAABER0byc6G0AAAAAXRSTlMAQObYZgAAAB9JREFUeF5jYEAD9h8YmEA0MwOYZmSWWQjhs4H56BgAT4ECDeGaeV4AAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQAQMAAAAs1s1YAAAABlBMVEUAAABER0byc6G0AAAAAXRSTlMAQObYZgAAAB9JREFUeF5jYEAD9h8YmEA0MwOYZmSWWQjhs4H56BgAT4ECDeGaeV4AAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAx0lEQVR4Xu2TYRHCMAyFKwEJSEBCjyVpXIAEHIATJCBhEpCAhEkA0tEtTVcod/zku8ufvDR7fduc+/NTmHkNge6t1QU82x0TQHRMg8i4t7rGI266QJc0b3Xt7Gq1d3jvV69zQyZUn9QAMHg5K8vnpuTBtFNzXzEawj5rKL0AmE7pFku3KXrR8jPHeaRELy00m2NhuYIstT1hPB8OqoF9dKmDbQQD3ZZcTznIJ2S1GmlZ5k4DhENa3FrbDz+Bk5eTIqhVdFbJ8wG0lJX5M/zhmwAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAVElEQVR4XmNgGJLAxd3tPy7s6u46H109QQDSiC4GAmQbSshAkg0lxkAw9nBxQFeDFeAyEBmMGogfjBqIFZBsoLO763x8mCQDgRomgDXgx+fR9YEAABbAbvDAaxmAAAAAAElFTkSuQmCC>