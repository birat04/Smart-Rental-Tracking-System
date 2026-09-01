"use client";

import { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Search,
  FileText,
  ShieldCheck,
  Zap,
  Activity,
  ClipboardList,
  AlertTriangle,
  Radio,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  LifeBuoy,
  CheckCircle2,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DocSection {
  id: string;
  title: string;
  category: "guide" | "operations" | "telemetry" | "ai" | "hardware";
  summary: string;
  content: React.ReactNode;
}

const FAQS = [
  {
    question: "How do I perform an equipment checkout using QR or RFID scanning?",
    answer:
      "Navigate to 'Rental Operations' or click 'New Rental Checkout' from the Asset Directory. Click 'Simulate QR Scan' or scan the physical RFID/barcoded asset tag with an enterprise handheld scanner. Select the destination project site, assign an authorized operator, confirm the pre-dispatch condition rating, and click 'Confirm Checkout'. This automatically updates the asset status to ACTIVE and creates an auditable event in the ledger.",
    category: "Rental Operations",
  },
  {
    question: "What triggers an 'Excessive Idle' or 'Zero Runtime' anomaly?",
    answer:
      "The system monitors hourly telemetry data streams from onboard Cat Product Link™ hardware. If an asset is logged as active or rented but reports less than 1.0 engine hour and more than 8.0 idle hours within a 24-hour cycle, an 'Excessive Idle' anomaly is flagged. If zero runtime is detected across 3 consecutive days, a 'Zero Runtime' warning is escalated to the Control Tower.",
    category: "Telemetry & Anomalies",
  },
  {
    question: "How are AI recommendations generated and what does the confidence score mean?",
    answer:
      "The AI Action Engine analyzes live asset location, current utilization rates, site-level demand forecasts, and overdue flags. Recommendations like 'Reassign EQX1007 to S003' are synthesized when an underutilized asset is geographically near a site with a forecasted shortage. The confidence score (e.g. 87%) reflects historical model accuracy, weather data stability, and confirmed site project milestone dates.",
    category: "AI & Forecasting",
  },
  {
    question: "How do I report damage or mechanical issues during return check-in?",
    answer:
      "In the 'Rental Operations' dashboard, locate the active rental and click 'Check-in'. Under 'Post-Rental Condition Assessment', select 'Damaged' or 'Fair'. Enter final engine hours, check the 'Report mechanical anomaly' box, and input inspection notes (e.g., hydraulic leakage, track wear). This flags the asset for maintenance inspection and pauses automated reassignment.",
    category: "Rental Operations",
  },
  {
    question: "Which telemetry hardware protocols are supported by the platform?",
    answer:
      "The system natively integrates with Caterpillar Product Link™ (PL542/PL641), ISO 15143-3 (AEMP 2.0) telematics feeds, SAE J1939 CAN-bus telemetry, and Bluetooth Low Energy (BLE) asset tags for non-powered work tools and attachments.",
    category: "Hardware & IoT",
  },
  {
    question: "How is 'Simulated Cost Avoided' calculated in Analytics?",
    answer:
      "Cost avoidance is calculated using baseline daily rental rates, estimated equipment transport costs, and unplanned site downtime penalties. When an idle unassigned asset is reassigned instead of ordering a new rental, the avoided rental duration multiplied by daily rate is credited to the savings ledger.",
    category: "Analytics & ROI",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  const categories = [
    { id: "all", label: "All Topics", count: FAQS.length },
    { id: "Rental Operations", label: "Rental Operations", count: FAQS.filter(f => f.category === "Rental Operations").length },
    { id: "Telemetry & Anomalies", label: "Telemetry & Anomalies", count: FAQS.filter(f => f.category === "Telemetry & Anomalies").length },
    { id: "AI & Forecasting", label: "AI & Forecasting", count: FAQS.filter(f => f.category === "AI & Forecasting").length },
    { id: "Hardware & IoT", label: "Hardware & IoT", count: FAQS.filter(f => f.category === "Hardware & IoT").length },
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeTab === "all" || faq.category === activeTab;
    const matchesSearch =
      !search ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleTicketSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmittingTicket(true);
    setTimeout(() => {
      setIsSubmittingTicket(false);
      setTicketSubject("");
      setTicketMessage("");
      toast.success("Support Ticket Submitted", {
        description: "Cat Fleet Operations Support ticket #TK-8492 has been opened. Dispatcher SLA: < 15 mins.",
      });
    }, 600);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Page Header & Hero Search ─────────────────────────── */}
      <div
        className="p-6 rounded-lg border border-[var(--border-default)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{
          background: "linear-gradient(135deg, var(--surface-secondary) 0%, rgba(245,184,0,0.03) 100%)",
        }}
      >
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[var(--brand-muted)] border border-[var(--brand-muted-border)] flex items-center justify-center text-[var(--brand-primary)]">
              <BookOpen size={14} />
            </div>
            <span className="text-label text-[10px] text-[var(--brand-primary)]">
              KNOWLEDGE BASE & SUPPORT
            </span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Help Center & Technical Documentation
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Operational guides, telemetry protocol specifications, AI troubleshooting, and 24/7 Caterpillar Fleet Operations Dispatch desk.
          </p>
        </div>

        {/* Live SLA Badge */}
        <div className="p-3 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-primary)] flex flex-col gap-1 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--status-active-dot)] pulse-dot" />
            <span className="font-semibold text-[var(--text-primary)]">Fleet Support Desk: Active</span>
          </div>
          <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
            Avg. Dispatch Response: 8 mins
          </span>
        </div>
      </div>

      {/* ── Search Input ──────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-default)] shadow-sm"
        style={{ background: "var(--surface-secondary)" }}
      >
        <Search size={16} className="text-[var(--text-tertiary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documentation, operational workflows, error codes, telemetry protocols..."
          className="w-full bg-transparent border-none outline-none text-xs text-[var(--text-primary)] placeholder:text-[var(--text-disabled)]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Quick Documentation Guides Cards ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] flex flex-col justify-between gap-3 hover:border-[var(--border-strong)] transition-colors"
        >
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[var(--status-info-bg)] border border-[var(--status-info-border)] flex items-center justify-center text-[var(--status-info-text)]">
              <ClipboardList size={16} />
            </div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Rental Checkout & Return Manual
            </h2>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              Step-by-step instructions for QR tag scanning, site/operator binding, and return inspection condition grading.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--brand-primary)] flex items-center gap-1">
            <span>Read Operations SOP</span>
            <ArrowRight size={11} />
          </div>
        </div>

        <div
          className="p-4 rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] flex flex-col justify-between gap-3 hover:border-[var(--border-strong)] transition-colors"
        >
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[var(--brand-muted)] border border-[var(--brand-muted-border)] flex items-center justify-center text-[var(--brand-primary)]">
              <Zap size={16} />
            </div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              AI Action Engine & Forecasting
            </h2>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              How the predictive demand model calculates site capacity shortages, confidence envelopes, and automated reassignments.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--brand-primary)] flex items-center gap-1">
            <span>View Model Whitepaper</span>
            <ArrowRight size={11} />
          </div>
        </div>

        <div
          className="p-4 rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] flex flex-col justify-between gap-3 hover:border-[var(--border-strong)] transition-colors"
        >
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-[var(--status-active-bg)] border border-[var(--status-active-border)] flex items-center justify-center text-[var(--status-active-text)]">
              <Cpu size={16} />
            </div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Product Link™ Hardware & IoT
            </h2>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              Specs for Cat Product Link™ cellular/satellite beacons, J1939 CAN-bus telemetry, and asset GPS mapping.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--brand-primary)] flex items-center gap-1">
            <span>Telemetry Specs</span>
            <ArrowRight size={11} />
          </div>
        </div>
      </div>

      {/* ── Main Split: FAQ Accordion + Support Ticket Desk ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive FAQ Accordion */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
              <HelpCircle size={14} className="text-[var(--brand-primary)]" />
              Frequently Asked Questions ({filteredFaqs.length})
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={cn(
                  "text-label text-[10px] px-2.5 py-1 rounded-sm border transition-colors",
                  activeTab === c.id
                    ? "bg-[var(--brand-muted)] text-[var(--text-accent)] border-[var(--brand-muted-border)]"
                    : "border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {c.label} ({c.count})
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] text-xs text-[var(--text-tertiary)]">
                No matching documentation articles found. Try a different query or contact the support desk.
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--interactive-hover)] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] font-mono">
                          {faq.category}
                        </span>
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={14} className="text-[var(--brand-primary)] shrink-0" />
                      ) : (
                        <ChevronRight size={14} className="text-[var(--text-disabled)] shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] bg-[var(--surface-primary)]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 4 Cols: Contact Support & Submit Ticket */}
        <div className="lg:col-span-4 space-y-4">
          {/* Direct Contacts Card */}
          <div
            className="p-4 rounded-md border border-[var(--border-default)] space-y-3"
            style={{ background: "var(--surface-secondary)" }}
          >
            <div className="flex items-center gap-2">
              <LifeBuoy size={14} className="text-[var(--brand-primary)]" />
              <h2 className="text-xs font-bold text-[var(--text-primary)]">
                Direct Fleet Operations Hotlines
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-[var(--surface-primary)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[var(--status-active-text)]" />
                  <span className="text-[var(--text-secondary)]">24/7 Field Dispatch</span>
                </div>
                <span className="font-mono font-bold text-[var(--text-primary)]">1-800-CAT-FLEET</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[var(--surface-primary)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[var(--status-info-text)]" />
                  <span className="text-[var(--text-secondary)]">Technical Ops Email</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-secondary)]">ops@cat-rental.com</span>
              </div>
            </div>
          </div>

          {/* Submit Support Ticket Widget */}
          <form
            onSubmit={handleTicketSubmit}
            className="p-4 rounded-md border border-[var(--border-default)] space-y-3"
            style={{ background: "var(--surface-secondary)" }}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[var(--brand-primary)]" />
              <h2 className="text-xs font-bold text-[var(--text-primary)]">
                Submit Dispatch / Tech Ticket
              </h2>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-label text-[10px] text-[var(--text-tertiary)]">
                ISSUE SUBJECT
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Telemetry sensor offline on EQX1002"
                className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-label text-[10px] text-[var(--text-tertiary)]">
                DETAILS & ASSET ID
              </label>
              <textarea
                rows={3}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe equipment location, malfunction, or urgent dispatch reassignment request..."
                className="w-full px-2.5 py-1.5 rounded border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingTicket}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded text-xs font-semibold bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={13} />
              {isSubmittingTicket ? "Submitting Ticket..." : "Submit to Dispatch Desk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
