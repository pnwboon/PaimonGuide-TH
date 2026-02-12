# Prompt: สร้างเว็บ Paimon Guide TH ภาษาไทย

## ภาพรวมโปรเจค

สร้างเว็บไซต์ Paimon Guide TH ภาษาไทย (Unofficial Fan Wiki) ที่มีข้อมูลครบถ้วนเกี่ยวกับตัวละคร, อาวุธ, artifacts, และคู่มือต่างๆ โดยใช้ Next.js (App Router), TypeScript, Tailwind CSS, และ Supabase

---

## Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (สำหรับรูปภาพ)
- **API Routes:** Next.js API Routes
- **ORM/Client:** Supabase JS Client

### DevOps & Tools
- **Package Manager:** pnpm
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Deployment:** Vercel

---

## โครงสร้างโฟลเดอร์ (Professional Structure)

```
genshin-wiki-th/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── public/
│   ├── images/
│   │   ├── characters/
│   │   ├── weapons/
│   │   ├── artifacts/
│   │   └── elements/
│   ├── icons/
│   └── favicon.ico
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── (root)/                   # Root layout group
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── loading.tsx           # Loading state
│   │   ├── characters/
│   │   │   ├── page.tsx              # Characters list
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx          # Character detail
│   │   │   │   └── loading.tsx
│   │   │   └── layout.tsx
│   │   ├── weapons/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── artifacts/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── guides/
│   │   │   ├── page.tsx
│   │   │   └── [category]/
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   ├── tier-list/
│   │   │   └── page.tsx
│   │   ├── tools/
│   │   │   ├── damage-calculator/
│   │   │   │   └── page.tsx
│   │   │   └── wish-tracker/
│   │   │       └── page.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── characters/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── weapons/
│   │   │   │   └── route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   └── sync/
│   │   │       └── genshin-dev/
│   │   │           └── route.ts      # API sync script
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/                    # React Components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── character/
│   │   │   ├── CharacterCard.tsx
│   │   │   ├── CharacterDetail.tsx
│   │   │   ├── TalentSection.tsx
│   │   │   ├── ConstellationSection.tsx
│   │   │   ├── BuildRecommendation.tsx
│   │   │   └── TeamComposition.tsx
│   │   ├── weapon/
│   │   │   ├── WeaponCard.tsx
│   │   │   ├── WeaponDetail.tsx
│   │   │   └── WeaponComparison.tsx
│   │   ├── artifact/
│   │   │   ├── ArtifactCard.tsx
│   │   │   └── ArtifactSetBonus.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── filters/
│   │   │   ├── ElementFilter.tsx
│   │   │   ├── RarityFilter.tsx
│   │   │   └── WeaponTypeFilter.tsx
│   │   └── common/
│   │       ├── ElementIcon.tsx
│   │       ├── RarityStars.tsx
│   │       ├── StatDisplay.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/                          # Utility functions & configs
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase client
│   │   │   ├── server.ts             # Server-side Supabase
│   │   │   └── middleware.ts
│   │   ├── api/
│   │   │   ├── genshin-dev.ts        # Genshin.dev API client
│   │   │   ├── enka.ts               # Enka Network API
│   │   │   └── ambr.ts               # Ambr.top API
│   │   ├── utils/
│   │   │   ├── cn.ts                 # Tailwind class merger
│   │   │   ├── format.ts             # Formatting utilities
│   │   │   └── validators.ts         # Validation functions
│   │   └── constants/
│   │       ├── elements.ts
│   │       ├── weapon-types.ts
│   │       └── rarities.ts
│   ├── types/                        # TypeScript types
│   │   ├── character.ts
│   │   ├── weapon.ts
│   │   ├── artifact.ts
│   │   ├── material.ts
│   │   ├── talent.ts
│   │   ├── database.ts               # Supabase generated types
│   │   └── api.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── useCharacters.ts
│   │   ├── useWeapons.ts
│   │   ├── useArtifacts.ts
│   │   ├── useSearch.ts
│   │   └── useLocalStorage.ts
│   ├── store/                        # Zustand stores
│   │   ├── filterStore.ts
│   │   ├── searchStore.ts
│   │   └── userPreferencesStore.ts
│   ├── services/                     # Business logic layer
│   │   ├── character.service.ts
│   │   ├── weapon.service.ts
│   │   ├── artifact.service.ts
│   │   └── sync.service.ts           # Data sync service
│   └── middleware.ts                 # Next.js middleware
├── supabase/                         # Supabase configuration
│   ├── migrations/
│   │   ├── 00001_initial_schema.sql
│   │   ├── 00002_characters.sql
│   │   ├── 00003_weapons.sql
│   │   ├── 00004_artifacts.sql
│   │   └── 00005_materials.sql
│   ├── functions/                    # Edge functions
│   └── seed.sql                      # Seed data
├── scripts/                          # Utility scripts
│   ├── sync-genshin-dev.ts          # Sync data from Genshin.dev
│   ├── generate-types.ts            # Generate Supabase types
│   └── seed-database.ts             # Seed initial data
├── .env.local                        # Environment variables
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Database Schema (Supabase/PostgreSQL)

### 1. Characters Table
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  rarity INTEGER NOT NULL CHECK (rarity IN (4, 5)),
  element TEXT NOT NULL CHECK (element IN ('Pyro', 'Hydro', 'Cryo', 'Electro', 'Anemo', 'Geo', 'Dendro')),
  weapon_type TEXT NOT NULL CHECK (weapon_type IN ('Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst')),
  region TEXT,
  
  -- Stats
  base_hp INTEGER NOT NULL,
  base_atk INTEGER NOT NULL,
  base_def INTEGER NOT NULL,
  ascension_stat TEXT,
  ascension_stat_value DECIMAL,
  
  -- Assets
  icon_url TEXT,
  card_url TEXT,
  avatar_url TEXT,
  
  -- Metadata
  release_date DATE,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_characters_element ON characters(element);
CREATE INDEX idx_characters_weapon_type ON characters(weapon_type);
CREATE INDEX idx_characters_rarity ON characters(rarity);
```

### 2. Talents Table
```sql
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('normal_attack', 'elemental_skill', 'elemental_burst', 'passive_1', 'passive_2', 'passive_3')),
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description_en TEXT,
  description_th TEXT,
  
  -- Scaling data (JSONB for flexibility)
  scaling JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_talents_character ON talents(character_id);
```

### 3. Constellations Table
```sql
CREATE TABLE constellations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 6),
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description_en TEXT,
  description_th TEXT,
  icon_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_constellations_character ON constellations(character_id);
```

### 4. Weapons Table
```sql
CREATE TABLE weapons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  rarity INTEGER NOT NULL CHECK (rarity BETWEEN 1 AND 5),
  type TEXT NOT NULL CHECK (type IN ('Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst')),
  
  -- Stats
  base_atk INTEGER NOT NULL,
  secondary_stat TEXT,
  secondary_stat_value DECIMAL,
  
  -- Passive
  passive_name_en TEXT,
  passive_name_th TEXT,
  passive_description_en TEXT,
  passive_description_th TEXT,
  
  -- Refinement data
  refinements JSONB,
  
  -- Assets
  icon_url TEXT,
  awakened_icon_url TEXT,
  
  -- Obtain method
  obtain_method TEXT, -- 'Gacha', 'Craftable', 'Battle Pass', 'Event'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weapons_type ON weapons(type);
CREATE INDEX idx_weapons_rarity ON weapons(rarity);
```

### 5. Artifacts Table
```sql
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  max_rarity INTEGER NOT NULL,
  
  -- Set bonuses
  bonus_2pc_en TEXT,
  bonus_2pc_th TEXT,
  bonus_4pc_en TEXT,
  bonus_4pc_th TEXT,
  
  -- Piece types available
  pieces JSONB, -- ['flower', 'plume', 'sands', 'goblet', 'circlet']
  
  -- Assets
  icon_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Materials Table
```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Character Ascension', 'Talent', 'Weapon Ascension'
  rarity INTEGER,
  
  description_en TEXT,
  description_th TEXT,
  
  -- Sources
  sources JSONB, -- ['Domain: xxx', 'Boss: xxx', 'Crafting']
  
  -- Availability (days of week for domains)
  availability JSONB,
  
  icon_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. Character Builds Table (User-generated content)
```sql
CREATE TABLE character_builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  
  title_th TEXT NOT NULL,
  description_th TEXT,
  
  -- Build details
  recommended_weapons JSONB, -- Array of weapon IDs with priority
  recommended_artifacts JSONB, -- Artifact set recommendations
  main_stats JSONB, -- Recommended main stats per piece
  sub_stats_priority JSONB, -- Sub stat priority array
  
  -- Team compositions
  team_comps JSONB,
  
  -- Ratings
  dps_rating INTEGER CHECK (dps_rating BETWEEN 1 AND 10),
  support_rating INTEGER CHECK (support_rating BETWEEN 1 AND 10),
  
  -- Metadata
  author_id UUID,
  is_official BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_builds_character ON character_builds(character_id);
```

### 8. Character Ascension Materials (Junction Table)
```sql
CREATE TABLE character_ascension_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  ascension_level INTEGER NOT NULL CHECK (ascension_level BETWEEN 1 AND 6),
  quantity INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_char_asc_materials_character ON character_ascension_materials(character_id);
```

### 9. Talent Materials (Junction Table)
```sql
CREATE TABLE talent_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  talent_level INTEGER NOT NULL CHECK (talent_level BETWEEN 2 AND 10),
  quantity INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## TypeScript Types (src/types/)

### character.ts
```typescript
export type Element = 'Pyro' | 'Hydro' | 'Cryo' | 'Electro' | 'Anemo' | 'Geo' | 'Dendro';
export type WeaponType = 'Sword' | 'Claymore' | 'Polearm' | 'Bow' | 'Catalyst';
export type TalentType = 'normal_attack' | 'elemental_skill' | 'elemental_burst' | 'passive_1' | 'passive_2' | 'passive_3';

export interface Character {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  rarity: 4 | 5;
  element: Element;
  weapon_type: WeaponType;
  region?: string;
  
  base_hp: number;
  base_atk: number;
  base_def: number;
  ascension_stat?: string;
  ascension_stat_value?: number;
  
  icon_url?: string;
  card_url?: string;
  avatar_url?: string;
  
  release_date?: string;
  description?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Talent {
  id: string;
  character_id: string;
  type: TalentType;
  name_en: string;
  name_th: string;
  description_en?: string;
  description_th?: string;
  scaling?: any;
}

export interface Constellation {
  id: string;
  character_id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  name_en: string;
  name_th: string;
  description_en?: string;
  description_th?: string;
  icon_url?: string;
}

export interface CharacterWithDetails extends Character {
  talents: Talent[];
  constellations: Constellation[];
  ascension_materials?: any[];
  talent_materials?: any[];
}
```

### weapon.ts
```typescript
export interface Weapon {
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  type: WeaponType;
  
  base_atk: number;
  secondary_stat?: string;
  secondary_stat_value?: number;
  
  passive_name_en?: string;
  passive_name_th?: string;
  passive_description_en?: string;
  passive_description_th?: string;
  
  refinements?: any;
  
  icon_url?: string;
  awakened_icon_url?: string;
  
  obtain_method?: string;
  
  created_at: string;
  updated_at: string;
}
```

---

## API Integration Plan

### 1. Data Sync Service (services/sync.service.ts)
```typescript
// Fetch data from Genshin.dev API and store in Supabase
export class SyncService {
  async syncCharacters(): Promise<void> {
    // 1. Fetch from https://genshin.dev/characters
    // 2. Transform to match our schema
    // 3. Upsert to Supabase
  }
  
  async syncWeapons(): Promise<void> {
    // Similar process
  }
  
  async syncArtifacts(): Promise<void> {
    // Similar process
  }
}
```

### 2. Genshin.dev API Client (lib/api/genshin-dev.ts)
```typescript
const GENSHIN_API_BASE = 'https://genshin.dev';

export const genshinDevApi = {
  async getCharacters() {
    return fetch(`${GENSHIN_API_BASE}/characters`).then(r => r.json());
  },
  
  async getCharacter(name: string) {
    return fetch(`${GENSHIN_API_BASE}/characters/${name}`).then(r => r.json());
  },
  
  async getWeapons() {
    return fetch(`${GENSHIN_API_BASE}/weapons`).then(r => r.json());
  },
  
  // ... more endpoints
};
```

---

## Key Features to Implement

### Phase 1: Core Features
1. **Character Database**
   - รายการตัวละครทั้งหมด (with filters: element, weapon, rarity)
   - หน้ารายละเอียดตัวละคร (stats, talents, constellations)
   - ระบบค้นหาตัวละคร

2. **Weapon Database**
   - รายการอาวุธทั้งหมด (with filters)
   - หน้ารายละเอียดอาวุธ
   - เปรียบเทียบอาวุธ

3. **Artifact Database**
   - รายการ artifact sets
   - คำแนะนำ artifact สำหรับแต่ละตัวละคร

### Phase 2: Advanced Features
4. **Build Recommendations**
   - Build guides เป็นภาษาไทย
   - Team compositions
   - Gameplay tips

5. **Interactive Tools**
   - Damage Calculator
   - Wish Tracker/Counter
   - Ascension Calculator

6. **Search & Filters**
   - Global search (characters, weapons, artifacts)
   - Advanced filtering

### Phase 3: Community Features
7. **User Accounts** (Optional)
   - Save favorite builds
   - Submit community builds
   - Bookmark characters

---

## Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External APIs
GENSHIN_DEV_API_URL=https://genshin.dev
ENKA_NETWORK_API_URL=https://enka.network/api

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Genshin Wiki TH
```

---

## Initial Setup Commands

```bash
# 1. Create Next.js project
npx create-next-app@latest genshin-wiki-th --typescript --tailwind --app --use-pnpm

# 2. Install dependencies
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add @tanstack/react-query zustand
pnpm add react-hook-form zod @hookform/resolvers
pnpm add lucide-react
pnpm add class-variance-authority clsx tailwind-merge

# 3. Install shadcn/ui
npx shadcn-ui@latest init

# 4. Install dev dependencies
pnpm add -D @types/node prettier eslint-config-prettier husky lint-staged

# 5. Initialize Supabase project
npx supabase init

# 6. Setup git hooks
npx husky install
```

---

## Design System Guidelines

### Colors (Tailwind Config)
```javascript
// Element colors
colors: {
  pyro: '#FF6B6B',
  hydro: '#4ECDC4',
  cryo: '#95E1D3',
  electro: '#A78BFA',
  anemo: '#86EFAC',
  geo: '#FCD34D',
  dendro: '#84CC16',
}
```

### Component Conventions
- ใช้ shadcn/ui components เป็นฐาน
- ทุก component ต้องมี TypeScript types
- ใช้ Tailwind CSS สำหรับ styling (ไม่ใช้ CSS modules)
- Responsive design: Mobile-first approach

---

## SEO Strategy

### Metadata Configuration
```typescript
// app/characters/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const character = await getCharacter(params.slug);
  
  return {
    title: `${character.name_th} - คู่มือ Build และ Team | Genshin Wiki TH`,
    description: `คู่มือ ${character.name_th} ฉบับสมบูรณ์ พร้อม Build แนะนำ, อาวุธที่ดีที่สุด, Artifacts, และ Team Composition ภาษาไทย`,
    openGraph: {
      images: [character.card_url],
    },
  };
}
```

### Sitemap & Robots.txt
- สร้าง dynamic sitemap สำหรับ characters, weapons, artifacts
- robots.txt อนุญาต crawling ทั้งหมด

---

## Performance Optimization

1. **Image Optimization**
   - ใช้ Next.js Image component
   - Lazy loading images
   - WebP format

2. **Code Splitting**
   - Dynamic imports สำหรับ heavy components
   - Route-based code splitting (automatic ใน App Router)

3. **Caching Strategy**
   - React Query cache (5 minutes stale time)
   - Supabase query caching
   - Next.js static generation สำหรับ stable pages

4. **Database Optimization**
   - Index สำหรับ frequently queried columns
   - Limit + offset pagination
   - Select specific columns only

---

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data loaded
- [ ] SEO metadata complete
- [ ] Analytics setup (optional)
- [ ] Error tracking (Sentry) setup (optional)
---

## Content Strategy

### ภาษาที่ใช้
- **ชื่อตัวละคร/อาวุธ/Artifacts:** ภาษาอังกฤษ (ถอดเสียงไทยในวงเล็บ)
- **เนื้อหาทั้งหมด:** ภาษาไทย 100%
- **Element names:** ภาษาอังกฤษ (Pyro, Hydro, etc.)
- **Stats terms:** ภาษาอังกฤษ + คำอธิบายไทย (Crit Rate = อัตราคริติคอล)

### Initial Content Priority
1. ตัวละคร 5 ดาวยอดนิยม 10 ตัว
2. ตัวละคร 4 ดาว support ที่ใช้บ่อย 5 ตัว
3. อาวุธ 5 ดาว meta 5 อัน
4. อาวุธ 4 ดาว F2P friendly 5 อัน
5. Artifact sets ยอดนิยม 10 sets

---

## Legal & Disclaimer

### Footer Disclaimer
```
เว็บไซต์นี้เป็น Unofficial Fan Wiki ไม่ได้เกี่ยวข้องหรือได้รับการสนับสนุนจาก 
HoYoverse/Cognosphere/miHoYo

Genshin Impact™ เป็นเครื่องหมายการค้าของ Cognosphere Pte. Ltd.
เนื้อหา ภาพ และข้อมูลจากเกมเป็นลิขสิทธิ์ของ HoYoverse

เว็บไซต์นี้ใช้เนื้อหาภายใต้หลักการ Fair Use เพื่อการศึกษาและให้ข้อมูล
```

---

## Success Metrics (Optional - Phase 2)

- Google Analytics 4
- Track: Page views, User retention, Search queries
- Monitor: Most viewed characters, Popular builds

---

## ขั้นตอนการพัฒนา (Development Roadmap)

### Week 1-2: Foundation
- [ ] Setup project structure
- [ ] Configure Supabase
- [ ] Create database schema
- [ ] Setup shadcn/ui components
- [ ] Implement layout (Header, Footer, Navigation)

### Week 3-4: Core Features
- [ ] Characters list page with filters
- [ ] Character detail page
- [ ] Weapons list page with filters
- [ ] Weapon detail page
- [ ] Global search functionality

### Week 5-6: Data & Content
- [ ] Implement data sync from Genshin.dev API
- [ ] Seed initial data
- [ ] Add build recommendations (manual entry)
- [ ] Add Thai translations

### Week 7-8: Polish & Deploy
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Mobile responsive testing
- [ ] Deploy to Vercel
- [ ] Setup custom domain

---

## Additional Notes

- **Copyright:** ระวังเรื่องลิขสิทธิ์ ใส่ disclaimer ชัดเจน ไม่อ้างว่าเป็น official

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Genshin.dev API:** https://github.com/genshindev/api

---

## Summary

นี่คือ prompt ที่ครบถ้วนสำหรับการสร้างเว็บ Genshin Wiki TH โดยมี:
✅ โครงสร้างโฟลเดอร์แบบมืออาชีพ แยก Frontend/Backend ชัดเจน
✅ Database schema ครบถ้วน
✅ TypeScript types สำหรับทุก entity
✅ API integration plan
✅ SEO และ performance optimization
✅ Legal disclaimer
