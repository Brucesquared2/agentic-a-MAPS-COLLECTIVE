# List Buddy - Quick Reference Guide

## What is List Buddy?

List Buddy is your companion system for tracking, organizing, and managing repair items, features, and tasks across the Agentic repository. It consists of two main tracking documents and integration with the cockpit dashboard.

## Documents

### 1. STATUS_CHECKLIST.md
**Purpose**: Quick, scannable checklist format
- ✅ Best for: Daily standup, quick status checks
- 📋 Format: Simple checkboxes with item numbers
- 🎯 Use when: You need to quickly mark items complete

### 2. REPAIR_STATUS.md
**Purpose**: Detailed tracking with context
- ✅ Best for: Understanding context, planning work
- 📋 Format: Detailed descriptions with actions
- 🎯 Use when: You need background on what needs to be done

## The 34 Core Items

These are the prioritized items that need attention, organized into:
- **8 items**: Infrastructure & Build
- **5 items**: Security & Authentication
- **12 items**: Features & Functionality
- **6 items**: UI/UX & Documentation
- **3 items**: DevOps & Monitoring

## How to Use List Buddy

### When Starting Work
1. Check `STATUS_CHECKLIST.md` for quick overview
2. Find an unchecked item in your skill area
3. Read details in `REPAIR_STATUS.md`
4. Update status emoji in `REPAIR_STATUS.md`
5. Check the box in `STATUS_CHECKLIST.md` when done

### Status Indicators
- 🔴 **Critical**: Drop everything, needs immediate attention
- 🟡 **High**: Should be next in queue
- 🟢 **Medium**: Normal priority work
- ⚪ **Low**: Nice to have when time permits
- ✅ **Complete**: Done and verified
- 🚫 **Blocked**: Waiting on something else

### Making Updates

#### Mark Item Complete
```markdown
# In STATUS_CHECKLIST.md
- [x] #5 - Binary Bodies/Responses Testing

# In REPAIR_STATUS.md
5. ✅ **Binary Bodies/Responses** - Test handling in gateway
   - Status: Complete
   - Completed: 2025-12-07
```

#### Update Status
```markdown
# In REPAIR_STATUS.md
10. 🟡 **Signed Requests** - API gateway signed request support
    - Status: In Progress (John working on it)
    - Action: Implement request signing
    - ETA: 2025-12-10
```

#### Add Notes
```markdown
# In REPAIR_STATUS.md
12. 🟢 **Sentry Middleware** - Fix Sentry middleware
    - Status: Blocked - waiting on upstream fix
    - Blocking Issue: https://github.com/honojs/middleware/issues/943
    - Notes: May need workaround if not fixed soon
```

## Integration with Dashboard

List Buddy is integrated into the cockpit dashboard (`dashboard.yml`):

```yaml
dashboard:
  panels:
    - CONFIG_PANEL.md
    - REPOS.md
    - HOOK_LOG.md
    - ALGO_COMPILER.md
    - FILE_NAV.md
    - STATUS_CHECKLIST.md    # Quick checklist
    - REPAIR_STATUS.md       # Detailed status
```

## Workflow Examples

### Daily Workflow
```bash
# 1. Check status
cat STATUS_CHECKLIST.md

# 2. Pick an item (e.g., #8 - Dependencies Audit)
cd /repo/root
pnpm knip

# 3. Complete the work
# ... make changes ...

# 4. Update checklist
# Edit STATUS_CHECKLIST.md: [x] #8 - Dependencies Audit

# 5. Update detailed status
# Edit REPAIR_STATUS.md: Change 🟢 to ✅, add completion date

# 6. Commit
git add STATUS_CHECKLIST.md REPAIR_STATUS.md
git commit -m "✅ chore: complete dependency audit (#8)"
```

### Team Coordination
```bash
# Morning standup - Quick status
grep "\- \[x\]" STATUS_CHECKLIST.md | wc -l  # Items completed
grep "\- \[ \]" STATUS_CHECKLIST.md | wc -l  # Items remaining

# Check what's blocked
grep "🚫" REPAIR_STATUS.md

# Check critical items
grep "🔴" REPAIR_STATUS.md
```

## Tips for Success

1. **Update Often**: Keep the status current
2. **Add Context**: When you learn something, add it to notes
3. **Communicate**: Use status emojis to show progress
4. **Be Specific**: Include dates, names, links when relevant
5. **Review Weekly**: Look at progress and adjust priorities

## Common Commands

```bash
# See completion progress
grep -c "\- \[x\]" STATUS_CHECKLIST.md
grep -c "\- \[ \]" STATUS_CHECKLIST.md

# Find critical items
grep "🔴" REPAIR_STATUS.md

# Find blocked items
grep "🚫" REPAIR_STATUS.md

# Find items by category
grep "### Infrastructure" REPAIR_STATUS.md -A 20

# Check last update
git log -1 --pretty=format:"%h - %s (%cr)" -- STATUS_CHECKLIST.md
```

## Maintenance

### Weekly Review
- Update priorities based on business needs
- Move completed items to archive (if needed)
- Add new critical items discovered during the week
- Update ETAs and blocked status

### Monthly Cleanup
- Archive completed items
- Re-evaluate priorities
- Add learnings and documentation links
- Update progress metrics

## Getting Help

If you're unsure about an item:
1. Check `REPAIR_STATUS.md` for detailed context
2. Look at related files in the codebase
3. Check TODO.md for additional context
4. Ask in team chat with item number (e.g., "Question about #15")

---

## Quick Start Commands

```bash
# View quick status
cat STATUS_CHECKLIST.md

# View detailed status
cat REPAIR_STATUS.md

# Start working on next item
# 1. Pick unchecked item from STATUS_CHECKLIST.md
# 2. Read details in REPAIR_STATUS.md
# 3. Do the work
# 4. Update both files
# 5. Commit with item number in message
```

---

**Remember**: List Buddy is here to help, not to create bureaucracy. Update it as you work, and it will help you track progress effortlessly!

Last Updated: 2025-12-07
