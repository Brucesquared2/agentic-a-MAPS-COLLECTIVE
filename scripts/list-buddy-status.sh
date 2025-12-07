#!/bin/bash
# List Buddy Status Report Script
# Quick script to show status of the 34 core items

echo "=========================================="
echo "  List Buddy - Status Report"
echo "=========================================="
echo ""

# Count total items
TOTAL_ITEMS=$(grep -c "^\- \[ \]" STATUS_CHECKLIST.md)
COMPLETED_ITEMS=$(grep -c "^\- \[x\]" STATUS_CHECKLIST.md)

echo "📊 Overall Progress:"
echo "   Total Items: $TOTAL_ITEMS"
echo "   Completed: $COMPLETED_ITEMS"
echo "   Remaining: $((TOTAL_ITEMS - COMPLETED_ITEMS))"
echo ""

# Count by priority
CRITICAL=$(grep -c "🔴" REPAIR_STATUS.md)
HIGH=$(grep -c "🟡" REPAIR_STATUS.md)
MEDIUM=$(grep -c "🟢" REPAIR_STATUS.md)

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
