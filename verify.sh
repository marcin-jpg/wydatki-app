#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     System Zarządzania Wydatkami - Weryfikacja Projektu       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

errors=0

echo "🔍 Weryfikacja struktury projektu..."
echo ""

# Backend checks
echo "Backend:"
if [ -f "backend/package.json" ]; then
    echo "  ✅ package.json"
else
    echo "  ❌ package.json BRAK"
    ((errors++))
fi

if [ -f "backend/src/server.js" ]; then
    echo "  ✅ server.js"
else
    echo "  ❌ server.js BRAK"
    ((errors++))
fi

if [ -f "backend/src/db/database.js" ]; then
    echo "  ✅ database.js"
else
    echo "  ❌ database.js BRAK"
    ((errors++))
fi

if [ -f "backend/src/db/schema.sql" ]; then
    echo "  ✅ schema.sql"
else
    echo "  ❌ schema.sql BRAK"
    ((errors++))
fi

# Routes
echo ""
echo "Routes:"
for route in transactions categories budgets recurring analytics; do
    if [ -f "backend/src/routes/${route}.js" ]; then
        echo "  ✅ ${route}.js"
    else
        echo "  ❌ ${route}.js BRAK"
        ((errors++))
    fi
done

# Services
echo ""
echo "Services:"
for service in nlpParser forecasting analytics; do
    if [ -f "backend/src/services/${service}.js" ]; then
        echo "  ✅ ${service}.js"
    else
        echo "  ❌ ${service}.js BRAK"
        ((errors++))
    fi
done

# Frontend checks
echo ""
echo "Frontend:"
if [ -f "frontend/package.json" ]; then
    echo "  ✅ package.json"
else
    echo "  ❌ package.json BRAK"
    ((errors++))
fi

if [ -f "frontend/src/App.jsx" ]; then
    echo "  ✅ App.jsx"
else
    echo "  ❌ App.jsx BRAK"
    ((errors++))
fi

# Components
echo ""
echo "Components:"
for comp in ChatInterface ChatMessage ChatInput Dashboard QuickStats CategoryBreakdown BudgetProgress MonthlyOverview; do
    if [ -f "frontend/src/components/Chat/${comp}.jsx" ] || [ -f "frontend/src/components/Dashboard/${comp}.jsx" ]; then
        echo "  ✅ ${comp}.jsx"
    fi
done

# Documentation
echo ""
echo "Documentation:"
for doc in CLAUDE.md README.md SETUP.md IMPLEMENTATION_SUMMARY.txt; do
    if [ -f "${doc}" ]; then
        echo "  ✅ ${doc}"
    else
        echo "  ❌ ${doc} BRAK"
        ((errors++))
    fi
done

echo ""
echo "════════════════════════════════════════════════════════════════"
if [ $errors -eq 0 ]; then
    echo "✅ WSZYSTKIE PLIKI OBECNE!"
    echo ""
    echo "Aby uruchomić projekt:"
    echo ""
    echo "1. Backend:"
    echo "   cd backend && npm install && npm run dev"
    echo ""
    echo "2. Frontend (nowy terminal):"
    echo "   cd frontend && npm install && npm run dev"
    echo ""
    echo "3. Otwórz http://localhost:3000"
    echo ""
    echo "🎉 Projekt gotowy do użytku!"
else
    echo "❌ ZNALEZIONO $errors BRAKUJĄCYCH PLIKÓW"
    echo "Proszę sprawdzić strukturę projektu"
fi
echo "════════════════════════════════════════════════════════════════"
