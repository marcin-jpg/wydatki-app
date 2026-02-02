export function getMonthYear() {
  const today = new Date();
  return {
    month: today.getMonth() + 1,
    year: today.getFullYear()
  };
}

export function formatDate(date) {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString().split('T')[0];
}

export function isToday(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

export function isThisMonth(dateStr, month, year) {
  const [y, m] = dateStr.split('-');
  return parseInt(m) === month && parseInt(y) === year;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function getMonthName(month) {
  const names = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];
  return names[month - 1];
}
