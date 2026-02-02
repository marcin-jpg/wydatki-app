import { startOfDay, subDays, addDays } from 'date-fns';

const POLISH_MONTHS = {
  'stycznia': 0, 'luty': 1, 'lutym': 1, 'marca': 2, 'marcu': 2,
  'kwietnia': 3, 'kwietnia': 3, 'kwietnia': 3, 'maja': 4, 'maju': 4,
  'czerwca': 5, 'czerwcu': 5, 'lipca': 6, 'lipcu': 6,
  'sierpnia': 7, 'sierpniu': 7, 'września': 8, 'wrześniu': 8,
  'października': 9, 'październiku': 9, 'listopada': 10, 'listopadzie': 10,
  'grudnia': 11, 'grudniu': 11
};

const CATEGORY_KEYWORDS = {
  'Jedzenie': ['jedzenie', 'obiad', 'lunch', 'śniadanie', 'kolacja', 'kanapka', 'pizza', 'burger', 'zapłacił', 'zapłaciłem', 'zapłaciłam', 'kupił', 'kupiłem', 'kupiłam', 'restauracja', 'bar', 'kawiarnia', 'cukiernia', 'lody'],
  'Transport': ['transport', 'paliwo', 'benzyna', 'samochód', 'taxi', 'uber', 'tramwaj', 'autobus', 'metro', 'rower', 'komunikacja', 'przejazd', 'karta', 'abonament', 'parkomat', 'bilet'],
  'Rachunki': ['rachunek', 'prąd', 'gaz', 'woda', 'internet', 'telefon', 'czynsz', 'opłata', 'abonament', 'insurance', 'ubezpieczenie', 'czynsz', 'miesiąca'],
  'Rozrywka': ['kino', 'film', 'koncert', 'rozrywka', 'bilet', 'wstęp', 'bawić', 'gra', 'grze', 'sport', 'rekreacja'],
  'Zakupy': ['zakupy', 'shopping', 'sklep', 'supermarket', 'market', 'centrum handlowe', 'ubrania', 'buty', 'odzież'],
  'Zdrowie': ['lekarz', 'apteka', 'lek', 'medyk', 'szpital', 'stomatolog', 'dentysta', 'zdrowiej', 'fitness', 'siłownia', 'trener'],
  'Edukacja': ['szkoła', 'kurs', 'nauka', 'lekcja', 'korepetycje', 'książka', 'podręcznik', 'szkolenie', 'uniwersytet'],
  'Wynagrodzenie': ['pensja', 'wynagrodzenie', 'pensję', 'wynagrodzeniu', 'pensji', 'wypłata', 'wypłatę', 'salary'],
  'Bonusy': ['bonus', 'premię', 'premii', 'premia'],
  'Sprzedaż': ['sprzedaż', 'sprzedaży', 'sprzedałem', 'sprzedałam', 'dochód', 'przychód'],
};

const TYPE_PATTERNS = {
  income: ['przychód', 'dochód', 'zarobek', 'zarobili', 'zarobiliśmy', 'wpłata', 'wpłatę', 'pensja', 'wypłata', 'bonus', 'sprzedaż', 'dochodów', 'zarabiłem', 'zarabiałem', 'dostał', 'dostałem', 'dostałam'],
  expense: ['wydałem', 'wydałam', 'wydatki', 'wydatek', 'wydały', 'wydały', 'zapłacił', 'zapłaciłem', 'zapłaciłam', 'zapłacę', 'kupiłem', 'kupiłam', 'kupił', 'koszt', 'koszty', 'wydać', 'wydawał']
};

const AMOUNT_PATTERNS = [
  /(\d+(?:[.,]\d{1,2})?)\s*(?:zł|zloty|złotych|złoty|pln)/gi,
  /(\d+(?:[.,]\d{1,2})?)\s*(?:groszy|gr)/gi
];

export function parseTransaction(text) {
  const result = {
    type: null,
    amount: null,
    category: null,
    date: new Date().toISOString().split('T')[0],
    description: text,
    confidence: 0
  };

  // Parse type (income/expense)
  const lowerText = text.toLowerCase();

  for (const type of ['income', 'expense']) {
    const keywords = TYPE_PATTERNS[type];
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      result.type = type;
      break;
    }
  }

  // If no type detected, assume expense
  if (!result.type) {
    result.type = 'expense';
  }

  // Parse amount
  const amountMatch = text.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:zł|zloty|złotych|złoty|pln)?/i) || text.match(/(\d+(?:[.,]\d{1,2})?)/);
  if (amountMatch && amountMatch[1]) {
    const amountStr = amountMatch[1].replace(',', '.');
    result.amount = parseFloat(amountStr);
  } else if (amountMatch && amountMatch[0]) {
    const amountStr = amountMatch[0].replace(',', '.');
    result.amount = parseFloat(amountStr);
  }

  // Parse category
  const categoryScores = {};
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += keyword.length; // Longer keywords have more weight
      }
    }
    if (score > 0) {
      categoryScores[category] = score;
    }
  }

  if (Object.keys(categoryScores).length > 0) {
    result.category = Object.keys(categoryScores).reduce((a, b) =>
      categoryScores[a] > categoryScores[b] ? a : b
    );
  } else {
    result.category = result.type === 'income' ? 'Inne przychody' : 'Inne';
  }

  // Parse date
  result.date = parseDate(text) || result.date;

  // Calculate confidence
  result.confidence = (
    (result.type ? 0.3 : 0) +
    (result.amount ? 0.4 : 0) +
    (result.category ? 0.3 : 0)
  );

  return result;
}

function parseDate(text) {
  const today = startOfDay(new Date());
  const lowerText = text.toLowerCase();

  // Check relative dates
  if (lowerText.includes('dziś') || lowerText.includes('dzisiaj')) {
    return today.toISOString().split('T')[0];
  }
  if (lowerText.includes('wczoraj')) {
    return subDays(today, 1).toISOString().split('T')[0];
  }
  if (lowerText.includes('przedwczoraj') || lowerText.includes('przedwczorajem')) {
    return subDays(today, 2).toISOString().split('T')[0];
  }
  if (lowerText.includes('jutro')) {
    return addDays(today, 1).toISOString().split('T')[0];
  }

  // Check for "tygodniu temu", "dwa tygodnie temu", etc.
  const weekAgoMatch = text.match(/(\d+)\s*(?:tydzień|tygodni?|tyg\.?)/i);
  if (weekAgoMatch || lowerText.includes('tygodniu temu')) {
    const weeks = weekAgoMatch ? parseInt(weekAgoMatch[1]) : 1;
    return subDays(today, weeks * 7).toISOString().split('T')[0];
  }

  // Check for specific day and month pattern (e.g., "15 stycznia")
  const dayMonthMatch = text.match(/(\d{1,2})\s+([a-ząćęłńóśźż]+)/i);
  if (dayMonthMatch) {
    const day = parseInt(dayMonthMatch[1]);
    const monthStr = dayMonthMatch[2].toLowerCase();
    const month = POLISH_MONTHS[monthStr];

    if (month !== undefined && day >= 1 && day <= 31) {
      const year = today.getFullYear();
      const date = new Date(year, month, day);
      return date.toISOString().split('T')[0];
    }
  }

  // Check for "25.12" or "25/12" format
  const dateFormatMatch = text.match(/(\d{1,2})[./](\d{1,2})/);
  if (dateFormatMatch) {
    const day = parseInt(dateFormatMatch[1]);
    const month = parseInt(dateFormatMatch[2]) - 1;
    const year = today.getFullYear();
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  }

  return null;
}

export function getCategoryMapping() {
  return CATEGORY_KEYWORDS;
}

export function validateParsedTransaction(parsed) {
  const errors = [];

  if (!parsed.type || !['income', 'expense'].includes(parsed.type)) {
    errors.push('Type must be "income" or "expense"');
  }
  if (!parsed.amount || parsed.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  if (!parsed.category) {
    errors.push('Category is required');
  }
  if (!parsed.date) {
    errors.push('Date is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
