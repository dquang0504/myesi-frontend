// src/config/sidebarMenu.js
const sidebarMenus = {
  admin: [
    { name: "Dashboard", path: "/admin-dashboard" },
    { name: "User Management", path: "/admin/users" },
    { name: "System Logs", path: "/admin/logs" },
    { name: "Reports", path: "/admin/reports" },
  ],

  analyst: [
    { name: "Dashboard", path: "/analyst-dashboard" },
    { name: "Vulnerability Insights", path: "/analyst/insights" },
    { name: "Risk Analysis", path: "/analyst/risk" },
    { name: "Reports", path: "/analyst/reports" },
  ],

  developer: [
    { name: "Dashboard", path: "/developer-dashboard" },
    { name: "My Projects", path: "/developer/projects" },
    { name: "Vulnerability List", path: "/developer/vulnerabilities" },
  ],

  auditor: [
    { name: "Dashboard", path: "/auditor-dashboard" },
    { name: "Compliance Overview", path: "/auditor/compliance" },
    { name: "Reports", path: "/auditor/reports" },
  ],
};

export default sidebarMenus;
