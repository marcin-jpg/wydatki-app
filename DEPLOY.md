# 🚀 Wdrażanie na Vercel + Render

## Gotowy URL po Wdrożeniu:
```
Frontend: https://wydatki-app.vercel.app
Backend:  https://wydatki-api.onrender.com
```

---

## 📋 KROK 1: GitHub Account (Wymagane)

1. Zaloguj się lub stwórz konto: https://github.com
2. Zapamiętaj email i hasło

---

## 📋 KROK 2: Wrzuć Projekt na GitHub

### 2.1 Inicjuj Git (jeśli nie ma)
```bash
cd "D:\Dropbox\projekty claude\osobiste\planowanie wydatkow"
git init
git config user.name "Twoje Imię"
git config user.email "twoj.email@example.com"
```

### 2.2 Dodaj wszystko do Git'a
```bash
git add .
git commit -m "Initial commit - Wydatki App"
```

### 2.3 Utwórz Repo na GitHub

1. Przejdź: https://github.com/new
2. Nazwa: `wydatki-app`
3. Kliknij: "Create repository"
4. Skopiuj URL (np. `https://github.com/TWOJA_NAZWA/wydatki-app.git`)

### 2.4 Wrzuć do GitHub'a
```bash
git branch -M main
git remote add origin https://github.com/TWOJA_NAZWA/wydatki-app.git
git push -u origin main
```

---

## 🎯 KROK 3: Wdrażanie Frontend'u (Vercel)

### 3.1 Zaloguj się na Vercel

1. Przejdź: https://vercel.com
2. Kliknij: "Sign Up"
3. Wybierz: "Continue with GitHub"
4. Autoryzuj GitHub

### 3.2 Importuj Projekt

1. Na stronie Vercel kliknij: "New Project"
2. Wybierz: "wydatki-app" z GitHub
3. Konfiguracja:
   - Framework: `Next.js` → zmień na `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3.3 Zmienne Środowiskowe

W sekcji "Environment Variables" dodaj:
```
Nazwa: VITE_API_URL
Wartość: https://wydatki-api.onrender.com
```

### 3.4 Deploy!

Kliknij: "Deploy" i czekaj ~2 minuty

**Gratulacje! Frontend jest live!** 🎉

URL będzie coś typu:
```
https://wydatki-app-TWOJA-NAZWA.vercel.app
```

---

## 🎯 KROK 4: Wdrażanie Backend'u (Render)

### 4.1 Zaloguj się na Render

1. Przejdź: https://render.com
2. Kliknij: "Sign Up"
3. Wybierz: "Continue with GitHub"
4. Autoryzuj GitHub

### 4.2 Utwórz Web Service

1. Kliknij: "New Web Service"
2. Wybierz: `wydatki-app` z GitHub
3. Konfiguracja:
   - Name: `wydatki-api`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm run dev`
   - Root Directory: nie wymagane (zoaw puste)

### 4.3 Zmienne Środowiskowe

W sekcji "Environment" dodaj:
```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://wydatki-app-TWOJA-NAZWA.vercel.app
```

(Zamień `TWOJA-NAZWA` na Twoje rzeczywiste ID z Vercel)

### 4.4 Deploy!

Kliknij: "Create Web Service" i czekaj ~3-5 minut

**Gotowe! Backend żyje!** 🎉

URL będzie:
```
https://wydatki-api.onrender.com
```

---

## ✅ KROK 5: Aktualizacja Frontend'u

Teraz zaktualizuj Frontend aby łączył się z Render:

### 5.1 Zmień API URL

W Vercel Dashboard:
1. Przejdź: Project → Settings → Environment Variables
2. Zmień wartość `VITE_API_URL` na: `https://wydatki-api.onrender.com`

### 5.2 Re-deploy

Kliknij: "Deployments" → "..." → "Redeploy"

---

## 🎯 KROK 6: Testowanie

### Otwórz w Przeglądarce:
```
https://wydatki-app-TWOJA-NAZWA.vercel.app
```

### Spróbuj:
1. Chat tab
2. Wpisz: "Wydałem 50 zł na obiad"
3. Powinno dodać transakcję!

### Jeśli Błąd:
- Sprawdzaj konsolę (F12)
- Czytaj błędy w Network tab
- Upewnij się że Backend jest uruchomiony (URL powinien być dostępny)

---

## 📱 Finalne URL'e

Po skończeniu będziesz mieć:

```
🌐 Frontend (Strona Internetowa):
   https://wydatki-app-TWOJA-NAZWA.vercel.app

🔌 Backend (API):
   https://wydatki-api.onrender.com

💾 Baza Danych:
   SQLite na Render'ze
```

---

## 🆘 Troubleshooting

### Problem: Frontend się nie łączy z Backend'em

**Rozwiązanie:**
1. Sprawdź czy VITE_API_URL jest poprawnie ustawiony
2. Sprawdź konsolę (F12) - jaki błąd?
3. Upewnij się że Backend URL jest dostępny w przeglądarce

### Problem: Backend zwraca 503 Service Unavailable

**Rozwiązanie:**
1. Render może być w trakcie budowania
2. Czekaj 5 minut
3. Odśwież stronę

### Problem: Baza danych nie działa

**Rozwiązanie:**
1. SQLite jest lokalny na Render'ze
2. Przy każdym redeployu baza się resetuje
3. (To jest znane ograniczenie SQLite w chmurze)
4. Rozwiązanie: Migracja na PostgreSQL (paid)

### Problem: Nie mogę wrzucić na GitHub

**Rozwiązanie:**
1. Zainstaluj Git: https://git-scm.com
2. Uwierzytelniaj się: `git config --global user.email "..."`
3. Jeśli SSH, wygeneruj klucz: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 📋 Checklist Wdrażania

- [ ] GitHub account stworzony
- [ ] Projekt wrzucony na GitHub
- [ ] Vercel account stworzony
- [ ] Frontend wdrożony na Vercel
- [ ] Render account stworzony
- [ ] Backend wdrożony na Render
- [ ] VITE_API_URL ustawiony na Vercel
- [ ] FRONTEND_URL ustawiony na Render
- [ ] Frontend re-deployowany
- [ ] Strona testowana i działa!

---

## 🎉 Sukces!

Gratulacje! Twoja aplikacja jest teraz dostępna w internecie!

Możesz ją udostępnić komukolwiek i będzie dostępna 24/7! 🚀

---

## 💡 Następne Kroki (Opcjonalne)

### Własna Domena
- Vercel: https://vercel.com/docs/concepts/projects/custom-domains
- Render: https://render.com/docs/custom-domains

### Baza Danych (zamiast SQLite)
- PostgreSQL na Render (płatne)
- MongoDB Atlas (darmowe)

### Monitorowanie
- Sentry: Error tracking
- LogRocket: User session recording

---

**Powodzenia! 🚀💰**
