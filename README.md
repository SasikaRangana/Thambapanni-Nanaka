# 🪙 Thambapanni Nanaka Backend API

A modern, high-performance, asynchronous REST API engine built with **Python 3.11+**, **FastAPI**, **Supabase (PostgreSQL + Realtime)**, **Cloudinary**, and **WhatsApp Order Automation** for the **Thambapanni Nanaka** old currency (banknotes and antique coins) e-commerce & gallery platform.

---

## 🌟 Key Features

* **⚡ Ultra Fast & Async:** Built on FastAPI and Uvicorn with non-blocking I/O operations.
* **🛡️ Modular Public & Admin Separation:**
  * **Public APIs (`/api/currencies`):** Fast, paginated inventory search, country/year/category filters, and detail view enriched with automatic WhatsApp checkout links in **LKR**.
  * **Admin APIs (`/api/admin/...`):** Protected by secret token auth (`X-Admin-Token` or Bearer) for inventory CRUD and live `is_sold` toggles.
* **📸 Cloudinary Media Engine (`/api/admin/upload-image`):** Direct image uploads with automatic format optimization (`auto:best`, WebP/AVIF conversion) returning `secure_url`.
* **📲 WhatsApp Direct Checkout / Inquiry Generator:** Formats standardized order inquiry strings and instant `https://wa.me/{phone}?text={...}` links priced in **LKR**.
* **🔄 Realtime Synchronization Ready:** Supabase Realtime publication configured for Next.js instant frontend updates.
* **🚀 Ready for 1-Click Hosting:** Includes `Dockerfile`, `Procfile`, and `render.yaml` for Render, Railway, Fly.io, or VPS deployment.

---

## 📁 Project Structure

```
thambapanni-nanaka/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── currencies.py    # Admin CRUD & is_sold status toggle
│   │   │   └── uploads.py       # Cloudinary image upload endpoint
│   │   ├── public/
│   │   │   └── currencies.py    # Public catalog, filters & WhatsApp links
│   │   ├── deps.py              # Auth & dependency injection
│   │   └── router.py            # Central API router (/api/...)
│   ├── core/
│   │   ├── config.py            # Pydantic Settings & environment variables
│   │   └── security.py          # Admin token verification logic
│   ├── db/
│   │   ├── supabase.py          # Supabase client singleton
│   │   └── schema.sql           # Complete PostgreSQL schema, indexes & RLS
│   ├── schemas/
│   │   ├── common.py            # Standard & Paginated response models
│   │   ├── currency.py          # Pydantic schemas (CurrencyCreate, Update, PublicView)
│   │   └── upload.py            # Upload response model
│   ├── services/
│   │   ├── cloudinary_service.py # Cloudinary async upload & optimization
│   │   ├── currency_service.py   # Database queries & search operations
│   │   └── whatsapp_service.py   # LKR WhatsApp message & link builder
│   └── main.py                  # FastAPI entry point, CORS & lifespan
├── tests/
│   └── test_backend.py          # Pytest automated test suite
├── Dockerfile                   # Production multi-stage Docker container
├── Procfile                     # Process file for Render / Railway
├── render.yaml                  # 1-Click Render deployment specification
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
└── README.md                    # Project documentation
```

---

## 🛠️ Step 1: Supabase Setup

1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Open [`app/db/schema.sql`](file:///c:/Users/ALPHA/OneDrive/Desktop/yt%20videos/thambapanni%20nanaka/app/db/schema.sql), copy the entire SQL script, paste it into the SQL Editor, and click **Run**.
4. This will:
   * Create the `currencies` table with indexes for fast searching.
   * Configure Row-Level Security (RLS).
   * Enable `supabase_realtime` publication so your Next.js frontend can subscribe to live changes.
5. Go to **Project Settings -> API** to copy your **Project URL** and **anon/service_role API Key**.

---

## ⚙️ Step 2: Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
PROJECT_NAME="Thambapanni Nanaka API"
APP_ENV="development"
DEBUG=True
PORT=8000
HOST="0.0.0.0"

# CORS (Frontend URLs)
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-service-role-or-anon-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Admin Authentication Token
ADMIN_SECRET="your_secret_admin_token_here"

# WhatsApp & Currency
WHATSAPP_PHONE_NUMBER="94771234567"
DEFAULT_CURRENCY_SYMBOL="LKR"
```

---

## 💻 Step 3: Local Installation & Run

### 1. Create Virtual Environment
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

* **Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
* **Health Check:** [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

---

## 🧪 Step 4: Running Tests

Run the automated test suite:

```bash
pytest tests/ -v
```

---

## 📡 API Endpoints Reference

### 🌐 Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/currencies` | Browse active catalog (supports filters: `country`, `year`, `category`, `min_price`, `max_price`, `condition_grade`, `is_sold`, `search`, `page`, `limit`) |
| `GET` | `/api/currencies/{id}` | Get single item details by UUID or `itemCode`, including pre-formatted WhatsApp link |
| `GET` | `/api/currencies/meta/countries` | Get list of distinct origin countries for UI dropdowns |
| `GET` | `/api/health` | Service health status |

### 🔒 Admin Endpoints (Requires `X-Admin-Token` or Bearer Token)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/currencies` | Add a new coin/banknote item |
| `PUT` | `/api/admin/currencies/{id}` | Update existing currency details |
| `PUT` | `/api/admin/currencies/{id}/status` | Toggle or update `is_sold` status |
| `DELETE`| `/api/admin/currencies/{id}` | Delete a currency item |
| `POST` | `/api/admin/upload-image` | Upload image to Cloudinary & get `secure_url` |

#### Admin Authentication Example:
Include either of these headers in admin requests:
```http
X-Admin-Token: your_secret_admin_token_here
```
or
```http
Authorization: Bearer your_secret_admin_token_here
```

---

## 🚀 Hosting & Deployment Guide

### Option 1: Deploy to Render (Recommended & Free/Low-Cost)
1. Push this repository to GitHub / GitLab.
2. Log in to [Render](https://render.com).
3. Click **New +** -> **Blueprint** and select your repository (Render automatically reads `render.yaml`).
4. Set your environment variables (`SUPABASE_URL`, `SUPABASE_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_SECRET`, `WHATSAPP_PHONE_NUMBER`).
5. Render will automatically build and deploy your API with free HTTPS!

### Option 2: Deploy with Docker
```bash
# Build the Docker container
docker build -t thambapanni-nanaka-backend .

# Run container
docker run -d -p 8000:8000 --env-file .env thambapanni-nanaka-backend
```

### Option 3: Deploy to Railway / Fly.io / Koyeb
Simply connect your GitHub repo to Railway or Fly.io; the provided `Procfile` and `Dockerfile` are automatically detected.

---

## 🔗 Next.js Frontend Integration Note (Supabase Realtime)

Your Next.js frontend can subscribe to live changes on the `currencies` table using the Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Subscribe to real-time status/inventory changes
const channel = supabase
  .channel('currencies-live')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'currencies' },
    (payload) => {
      console.log('Realtime inventory change received:', payload)
    }
  )
  .subscribe()
```
