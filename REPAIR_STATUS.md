# Repair Status Tracker - List Buddy

## Purpose
This document tracks items that need repair, updates, or completion across the Agentic repository. It serves as a "list buddy" to help organize and prioritize work items.

## Status Legend
- 🔴 **Critical**: Needs immediate attention
- 🟡 **High**: Should be addressed soon
- 🟢 **Medium**: Normal priority
- ⚪ **Low**: Nice to have
- ✅ **Complete**: Done
- 🚫 **Blocked**: Waiting on dependencies

---

## High Priority Items (34 Core Items)

### Infrastructure & Build (8 items)

1. 🟡 **Database Setup** - `apps/api` requires postgres database initialization
   - Status: Needs setup documentation
   - Action: Run `pnpm drizzle-kit push` from `apps/api` directory

2. 🟡 **Environment Variables** - Multiple apps need `.env` configuration
   - Status: Incomplete setup
   - Action: Configure Stripe, GitHub OAuth, Resend, Sentry for all apps

3. 🟢 **API Gateway Stress Tests** - Missing comprehensive load testing
   - Status: Not started
   - Action: Create stress test suite

4. 🟢 **E2E Test Coverage** - Expand test cases for different content types
   - Status: Partial
   - Action: Add more test cases to `apps/e2e`

5. 🟢 **Binary Bodies/Responses** - Test handling in gateway
   - Status: Not tested
   - Action: Add tests for binary data

6. 🟢 **MCP Resources** - Test handling of MCP resources
   - Status: Not tested
   - Action: Add resource handling tests

7. 🟢 **Build Artifacts** - Clean up and optimize build process
   - Status: Review needed
   - Action: Verify build outputs and cleanup

8. 🟢 **Dependencies Audit** - Run `pnpm knip` for unused dependencies
   - Status: Periodic
   - Action: Regular cleanup needed

### Security & Authentication (5 items)

9. 🔴 **Custom Auth Providers** - Support for project/deployment-specific auth
   - Status: Not implemented
   - Action: Design and implement custom auth provider configs

10. 🟡 **Signed Requests** - API gateway signed request support
    - Status: Not implemented
    - Action: Implement request signing

11. 🟡 **Secrets Management** - Ensure no secrets in source code
    - Status: Ongoing
    - Action: Regular audits with `scripts/secrets_check.sh`

12. 🟢 **Sentry Middleware** - Fix Sentry middleware for `@agentic/platform-hono`
    - Status: Known issue
    - Action: Follow up on GitHub issues #943

13. 🟢 **MCP Origin Auth** - Guarantee requests come from Agentic
    - Status: Research needed
    - Action: Implement `_meta` for tool calls, ask in MCP Discord

### Features & Functionality (12 items)

14. 🟡 **Teams/Organizations** - Re-add support for teams
    - Status: Removed, needs restoration
    - Action: Restore team functionality

15. 🟢 **Declarative Pricing** - JSON-based pricing like Saasify/Tier
    - Status: Research phase
    - Action: Implement declarative pricing schema

16. 🟢 **Pricing Plan Stability** - Validate stability across deployments
    - Status: Needs validation
    - Action: Add validation for pricing plan slugs

17. 🟢 **SSE Support** - Server-Sent Events for gateway
    - Status: Post-MVP consideration
    - Action: Evaluate streamable HTTP vs SSE

18. 🟢 **Custom Response Headers** - Support for custom headers
    - Status: Not implemented
    - Action: Add header customization

19. 🟢 **Non-Cached Usage Reporting** - Only report Stripe usage for non-cached requests
    - Status: Not implemented
    - Action: Add caching awareness to billing

20. 🟢 **ToolConfig.cost** - Default to 1 for multi-credit tools
    - Status: Not implemented
    - Action: Add cost multiplier support

21. 🟢 **Dynamic MCP Tools** - Handle dynamic origin tools
    - Status: Not handled
    - Action: Add validation for dynamic tools

22. 🟢 **Multiple Rate Limits** - Support rate limits by slug
    - Status: Single limit only
    - Action: Implement RateLimit-Policy header spec

23. 🟢 **MCP Ping Support** - Add ping support to MCP servers
    - Status: Not implemented
    - Action: Implement MCP ping utility

24. 🟢 **Claude Desktop Extensions** - Support DXT
    - Status: Not supported
    - Action: Add DXT support

25. 🟢 **MCP Remote** - Support stdio-only MCP clients
    - Status: Not supported
    - Action: Add mcp-remote support

### UI/UX & Documentation (6 items)

26. 🟢 **llms.txt** - Generate llms.txt for all projects
    - Status: Not implemented
    - Action: Add llms.txt generation

27. 🟢 **Browser Navigation** - Handle browser back/forward with `?next=`
    - Status: Not implemented
    - Action: Add proper navigation handling

28. 🟢 **Social Proof** - Add social proof to signup page
    - Status: Missing
    - Action: Add testimonials/stats

29. 🟢 **Hero Animation** - Add scroll appearance motion
    - Status: Basic only
    - Action: Enhance animation

30. 🟢 **Marketplace Detail Page** - Improve project detail page
    - Status: Needs enhancement
    - Action: Add breadcrumbs, dates, schema improvements

31. 🟢 **Documentation** - MCP origin servers constraints
    - Status: Missing
    - Action: Document static tools requirement

### DevOps & Monitoring (3 items)

32. 🟢 **Sentry Instrumentation** - Extra instrumentation (setUser, captureMessage)
    - Status: Basic only
    - Action: Add comprehensive Sentry tracking

33. 🟢 **Analytics Dashboard** - Build analytics dashboard
    - Status: Not started
    - Action: Design and implement dashboard

34. 🟢 **Ledger Rotation** - Automate ledger rotation workflow
    - Status: Scripts exist, automation needed
    - Action: Verify GitHub workflow is functioning

---

## Additional Items (Post-MVP)

### Code Quality
- Replace `ms` package with alternative
- Consider switching to `consola` for logging
- Consider switching to `bun` for hot reloading
- Improve logger vs console usage
- Consider replacing `eventId` with UUIDs for `requestId`

### Testing
- Add TypeScript SDK examples to e2e tests
- Add more OpenAPI test cases
- Test MCP resources handling
- Test prompts and other MCP features

### Features
- Visual pricing plan config + previews
- UX onboarding flow
- Enterprise/custom pricing support
- ChatGPT MCP custom connectors support
- About page (inspiration: mastra.ai/about)

### Architecture
- Simplify overlap between `@agentic/core` and `@agentic/platform-core`
- Simplify `AgenticToolClient` to require fewer packages
- Allow deployments to specify proxy secret
- Handle hosting of deployment/user images

---

## Quick Actions

### To Run Tests
```bash
pnpm test           # Run all tests
pnpm test:unit      # Unit tests only
pnpm test:lint      # Linting
pnpm test:format    # Format check
```

### To Build
```bash
pnpm build          # Build all packages
pnpm dev            # Development mode
```

### To Fix Issues
```bash
pnpm fix            # Auto-fix formatting and linting
pnpm knip           # Check unused dependencies
```

---

## Notes
- This tracker focuses on the 34 most important items that need attention
- Items are organized by category for easier navigation
- Status indicators help prioritize work
- Regular updates recommended after completing items

Last Updated: 2025-12-07
