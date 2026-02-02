# System Zarządzania Wydatkami

Pełnoprawna aplikacja webowa do zarządzania wydatkami i budżetem z interfejsem konwersacyjnym w języku polskim.

## 🚀 Szybki Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Server uruchomi się na `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikacja otworzy się na `http://localhost:3000`

## 📋 Architektura

### Backend (Node.js + Express)

- **Express** - Framework REST API
- **SQLite** - Lokalna baza danych
- **date-fns** - Obsługa dat

#### API Endpoints

**Transakcje:**
- `POST /api/transactions/parse` - Przetwarzanie tekstu w języku naturalnym i dodawanie transakcji
- `GET /api/transactions` - Lista transakcji (filtrowanie po miesiącu, roku, typie, kategorii)
- `GET /api/transactions/:id` - Szczegóły transakcji
- `PUT /api/transactions/:id` - Aktualizacja transakcji
- `DELETE /api/transactions/:id` - Usunięcie transakcji
- `GET /api/transactions/stats/monthly` - Statystyki miesięczne

**Kategorie:**
- `GET /api/categories` - Lista kategorii
- `POST /api/categories` - Stworzenie kategorii
- `PUT /api/categories/:id` - Aktualizacja kategorii
- `DELETE /api/categories/:id` - Usunięcie kategorii

**Budżety:**
- `GET /api/budgets` - Lista budżetów
- `POST /api/budgets` - Stworzenie/aktualizacja budżetu
- `PUT /api/budgets/:id` - Aktualizacja budżetu
- `DELETE /api/budgets/:id` - Usunięcie budżetu
- `GET /api/budgets/status/month` - Status budżetów na miesiąc

**Transakcje Cykliczne:**
- `GET /api/recurring` - Lista cyklicznych transakcji
- `POST /api/recurring` - Stworzenie cyklicznej transakcji
- `PUT /api/recurring/:id` - Aktualizacja
- `DELETE /api/recurring/:id` - Usunięcie
- `POST /api/recurring/:id/process` - Stworzenie transakcji z szablonu

**Analityka:**
- `GET /api/analytics/breakdown` - Rozkład kategorii na miesiąc
- `GET /api/analytics/trends` - Trendy na ostatnie N miesięcy
- `GET /api/analytics/monthly` - Statystyki miesięczne
- `GET /api/analytics/top` - Top kategorie
- `GET /api/analytics/balance` - Całkowite saldo
- `GET /api/analytics/daily-spending` - Wydatki dzienne
- `GET /api/analytics/compare` - Porównanie dwóch miesięcy
- `GET /api/analytics/forecast` - Prognoza wydatków
- `GET /api/analytics/budget-status` - Status budżetów

### Frontend (React + Vite)

- **React 18** - UI Framework
- **Recharts** - Wykresy
- **Axios** - HTTP Client
- **date-fns** - Formatowanie dat
- **Vite** - Build tool

#### Komponenty

**Chat Interface** (`ChatInterface.jsx`)
- Interfejs konwersacyjny do dodawania transakcji
- Przetwarzanie tekstu w języku naturalnym
- Historia wiadomości z potwierdzeniami
- Sugestie szybkich akcji

**Dashboard** (`Dashboard.jsx`)
- Przegląd finansowy na dany miesiąc
- Statystyki przychodów i wydatków
- Wykresy trendów (12 ostatnich miesięcy)

**Komponenty Dashboardu:**
- `QuickStats.jsx` - Szybkie statystyki (Przychody, Wydatki, Saldo)
- `MonthlyOverview.jsx` - Wykres trendów
- `CategoryBreakdown.jsx` - Rozkład kategorii (wykres kołowy)
- `BudgetProgress.jsx` - Postęp budżetów

## 🧠 NLP Parser (Język Polski)

Parser w `backend/src/services/nlpParser.js` przetwarzający naturalny język polski:

### Rozpoznawane Wzory

**Kwoty:**
```
50 zł, 100 PLN, 200.50 złotych, 150 gr
```

**Kategorie:**
```
Wydatki: Jedzenie, Transport, Rachunki, Rozrywka, Zakupy, Zdrowie, Edukacja
Przychody: Wynagrodzenie, Bonusy, Sprzedaż, Inne przychody
```

**Daty (względne):**
```
Dziś, wczoraj, przedwczoraj, jutro, tygodniu temu
```

**Daty (bezwzględne):**
```
15 stycznia, 25.12, 01/01, 25-01
```

**Typ transakcji:**
```
Wydatek: "wydałem", "zapłaciłem", "kupiłem", "koszt"
Przychód: "zarobek", "pensja", "bonus", "sprzedaż", "wpłata"
```

### Przykłady Przetwarzania

```
"Wydałem 50 zł na obiad"
→ { type: 'expense', amount: 50, category: 'Jedzenie', date: '2026-02-02' }

"Pensja 5000"
→ { type: 'income', amount: 5000, category: 'Wynagrodzenie', date: '2026-02-02' }

"Rachunek za prąd 200 zł 15 stycznia"
→ { type: 'expense', amount: 200, category: 'Rachunki', date: '2026-01-15' }

"Czynsz 1500 wczoraj"
→ { type: 'expense', amount: 1500, category: 'Rachunki', date: '2026-02-01' }
```

## 📊 Baza Danych

SQLite z następującymi tabelami:

### `categories`
```sql
id INTEGER PRIMARY KEY
name TEXT UNIQUE NOT NULL
type TEXT ('income' | 'expense')
color TEXT
icon TEXT
```

### `transactions`
```sql
id INTEGER PRIMARY KEY
date TEXT NOT NULL
amount REAL NOT NULL
type TEXT ('income' | 'expense')
category_id INTEGER FOREIGN KEY
description TEXT
is_recurring INTEGER
```

### `budgets`
```sql
id INTEGER PRIMARY KEY
month INTEGER
year INTEGER
category_id INTEGER FOREIGN KEY
amount REAL NOT NULL
UNIQUE(month, year, category_id)
```

### `recurring_transactions`
```sql
id INTEGER PRIMARY KEY
name TEXT
amount REAL
type TEXT ('income' | 'expense')
category_id INTEGER FOREIGN KEY
frequency TEXT ('daily'|'weekly'|'biweekly'|'monthly'|'quarterly'|'yearly')
next_date TEXT
is_active INTEGER
```

## 🔧 Usługi Backend

### `nlpParser.js`
- `parseTransaction(text)` - Przetwarzanie tekstu na strukturę transakcji
- `validateParsedTransaction(parsed)` - Walidacja sparsowanej transakcji
- `getCategoryMapping()` - Mapa słów kluczowych dla kategorii

### `forecasting.js`
- `forecastMonthlyExpenses(year, month)` - Prognoza wydatków na miesiąc
- `forecastBalance(year, month)` - Prognoza salda
- `getBudgetStatus(year, month)` - Status budżetów

### `analytics.js`
- `getCategoryBreakdown(year, month)` - Rozkład kategorii
- `getTrendData(months)` - Trendy historyczne
- `getMonthlyStats(year, month)` - Statystyki miesięczne
- `getBalance()` - Całkowite saldo

## 💾 Format Schematu

Baza danych jest automatycznie inicjalizowana przy pierwszym uruchomieniu.
Domyślnie wychodzi 12 kategorii (6 wydatkowych, 4 dochodowe + kategoria "Inne").

## 🧪 Testowanie

### Test Parsera NLP
```bash
POST /api/transactions/parse
{
  "text": "Wydałem 100 zł na jedzenie"
}
```

### Test Budżetu
```bash
POST /api/budgets
{
  "month": 2,
  "year": 2026,
  "category_id": 1,
  "amount": 1000
}
```

### Test Cyklicznych Transakcji
```bash
POST /api/recurring
{
  "name": "Czynsz",
  "amount": 1500,
  "type": "expense",
  "category_id": 3,
  "frequency": "monthly",
  "next_date": "2026-03-01"
}
```

## 📈 Funkcjonalności

✅ Chat z przetwarzaniem języka naturalnego (Polish NLP)
✅ Automatyczne rozpoznawanie kategorii i dat
✅ Dashboard z wykresami i statystykami
✅ Budżety miesięczne z alertami (80%, 100%)
✅ Prognozowanie wydatków
✅ Transakcje cykliczne (subskrypcje, pensje, czynsz)
✅ Analityka - rozkład kategorii, trendy, porównanie miesięcy
✅ Responsywny interfejs (desktop + mobile)
✅ Wbudowana baza SQLite (zero zależności zewnętrznych)

## 🌍 Obsługiwane Języki

- Interfejs: Polski
- Parser: Polski
- Lokalizacja dat: Polski

## 📱 Responsywność

Aplikacja jest w pełni responsywna i działa na:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🔐 Security Notes

- Dane przechowywane lokalnie w SQLite
- Brak autoryzacji (zakładam użytkownika lokalnego)
- CORS włączony dla localhost
- Walidacja danych na backend'zie
