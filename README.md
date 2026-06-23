# ALFA DARK JOYERÍA — Plataforma E-Commerce Premium

Plataforma e-commerce empresarial y escalable para la venta de joyas premium. Desarrollada siguiendo los principios SOLID, Clean Architecture y patrón de repositorio.

## 🌟 Arquitectura

\`\`\`mermaid
graph TB
    subgraph Frontend["Frontend (React + Vite)"]
        Pages --> Components
        Pages --> Hooks
        Hooks --> Services
        Services --> API["Axios API Client"]
        Store["Zustand Store"]
    end
    
    subgraph Backend["Backend (NestJS)"]
        Controllers --> ServicesB["Services"]
        ServicesB --> Repositories
        Repositories --> Prisma["Prisma ORM"]
        Guards --> Controllers
        Middleware --> Controllers
    end
    
    API -->|REST API| Controllers
    Prisma -->|PostgreSQL| Supabase[(Supabase DB)]
    ServicesB -->|Storage| SupabaseStorage[(Supabase Storage)]
    ServicesB -->|Payments| Stripe[Stripe API]
\`\`\`

## 🚀 Tecnologías Principales

**Frontend**
- React 18 + Vite
- TypeScript Estricto
- Tailwind CSS v3
- Zustand (Global State)
- React Query (Server State)
- React Router DOM
- Framer Motion

**Backend**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Auth (Passport & Bcrypt)
- Swagger (OpenAPI)
- Stripe
- Class-Validator

## 🛠️ Instalación y Configuración

### 1. Variables de Entorno (Backend)

Crea un archivo \`.env\` en el directorio \`backend/\` usando el \`.env.example\` provisto:

\`\`\`env
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
JWT_SECRET="super-secret-key-alfa-dark"
JWT_EXPIRATION="7d"
PORT=3000
FRONTEND_URL="http://localhost:5173"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
\`\`\`

### 2. Variables de Entorno (Frontend)

Crea un archivo \`.env\` en el directorio \`frontend/\`:

\`\`\`env
VITE_API_URL="http://localhost:3000/api/v1"
VITE_STRIPE_PUBLIC_KEY="pk_test_..."
\`\`\`

### 3. Levantar Backend

\`\`\`bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
\`\`\`
El backend estará disponible en \`http://localhost:3000\`.
Documentación Swagger disponible en \`http://localhost:3000/api/v1/docs\`.

### 4. Levantar Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
El frontend estará disponible en \`http://localhost:5173\`.

## 🛡️ Seguridad Implementada
- JWT Authentication
- Role Based Access Control (RBAC) con Guards
- Rate Limiting
- Helmet (Security Headers)
- CORS estricto
- Validación de DTOs
- Contraseñas encriptadas con Bcrypt

---
**Desarrollado con ❤️ para Alfa Dark Joyería**
