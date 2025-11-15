**MyESI** **—** **Week** **4** **Development** **Plan**

**Goal:**

Deliver the **final** **functional** **build** of MyESI — completing all
backend, frontend, and infrastructure features.

By the end of Week 4, the entire flow *User* *→* *Project* *→* *SBOM*
*→* *Vulnerability* *→* *Risk* *→* *Report* *→* *Billing* must be
**fully** **functional** in a **production-ready** **staging**
environment, compliant with **PCI-DSS** **v4.0.1** and **ISO**
**27001**.

**1.** **Infrastructure** **&** **DevOps** **—** **Production**
**Readiness**

> **Task**
>
> **1.1** **—** **Provision** **Production** **Cluster** **(K8s)**
>
> **1.2** **—** **Enable** **Full** **mTLS** **Between** **Services**
>
> **1.3** **—** **Backup** **&** **Data** **Retention** **Policy**
>
> **1.4** **—** **Logging** **&** **Alerting** **for** **Prod**
>
> **1.5** **—** **Secrets** **Rotation**
>
> **Pipeline**
>
> **Description**

Create a production namespace with real secrets (Stripe Live, JWT, DB
credentials). Enable autoscaling and monitoring.

Enforce mTLS (Istio / Linkerd) between all microservices to comply with
PCI-DSS Requirement 4.

Configure daily DB backups (PostgreSQL + Redis snapshots) with AES-256
encryption.

Extend Promtail → Loki → Grafana pipelines; forward audit logs to
Elasticsearch to satisfy PCI-DSS Req 10.

Integrate Vault + ArgoCD sync for automatic API

key and token rotation.

> **Dependencie** **s**

Week 3 staging cluster

1.1

1.1

Week 3 logging

—

> **Priority**

**High**

**High**

**Medium**

**High**

**Medium**

> **Deliverable**

Production environment live at prod.myesi.clou d

Verified encrypted inter-service traffic

Backup logs + restore verification report

Real-time dashboards + alerting rules

Vault rotation tested

successfully

**2.** **Backend** **—** **Final** **Features** **&** **Compliance**
**Hardening**

> **Task**
>
> **2.1** **—** **Stripe** **Live** **Mode** **Activation**
>
> **2.2** **—** **RBAC** **&** **Admin** **Panel** **APIs**
>
> **2.3** **—** **Full** **Audit** **Trail** **Persistence**
>
> **2.4** **—** **PCI-DSS** **Encryption** **&** **Key** **Management**
>
> **2.5** **—** **Rate** **Limiting** **&** **Security** **Tests**
>
> **2.6** **—** **Notification** **Service** **(Email/Webhook)**
>
> **2.7** **—** **Data** **Export**
>
> **/** **Import** **Tools**
>
> **Description**

Configure Stripe Live API keys; run real low-value test transactions.

Finalize Role-Based Access Control (Admin/Analyst/User) and endpoints
(/api/admin/users, /api/admin/audit).

Log user, report, and billing actions to Elasticsearch + PostgreSQL
hybrid storage.

Apply AES-256 encryption to sensitive data (billing, user info); manage
keys in Vault.

Enable slowapi rate limiter at API Gateway; run DDoS and

token-expiry tests.

Send alerts for critical CVEs (≥ 9.0) and billing failures via
Celery/SMTP.

Provide /api/export/sbom and /api/export/vuln endpoints (JSON/CSV) for

audit and compliance use.

> **Dependencie** **s**

Billing service stable

Auth module ready

1.4

1.5

Week 3 gateway

Risk + Billing

SBOM / Vuln

ready

> **Priority**

**High**

**High**

**High**

**High**

**Medium**

**Medium**

**Low**

> **Deliverable**

Successful live payment + invoice receipt

Role-based access verified via JWT claims

Kibana dashboard showing full audit history

Verified PCI-DSS

Requirement 3 compliance

\< 1% error at 200 req/s load

Email alerts received successfully

Downloadable exports from

dashboard

**3.** **Frontend** **—** **Final** **UI** **&** **Production**
**Integration**

> **Task**
>
> **3.1** **—** **Unified** **Dashboard** **Layout**
>
> **3.2** **—** **Admin** **Console** **(RBAC** **UI)**
>
> **3.3** **—** **Billing** **Portal** **(Stripe** **Live)**
>
> **3.4** **—** **Notification** **Center**
>
> **3.5** **—** **UI/UX** **Polish** **&**
>
> **Accessibility**
>
> **Description**

Integrate all modules (SBOM, Vuln, Risk, Billing, Reports) into one
responsive React dashboard.

Add user management, audit log, and subscription status views.

Show invoices, subscription status, and plan upgrade/cancel buttons.

Implement toast alerts and notification icon for CVEs and payment
events.

Review responsiveness, ARIA labels, dark mode,

and error boundaries.

> **Dependencie** **s**

All backend APIs

2.2 + 2.3

2.1

2.6

—

> **Priority**

**High**

**High**

**High**

**Medium**

**Low**

> **Deliverable**

Fully functional enterprise dashboard

Working Admin panel with live API data

Live payment validated via UI

Real-time notifications visible

Production-qualit y front end ready

for demo

**4.** **Security** **&** **Quality** **Assurance**

> **Task**
>
> **4.1** **—** **Penetration** **Test** **(OWASP** **+** **PCI-DSS)**
>
> **4.2** **—** **PCI-DSS** **Self-Assessment** **(SAQ** **A)**
>
> **4.3** **—** **End-to-End**
>
> **Regression** **Tests**
>
> **Description**

Conduct web security tests (XSS, SQLi, CSRF, privilege escalation).

Complete PCI-DSS v4.0.1 Self-Assessment Questionnaire for Stripe
integration.

Validate complete workflow (Login → Upload SBOM → Detect Vuln →

Report → Checkout).

> **Dependenci** **es**

2.2 + 2.5

2.4

Week 3 E2E

> **Priority**

**High**

**High**

**High**

> **Deliverable**

Penetration test report — no critical issues

Completed and signed SAQ A document

≥ 95 % pytest

pass rate

> **4.4** **—** **Performance** **&** **Load** **Test**
>
> **4.5** **—** **Data** **Privacy** **Review** **(GDPR** **+** **ISO**
>
> **27001)**

Test 10 k SBOM records 1.1 with target \< 400 ms

average response time.

Ensure users can request 2.4 data deletion and privacy

export.

**Medium** Load test summary documented

**Medium** Privacy compliance checklist

> approved

**End-of-Week** **4** **Deliverables**

> **Area**
>
> **Infrastructure**
>
> **Backend**
>
> **Frontend**
>
> **Security** **&** **QA**
>
> **Overall**
>
> **Deliverable**

Production cluster active, mTLS enabled, automated backups

All APIs live, Stripe operational, encryption in place

Unified dashboard and admin console fully connected

PCI-DSS and ISO 27001 readiness confirmed

MyESI Production-Ready Build v1.0-RC

> **Verification**

Verified via Helm & Grafana

Postman + Kibana validation

UI demo recording

Audit and test reports

CI/CD green + successful

team demo
