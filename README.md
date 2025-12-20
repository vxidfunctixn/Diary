# Diary

Aplikacja pamiętnika oparta na Electron + Vue 3 + TypeScript.

## Wymagania

- Node.js (wersja 18+)
- npm

## Instalacja

```bash
npm install
```

## Dostępne komendy

### Uruchomienie w trybie deweloperskim

```bash
npm start
```

Uruchamia aplikację Electron w trybie deweloperskim z hot-reload.

### Zbudowanie aplikacji

```bash
npm run build
```

Tworzy wersję produkcyjną aplikacji (exe + installer).

### Sprawdzanie typów TypeScript

```bash
npm run type-check          # Jednorazowe sprawdzenie
npm run type-check:watch    # Ciągłe sprawdzanie w tle
```

### Formatowanie kodu

```bash
npm run format              # Formatuje kod
npm run format:check        # Sprawdza formatowanie bez zmian
```

### Aktualizacja importów

```bash
npm run update-imports
```

Uruchamia skrypt do automatycznej aktualizacji importów w projekcie.

## Struktura projektu

- `src/` - kod źródłowy aplikacji
- `public/` - pliki statyczne
- `dist_electron/` - zbudowana aplikacja
- `scripts/` - skrypty pomocnicze

## Kamienie milowe projektu

- [x] Stworzenie podstawowej funkcjonalności zapisywania i edytowania notatek
- [ ] Dodanie funkcjonalności przeglądania wpisów
- [ ] Dodanie funkcjonalności czuwania w tle oraz nakładki w grach do szybkiego dodawania notatek.
- [ ] Dodanie do projektu modułu analitycznego opartego na AI (do dokładniejszego rozplanowania)
