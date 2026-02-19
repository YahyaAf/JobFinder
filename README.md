# 🎯 JobFinder - Application de Recherche d'Emplois

Application Angular complète pour la recherche d'emplois avec gestion des favoris et suivi des candidatures.

## 📋 Fonctionnalités

### 1. Authentification
- ✅ Inscription / Connexion
- ✅ Gestion de profil
- ✅ Protection des routes (AuthGuard)

### 2. Recherche d'Emplois
- ✅ API Arbeitnow intégrée
- ✅ Recherche par titre (uniquement dans le titre du poste)
- ✅ Filtre par localisation
- ✅ Tri par date de publication (plus récent en premier)
- ✅ Pagination : 10 résultats par page
- ✅ Indicateur de chargement

### 3. Gestion des Favoris (NgRx)
- ✅ Ajouter/Supprimer des favoris
- ✅ Page dédiée `/favorites`
- ✅ Indicateur visuel (⭐/☆)
- ✅ Pas de doublons

### 4. Suivi des Candidatures
- ✅ Ajouter/Supprimer des candidatures
- ✅ Page dédiée `/applications`
- ✅ Gestion des statuts (En attente, Accepté, Refusé)
- ✅ Notes personnelles (optionnel)
- ✅ Indicateur visuel (✓/📋)
- ✅ Pas de doublons

## 🚀 Installation

### Prérequis
- Node.js (v18+)
- npm
- Angular CLI

### Étapes

1. **Cloner le projet**
```bash
cd C:\Users\Youcode\Desktop\AngularDocummetation\JobFinder
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer JSON Server**
```bash
json-server --watch db.json
```

4. **Démarrer Angular (nouveau terminal)**
```bash
ng serve
```

5. **Ouvrir dans le navigateur**
```
http://localhost:4200
```

## 🔑 Compte de Test

```
Email: yahya@gmail.com
Password: yahya123
```

## 📁 Structure du Projet

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptors.ts
│   ├── model/
│   │   ├── job.model.ts
│   │   ├── user.model.ts
│   │   ├── favorite.model.ts
│   │   └── application.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── job.service.ts
│   │   ├── favorite.service.ts
│   │   └── application.service.ts
│   └── store/
│       └── favorites/
│           ├── favorites.actions.ts
│           ├── favorites.reducer.ts
│           ├── favorites.selectors.ts
│           └── favorites.effects.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── profile/
│   ├── loading/
│   │   └── home/
│   ├── favorites/
│   └── applications/
└── shared/
    └── components/
        ├── header/
        └── footer/
```

## 🛠️ Technologies

- **Angular** 19
- **NgRx** (gestion d'état pour favoris)
- **RxJS** (programmation réactive)
- **JSON Server** (backend simulé)
- **TypeScript**
- **HTML/CSS**

## 📊 Architecture

### Favoris : NgRx
- State management centralisé
- Actions, Reducers, Selectors, Effects

### Candidatures : Service Simple
- Logique directe avec services
- Plus simple à maintenir
- Idéal pour cette fonctionnalité

## 📖 Documentation

- [Guide de Test Complet](./GUIDE_TEST.md)
- [Implémentation Complète](./IMPLEMENTATION_COMPLETE.md)
- [Documentation Favoris](./FAVORITES_README.md)
- [Documentation Applications](./APPLICATIONS_README.md)

## 🎯 Routes

| Route | Description | Protection |
|-------|-------------|------------|
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/home` | Recherche d'emplois | Protégée |
| `/profile` | Profil utilisateur | Protégée |
| `/favorites` | Mes favoris | Protégée |
| `/applications` | Mes candidatures | Protégée |

## 🗄️ JSON Server

### Tables

#### users
```json
{
  "id": 1,
  "nom": "Yahya",
  "prenom": "Af",
  "email": "yahya@gmail.com",
  "password": "yahya123"
}
```

#### favoritesOffers
```json
{
  "id": 1,
  "userId": 1,
  "slug": "job-slug",
  "title": "Développeur Angular",
  "company_name": "Entreprise A",
  "location": "Paris",
  "created_at": 1234567890
}
```

#### applications
```json
{
  "id": 1,
  "userId": 1,
  "offerId": "job-slug",
  "apiSource": "arbeitnow",
  "title": "Développeur Angular",
  "company": "Entreprise A",
  "location": "Paris",
  "url": "https://...",
  "status": "en_attente",
  "notes": "Candidature envoyée le...",
  "dateAdded": "2026-02-15T10:30:00Z"
}
```

## ✨ Fonctionnalités Avancées

### Cache Intelligent
- Mise en cache des résultats de recherche
- Performance optimisée
- Moins d'appels API

### Indicateurs Visuels
- **Favoris** : ☆ → ⭐ (jaune)
- **Candidatures** : 📋 → ✓ (vert)
- **Statuts** :
  - En attente (jaune)
  - Accepté (vert)
  - Refusé (rouge)

### Pas de Doublons
- Vérification avant ajout
- Message d'alerte si doublon
- Set pour recherche rapide O(1)

## 🧪 Tests

Voir le [Guide de Test Complet](./GUIDE_TEST.md) pour tous les scénarios de test.

## 🐛 Dépannage

### JSON Server ne démarre pas
```bash
npm install -g json-server
json-server --watch db.json
```

### Angular ne compile pas
```bash
npm install
ng serve
```

### Erreur CORS
JSON Server gère automatiquement CORS, vérifier que le port 3000 est libre.

## 📝 License

Ce projet est réalisé dans un cadre éducatif.

## 👨‍💻 Auteur

Développé avec ❤️ en Angular

---

**Projet 100% fonctionnel et conforme au cahier des charges !** ✅
