# ⚡ Szybka Referencyjna

## 🚀 Start (3 kroki)

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev

# Otwórz http://localhost:3000
```

## 💬 Parser NLP - Przykłady

```
"Wydałem 50 zł na obiad"
→ Wydatek 50 PLN | Jedzenie | Dziś

"Pensja 5000"
→ Przychód 5000 PLN | Wynagrodzenie | Dziś

"Rachunek 200 wczoraj"
→ Wydatek 200 PLN | Rachunki | Wczoraj

"Zakupy 350 zł 25 stycznia"
→ Wydatek 350 PLN | Zakupy | 25 stycznia

"Bonus 500 zł"
→ Przychód 500 PLN | Bonusy | Dziś
```

## 📂 Kategorie Domyślne

**Wydatki:**
- 🍔 Jedzenie
- 🚗 Transport
- 💡 Rachunki
- 🎬 Rozrywka
- 🛍️ Zakupy
- 🏥 Zdrowie
- 📚 Edukacja
- 📌 Inne

**Przychody:**
- 💰 Wynagrodzenie
- 🎁 Bonusy
- 📦 Sprzedaż
- 📈 Inne przychody

## 🔗 API Endpoints

### Transakcje
```
POST   /api/transactions/parse
GET    /api/transactions?month=2&year=2026
GET    /api/transactions/:id
PUT    /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/transactions/stats/monthly?month=2&year=2026
```

### Budżety
```
GET    /api/budgets?month=2&year=2026
POST   /api/budgets
PUT    /api/budgets/:id
DELETE /api/budgets/:id
```

### Transakcje Cykliczne
```
GET    /api/recurring
POST   /api/recurring
PUT    /api/recurring/:id
DELETE /api/recurring/:id
POST   /api/recurring/:id/process
```

### Analityka
```
GET    /api/analytics/breakdown?month=2&year=2026
GET    /api/analytics/trends?months=12
GET    /api/analytics/monthly?month=2&year=2026
GET    /api/analytics/forecast?month=2&year=2026
GET    /api/analytics/budget-status?month=2&year=2026
```

## 📊 Struktura Bazy Danych

### Transakcje
```sql
{
  id: Integer,
  date: "2026-02-02",
  amount: 50.00,
  type: "expense" | "income",
  category_id: Integer,
  description: "String",
  is_recurring: 0 | 1
}
```

### Budżety
```sql
{
  id: Integer,
  month: 2,
  year: 2026,
  category_id: Integer,
  amount: 1000.00
}
```

### Transakcje Cykliczne
```sql
{
  id: Integer,
  name: "Czynsz",
  amount: 1500.00,
  type: "expense",
  category_id: Integer,
  frequency: "monthly",
  next_date: "2026-03-01",
  is_active: 1
}
```

## 🎨 Kolory

```
Primary Purple:    #667eea
Secondary Purple:  #764ba2
Success Green:     #27ae60
Warning Orange:    #f39c12
Error Red:         #e74c3c
Light Gray:        #f8f9fa
```

## 📱 Breakpoints (Responsive)

```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## 🧪 Testowanie API

### cURL - Dodaj transakcję
```bash
curl -X POST http://localhost:3001/api/transactions/parse \
  -H "Content-Type: application/json" \
  -d '{"text": "Wydałem 50 zł na obiad"}'
```

### cURL - Pobierz transakcje
```bash
curl http://localhost:3001/api/transactions?month=2&year=2026
```

### cURL - Ustaw budżet
```bash
curl -X POST http://localhost:3001/api/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "month": 2,
    "year": 2026,
    "category_id": 1,
    "amount": 1000
  }'
```

## 🔧 Zmienne Środowiskowe

Backend `.env`:
```
PORT=3001
NODE_ENV=development
```

Frontend proxy (vite.config.js):
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

## 🐛 Troubleshooting

| Problem | Rozwiązanie |
|---------|------------|
| Port zajęty | Zmień PORT w .env |
| Brak bazy | Uruchom backend (auto-inicjalizacja) |
| CORS error | Sprawdź porty i proxy config |
| Parser nie działa | Użyj dokładnych słów kluczowych |
| Brak danych | Sprawdź konsolę, spróbuj F5 |

## 📚 Pliki Dokumentacji

- **README.md** - Pełny przewodnik użytkownika
- **SETUP.md** - Instrukcja instalacji krok po kroku
- **CLAUDE.md** - Dokumentacja techniczna
- **QUICK_REFERENCE.md** - Ten plik

## 🎯 Typowy Workflow

1. **Uruchom backend i frontend**
2. **Otwórz http://localhost:3000**
3. **Przejdź do Chat tab**
4. **Wpisz transakcję naturalnym językiem**
5. **System przetworzy i dodaje**
6. **Przejdź do Dashboard**
7. **Przeglądaj statystyki i wykresy**

## 💾 Backup Bazy

```bash
# Baza znajduje się w:
backend/src/db/expenses.db

# Aby zresetować:
# 1. Zatrzymaj backend
# 2. Usuń expenses.db
# 3. Uruchom backend ponownie
```

## 🔐 Security Notes

- Baza SQLite przechowywana lokalnie
- Brak transmisji do internetu
- CORS ograniczony do localhost
- Walidacja danych na serwerze

## 📈 Performance Tips

- Parser działa w ~10ms
- Dashboard ładuje dane w <100ms
- Baza SQLite obsługuje 10k+ transakcji
- Responsywne UI bez lag-u

## 🌟 Pro Tips

1. Używaj skrótów: "50 jedzenie" zamiast "wydałem 50 zł na jedzenie"
2. Parser rozumie fleksję: "pensja", "pensję", "pensji"
3. Daty względne oszczędzają czas: "wczoraj" zamiast wpisywania daty
4. Dashboard auto-ładuje się co zmianę widoku
5. Budżety automatycznie obliczają procent

## 🎓 Nauka

Zacznij od:
1. README.md - Zrozum aplikację
2. SETUP.md - Zainstaluj
3. Spróbuj chat - 5 transakcji
4. Otwórz Dashboard - Zobaczysz wykresy
5. CLAUDE.md - Dokumentacja techniczna

---

**Powodzenia z planowaniem! 💰**
