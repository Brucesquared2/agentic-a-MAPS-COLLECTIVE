// scripts/businessPlanBuilder.js
// Auto-generates structured business plan sections from trading + marketing data

import fs from "fs";
import path from "path";

/**
 * Build structured business plan sections
 * @param {Object} tradingData - metrics from tradingMarketingBridge
 * @param {Object} marketingData - narratives from contentGenerator
 * @returns {Object} plan - structured business plan
 */
export function buildBusinessPlan(tradingData, marketingData) {
  const plan = {
    executiveSummary: generateExecutiveSummary(tradingData, marketingData),
    marketAnalysis: generateMarketAnalysis(tradingData),
    productRoadmap: generateProductRoadmap(marketingData),
    financialPlan: generateFinancialPlan(tradingData),
    marketingStrategy: generateMarketingStrategy(marketingData),
    operationsPlan: generateOperationsPlan(),
  };

  // Save to file for fossilization
  const outPath = path.resolve(process.cwd(), "BUSINESS_PLAN.json");
  fs.writeFileSync(outPath, JSON.stringify(plan, null, 2));
  console.log(`📜 Business plan generated at ${outPath}`);

  return plan;
}

function generateExecutiveSummary(tradingData, marketingData) {
  return {
    overview: "Integrated trading + marketing system leveraging multi-agent orchestration.",
    highlights: {
      winRate: tradingData.win_rate,
      sharpeRatio: tradingData.sharpe_ratio,
      totalPnL: tradingData.total_pnl,
      narrativeFocus: marketingData.keyThemes || [],
    },
  };
}

function generateMarketAnalysis(tradingData) {
  return {
    industryTrends: "AI-driven trading and automated content pipelines are growing rapidly.",
    targetMarkets: ["Retail traders", "Institutional investors", "Tech-savvy finance teams"],
    competitiveEdge: `Sharpe ratio ${tradingData.sharpe_ratio}, multi-agent orchestration`,
  };
}

function generateProductRoadmap(marketingData) {
  return {
    currentFeatures: ["Trading-Marketing Bridge", "Content Generator", "Orchestrator Hub"],
    upcoming: ["Investor portal", "Automated dashboards", "Business plan builder"],
    contentThemes: marketingData.upcomingThemes || [],
  };
}

function generateFinancialPlan(tradingData) {
  return {
    revenueStreams: ["Trading performance", "Investor subscriptions", "Content licensing"],
    pnl: tradingData.total_pnl,
    projections: {
      nextQuarter: tradingData.total_pnl * 1.2,
      nextYear: tradingData.total_pnl * 5,
    },
  };
}

function generateMarketingStrategy(marketingData) {
  return {
    channels: ["LinkedIn", "Twitter", "Blog", "Email", "Investor reports"],
    cadence: "Weekly content generation (4+ pieces)",
    narratives: marketingData.narratives || [],
  };
}

function generateOperationsPlan() {
  return {
    orchestration: "Multi-agent cockpit with ledger fossilization",
    automation: "Scheduled runs via CI/CD",
    dashboards: ["Prometheus metrics", "Grafana visualizations", "Discord ritual feed"],
  };
}

// CLI entrypoint
if (require.main === module) {
  const tradingData = {
    win_rate: 0.68,
    sharpe_ratio: 1.82,
    total_pnl: 3847.5,
  };
  const marketingData = {
    keyThemes: ["Performance", "Social proof", "Investor confidence"],
    narratives: ["Weekly updates", "Quarterly investor reports"],
  };
  buildBusinessPlan(tradingData, marketingData);
}
