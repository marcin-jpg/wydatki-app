# 💰 System Zarządzania Wydatkami

Profesjonalna aplikacja webowa do zarządzania budżetem i wydatkami z interfejsem konwersacyjnym w języku polskim.

## ✨ Główne Cechy

- **Interfejs Chat** 💬 - Dodawaj transakcje pisząc naturalnie po polsku
- **Inteligentny Parser NLP** 🧠 - Rozpoznaje kwoty, kategorie i daty automatycznie
- **Dashboard Analityki** 📊 - Wykresy i statystyki Twoich wydatków
- **Budżety Miesięczne** 💳 - Ustaw limity i śledź postęp
- **Transakcje Cykliczne** 🔄 - Automatyczne pensje, czynsz, subskrypcje
- **Prognozowanie** 🔮 - Sprawdź przewidywane saldo na koniec miesiąca
- **Baza Lokalna** 💾 - Wszystko zapisane lokalnie w SQLite

## 🚀 Szybki Start

### Wymagania
- Node.js 16+
- npm lub yarn

### Instalacja

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Uruchomienie

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Aplikacja otworzy się automatycznie na `http://localhost:3000`

## 📖 Jak Korzystać

### Dodawanie Transakcji (Chat)

Po prostu wpisz transakcję naturalnym językiem:

```
Wydałem 50 zł na obiad
Pensja 5000 zł
Rachunek za prąd 200 zł
Kupił nowe buty za 350 wczoraj
Czynsz 1500 15 stycznia
```

Parser automatycznie rozpozna:
- **Kwotę** (50 zł, 100 PLN, 200.50)
- **Kategorię** (Jedzenie, Transport, Rachunki, itp.)
- **Typ** (Przychód vs Wydatek)
- **Datę** (Dziś, wczoraj, konkretny dzień)

### Dashboard

Przejdź do Dashboard aby zobaczyć:
- Całkowite przychody i wydatki na miesiąc
- Wykres trendów (12 ostatnich miesięcy)
- Rozkład wydatków po kategoriach
- Postęp budżetów
- Prognozę na koniec miesiąca

### Budżety

Ustaw budżet na kategorię w danym miesiącu, a system będzie:
- Pokazywać postęp na pasku (0-100%)
- Ostrzegać przy 80% (żółty)
- Zakolorować na czerwono gdy przekroczysz limit

### Transakcje Cykliczne

Ustaw automatyczne transakcje (co miesiąc, tygodniu, itp.):
- Pensja (co miesiąc)
- Czynsz (co miesiąc)
- Subskrypcje (co miesiąc)
- Dojeżdżanie do pracy (co tydzień)

## 🏗️ Struktura Projektu

```
planowanie-wydatkow/
├── backend/                      # Node.js + Express server
│   ├── src/
│   │   ├── server.js            # Entry point
│   │   ├── db/
│   │   │   ├── database.js      # SQLite wrapper
│   │   │   └── schema.sql       # Schemat bazy
│   │   ├── routes/              # API endpoints
│   │   │   ├── transactions.js
│   │   │   ├── categories.js
│   │   │   ├── budgets.js
│   │   │   ├── recurring.js
│   │   │   └── analytics.js
│   │   ├── services/            # Logika biznesowa
│   │   │   ├── nlpParser.js     # Parser polskiego
│   │   │   ├── forecasting.js   # Prognozy
│   │   │   └── analytics.js     # Analityka
│   │   └── utils/
│   │       └── dateHelpers.js
│   └── package.json
│
├── frontend/                     # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Chat/            # Chat interface
│   │   │   └── Dashboard/       # Dashboard + wykresy
│   │   ├── services/
│   │   │   └── api.js           # HTTP client
│   │   ├── utils/
│   │   │   └── formatters.js    # Formatowanie (waluty, daty)
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
├── CLAUDE.md                    # Dokumentacja techniczna
└── README.md                    # Ten plik
```

## 🧠 Parser NLP (Polska)

### Rozpoznawane Wzory

#### Kwoty
```
50 zł
100 PLN
200.50 złotych
150 groszy
```

#### Kategorie Wydatków
- 🍔 Jedzenie
- 🚗 Transport
- 💡 Rachunki
- 🎬 Rozrywka
- 🛍️ Zakupy
- 🏥 Zdrowie
- 📚 Edukacja
- 📌 Inne

#### Kategorie Przychodów
- 💰 Wynagrodzenie
- 🎁 Bonusy
- 📦 Sprzedaż
- 📈 Inne przychody

#### Daty Względne
- "Dziś" / "Dzisiaj"
- "Wczoraj"
- "Przedwczoraj"
- "Jutro"
- "X tygodni temu"

#### Daty Bezwzględne
- "15 stycznia"
- "25.12"
- "01/01"

### Przykłady

```
"Wydałem 50 zł na obiad"
→ Wydatek 50 PLN kategoria "Jedzenie" dzisiaj

"Pensja 5000"
→ Przychód 5000 PLN kategoria "Wynagrodzenie" dzisiaj

"Rachunek za prąd 200 zł 15 stycznia"
→ Wydatek 200 PLN kategoria "Rachunki" 15 stycznia

"Kupił nowy laptop 3500 wczoraj"
→ Wydatek 3500 PLN kategoria "Zakupy" wczoraj
```

## 📊 API Endpoints

### Transakcje
```
POST   /api/transactions/parse              # Przetwórz tekst
GET    /api/transactions                    # Lista z filtrowaniem
GET    /api/transactions/:id                # Szczegóły
PUT    /api/transactions/:id                # Aktualizuj
DELETE /api/transactions/:id                # Usuń
GET    /api/transactions/stats/monthly      # Statystyki miesiąca
```

### Kategorie
```
GET    /api/categories                      # Lista
POST   /api/categories                      # Stwórz
PUT    /api/categories/:id                  # Aktualizuj
DELETE /api/categories/:id                  # Usuń
```

### Budżety
```
GET    /api/budgets                         # Lista
POST   /api/budgets                         # Stwórz/aktualizuj
PUT    /api/budgets/:id                     # Aktualizuj
DELETE /api/budgets/:id                     # Usuń
GET    /api/budgets/status/month            # Status miesiąca
```

### Transakcje Cykliczne
```
GET    /api/recurring                       # Lista
POST   /api/recurring                       # Stwórz
PUT    /api/recurring/:id                   # Aktualizuj
DELETE /api/recurring/:id                   # Usuń
POST   /api/recurring/:id/process           # Stwórz transakcję
```

### Analityka
```
GET    /api/analytics/breakdown             # Rozkład kategorii
GET    /api/analytics/trends                # Trendy N miesięcy
GET    /api/analytics/monthly               # Statystyki miesiąca
GET    /api/analytics/top                   # Top kategorie
GET    /api/analytics/balance               # Całkowite saldo
GET    /api/analytics/daily-spending        # Wydatki dziennie
GET    /api/analytics/compare               # Porównanie
GET    /api/analytics/forecast              # Prognozy
GET    /api/analytics/budget-status         # Status budżetów
```

## 🎨 Wygląd

### Chat Interface
- Interfejs podobny do popularnych aplikacji chat
- Sugestie szybkich akcji
- Potwierdzenia dodanych transakcji z ikonami

### Dashboard
- Szybkie statystyki (Przychody, Wydatki, Saldo)
- Wykresy słupkowe (trendy)
- Wykresy kołowe (rozkład kategorii)
- Paski postępu budżetów
- Prognozy na koniec miesiąca

## 🔧 Technologia

### Backend
- **Express** - REST API
- **SQLite** - Lokalna baza danych
- **date-fns** - Obsługa dat
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Recharts** - Wykresy
- **Axios** - HTTP client
- **CSS3** - Styling

## 📱 Responsywność

Pełne wsparcie dla:
- 🖥️ Desktop (1920px+)
- 📱 Tablet (768px-1024px)
- 📱 Mobile (<768px)

## 🔐 Bezpieczeństwo

- Dane przechowywane lokalnie (SQLite)
- Brak przesyłania do chmury
- Walidacja na backendie
- CORS skonfigurowany dla localhost

## 🐛 Troubleshooting

### Backend nie startuje
```bash
# Upewnij się, że port 3001 jest wolny
# Lub zmień PORT w backend/.env
```

### Frontend nie łączy się z API
```bash
# Sprawdź czy backend uruchomiony jest na localhost:3001
# Sprawdź Network tab w DevTools
```

### Parser nie rozpoznaje transakcji
- Użyj słów kluczowych z listy kategorii
- Spróbuj dodać eksplicitnie kwotę i kategorię
- Np. zamiast "Pizza" użyj "Pizza jedzenie 30 zł"

## 📝 Plany na przyszłość

- [ ] Eksport do CSV/PDF
- [ ] Chmura (Firebase/Supabase)
- [ ] Aplikacja mobilna (React Native)
- [ ] Wielouczytkownik z synchronizacją
- [ ] AI do lepszych prognoz
- [ ] Integracja z bankami
- [ ] Powiadomienia o budżetach
- [ ] Tematy (dark mode)

## 📄 Licencja

MIT

## 👨‍💻 Autor

Stworzony przez Claude AI Assistant

## 🤝 Wsparcie

Dla problemów lub sugestii, otwórz issue w repozytorium.

---

**Zacznij planować swoje wydatki dzisiaj! 💰**
