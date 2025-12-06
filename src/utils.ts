import { toRaw } from 'vue'
import jsSHA from 'jssha'
import type {
  DateCompareOptions,
  CalendarDay,
  CalendarMonth,
  CalendarYear
} from '@/interfaces/calendar-interface'

type CalendarCallback<T> = (this: T, column: T) => T

// Funkcja porównująca Vue proxy
export function isProxyDifferent(proxy1: any, proxy2: any): boolean {
  const obj1 = toRaw(proxy1)
  const obj2 = toRaw(proxy2)
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
}

// Funkcja zwracająca nazwę miesiąca
export function getMonthName(month: number): string {
  const months: string[] = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień'
  ]
  return months[month]
}

export function formatDate(date: Date): string {
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}.${month}.${year}`
}

// Klasa DateTime do zarządzania datami
export class DateTime {
  timestamp: number
  date: Date
  year: number
  month: number
  monthName: string
  day: number
  hours: number
  minutes: number
  seconds: number
  timeString: string
  dateString: string
  fullDateString: string

  constructor(timestamp: number) {
    this.timestamp = 0
    this.date = new Date()
    this.year = 0
    this.month = 0
    this.monthName = ''
    this.day = 0
    this.hours = 0
    this.minutes = 0
    this.seconds = 0
    this.timeString = ''
    this.dateString = ''
    this.fullDateString = ''
    this.setTimestamp(timestamp)
  }

  setTimestamp(timestamp: number): void {
    this.timestamp = timestamp
    this.date = new Date(timestamp)
    this.year = this.date.getFullYear()
    this.month = this.date.getMonth()
    this.monthName = getMonthName(this.month)
    this.day = this.date.getDate()
    this.hours = this.date.getHours()
    this.minutes = this.date.getMinutes()
    this.seconds = this.date.getSeconds()
    this.timeString = this.getTimeString()
    this.dateString = this.getDateString()
    this.fullDateString = this.getFullDateString()
  }

  setDay(days: number = 0): void {
    const newDate = new Date(this.date.setDate(this.day + days))
    this.setTimestamp(newDate.valueOf())
  }

  setMonth(months: number = 0): void {
    const newDate = new Date(this.year, this.month + (months + 1), 0)
    const monthLength = newDate.getDate()
    if (this.day < monthLength) newDate.setDate(this.day)
    this.setTimestamp(newDate.valueOf())
  }

  setYears(years: number = 0): void {
    const newDate = new Date(this.year + years, this.month + 1, 0)
    const monthLength = newDate.getDate()
    if (this.day < monthLength) newDate.setDate(this.day)
    this.setTimestamp(newDate.valueOf())
  }

  nextDay(): void {
    this.setDay(1)
  }
  prevDay(): void {
    this.setDay(-1)
  }
  nextMonth(): void {
    this.setMonth(1)
  }
  prevMonth(): void {
    this.setMonth(-1)
  }
  nextYear(): void {
    this.setYears(1)
  }
  prevYear(): void {
    this.setYears(-1)
  }

  getTimeString(): string {
    const hours = this.hours.toString().padStart(2, '0')
    const minutes = this.minutes.toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  getDateString(): string {
    const day = this.day.toString().padStart(2, '0')
    const month = (this.month + 1).toString().padStart(2, '0')
    return `${day}.${month}.${this.year}`
  }

  getFullDateString(): string {
    const month = getMonthName(this.month)
    return `${this.day} ${month} ${this.year}`
  }
}

// Funkcja sanityzująca zawartość z tagów HTML
function sanitizeContent(content: string): string {
  // Usuń wszystkie tagi HTML z zawartości
  let sanitized = content.replace(/<[^>]+>/g, '')

  // Usuń potencjalnie niebezpieczne sekwencje
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  return sanitized
}

// Funkcja sanityzująca URL
function sanitizeUrl(url: string): string {
  // Usuń białe znaki
  url = url.trim()

  // Dozwolone protokoły
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']

  try {
    const urlObj = new URL(url)
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return '' // Odrzuć niedozwolone protokoły (javascript:, data:, itp.)
    }
  } catch {
    // Jeśli URL jest relatywny lub nieprawidłowy, sprawdź czy nie zawiera javascript:
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:')) {
      return ''
    }
  }

  return url
}

// Funkcja konwertująca HTML na Markdown
export function htmlToMarkdown(html: string): string {
  let markdown = html

  // Linki - z sanityzacją URL
  markdown = markdown.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    (match, url, text) => {
      const sanitizedUrl = sanitizeUrl(url)
      const sanitizedText = sanitizeContent(text)
      return sanitizedUrl ? `[${sanitizedText}](${sanitizedUrl})` : sanitizedText
    }
  )

  // Mark (wyróżnienie) - z sanityzacją zawartości
  markdown = markdown.replace(/<mark[^>]*>(.*?)<\/mark>/gi, (match, content) => {
    return '`' + sanitizeContent(content) + '`'
  })

  // Pogrubienie - z sanityzacją zawartości
  markdown = markdown.replace(/<(strong|b)>(.*?)<\/\1>/gi, (match, tag, content) => {
    return '**' + sanitizeContent(content) + '**'
  })

  // Kursywa - z sanityzacją zawartości
  markdown = markdown.replace(/<(em|i)>(.*?)<\/\1>/gi, (match, tag, content) => {
    return '*' + sanitizeContent(content) + '*'
  })

  // Przekreślenie - z sanityzacją zawartości
  markdown = markdown.replace(/<(strike|s|del)>(.*?)<\/\1>/gi, (match, tag, content) => {
    return '~~' + sanitizeContent(content) + '~~'
  })

  // Podkreślenie - usuwamy obsługę HTML, zamieniamy na zwykły tekst
  markdown = markdown.replace(/<u>(.*?)<\/u>/gi, (match, content) => {
    return sanitizeContent(content)
  })

  // Łamanie linii
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n')

  // Usuń wszystkie pozostałe tagi HTML i potencjalnie niebezpieczny kod
  markdown = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  markdown = markdown.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  markdown = markdown.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  markdown = markdown.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
  markdown = markdown.replace(/<embed[^>]*>/gi, '')
  markdown = markdown.replace(/<[^>]+>/g, '')

  // Usuń atrybuty event handlerów
  markdown = markdown.replace(/on\w+\s*=\s*"[^"]*"/gi, '')
  markdown = markdown.replace(/on\w+\s*=\s*'[^']*'/gi, '')

  // Dekoduj encje HTML
  markdown = markdown
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Usuń nadmiar pustych linii
  markdown = markdown.replace(/\n{3,}/g, '\n\n')

  return markdown.trim()
}

// Funkcja konwertująca Markdown na HTML
export function markdownToHtml(markdown: string): string {
  let html = markdown

  // Escape HTML entities na początku
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  // Linki [text](url) - z sanityzacją URL
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const sanitizedUrl = sanitizeUrl(url)
    // Decode HTML entities w tekście
    const decodedText = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
    return sanitizedUrl ? `<a href="${sanitizedUrl}">${decodedText}</a>` : decodedText
  })

  // Pogrubienie **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // Kursywa *text* (ale nie w środku słowa i nie podwójne *)
  html = html.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>')

  // Przekreślenie ~~text~~
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')

  // Mark `text` (wyróżnienie)
  html = html.replace(/`([^`]+)`/g, '<mark>$1</mark>')

  // Łamanie linii - pojedyncze \n na <br>
  html = html.replace(/\n/g, '<br>')

  return html
}

// Funkcja haszująca hasło
export function hashPassword(password: string): string {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' })
  shaObj.update(password)
  return shaObj.getHash('HEX')
  // Change to Argon2
}

// Funkcja porównująca daty
export function isEqualDate(
  dateA: number | Date,
  dateB: number | Date,
  options: DateCompareOptions = {}
): boolean {
  const validOptions: Required<DateCompareOptions> = {
    day: options && options.day === false ? false : true,
    month: options && options.month === false ? false : true,
    year: options && options.year === false ? false : true
  }

  let testedDateA: Date | null = null
  let testedDateB: Date | null = null
  if (typeof dateA === 'number') {
    testedDateA = new Date(dateA)
  } else if (typeof (dateA as Date).getMonth === 'function') {
    testedDateA = dateA as Date
  } else {
    console.error('Invalid dateA object')
    return false
  }

  if (typeof dateB === 'number') {
    testedDateB = new Date(dateB)
  } else if (typeof (dateB as Date).getMonth === 'function') {
    testedDateB = dateB as Date
  } else {
    console.error('Invalid dateB object')
    return false
  }

  const dayA = testedDateA.getDate()
  const monthA = testedDateA.getMonth()
  const yearA = testedDateA.getFullYear()

  const dayB = testedDateB.getDate()
  const monthB = testedDateB.getMonth()
  const yearB = testedDateB.getFullYear()

  if (dayA !== dayB && validOptions.day) return false
  if (monthA !== monthB && validOptions.month) return false
  if (yearA !== yearB && validOptions.year) return false
  return true
}

// Funkcja sprawdzająca czy data jest dzisiaj
export function isToday(date: number | Date, options?: DateCompareOptions): boolean {
  return isEqualDate(date, Date.now(), options)
}

// Klasa Calendar
export class Calendar {
  private date: Date

  constructor(date: number | Date) {
    this.date = new Date()
    this.setDate(date)
  }

  setDate(date: number | Date): void {
    if (typeof date === 'number') {
      this.date = new Date(date)
    } else if (typeof (date as Date).getMonth === 'function') {
      this.date = date as Date
    } else {
      console.error('Invalid date object')
    }
  }

  getMonth(callback: CalendarCallback<CalendarDay> | null = null): CalendarDay[][] {
    const dateVar = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    const currentMonth = dateVar.getMonth()
    let firstWeekDayOfMonth = -dateVar.getDay() + 2
    if (firstWeekDayOfMonth > 1) firstWeekDayOfMonth -= 7
    dateVar.setDate(firstWeekDayOfMonth)

    const rows: CalendarDay[][] = []
    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
      const row: CalendarDay[] = []
      for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
        const dateObj = new Date(dateVar.valueOf())
        const number = dateObj.getDate()
        const isCurrentMonth = dateObj.getMonth() === currentMonth
        const isCurrentDay = isToday(dateObj)
        const column: CalendarDay = {
          date: dateObj,
          number,
          currentMonth: isCurrentMonth,
          currentDay: isCurrentDay
        }
        const callbackReturn =
          typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setDate(dateVar.getDate() + 1)
      }
      rows.push(row)
    }

    return rows
  }

  getYear(callback: CalendarCallback<CalendarMonth> | null = null): CalendarMonth[][] {
    const dateVar = new Date(this.date.getFullYear(), 0, 1)

    const rows: CalendarMonth[][] = []
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row: CalendarMonth[] = []
      for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        const dateObj = new Date(dateVar.getFullYear(), dateVar.getMonth() + 1, 0)
        const monthLength = dateObj.getDate()
        const currentDay = this.date.getDate()
        if (currentDay < monthLength) dateObj.setDate(currentDay)
        const isCurrentMonth = isToday(dateObj, {
          day: false
        })
        const monthName = getMonthName(dateObj.getMonth())
        const column: CalendarMonth = {
          date: dateObj,
          name: monthName,
          currentMonth: isCurrentMonth
        }
        const callbackReturn =
          typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setMonth(dateVar.getMonth() + 1)
      }
      rows.push(row)
    }

    return rows
  }

  getYears(callback: CalendarCallback<CalendarYear> | null = null): CalendarYear[][] {
    const currentYear = this.date.getFullYear()
    const startYear = currentYear - (currentYear % 20)
    const dateVar = new Date(startYear, 0, 1)
    const rows: CalendarYear[][] = []

    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      const row: CalendarYear[] = []
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const year = dateVar.getFullYear()
        const dateObj = new Date(year, this.date.getMonth() + 1, 0)
        const monthLength = dateObj.getDate()
        const currentDay = this.date.getDate()
        if (currentDay < monthLength) dateObj.setDate(currentDay)
        const isCurrentYear = isToday(dateObj, {
          day: false,
          month: false
        })
        const column: CalendarYear = {
          date: dateObj,
          number: year,
          currentYear: isCurrentYear
        }

        const callbackReturn =
          typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setFullYear(dateVar.getFullYear() + 1)
      }
      rows.push(row)
    }
    return rows
  }
}
