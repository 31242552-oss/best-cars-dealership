# Best Cars Dealership – Full Stack Capstone

A production-ready full-stack automotive dealership application and review sentiment platform built with Django, React, Node.js/Express, MongoDB, and Flask.

## Overview

The **Best Cars Dealership** platform enables users to browse a national network of car dealerships, filter dealerships by state, view detailed inventory and customer reviews, write reviews with purchase history, and see real-time AI-powered sentiment analysis (positive, neutral, negative) on all feedback.

---

## Tech Stack

- **Backend Application**: Django 5 / Python 3.12, SQLite database, Django REST APIs, Django Admin
- **Frontend User Interface**: React (Vite build served directly by Django) and responsive static HTML pages (About & Contact) styled with Bootstrap 5
- **Dealer & Review Microservice**: Node.js, Express, MongoDB (Mongoose), containerized with Docker Compose
- **Sentiment Analysis Microservice**: Flask, NLTK VADER sentiment analyzer, containerized in Docker
- **DevOps & CI/CD**:
  - Dockerfiles for Django, Node/Mongo, and Flask
  - Docker Compose for multi-container database orchestration
  - Kubernetes `deployment.yaml` with Deployment & LoadBalancer Service
  - GitHub Actions CI workflow running `flake8` for Python and `jshint` for JavaScript

---

## Repository Structure

```text
├── .github/
│   └── workflows/
│       └── main.yml           # GitHub Actions CI (flake8 + jshint)
├── .env                       # Environment variables (secrets & URLs)
├── .env.example               # Example environment variables template
├── .flake8                    # Flake8 linter configuration
├── .gitignore                 # Git ignore rules
├── .jshintrc                  # JSHint linter configuration
├── README.md                  # Project documentation & execution guide
└── server/
    ├── Dockerfile             # Multi-stage Django containerfile
    ├── entrypoint.sh          # Docker startup script (migrations, collectstatic, gunicorn)
    ├── deployment.yaml        # Kubernetes Deployment and Service definitions
    ├── requirements.txt       # Python dependencies
    ├── manage.py              # Django management script
    ├── djangoproj/            # Django root project configuration
    │   ├── settings.py        # Settings (CORS, CSRF, TEMPLATES, STATICFILES_DIRS)
    │   ├── urls.py            # Primary URL dispatcher
    │   ├── wsgi.py            # WSGI application entrypoint
    │   └── asgi.py            # ASGI application entrypoint
    ├── djangoapp/             # Core Django dealership application
    │   ├── models.py          # CarMake and CarModel models
    │   ├── admin.py           # Admin interface registration & inlines
    │   ├── populate.py        # Data seeding script for 5 makes & 16+ models
    │   ├── restapis.py        # Microservice client adapters
    │   ├── views.py           # Auth, dealers, reviews, cars, sentiment views
    │   ├── urls.py            # Application URL patterns
    │   └── microservices/     # Flask Sentiment Analyzer microservice
    │       ├── app.py         # Flask VADER sentiment endpoint
    │       ├── Dockerfile     # Sentiment analyzer containerfile
    │       └── requirements.txt # Sentiment microservice dependencies
    ├── frontend/              # Frontend client
    │   ├── package.json       # React dependencies and build scripts
    │   ├── vite.config.js     # Build pipeline config targeting build/
    │   ├── index.html         # Frontend HTML entry point
    │   ├── static/            # Static HTML assets & CSS
    │   │   ├── About.html     # About page (company overview & team)
    │   │   ├── Contact.html   # Contact page (headquarters & form)
    │   │   └── style.css      # Custom styling
    │   ├── src/               # React application source code
    │   │   ├── App.jsx        # Routing & layout
    │   │   ├── components/    # Header, Dealers, Dealer, PostReview, Login, Register
    │   │   └── main.jsx       # React DOM root
    │   └── build/             # Production build served by Django
    └── database/              # Node.js Dealership & Reviews microservice
        ├── app.js             # Express API & Mongoose models
        ├── package.json       # Node dependencies
        ├── Dockerfile         # Node service containerfile
        ├── docker-compose.yml # Compose file for Mongo + Node API
        └── data/              # Seed data (dealerships.json & reviews.json)
```

---

## API Endpoints

### Django Endpoints (`/djangoapp` prefix)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/djangoapp/login` | Authenticate user and initiate session |
| `GET` | `/djangoapp/logout` | Terminate user session |
| `POST` | `/djangoapp/register` | Register a new user and log in |
| `GET` | `/djangoapp/get_dealers` | Fetch all dealerships |
| `GET` | `/djangoapp/get_dealers/<state>` | Fetch dealerships filtered by US state |
| `GET` | `/djangoapp/dealer/<id>` | Fetch single dealership details by ID |
| `GET` | `/djangoapp/reviews/dealer/<id>` | Fetch reviews with VADER sentiment scores |
| `POST` | `/djangoapp/add_review` | Post a customer review |
| `GET` | `/djangoapp/get_cars` | Fetch all car makes and models |
| `GET` | `/djangoapp/analyze/<text>` | Proxy text to sentiment microservice |

### Node / Express Endpoints (Port 3030)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/fetchDealers` | Return all dealerships from MongoDB / store |
| `GET` | `/fetchDealers/:state` | Return dealerships by state |
| `GET` | `/fetchDealer/:id` | Return dealer details by ID |
| `GET` | `/fetchReviews` | Return all reviews |
| `GET` | `/fetchReviews/dealer/:id`| Return reviews for given dealer ID |
| `POST` | `/insert_review` | Insert a new customer review |

### Sentiment Analyzer Endpoint (Port 5050 / 5000)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/analyze/<text>` | Analyzes text sentiment returning `{"sentiment": "positive|neutral|negative"}` |

---

## Local Setup & Quickstart Guide

### 1. Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ and npm
- Docker and Docker Compose (optional for local mock / full containers)

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start Dealer / Review Database Service
**Via Docker Compose:**
```bash
cd server/database
docker-compose up -d
```
*Or standalone without Docker (uses high-performance in-memory JSON fallback store):*
```bash
cd server/database
npm install
node app.js
```
The service will run on `http://localhost:3030`.

### 4. Start Sentiment Analyzer Microservice
```bash
cd server/djangoapp/microservices
pip install -r requirements.txt
python -c "import nltk; nltk.download('vader_lexicon')"
python app.py
```
The service will run on `http://localhost:5050` (or `http://localhost:5000`).

### 5. Build Frontend
```bash
cd server/frontend
npm install
npm run build
```
The compiled assets will be placed into `server/frontend/build` and served automatically by Django.

### 6. Start Django Backend Server
```bash
cd server
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python -c "import django; django.setup(); from djangoapp.populate import initiate; initiate()"
python manage.py runserver 8000
```
Open your browser at `http://localhost:8000` to access the full application.

---

## Running CI & Linting

Run Python code linting:
```bash
flake8 .
```

Run JavaScript code linting:
```bash
jshint server/database/app.js
```
