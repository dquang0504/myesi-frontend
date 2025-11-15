# Notification Center - Visual Guide

## 🔔 How It Looks

### **1. Notification Bell Icon (Navbar)**
```
┌─────────────────────────────────────────┐
│  Dashboard  Reports  [🔔 3]  ⚙️       │  ← Navbar
└─────────────────────────────────────────┘
                        ↑
                   Badge with
                   unread count
```

### **2. Notification Dropdown (Opened)**
```
┌─────────────────────────────────────────┐
│  Notifications        Mark all read     │
├─────────────────────────────────────────┤
│  [All] [Unread (3)] [CVEs] [Payments]  │
├─────────────────────────────────────────┤
│  🔴  Critical CVE Detected      • New   │
│      CVE-2024-1234: Remote Code...      │
│      CVSS: 9.8           15m ago        │
├─────────────────────────────────────────┤
│  🔴  Payment Failed                     │
│      Your payment of $199.00 failed     │
│                      30m ago        [×] │
├─────────────────────────────────────────┤
│  🟠  High Severity CVE                  │
│      CVE-2024-5678: SQL Injection       │
│      CVSS: 9.2            2h ago        │
├─────────────────────────────────────────┤
│         View All Notifications          │
└─────────────────────────────────────────┘
```

### **3. Full Notifications Page**
```
┌───────────────────────────────────────────────────┐
│  Notifications                                    │
│  Stay updated on critical CVEs and billing events│
│                     [⚙️ Settings] [✓ Mark All]   │
├───────────────────────────────────────────────────┤
│  ⚙️ Notification Preferences                     │
│  ☑ Email Notifications                           │
│  ☑ Critical CVEs (CVSS ≥ 9.0)                    │
│  ☑ Payment Failures                              │
│  ☐ Medium CVEs                                   │
├───────────────────────────────────────────────────┤
│  [All (7)] [Unread (3)] [CVE Alerts] [Payments]  │
├───────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐ │
│  │ 🔴  Critical CVE Detected          [New]    │ │
│  │     CVE-2024-1234: Remote Code Execution... │ │
│  │     CVSS: 9.8  CVE-2024-1234  15 mins ago  │ │
│  └─────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────┐ │
│  │ 🔴  Payment Failed                          │ │
│  │     Your payment of $199.00 failed.        │ │
│  │     Update your payment method.            │ │
│  │     30 mins ago                        [🗑️]│ │
│  └─────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```

## 🎨 Color Scheme

### **Severity Colors**
- 🔴 **Critical**: Red gradient (#ef4444 → #dc2626)
- 🟠 **High**: Orange gradient (#f97316 → #ea580c)
- 🟡 **Warning**: Yellow gradient (#f59e0b → #d97706)
- 🔵 **Info**: Blue gradient (#3b82f6 → #2563eb)

### **Notification Types → Colors**
| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `cve_critical` | ⚠️ | Red | CVSS ≥ 9.0 |
| `cve_high` | ⚠️ | Orange | CVSS 7.0-8.9 |
| `payment_failed` | 💰 | Red | Failed payments |
| `subscription_expiring` | ⏰ | Yellow | Expires in 3 days |
| `payment_success` | ✅ | Blue | Successful payment |
| `invoice_available` | 📄 | Blue | New invoice ready |

## 📱 Responsive Views

### **Desktop (> 768px)**
- Dropdown: 420px wide, positioned right
- Full page: Centered container (1400px max)
- Grid: 2-3 columns for settings

### **Tablet (480-768px)**
- Dropdown: 360px wide
- Grid: 1-2 columns
- Reduced spacing

### **Mobile (< 480px)**
- Dropdown: Full viewport width
- Grid: Single column
- Stacked layout
- Delete button always visible

## 🚀 User Flows

### **Flow 1: View Notifications**
1. User clicks bell icon in navbar
2. Dropdown opens showing recent notifications
3. Badge shows unread count (e.g., "3")
4. User scans notifications
5. User clicks "View All Notifications"
6. Full page opens with all notifications

### **Flow 2: Mark as Read**
1. User sees unread notification (purple dot)
2. User clicks notification
3. Notification marked as read automatically
4. Badge count decrements (3 → 2)
5. User navigates to actionUrl (e.g., /admin/dashboard)

### **Flow 3: Manage Preferences**
1. User opens full notifications page
2. User clicks "Settings" button
3. Settings panel expands
4. User toggles preferences (e.g., disable Medium CVEs)
5. Preferences save automatically
6. Toast: "Notification preferences updated"

### **Flow 4: Delete Notification**
1. User hovers over notification card
2. Delete button (🗑️) appears
3. User clicks delete
4. Notification removed from list
5. Toast: "Notification deleted"

## 🔔 Notification Examples

### **Critical CVE Alert**
```
┌──────────────────────────────────────┐
│ 🔴  Critical CVE Detected       • New│
│                                      │
│ CVE-2024-1234: Remote Code Execution│
│ vulnerability found in OpenSSL 3.0.1│
│                                      │
│ [CVSS: 9.8] 15m ago                 │
└──────────────────────────────────────┘
```

### **Payment Failed Alert**
```
┌──────────────────────────────────────┐
│ 🔴  Payment Failed                   │
│                                      │
│ Your payment of $199.00 for         │
│ Professional Plan failed. Please    │
│ update your payment method.         │
│                                      │
│ 30m ago                          [×]│
└──────────────────────────────────────┘
```

### **Subscription Expiring Warning**
```
┌──────────────────────────────────────┐
│ 🟡  Subscription Expiring Soon  • New│
│                                      │
│ Your Professional Plan subscription │
│ will expire in 3 days. Renew now to │
│ avoid service interruption.         │
│                                      │
│ 12h ago                             │
└──────────────────────────────────────┘
```

## ⚡ Interactive Elements

### **Hover States**
- Bell icon: Background color changes
- Notification card: Background lightens
- Delete button: Appears on hover (desktop)
- Filter buttons: Border color changes

### **Active States**
- Filter button: Purple gradient background
- Unread notification: Purple highlight background
- Current page: Highlighted in sidebar

### **Disabled States**
- "Mark all read" button: Grayed out when 0 unread
- Delete button during deletion: Spinner icon

## 🎯 Key Features Visualized

### **Badge Animation**
```
Normal → Pulse → Normal
  (1)      (1.1)     (1)
Scale: 1.0 → 1.1 → 1.0
Duration: 2s loop
```

### **Dropdown Animation**
```
Closed → Opening → Open
         ↓         ↓
    opacity: 0 → 1
    translateY: -10px → 0
Duration: 0.2s ease-out
```

### **Toast Notification**
```
┌─────────────────────────────────┐
│ ✅ Notification marked as read  │  ← Top-right
└─────────────────────────────────┘
Auto-dismiss: 3 seconds
```

## 📊 Notification Stats (Mock Data)

- **Total Notifications**: 7
- **Unread**: 3
- **CVE Alerts**: 3 (2 critical, 1 high)
- **Payment Events**: 4

### **Distribution**
- Critical: 3 (43%)
- Warning: 1 (14%)
- Info: 3 (43%)

---

**Visual Design Credits**: Based on modern SaaS notification patterns  
**Icons**: Heroicons (MIT License)  
**Color Palette**: Tailwind CSS inspired
