# Caterpillar Smart Rental Tracking & Intelligence System 🏗️

> **From Rental Tracking to Rental Intelligence**
> An industrial-grade enterprise fleet intelligence control tower engineered for heavy equipment rental operations.

---

## 🌟 Overview

The **Caterpillar Smart Rental Intelligence System** is an enterprise operations control tower designed to eliminate the four costliest blind spots in heavy equipment rental workflows:
1. **Loss of Visibility**: Equipment becoming unaccounted for or having missing assignments.
2. **Misallocation**: Sites waiting for equipment while identical rented assets sit idle elsewhere.
3. **Rental Overruns**: Untracked returns leading to unexpected rental extensions and budget creep.
4. **Weak Planning**: Failure to convert historical telemetry into actionable predictive capacity forecasts.

### 🔁 The Closed-Loop Intelligence Paradigm

$$\text{TRACK} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{PREDICT} \longrightarrow \text{RECOMMEND} \longrightarrow \text{ACT} \longrightarrow \text{MEASURE}$$

---

## 🎯 Primary Hero Demonstration Scenario (`EQX1007` $\rightarrow$ `S003`)

The platform features a complete end-to-end operational decision flow:
1. **SPOT**: The **Control Tower** detects that Excavator `EQX1007` has generated **0 engine runtime hours** and **12 idle hours/day** across 12 operating days with no site or operator assignment (**Critical Severity Anomaly**).
2. **EXPLAIN**: Recommendation `REC-001` surfaces root-cause telemetry signals: 144 accumulated idle hours generating active rental waste ($2,800 cost at risk).
3. **PREDICT**: The **Demand Forecasting Engine** projects that Site `S003` (Eastfield Construction Hub) has an impending shortage of **+2 Excavators** next week with **87% confidence**.
4. **ACT**: The operator clicks **Apply Now** to reassign `EQX1007` to `S003` in a single click, binding site and operator assignments, resolving the anomaly, and updating the auditable rental timeline.
5. **MEASURE**: The **Analytics Ledger** immediately accounts for **$2,800 in simulated cost avoided** and a **+19% fleet utilization lift**.

---

## 🚀 Key Modules & Pages

| Route | Module | Description |
| :--- | :--- | :--- |
| `/dashboard` | **Control Tower** | Executive overview with fleet KPIs, active anomaly alerts, AI Action Center, Recharts fleet composition donut, and 14-day utilization trend. |
| `/assets` | **Asset Fleet Directory** | Full inventory table with search, sorting, 4 filter dropdowns (Status, Risk, Site, Type), and pagination. |
| `/assets/[id]` | **Asset Inspection & Telemetry** | Deep-dive telemetry card (runtime vs idle, fuel level, condition), daily telemetry area chart, linked anomalies, and action triggers. |
| `/rentals` | **Rental Operations & Lifecycle** | Active contracts ledger, interactive **Checkout Modal** with QR/RFID simulation, **Check-in Inspection Modal** (condition grading, closing engine hours, damage logging), and auditable **Event Stream**. |
| `/forecasting` | **Demand Forecasting** | 30-day historical baseline vs 7-day projected capacity shortage curves with 87% confidence envelopes. |
| `/anomalies` | **Anomaly Center** | Root-cause telemetry signals for unassigned assets, excessive idle, overdue rentals, and zero runtime. |
| `/recommendations` | **AI Action Center** | Explainable recommendations with confidence ratings, cost avoidance metrics, before/after impact matrices, and 1-click execution. |
| `/map` | **Fleet Geographic Map** | Regional sector canvas with interactive project site markers (`S001`–`S005`), live asset drawers, and demand surge alerts. |
| `/analytics` | **Analytics & ROI Ledger** | Financial impact ledger ($7,450+ cost avoided), site utilization benchmarks, and Before vs. After operational impact metrics. |
| `/usage` | **Usage & Telemetry Stream** | Sensor-level telemetry inspection across all fleet units. |
| `/settings` | **System Configuration** | Telemetry frequency settings (5s/60s/15m) and anomaly sensitivity threshold sliders. |
| `/help` | **Documentation & Demo Guide** | Step-by-step hackathon judging script and closed-loop architecture explainability. |

---

## 🛠️ Technology Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 & Turbopack
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 + Custom Industrial CSS Variable Tokens
- **Design System**: Caterpillar Safety Yellow (`#F5B800`) on dark slate industrial surfaces (`#0A0C0F`, `#111418`, `#1C2128`), WCAG AA compliant contrast
- **Component Primitives**: shadcn/ui & Base UI primitives
- **Data Fetching & State**: TanStack Query v5 + Optimistic State Mutations
- **Visualizations**: [Recharts 2.x](https://recharts.org/) (Donut charts, Area charts with confidence bands, Bar benchmarks)
- **Typography**: Inter (Body & Headers) + JetBrains Mono (Numeric telemetry & Asset IDs)
- **Icons & Feedback**: Lucide React + Sonner Toast Notifications

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/birat04/Smart-Rental-Tracking-System.git
cd Smart-Rental-Tracking-System/catterpillar

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔒 Backend-Ready API Abstraction

All data access is decoupled from presentation components via `lib/api/*`:
- `lib/api/assets.ts`
- `lib/api/anomalies.ts`
- `lib/api/recommendations.ts`
- `lib/api/rentals.ts`
- `lib/api/forecasts.ts`

These endpoints can be swapped to production REST, GraphQL, or WebSocket/SSE streams with zero modifications to the UI layer.

---

## 📄 License & Disclaimer

This project was built for the **Caterpillar Hackathon**. All financial impact figures and savings calculations are simulated demonstrations and do not represent actual Caterpillar financial data.
