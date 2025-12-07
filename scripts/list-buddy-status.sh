#!/bin/bash
# List Buddy Status Report Script
# Quick script to show status of the 34 core items

echo "=========================================="
echo "  List Buddy - Status Report"
echo "=========================================="
echo ""

# Check if required files exist
if [ ! -f "STATUS_CHECKLIST.md" ]; then
    echo "❌ Error: STATUS_CHECKLIST.md not found"
    exit 1
fi

if [ ! -f "REPAIR_STATUS.md" ]; then
    echo "❌ Error: REPAIR_STATUS.md not found"
    exit 1
fi

# Count total items (set +e temporarily to handle grep returning 0)
set +e
TOTAL_ITEMS=$(grep -c "^\- \[ \]" STATUS_CHECKLIST.md 2>/dev/null)
COMPLETED_ITEMS=$(grep -c "^\- \[x\]" STATUS_CHECKLIST.md 2>/dev/null)
set -e

# Default to 0 if empty
TOTAL_ITEMS=${TOTAL_ITEMS:-0}
COMPLETED_ITEMS=${COMPLETED_ITEMS:-0}

echo "📊 Overall Progress:"
echo "   Total Items: $TOTAL_ITEMS"
echo "   Completed: $COMPLETED_ITEMS"
echo "   Remaining: $((TOTAL_ITEMS - COMPLETED_ITEMS))"
echo ""

# Count by priority
set +e
CRITICAL=$(grep -c "🔴" REPAIR_STATUS.md 2>/dev/null)
HIGH=$(grep -c "🟡" REPAIR_STATUS.md 2>/dev/null)
MEDIUM=$(grep -c "🟢" REPAIR_STATUS.md 2>/dev/null)
set -e

# Default to 0 if empty
CRITICAL=${CRITICAL:-0}
HIGH=${HIGH:-0}
MEDIUM=${MEDIUM:-0}

echo "🎯 Priority Breakdown:"
echo "   🔴 Critical: $CRITICAL items"
echo "   🟡 High: $HIGH items"
echo "   🟢 Medium: $MEDIUM items"
echo ""

# Show category summary
echo "📁 Categories:"
echo "   Infrastructure & Build: 8 items"
echo "   Security & Authentication: 5 items"
echo "   Features & Functionality: 12 items"
echo "   UI/UX & Documentation: 6 items"
echo "   DevOps & Monitoring: 3 items"
echo ""

echo "📋 Quick Access:"
echo "   View Checklist: cat STATUS_CHECKLIST.md"
echo "   View Details:   cat REPAIR_STATUS.md"
echo "   View Guide:     cat LIST_BUDDY_GUIDE.md"
echo ""

echo "✅ List Buddy is ready to help!"
echo "=========================================="
