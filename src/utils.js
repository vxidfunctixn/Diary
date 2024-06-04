import { toRaw } from 'vue'
import jsSHA from 'jssha'

export function isProxyDifferent(proxy1, proxy2) {
  const obj1 = toRaw(proxy1)
  const obj2 = toRaw(proxy2)
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
}

export class DateTime {
  constructor(timestamp) {
    this.timestamp = timestamp
    this.date = new Date(timestamp)
    this.year = this.date.getFullYear(),
    this.month = this.date.getMonth(),
    this.day = this.date.getDate(),
    this.hours = this.date.getHours()
    this.minutes = this.date.getMinutes()
    this.seconds = this.date.getSeconds()
    this.timeString = this.getTimeString()
  }

  getMonthName(month) {
    const months = [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ]
    return months[month]
  }

  getTimeString() {
    const hours = this.hours.toString().padStart(2, '0')
    const minutes = this.minutes.toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  getDateString() {
    const day = this.day.toString().padStart(2, '0')
    const month = (this.month + 1).toString().padStart(2, '0')
    return `${day}.${month}.${this.year}`
  }

  getFullDateString() {
    const month = this.getMonthName(this.month)
    return `${this.day} ${month} ${this.year}`
  }
}

export function hashPassword(password) {
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" })
  shaObj.update(password)
  return shaObj.getHash("HEX")
  // Change to Argon2
}

export function isToday(date) {
  let testedDate = null
  if(typeof date === 'number') {
    testedDate = new Date(date)
  }
  else if(typeof date.getMonth === 'function') {
    testedDate = date
  } else {
    console.error('Invalid date object')
    return false
  }

  const today = new Date(Date.now())
  const dayA = today.getDate()
  const monthA = today.getMonth()
  const yearA = today.getFullYear()

  const dayB = testedDate.getDate()
  const monthB = testedDate.getMonth()
  const yearB = testedDate.getFullYear()

  if(dayA !== dayB) return false
  if(monthA !== monthB) return false
  if(yearA !== yearB) return false
  return true
}

export class Calendar {
  constructor(date) {
    this.setDate(date)
  }

  setDate(date) {
    if(typeof date === 'number') {
      this.date = new Date(date)
    }
    else if(typeof date.getMonth === 'function') {
      this.date = date
    } else {
      console.error('Invalid date object')
    }
  }

  getMonth(callback = null) {
    const dateVar = new Date(this.date.valueOf())
    const currentMonth = dateVar.getMonth()
    dateVar.setDate(1)
    const firstWeekDayOfMonth = dateVar.getDay()
    dateVar.setDate(2 - firstWeekDayOfMonth)

    const rows = []
    for(let rowIndex = 0; rowIndex < 6; rowIndex++) {
      const row = []
      for(let columnIndex = 0; columnIndex < 7; columnIndex++) {
        const dateObj = new Date(dateVar.valueOf())
        const number = dateObj.getDate()
        const isCurrentMonth = dateObj.getMonth() === currentMonth
        const isCurrentDay = isToday(dateObj)
        const column = {
          date: dateObj,
          number,
          currentMonth: isCurrentMonth,
          currentDay: isCurrentDay,
        }
        const callbackReturn = typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setDate(dateVar.getDate() + 1)
      }
      rows.push(row)
    }

    return rows
  }
}