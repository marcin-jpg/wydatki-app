# 🚀 Przewodnik Instalacji

## Wymagania Systemowe

- Node.js w wersji 16+ ([pobierz](https://nodejs.org))
- npm (zawarte w Node.js) lub yarn
- Dowolny nowoczesny przeglądarz internetowy

## Krok 1: Pobranie Projektu

```bash
# Przejdź do folderu projektu
cd "D:\Dropbox\projekty claude\osobiste\planowanie wydatkow"
```

## Krok 2: Instalacja Backend

```bash
cd backend
npm install
```

To zainstaluje wszystkie zależności:
- express (REST API)
- cors (Cross-Origin Requests)
- sqlite3 (Baza danych)
- date-fns (Obsługa dat)
- dotenv (Zmienne środowiskowe)

## Krok 3: Instalacja Frontend

```bash
# Z poziomu głównego folderu
cd frontend
npm install
```

To zainstaluje:
- react (UI Framework)
- vite (Build tool)
- axios (HTTP client)
- recharts (Wykresy)
- date-fns (Formatowanie dat)

## Krok 4: Uruchomienie Backend

Otwórz terminal w folderze `backend`:

```bash
npm run dev
```

Powinieneś zobaczyć:
```
Connected to SQLite database at ...
Database schema initialized
Server running on http://localhost:3001
```

⚠️ **Nie zamykaj tego terminala!**

## Krok 5: Uruchomienie Frontend

Otwórz drugi terminal w folderze `frontend`:

```bash
npm run dev
```

Powinieneś zobaczyć:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:3000
```

Aplikacja powinna otworzyć się automatycznie w przeglądarce na `http://localhost:3000`.

## 🎉 Gotowe!

Aplikacja jest teraz uruchomiona! Możesz:

1. **Dodawać transakcje** w Chat-cie
   - "Wydałem 50 zł na obiad"
   - "Pensja 5000"
   - "Rachunek za prąd 200 zł"

2. **Przeglądać Dashboard** z statystykami

3. **Ustawiać budżety** na kategorie

4. **Dodawać cykliczne transakcje** (pensja, czynsz, subskrypcje)

## 📋 Troubleshooting

### Port 3001 jest zajęty
Zmień port w `backend/.env`:
```
PORT=3002
```
I zaktualizuj konfigurację frontend w `frontend/vite.config.js`.

### Port 3000 jest zajęty
Zmień port w `frontend/vite.config.js`:
```javascript
server: {
  port: 3005,  // Nowy port
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

### "sqlite3 failed to install"
Na Windows może być wymagane zainstalowanie build tools:
```bash
npm install --global windows-build-tools
# A następnie ponownie
npm install
```

### CORS Error
Upewnij się, że oba servery uruchomione są na:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### Dane nie są widoczne
Poczekaj chwilę - API może pracować. Sprawdź Network tab w DevTools.

## 🗄️ Baza Danych

Baza SQLite jest automatycznie tworzona przy pierwszym uruchomieniu backend'u.
Plik bazy: `backend/src/db/expenses.db`

Aby zresetować bazę:
1. Zatrzymaj backend
2. Usuń plik `backend/src/db/expenses.db`
3. Uruchom backend ponownie

## 📚 Dalsze Kroki

1. Przeczytaj [CLAUDE.md](./CLAUDE.md) dla dokumentacji technicznej
2. Przeczytaj [README.md](./README.md) dla pełnego przewodnika
3. Zacznij dodawać transakcje!

## 🔄 Aktualizacja

Aby zaktualizować zależności:
```bash
cd backend
npm update

cd ../frontend
npm update
```

## 📞 Problemy?

Jeśli coś nie działa:
1. Sprawdź czy Node.js jest zainstalowany: `node --version`
2. Sprawdź czy porty są wolne
3. Sprawdź konsolę w DevTools (F12) szukając błędów
4. Czytaj logi w terminalach

---

**Powodzenia z planowaniem wydatków! 💰**
