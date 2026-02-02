# ▶️ Jak Uruchomić Aplikację - Jeden Przycisk!

## 🚀 Opcja 1: START.bat (NAJLEPIEJ) ⭐

### Jak użyć:

1. Przejdź do folderu: `D:\Dropbox\projekty claude\osobiste\planowanie wydatkow`
2. **Dwukrotnie kliknij**: `START.bat`
3. Czekaj 10-15 sekund
4. Aplikacja otworzy się automatycznie na: **http://localhost:3000**

### Co się stanie:

- ✅ Otworzy się 2 nowe okna terminala
- ✅ Pierwsze okno: Backend (port 3001)
- ✅ Drugie okno: Frontend (port 3000)
- ✅ Przeglądarka: Automatyczne otwarcie aplikacji
- ✅ Aplikacja: Gotowa do użycia!

### Aby zatrzymać:

Zamknij oba okna terminala.

---

## 🚀 Opcja 2: START.ps1 (PowerShell)

### Jak użyć:

1. Kliknij prawym przyciskiem na `START.ps1`
2. Wybierz: **Uruchom w PowerShell**
3. Jeśli pojawi się błąd, wpisz w PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
4. Następnie ponownie uruchom `START.ps1`

---

## 🚀 Opcja 3: Shortcut (Ikona na pulpicie)

### Jak stworzyć:

1. Kliknij prawym przyciskiem na `START.bat`
2. Wybierz: **Wyślij do** → **Pulpit (utwórz skrót)**
3. Na pulpicie pojawi się ikona
4. Od teraz wystarczy dwukliknąć ikonę!

---

## 🚀 Opcja 4: Ręczne - Command Prompt

Jeśli nic powyżej nie działa:

```bash
# Otwórz Command Prompt (Win + R, cmd)
cd "D:\Dropbox\projekty claude\osobiste\planowanie wydatkow"
START.bat
```

---

## ⚠️ Wymagania

- ✅ Node.js zainstalowany ([pobierz](https://nodejs.org))
- ✅ Porty 3000 i 3001 wolne
- ✅ Windows Vista lub nowszy

---

## 🔍 Troubleshooting

### Problem: "Node.js nie jest zainstalowany"

**Rozwiązanie:**
1. Pobierz Node.js: https://nodejs.org
2. Zainstaluj (domyślne ustawienia)
3. Uruchom ponownie `START.bat`

### Problem: "Błąd przy instalacji"

**Rozwiązanie:**
1. Usuń foldery: `backend/node_modules` i `frontend/node_modules`
2. Usuń pliki: `backend/package-lock.json` i `frontend/package-lock.json`
3. Uruchom `START.bat` ponownie

### Problem: "Port już zajęty"

**Rozwiązanie:**
1. Sprawdź czy aplikacja nie jest już uruchomiona
2. Lub zmień port w `backend/.env` (zmień `3001` na inny numer)

### Problem: Przeglądarka się nie otworzyła

**Rozwiązanie:**
Otwórz ręcznie: http://localhost:3000

### Problem: "The system cannot find the path specified"

**Rozwiązanie:**
1. Sprawdź czy jesteś w dobrym folderze
2. Upewnij się że `START.bat` jest w głównym folderze projektu
3. Spróbuj: `C:\Users\[YOUR_USER]\Dropbox\projekty claude\osobiste\planowanie wydatkow`

---

## 📊 Co Powinno Się Stać

### Po uruchomieniu `START.bat`:

```
╔════════════════════════════════════════════════════════════════╗
║     System Zarządzania Wydatkami - Uruchomienie                ║
╚════════════════════════════════════════════════════════════════╝

📂 Folder projektu: D:\Dropbox\projekty claude\osobiste\planowanie wydatkow

✅ Node.js znaleziony
v18.17.0

🔧 Uruchamianie Backend'u...
✅ Backend uruchomiony w nowym oknie

⚛️  Uruchamianie Frontend'u...
✅ Frontend uruchomiony w nowym oknie

═══════════════════════════════════════════════════════════════════

🎉 Aplikacja uruchamia się!

🌐 Strona będzie dostępna na: http://localhost:3000

Czekaj 10-15 sekund aż strona się załaduje...

✅ Backend: http://localhost:3001
✅ Frontend: http://localhost:3000

═══════════════════════════════════════════════════════════════════

Aby zatrzymać aplikację, zamknij oba okna terminala.
```

### Po 10-15 sekundach:

- Przeglądarka otworzy się automatycznie
- Zobaczysz aplikację na http://localhost:3000
- Gotowe do użycia! 🎉

---

## 🎯 Kolejne Kroki

1. ✅ Uruchomiono aplikację
2. ✅ Przeglądarka otwarta
3. 📝 Wpisz w chacie: "Wydałem 50 zł na obiad"
4. 📊 Przejdź do Dashboard aby zobaczyć wykresy
5. 💰 Dodaj budżety i transakcje!

---

## 🆘 Potrzebujesz Pomocy?

- Czytaj: **README.md**
- Instalacja: **SETUP.md**
- Szybka ref: **QUICK_REFERENCE.md**
- Technika: **CLAUDE.md**

---

## 💡 Pro Tip

Możesz stworzyć skrót na Pulpicie:

1. Kliknij prawym na `START.bat`
2. **Wyślij do** → **Pulpit (utwórz skrót)**
3. Teraz wystarczy dwukliknąć ikonę na pulpicie!

---

**Powodzenia! 💰**
