# 🌟 PaimonGuide TH — คู่มือ Genshin Impact ภาษาไทย

> แฟนวิกิ Genshin Impact ภาษาไทยแบบไม่เป็นทางการ สร้างด้วย Next.js, Supabase & Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)](https://supabase.com/)

---

## 📖 เกี่ยวกับโปรเจกต์

PaimonGuide TH เป็นเว็บไซต์ฐานข้อมูล Genshin Impact ภาษาไทย ที่รวบรวมข้อมูลตัวละคร อาวุธ อาร์ติแฟกต์ และบิลด์แนะนำ โดยดึงข้อมูลจาก [genshin.jmp.blue API](https://genshin.jmp.blue/) แล้วเพิ่มคำแปลภาษาไทยเข้าไป

### ✨ Features

- 🎭 **ตัวละคร** — ข้อมูลสกิล, กลุ่มดาว, สเตตัส, วัสดุอัปเกรด
- ⚔️ **อาวุธ** — สเตตัส, ความสามารถพิเศษ, การเสริมพลัง
- 🏺 **อาร์ติแฟกต์** — เซตโบนัส, ชิ้นส่วน, สเตตัสหลัก/รอง
- 🔧 **บิลด์แนะนำ** — ทีม, อาวุธ, อาร์ติแฟกต์ที่เหมาะสม
- 🔍 **ค้นหา** — ค้นหาข้ามหมวดหมู่แบบ Real-time
- 🌙 **Dark Mode** — รองรับธีมมืด/สว่าง
- 📱 **Responsive** — รองรับทุกขนาดหน้าจอ
- 🇹🇭 **ภาษาไทย** — เนื้อหาทั้งหมดเป็นภาษาไทย

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS 4 |
| **Database** | Supabase (PostgreSQL) |
| **State** | Zustand + TanStack Query |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Package Manager** | pnpm |

---

## 📁 โครงสร้างโปรเจกต์

```
PaimonGuideTH/
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/               # App Router pages & API routes
│   │   │   ├── api/           # REST API endpoints
│   │   │   ├── characters/    # หน้าตัวละคร
│   │   │   ├── weapons/       # หน้าอาวุธ
│   │   │   ├── artifacts/     # หน้าอาร์ติแฟกต์
│   │   │   ├── builds/        # หน้าบิลด์
│   │   │   └── search/        # หน้าค้นหา
│   │   ├── components/        # React Components
│   │   │   ├── common/        # Shared UI components
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── providers/     # Context Providers
│   │   │   ├── characters/    # Character-specific components
│   │   │   ├── weapons/       # Weapon-specific components
│   │   │   └── artifacts/     # Artifact-specific components
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── stores/            # Zustand State Stores
│   │   ├── lib/               # Utilities & API clients
│   │   ├── types/             # TypeScript type definitions
│   │   └── config/            # Site configuration
│   ├── public/                # Static assets
│   └── next.config.ts         # Next.js configuration
│
├── backend/                    # Backend Services
│   ├── supabase/
│   │   └── migrations/        # SQL migration files (001-009)
│   ├── services/              # Business logic services
│   ├── scripts/               # Data seeding & sync scripts
│   └── package.json
│
├── .vscode/                   # VS Code workspace settings
├── .gitignore
├── .prettierrc
└── README.md
```

---

## 🚀 เริ่มต้นใช้งาน

### Prerequisites

- **Node.js** ≥ 18.17
- **pnpm** ≥ 9.0 (`npm install -g pnpm`)
- **Supabase** account ([supabase.com](https://supabase.com))

### 1. Clone Repository

```bash
git clone https://github.com/your-username/PaimonGuideTH.git
cd PaimonGuideTH
```

### 2. ตั้งค่า Environment Variables

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

แก้ไขค่าใน `.env.local` และ `.env`:

| Variable | คำอธิบาย | ปลอดภัย? |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL ของ Supabase project | ✅ เปิดเผยได้ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key สำหรับ client-side | ✅ เปิดเผยได้ (มี RLS ป้องกัน) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | ⚠️ **ห้ามเปิดเผย** |
| `GENSHIN_DEV_API_URL` | URL ของ Genshin Dev API | ✅ เปิดเผยได้ |

### 3. ติดตั้ง Dependencies

```bash
# Frontend
cd frontend && pnpm install

# Backend
cd ../backend && pnpm install
```

### 4. ตั้งค่า Database

ไปที่ Supabase Dashboard → SQL Editor → รัน migration files ตามลำดับ:

```
001_create_characters.sql
002_create_talents.sql
003_create_constellations.sql
004_create_weapons.sql
005_create_artifacts.sql
006_create_materials.sql
007_create_character_builds.sql
008_create_junction_tables.sql
009_setup_rls_policies.sql
```

### 5. Seed ข้อมูลเริ่มต้น

```bash
cd backend
pnpm seed        # Seed ข้อมูลตัวอย่าง
pnpm sync        # ดึงข้อมูลจาก Genshin Dev API
```

### 6. รัน Development Server

```bash
cd frontend
pnpm dev
```

เปิด [http://localhost:3000](http://localhost:3000) บนเบราว์เซอร์

---

## 📜 Scripts

### Frontend

| Script | คำสั่ง | คำอธิบาย |
|--------|-------|---------|
| Dev Server | `pnpm dev` | รันเซิร์ฟเวอร์สำหรับพัฒนา |
| Build | `pnpm build` | สร้าง production build |
| Start | `pnpm start` | รัน production server |
| Lint | `pnpm lint` | ตรวจสอบโค้ดด้วย ESLint |
| Format | `pnpm format` | จัดรูปแบบโค้ดด้วย Prettier |
| Type Check | `pnpm type-check` | ตรวจสอบ TypeScript |

### Backend

| Script | คำสั่ง | คำอธิบาย |
|--------|-------|---------|
| Seed | `pnpm seed` | เพิ่มข้อมูลตัวอย่างลง DB |
| Sync | `pnpm sync` | ดึงข้อมูลจาก Genshin Dev API |
| Migrate | `pnpm migrate` | รัน SQL migrations |

---

## 🔒 Security

- **Row Level Security (RLS)** เปิดใช้งานทุกตาราง
- ข้อมูลเป็น **read-only** สำหรับ public access
- **Service Role Key** ใช้เฉพาะ server-side เท่านั้น
- **CSRF Protection** ผ่าน Next.js middleware
- **Security Headers** ตั้งค่าใน `next.config.ts`
- ไฟล์ `.env.local` อยู่ใน `.gitignore` ไม่ถูก commit

---

## 🎨 Design System

### Element Colors

| Element | Color | Thai |
|---------|-------|------|
| 🔥 Pyro | `#EF7938` | ไฟ |
| 💧 Hydro | `#4CC2F1` | น้ำ |
| ⚡ Electro | `#AF8EC1` | ไฟฟ้า |
| 🌿 Dendro | `#A5C83B` | เดนโดร |
| ❄️ Cryo | `#9FD6E3` | น้ำแข็ง |
| 🌪️ Anemo | `#74C2A8` | ลม |
| 🪨 Geo | `#FAB632` | หิน |

### Rarity

- ⭐⭐⭐⭐⭐ 5-star: `#FFB13F` (ทอง)
- ⭐⭐⭐⭐ 4-star: `#D28FD6` (ม่วง)
- ⭐⭐⭐ 3-star: `#5A9CDE` (น้ำเงิน)

---

## 📝 License

โปรเจกต์นี้สร้างขึ้นเพื่อการศึกษาและเป็นแฟนเมดเท่านั้น

**Genshin Impact** เป็นเครื่องหมายการค้าของ **COGNOSPHERE PTE. LTD.** และ **miHoYo Co., Ltd.**

ข้อมูลในเว็บไซต์นี้ไม่ได้รับการรับรองจากผู้พัฒนาเกมอย่างเป็นทางการ

---

## 🤝 Contributing

1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. เปิด Pull Request
