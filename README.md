<div align="center">

# NdaCampaignDemo

**IMPORTANT: Simplified/Abridged DEMO version. Some sensitive code has deliberately been removed. But the main logic and functionality are here**

**An integrated platform for managing tabletop RPG campaigns with power and elegance**

</div>

---

## 🎭 What is NdaCampaignDemo?

**NdaCampaignDemo** is a comprehensive, modern platform designed for **Game Masters** and **Players** to manage tabletop RPG campaigns like never before. Born from the chaos of scattered notes, forgotten character sheets, and lost session summaries, NdaCampaignDemo brings everything into one **beautiful**, **organized**, and **powerful** workspace.

> **💡 The Problem:** Running a D&D campaign means juggling character sheets, NPC notes, session logs, maps, inventory lists, and storylines across multiple apps, documents, and notebooks.

> **✨ The Solution:** NdaCampaignDemo unifies everything into one seamless platform — with a powerful web dashboard for Game Masters and an elegant mobile app for Players.

---

## 🌟 Features

### 🎯 For Game Masters (Web Dashboard)

<div align="center">

| Feature | Description |
|---------|-------------|
| 📚 **Campaign Management** | Create, organize, and manage multiple campaigns with rich descriptions and custom settings |
| 🧙 **Character Sheets** | Build detailed character sheets with full D&D 5e attributes, skills, and inventories |
| 👥 **NPC Database** | Track NPCs with relationships, roles, and detailed backgrounds |
| ⚔️ **Item Management** | Manage weapons, armor, artifacts, and consumables with rarity and properties |
| 📖 **Session Logs** | Record session summaries, important notes, and story milestones |
| 🗺️ **Media Gallery** | Upload and organize maps, character art, and campaign visuals |
| 👫 **Player Invitations** | Invite players to campaigns with simple email invitations |

</div>

### 📱 For Players (Mobile App)

<div align="center">

| Feature | Description |
|---------|-------------|
| 🎲 **Character Sheet** | View your character's attributes, skills, inventory, and history on the go |
| 🎒 **Inventory Tracker** | See all your items, equipment, and consumables in one place |
| 📜 **Campaign Journal** | Read session summaries and track the story as it unfolds |
| 🗺️ **Maps & Images** | Access campaign maps and artwork with zoom and full-screen viewing |

</div>

---

## 🏗️ Tech Stack

<div align="center">

```mermaid
graph TB
    subgraph Frontend["🌐 Web Application"]
        A[React + TypeScript]
        B[TailwindCSS + Shadcn/UI]
        C[Zustand State Management]
        D[Axios HTTP Client]
    end
    
    subgraph Mobile["📱 Mobile Application"]
        E[React Native + Expo]
        F[TypeScript]
        G[Zustand]
    end
    
    subgraph Backend["⚙️ Backend API"]
        H[NestJS + TypeScript]
        I[JWT Authentication]
        J[TypeORM]
    end
    
    subgraph Database["🗄️ Database"]
        K[(PostgreSQL)]
    end
    
    Frontend --> Backend
    Mobile --> Backend
    Backend --> Database
    
    style Frontend fill:#61dafb22,stroke:#61dafb,stroke-width:2px
    style Mobile fill:#61dafb22,stroke:#61dafb,stroke-width:2px
    style Backend fill:#e0234e22,stroke:#e0234e,stroke-width:2px
    style Database fill:#31619222,stroke:#316192,stroke-width:2px
```

</div>

### 🎨 Frontend Stack

- **Framework:** React 19 with TypeScript
- **Styling:** TailwindCSS + Shadcn/UI component library
- **State Management:** Zustand
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Build Tool:** Vite

### 📱 Mobile Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Zustand
- **HTTP Client:** Axios

### ⚙️ Backend Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5
- **Database:** PostgreSQL
- **ORM:** TypeORM (with Prisma schema reference)
- **Authentication:** JWT (Access + Refresh Tokens) with Passport
- **Security:** Bcrypt, Helmet
- **API Documentation:** Swagger/OpenAPI

### 🛠️ Development Tools

- **Version Control:** Git + GitHub
- **Testing:** Jest (Backend & Frontend), React Testing Library
- **Code Quality:** ESLint, Prettier
- **Containerization:** Docker + Docker Compose

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20+)
- **PostgreSQL** (v14+)
- **npm** or **yarn**
- **Docker** (optional, for containerized setup)

### 📦 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/invirial-com/nda-rpg-campaign-demo.git
cd nda-rpg-campaign-demo
```

#### 2️⃣ Set Up the Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Configure your database credentials in .env
# DATABASE_URL=postgresql://user:password@localhost:5432/NdaCampaignDemo

# Run migrations
npm run typeorm migration:run

# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:3000`

#### 3️⃣ Set Up the Frontend

```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

The web app will be available at `http://localhost:5173`

#### 4️⃣ Set Up the Mobile App (Optional)

```bash
cd ../mobile
npm install

# Start Expo
npx expo start
```

### 🐳 Docker Setup (Alternative)

For a quick setup using Docker:

```bash
# From the root directory
docker-compose up -d

# This will start:
# - PostgreSQL database on port 5432
# - API server on port 3000
# - Web application on port 5173
```

---

## 📖 Documentation

### 📚 API Documentation

Once the backend is running, visit the Swagger documentation at:

```
http://localhost:3000/api/docs
```

### 🗂️ Project Structure

```
nda-rpg-campaign-demo/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── campaigns/   # Campaign management
│   │   ├── characters/  # Character management
│   │   ├── users/       # User management
│   │   └── database/    # Database configuration
│   └── package.json
│
├── frontend/            # React web application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities & helpers
│   │   └── assets/      # Static assets
│   └── package.json
│
├── mobile/              # React Native mobile app
│   └── package.json
│
├── database/            # Database schemas
│   ├── schema.prisma    # Prisma schema
│   └── database-schema.sql
│
├── documents/           # Project documentation
└── docker-compose.yml
```

### 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend/Mobile
    participant API as Backend API
    participant DB as PostgreSQL

    U->>F: Login Request
    F->>API: POST /auth/login
    API->>DB: Verify Credentials
    DB-->>API: User Data
    API-->>F: Access Token + Refresh Token
    F->>F: Store Tokens
    F->>API: Authenticated Requests (with Access Token)
    API-->>F: Protected Resources
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Follow the existing code structure and naming conventions
- Use TypeScript for all new code
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 👨‍💻 Author

**Invirial**

- GitHub: [@Invirial](https://github.com/invirial-com)
- Project: [nda-rpg-campaign-demo](https://github.com/invirial-com/nda-rpg-campaign-demo)

---

## 🙏 Acknowledgments

- **Professor Gabriel Barros** - Technical Course in Systems Development
- **Final Integrating Project** - November 2025
- Inspired by the amazing tabletop RPG community

---
