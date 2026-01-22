# Implementation Plan - cbx.life (慈贝瑆.生活)

## Branding

![cbx.life Logo](c:/Users/ThinkPad/.gemini/antigravity/brain/790d3a68-d7f3-47de-bfef-ce50c47444cc/cbx_life_logo_v3_1768637161608.png)

## UI/UX Design System

- **Primary Color (Compassion Purple)**: `#7A65B4` (Muted Violet)
- **Secondary Color (Warm Gray)**: `#86817E`
- **Design Philosophy**: Minimalist, universally approachable, "Life & Compassion".
- **Typography**: Clean, rounded sans-serif (e.g., Inter or Outfit).

## Goal

Build a unified 2C platform "cbx.life" accessible via PC, Mobile Web, and Native Apps (iOS/Android wrappers). The platform aims to bring AI convenience to the working class.

## Architecture

- **Build System**: Bazel (Monorepo)
- **Backend**: Python (FastAPI/Django) - *To be confirmed based on "pytest" preference*
- **Frontend**: Next.js (React) - *Optimized for Responsive & PWA*
- **Database**: PostgreSQL (Confirmed)
- **Mobile Strategy**: Responsive Web App (PWA) + Capacitor/Expo for Native Wrapping if needed.

## User Review Required
>
> [!IMPORTANT]
> **Ready to Start?**:
> I am ready to start development upon your explicit request.

## Proposed Structure

### Root

- `WORKSPACE` / `MODULE.bazel`
- `server/` (Python Backend)
- `web/` (Next.js Frontend)
- `shared/` (Proto definitions / Shared logic)

## System Architecture

```mermaid
graph TD
    User((User))
    
    subgraph Clients
        PC[PC Browser]
        MobileWeb[Mobile Web / PWA]
        App[iOS / Android Wrapper]
    end
    
    subgraph "cbx.life Platform (Bazel Monorepo)"
        LB[Load Balancer / Ingress]
        
        subgraph "Frontend (Next.js)"
            WebPortal[Unified Portal & Auth]
        end
        
        subgraph "Backend (Python)"
            API[FastAPI Gateway]
            
            subgraph Modules
                Auth[Auth Service]
                Survey[SurveyStar]
                Account[Accounting]
                Job[CareerDev]
                Pantry[SupplyStar]
            end
        end
        
        DB[(PostgreSQL)]
    end
    
    User --> PC
    User --> MobileWeb
    User --> App
    
    PC --> LB
    MobileWeb --> LB
    App --> LB
    
    LB --> WebPortal
    WebPortal --> API
    
    API --> Auth
    API --> Survey
    API --> Account
    API --> Job
    API --> Pantry
    
    Auth --> DB
    Survey --> DB
    Account --> DB
    Job --> DB
    Pantry --> DB
```

### Modules

1. **Auth**: Unified login (Email, Phone, Google, WeChat?).
2. **Portal**: Dashboard.
3. **SurveyStar (问卷瑆)**: Survey management.
4. **Accounting (代账王)**: Expense tracking, tax, utilities.
5. **CareerDev (工作珄)**: AI job search & apply.
6. **SupplyStar (补给瑆)**: Grocery & habit tracking.

## Verification Plan

### Automated Tests

- `pytest` for Backend.
- `jest` / `playwright` for Frontend.
- Bazel `test` targets.

### Manual Verification

- Mobile responsiveness check (Chrome DevTools Device Mode).
- Touch interaction check.
- Network access via LAN IP (not localhost).
