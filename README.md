# 🔮 LithoApp — Web App Lithothérapie MVP

Application web complète de gestion de cristaux et de création artisanale.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State management | Zustand |
| Router | React Router v6 |
| Backend | Node.js + Express |
| ORM | Prisma |
| Base de données | PostgreSQL |
| Monorepo | npm workspaces |

---

## Prérequis

- Node.js 18+
- PostgreSQL (local ou Docker)

---

## Installation & lancement

### 1. Configurer la base de données

```bash
# Éditer .env avec votre URL PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/litho_db"
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Initialiser la base de données

```bash
cd apps/backend

# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate dev --name init

# Insérer les données de test
node prisma/seed.js
```

### 4. Lancer l'application

```bash
# Depuis la racine — lance frontend + backend en parallèle
npm run dev
```

- Frontend : http://localhost:5173
- Backend API : http://localhost:3001
- Prisma Studio : `cd apps/backend && npx prisma studio`

---

## Structure du projet

```
litho-app/
├── apps/
│   ├── frontend/          # React + Vite
│   │   └── src/
│   │       ├── pages/     # Home, CrystalDetail, Favorites, Creator
│   │       ├── components/ # CrystalCard, SearchBar, FilterBar, Navbar
│   │       ├── store/     # Zustand (crystals, favorites)
│   │       └── services/  # Client API REST
│   └── backend/           # Node.js + Express
│       ├── src/
│       │   ├── routes/    # crystals, chakras, zodiacs, creationTypes
│       │   ├── controllers/
│       │   └── services/  # logique métier Prisma
│       └── prisma/
│           ├── schema.prisma
│           └── seed.js    # 12 cristaux + données réalistes
├── .env                   # Variables d'environnement
└── package.json           # Workspaces npm
```

---

## API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/crystals | Liste tous les cristaux |
| GET | /api/crystals?search= | Recherche par nom/vertu |
| GET | /api/crystals?color= | Filtre par couleur |
| GET | /api/crystals?chakra= | Filtre par chakra |
| GET | /api/crystals?zodiac= | Filtre par signe |
| GET | /api/crystals/:id | Détail d'un cristal |
| POST | /api/crystals | Créer un cristal |
| PUT | /api/crystals/:id | Modifier un cristal |
| DELETE | /api/crystals/:id | Supprimer un cristal |
| PUT | /api/crystals/:id/stock | Modifier le stock |
| POST | /api/crystals/suggest | Suggestions pour création |
| POST | /api/crystals/generate | Génération IA (simulée) |
| GET | /api/chakras | Liste des chakras |
| GET | /api/zodiacs | Liste des signes |
| GET | /api/creation-types | Types de création |

---

## Fonctionnalités MVP

- ✅ Bibliothèque de cristaux avec filtres (couleur, chakra, signe, recherche)
- ✅ Fiche détail avec vertus, chakras, compatibilités, précautions
- ✅ Favoris persistés en localStorage (Zustand)
- ✅ Créateur artisanal — sélection par type, couleur, intention
- ✅ Détection d'incompatibilités entre cristaux sélectionnés
- ✅ Aperçu visuel de la sélection (ligne de perles colorées)
- ✅ Suggestion IA simulée (POST /api/crystals/generate)
- ✅ Gestion du stock par catégorie (perles 2/4/6mm, roulées, brutes)
- ✅ 12 cristaux préconfigurés avec données réalistes

---

## Prochaines étapes (post-MVP)

- Authentification utilisateur
- Intégration IA réelle (OpenAI / Claude)
- Upload d'images de cristaux
- Export PDF des créations
- Historique des créations
