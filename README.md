# Numora Mobile

[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Navigation](https://img.shields.io/badge/React%20Navigation-7-6C47FF?logo=react&logoColor=white)](https://reactnavigation.org/)
[![Axios](https://img.shields.io/badge/Axios-1.16-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

Application mobile React Native (Expo) pour l'authentification utilisateur, la gestion de lectures et le calcul de numerologie.

## Tech Stack

`Expo` `React Native` `React 19` `TypeScript` `React Navigation` `Axios` `Expo Secure Store`

## Prerequis

- Node.js 18+
- npm 9+
- Expo Go (mobile) ou emulateur Android/iOS

## Installation

```bash
npm install
```

## Variables d'environnement

1. Copier le fichier d'exemple :

```bash
cp .env.example .env.local
```

2. Renseigner les variables necessaires dans `.env.local` (ex: URL API backend).

## Lancer le projet

```bash
npm run start
```

## Scripts disponibles

- `npm run start` : demarre Expo
- `npm run android` : lance sur Android
- `npm run ios` : lance sur iOS
- `npm run web` : lance sur Web

## Structure du projet

```text
src/
  app/
    App.tsx
    navigation/
      AppNavigator.tsx
  pages/
    Auth/
    Home/
    NewReading/
    Numerology/
    ReadingDetail/
  components/
    AuthForm/
    NumerologySummary/
    ReadingList/
  hooks/
    useAuth.ts
    useNumerology.ts
    useReadings.ts
  services/
    apiClient.ts
    authService.ts
    numerologyService.ts
    readingService.ts
    secureStorageService.ts
  types/
    auth.types.ts
    navigation.types.ts
    numerology.types.ts
    reading.types.ts
  utils/
    apiBaseUrl.ts
```

## Fonctionnalites principales

- Authentification utilisateur
- Navigation entre ecrans principaux
- Consultation et gestion des lectures
- Resume numerologique
- Stockage securise local (tokens/session)

