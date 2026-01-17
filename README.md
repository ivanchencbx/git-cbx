# cbx.life

A unified specialized life platform.

## Architecture

- **Monorepo**: Managed by Bazel.
- **Backend**: Python (FastAPI), SQLAlchemy, PostgreSQL (pgvector).
- **Frontend**: TypeScript, Next.js, Vanilla CSS.
- **Infrastructure**: Docker for database.

## Prerequisites

- Docker & Docker Compose
- Python 3.10+
- Node.js 18+
- Bazel (Optional, can run components individually)

## Quick Start (PowerShell Scripts)

We provide handy PowerShell scripts for managing the application:

- **Start**: `.\start.ps1` (Starts services without re-installing dependencies)
- **Stop**: `.\Stop.ps1` (Stops all Python and Node processes)
- **Restart**: `.\restart.ps1` (Kills processes, updates deps, and restarts)

## Setup & Run

### 1. Database

Start the PostgreSQL container:

```bash
docker-compose up -d
```

This starts the DB on port `5432`.

### 2. Backend (Server)

Navigate to `server/` or run via root:

```bash
# Install dependencies
pip install -r server/requirements.txt

# Run Server (Development)
cd server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

*Note: `--host 0.0.0.0` is required for mobile LAN access.*

### 3. Frontend (Web)

Navigate to `web/` or run via root:

```bash
# Install dependencies
cd web
npm install

# Run Next.js (Development)
npm run dev
```

The app will be available at `http://localhost:3000`.
On mobile, access via `http://172.20.10.2:3000` (Your detected LAN IP).
Ensure your phone is on the same Wi-Fi.

## Modules

- **Portal**: Main Dashboard.
- **SurveyStar**: Survey/Form Builder.
- **Accounting**: Expense Tracker.
- **Job Hunter**: Career & Application Tracker.
- **SupplyStar**: Inventory & Shopping List.

## Mobile Notes

- The frontend `apiClient` automatically detects the backend URL.
- Ensure your mobile device is on the same Wi-Fi as your PC.
- Access the app using your PC's local IP address (e.g., `192.168.1.5:3000`).
