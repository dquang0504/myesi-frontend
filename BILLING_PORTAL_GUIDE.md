# Billing Portal - Quick Reference Guide

## 🚀 How to Access

**All Roles**:
- Navigate to `/admin/billing`, `/developer/billing`, `/analyst/billing`, or `/auditor/billing`
- Click "Billing" in the sidebar navigation

---

## 🎯 Main Features

### 1. View Current Subscription
- See your current plan, price, and status
- Check next billing date
- View payment method on file

### 2. Upgrade or Downgrade Plan
1. Scroll to "Available Plans" section
2. Click "Upgrade" or "Downgrade" button on desired plan
3. Review comparison modal
4. Click "Confirm Change"
5. See success toast notification

### 3. Cancel Subscription
1. Click "Cancel Subscription" button
2. Choose cancellation option:
   - **Cancel at period end** (recommended) - keep access until billing date
   - **Cancel immediately** - lose access now, no refund
3. Click "Confirm Cancellation"

### 4. Reactivate Subscription
- If subscription is set to cancel, see yellow warning banner
- Click "Reactivate Subscription" button
- Subscription continues normally

### 5. View Invoice History
- See all past invoices in table
- Filter by status: Paid, Open, Void, Draft
- Click eye icon to view full details
- Click download icon to get PDF

### 6. Download Invoice
1. Find invoice in table
2. Click download icon
3. PDF downloads automatically
4. See success notification

---

## 📱 Mobile Usage

### Phone (< 480px)
- Plans display one per row
- Tables scroll horizontally (swipe left/right)
- Modals are full-screen friendly
- Buttons are touch-optimized (44px minimum)

### Tablet (< 768px)
- Plans display two per row
- Subscription details stack vertically
- All features remain accessible

---

## 💳 Payment Information

### Supported Cards
- Visa
- Mastercard
- American Express
- Discover

### Security
- PCI-DSS compliant via Stripe
- No card details stored on frontend
- Encrypted transmission
- Tokenized payment processing

---

## 🎨 Visual Indicators

### Status Colors
- 🟢 **Green**: Active subscription, Paid invoices
- 🟡 **Yellow**: Past due, Open invoices, Cancellation warning
- 🔴 **Red**: Cancelled subscription, Failed payments
- 🔵 **Blue**: Trialing subscription, Draft invoices

### Plan Badges
- **Purple "Most Popular"**: Featured/recommended plan
- **Green "Current Plan"**: Your active plan
- **No badge**: Other available plans

---

## ⚡ Quick Actions

| Action | Steps | Result |
|--------|-------|--------|
| **Check next billing** | View subscription card → See "Next Billing Date" | Date displayed |
| **Upgrade plan** | Click plan card → Click "Upgrade" → Confirm | Plan changed, prorated charge |
| **View invoice** | Find invoice → Click eye icon | Modal with full details |
| **Download invoice** | Find invoice → Click download icon | PDF downloaded |
| **Cancel subscription** | Click "Cancel" → Choose option → Confirm | Subscription cancelled |
| **Reactivate** | Click "Reactivate" in warning banner | Cancellation reversed |

---

## 🔔 Notifications

### Success Messages
- ✅ "Subscription updated successfully!"
- ✅ "Subscription cancelled successfully"
- ✅ "Subscription reactivated successfully!"
- ✅ "Invoice downloaded successfully!"

### Info Messages
- ℹ️ "Downloading invoice..."

### Error Messages
- ❌ "Failed to update subscription. Please try again."
- ❌ "Failed to cancel subscription. Please try again."

---

## 🛠️ Troubleshooting

### "No Active Subscription" Message
- **Cause**: You don't have an active plan
- **Solution**: Scroll down and select a plan

### Can't Download Invoice
- **Cause**: Invoice is in draft status
- **Solution**: Wait for invoice to be finalized (status: Paid/Open)

### Upgrade Button Disabled
- **Cause**: You're viewing your current plan
- **Solution**: Choose a different plan

### Payment Failed
- **Cause**: Card declined or expired
- **Solution**: Update payment method or contact support

---

## 📊 Plan Comparison

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| **Price** | $0/mo | $29/mo | $99/mo | $299/mo |
| **SBOM Scans** | 5 | 50 | Unlimited | Unlimited |
| **Vuln Scans** | 10 | 100 | Unlimited | Unlimited |
| **Projects** | 1 | 10 | Unlimited | Unlimited |
| **Users** | 1 | 5 | 25 | Unlimited |
| **Support** | Community | Email | Priority | Dedicated |
| **API Access** | ❌ | ✅ | ✅ | ✅ |
| **SSO** | ❌ | ❌ | ✅ | ✅ |
| **Audit Logs** | ❌ | ❌ | ✅ | ✅ |

---

## 🔐 Security Notes

- All payments processed through Stripe (PCI Level 1)
- SSL/TLS encryption for all data transfer
- No sensitive card data stored locally
- Subscription changes require authentication
- Invoice downloads are user-specific

---

## 📞 Support

**Need Help?**
- Check invoice details for payment issues
- Review subscription status for access problems
- Contact admin for billing questions
- Check payment method for failed transactions

---

## ⌨️ Keyboard Shortcuts (Desktop)

- `Esc` - Close modal
- `Tab` - Navigate between buttons
- `Enter` - Confirm action on focused button
- `Space` - Toggle radio options

---

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 not supported

---

## 📅 Billing Cycle

### How It Works
1. **Subscription starts**: First payment charged
2. **Monthly billing**: Auto-charge on billing date
3. **Prorated changes**: If you upgrade/downgrade mid-cycle
4. **End of period**: Subscription renews automatically
5. **Cancellation**: Access until current period ends

### Proration Example
- Current plan: Starter ($29/mo), 15 days remaining
- Upgrade to: Professional ($99/mo)
- Charge today: ~$35 (prorated for 15 days)
- Next full charge: $99 on next billing date

---

## 💡 Tips

✨ **Upgrade anytime** - Prorated charges mean you only pay for what you use  
✨ **Cancel safely** - Choose "end of period" to keep access until billing date  
✨ **Download invoices** - Keep records for accounting/taxes  
✨ **Check status** - Green = good, Yellow = attention needed  
✨ **Compare plans** - Use the comparison modal before changing  

---

**Questions?** Check the full implementation summary in `TASK_3.3_IMPLEMENTATION_SUMMARY.md`
