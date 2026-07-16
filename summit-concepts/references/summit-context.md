# Summit Data & Insights — Business & Market Context

> An optional background reference for the `summit-concept` skill. Read it at the start
> of a concept to ground the idea in Summit's business, market, customers, data, and
> competitors. Factual and a-political — it states what Summit is and the market it
> operates in; it does not argue a position or rationalise decisions.

---

## What Summit Is

Summit Insights is a **data & insights** business for the **retail industry**, founded **2011**, headquartered in North Sydney, Australia. It builds software and services around retailer/supplier data sharing, and serves retail customers in Australia and internationally — including **Alfamart** (Indonesia, POC) and **Wellcome** (Hong Kong). Its specialisation spans Food & Beverage (F&B) — grocery, convenience, and QSR — and broader retail beyond F&B, including general-merchandise and office/stationery retail such as **Officeworks**.

Summit's work covers four functions:

1. **Data processing, management & engineering** — processing, managing, and engineering retailer data.
2. **Visual Insights (VI) platform** — the analytics platform: turns transaction data into clean interactive dashboards/reports, defined in **JSON + CSS on the DataFoundry backend**; client access is sold.
3. **Consultancy** — data-driven range / promo / ops strategy off transaction data; **300+ companies supported**.
4. **Data agency** — Summit is the **exclusive data agent for 7-Eleven Australia**. Retail partners include Ritchies Supa IGA, Drakes, FoodWorks, Liquor Legends, LMG, and Officeworks; Alfamart (Indonesia) is a POC.

Delivered by an Australian-based technical team (data processing, governance, and end-to-end development from data through to the analytics platform) and industry-trained consultants.

**Scale:** founded 2011; ~30 staff; 500+ client reports in production.

---

## Customers

Five customer types:

1. **Data-commercialising retailers** — the priority type: Summit gets exclusive data-agent rights, and the retailer's suppliers pay for data services.
2. **Suppliers of those retailers** — e.g. Red Bull, Mars — buy data services.
3. **CCEP (Coca-Cola Europacific Partners)** — a long-term partner whose contract funds Summit's work with (4).
4. **Non-traditional retailers** — QSR, cinemas, stadiums, pubs, airlines — served in exchange for CCEP receiving their transaction data.
5. **Direct-pay retailers** — pay Summit directly without commercialising their data.

---

## The Retail Analytics Vertical

Summit's deepest specialisation is the FMCG / Food & Beverage segment — grocery, convenience, and QSR. Traits of F&B retail that shape how its data is modelled and used (broader retail clients such as Officeworks share the transaction-velocity and ranging dynamics, without the perishability constraint):

| Characteristic | What it means |
|---|---|
| **High rate of sale / velocity** | Sales turn over at weekly and daily granularity |
| **Short shelf life** | Ranging decisions carry waste risk, not only margin risk |
| **Centralised ranging** | Range decisions are made at the cluster level, not per SKU-store |
| **Promotional intensity** | Frequent promo cycles distort baseline sales, requiring promo-from-BAU separation |
| **Convenience ≠ grocery** | Convenience has smaller baskets, higher footfall, and distinct shopper missions |
| **Supplier–retailer dynamics** | Category captaincy, JBP cycles, and trading terms determine what data is available and to whom |

---

## Supplier–Retailer relationships (Australian market)

Australian grocery/FMCG has a concentrated retailer base (Woolworths, Coles, Metcash/IGA, Aldi; convenience via 7-Eleven and others). Retailers control ranging and shelf space; suppliers (brand manufacturers) sell into them through the **category management** process — products are managed by category, and suppliers engage via **category reviews** and **Joint Business Planning (JBP)**. A supplier may act as **category captain/advisor**, providing data and range recommendations.

**Category KPIs** — the metrics used to evaluate category and product performance: sales value and volume; market share (value and volume); rate of sale (ROS); distribution (numeric and weighted) and on-shelf availability; penetration and basket metrics (frequency, basket size, cross-purchase); margin / gross profit; promotional performance and incrementality; range and space productivity (sales per SKU and per linear metre).

**Supplier innovation cycles** — New product development (NPD) is launched into retailer **range-review windows**, which run on a periodic cadence (typically once or twice a year per category). Suppliers time innovation to these windows; NPD is assessed against category KPIs and must earn shelf space against incumbent SKUs, while delisting of underperformers frees space — so innovation and rationalisation happen together at each review.

---

## Retail Media

Retail media is advertising operated by retailers that monetises their **first-party shopper data** and owned channels — onsite (e-commerce), offsite (digital), and in-store (screens, radio, print). Suppliers and brands buy it to reach shoppers, and it is increasingly negotiated alongside range and trade terms.

- **Networks:** **Coles 360** (Coles) and **Cartology** (Woolworths); **Wesfarmers (OneDigital)** and **Metcash** operate and expand their own.
- **Specialist:** **Redworks** (Redworks Media) — an independent retail media specialist; from 2021 the team behind Coles 360, and builder of networks for Coles Liquor and Bunnings' Hammer Media (parent: Retail MediaWorks). From September 2025 the Redworks team amalgamated into Coles Group under Coles 360; Retail MediaWorks continues independently.
- **Reporting & measurement:** Circana reports for Coles; Quantium (Woolworths-owned) reports for Woolworths — see **Competitors** for company detail.
- **Scale:** industry estimates put Australian retail media spend at ~$1bn (2022) tracking toward ~$2.8bn by 2027, with Coles 360 and Cartology together approaching ~$1bn in combined annual ad revenue.

**Embeddedness in category management:** media commitments are increasingly discussed alongside range, promotion, and trading terms within JBP — linking a supplier's media spend to category outcomes and to the measurement of those outcomes.

---

## Competitors

Factual summaries drawn from each company's public website.

### Retail analytics & data specialists

- **Circana** (formerly IRI) — `circana.com/au`. Data, AI, and analytics for CPG companies, manufacturers, and retailers. In Australia tracks grocery, liquor, pharmacy, foodservice, and retail via its Liquid Data platform (market share and consumer behaviour from point-of-sale and panel data). Acquired Nielsen's Marketing Mix Modeling business. Provides retail-media reporting for Coles.
- **Quantium** — `quantium.com`. Australian data and analytics across retail, FMCG, banking, healthcare, insurance, and public sector. Its Q platform (Q.Checkout, Q.Promotions, Q.Audience, Q.Refinery) processes transaction data at scale. Majority-owned by Woolworths Group; reports for Woolworths. Clients include Commonwealth Bank and Telstra.
  - **Q.Checkout** — `quantium.com/q-checkout`. Shopper analytics on first-party retailer transaction data (not panel estimates), connecting transactions to shopper profiles for retailers and CPG suppliers, with a natural-language interface for category performance, segments, loyalty status, and promotional incrementality.
- **Goodwork.ai** — `goodwork.ai`. Sydney-based retail-analytics platform for retailer Category and Finance teams: performance diagnostics, forecasting, range optimisation, promotional effectiveness, supplier-negotiation support, supply-chain and customer-behaviour analysis, and financial planning (P&L, budget tracking).

### Adjacent software categories in the retailer stack

- **Office & productivity suites** (e.g. Microsoft 365) — general-purpose reporting and analysis outside dedicated analytics platforms.
- **Database & data-warehouse solutions** (e.g. SQL Server, Oracle, Snowflake) — store and query retailer point-of-sale and transaction data.
- **Loyalty data programs** — capture shopper identity linked to purchase history; first-party data for segmentation and personalisation.
- **ERP providers** (e.g. SAP, Oracle) — inventory, procurement, supply chain, and finance operations.
- **CRM providers** (e.g. Salesforce) — customer records, marketing, and engagement.

---

## Building on Summit (for concept work)

**Data Summit typically HAS:** transaction-level POS (basket, SKU, store, day) for partner retailers; loyalty / shopper-level behaviour where a program exists (e.g. 7-Eleven, Ritchies); store attributes including locations; product hierarchies; promo calendars where supplied; integrated enrichment sources.

**Data Summit typically does NOT have:** competitor internal sales; retailer margins (unless supplied); foot traffic (needs third parties / scraping); granular demographics beyond appended sources; anything about retailers outside the partner list. A concept that needs missing data isn't dead — it needs a proxy or a smaller claim; flag the gap and offer the nearest available data.

**Output shapes Summit ships:** a VI report (JSON + CSS in-platform); a modern web app embedded in an Azure iframe inside VI; a PowerPoint deck; a one-off analysis readout; a standalone tool. A concept can become any of these.

**Audiences a concept can serve:** a retailer's category manager; a supplier's national account manager (NAM); a retailer or supplier executive; Summit business development (pitching a prospect); or Summit internal.

---

## Glossary

- **VI** — Visual Insights, Summit's analytics platform.
- **DataFoundry** — the backend data platform VI is built on.
- **MAT** — moving annual total.
- **FMCG / CPG** — fast-moving consumer goods / consumer packaged goods (supplier goods).
- **Data commercialisation** — a retailer selling structured access to its transaction data.
- **NAM** — national account manager (a supplier's retailer-facing role).
- **VI content quirk:** never use a literal `$` in content destined for the VI platform — write `AUD` or `&#36;`.
