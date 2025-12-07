# Status Checklist - 34 Core Items

Quick reference checklist for tracking repair and implementation status.

## 🔴 Critical Priority

- [ ] #9 - Custom Auth Providers for projects/deployments

## 🟡 High Priority

- [ ] #1 - Database Setup - Initialize postgres for `apps/api`
- [ ] #2 - Environment Variables - Configure all apps (Stripe, GitHub, Resend, Sentry)
- [ ] #10 - Signed Requests - Implement API gateway request signing
- [ ] #11 - Secrets Management - Regular audits
- [ ] #14 - Teams/Organizations - Restore team support

## 🟢 Medium Priority - Infrastructure

- [ ] #3 - API Gateway Stress Tests
- [ ] #4 - E2E Test Coverage - Expand content type tests
- [ ] #5 - Binary Bodies/Responses Testing
- [ ] #6 - MCP Resources Testing
- [ ] #7 - Build Artifacts Cleanup
- [ ] #8 - Dependencies Audit (`pnpm knip`)

## 🟢 Medium Priority - Security

- [ ] #12 - Sentry Middleware Fix
- [ ] #13 - MCP Origin Auth - Guarantee Agentic requests

## 🟢 Medium Priority - Features

- [ ] #15 - Declarative JSON Pricing
- [ ] #16 - Pricing Plan Stability Validation
- [ ] #17 - SSE Support Evaluation
- [ ] #18 - Custom Response Headers
- [ ] #19 - Non-Cached Usage Reporting
- [ ] #20 - ToolConfig.cost Multi-Credit Support
- [ ] #21 - Dynamic MCP Tools Handling
- [ ] #22 - Multiple Rate Limits by Slug
- [ ] #23 - MCP Ping Support
- [ ] #24 - Claude Desktop Extensions (DXT)
- [ ] #25 - MCP Remote (stdio support)

## 🟢 Medium Priority - UI/UX

- [ ] #26 - llms.txt Generation
- [ ] #27 - Browser Navigation with `?next=`
- [ ] #28 - Social Proof on Signup
- [ ] #29 - Hero Animation Enhancement
- [ ] #30 - Marketplace Detail Page Improvements
- [ ] #31 - MCP Origin Constraints Documentation

## 🟢 Medium Priority - DevOps

- [ ] #32 - Enhanced Sentry Instrumentation
- [ ] #33 - Analytics Dashboard
- [ ] #34 - Ledger Rotation Automation

---

## Quick Commands

```bash
# Development
pnpm dev              # Start all services
pnpm build            # Build everything
pnpm test             # Run all tests

# Quality
pnpm fix              # Auto-fix issues
pnpm test:lint        # Check linting
pnpm test:format      # Check formatting
pnpm knip             # Check dependencies

# Database (from apps/api)
cd apps/api
pnpm drizzle-kit push # Initialize database
```

## Progress Tracking

Started: 2025-12-07
Last Updated: 2025-12-07
Items Completed: 0/34
