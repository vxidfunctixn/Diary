import { toRaw } from 'vue'
import jsSHA from 'jssha'

export function isProxyDifferent(proxy1, proxy2) {
  const obj1 = toRaw(proxy1)
  const obj2 = toRaw(proxy2)
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
}

export function getMonthName(month) {
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

export class DateTime {
  constructor(timestamp) {
    this.setTimestamp(timestamp)
  }

  setTimestamp(timestamp) {
    this.timestamp = timestamp
    this.date = new Date(timestamp)
    this.year = this.date.getFullYear(),
    this.month = this.date.getMonth(),
    this.monthName = getMonthName(this.month),
    this.day = this.date.getDate(),
    this.hours = this.date.getHours()
    this.minutes = this.date.getMinutes()
    this.seconds = this.date.getSeconds()
    this.timeString = this.getTimeString()
    this.dateString = this.getDateString()
    this.fullDateString = this.getFullDateString()
  }

  setDay(days = 0) {
    const newDate = new Date(this.date.setDate(this.day + days))
    this.setTimestamp(newDate.valueOf())
  }

  setMonth(months = 0) {
    const newDate = new Date(this.year, this.month + (months + 1), 0)
    const monthLength = newDate.getDate()
    if(this.day < monthLength) newDate.setDate(this.day)
    this.setTimestamp(newDate.valueOf())
  }

  setYears(years = 0) {
    const newDate = new Date(this.year + years, this.month + 1, 0)
    const monthLength = newDate.getDate()
    if(this.day < monthLength) newDate.setDate(this.day)
    this.setTimestamp(newDate.valueOf())
  }

  nextDay() { this.setDay(1) }
  prevDay() { this.setDay(-1) }
  nextMonth() { this.setMonth(1) }
  prevMonth() { this.setMonth(-1) }
  nextYear() { this.setYears(1) }
  prevYear() { this.setYears(-1) }

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
    const month = getMonthName(this.month)
    return `${this.day} ${month} ${this.year}`
  }
}

export function hashPassword(password) {
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" })
  shaObj.update(password)
  return shaObj.getHash("HEX")
  // Change to Argon2
}

export function isEqualDate(dateA, dateB, options = {}) {
  const validOptions = {
    day: options && options.day === false ? false : true,
    month: options && options.month === false ? false : true,
    year: options && options.year === false ? false : true,
  }

  let testedDateA = null
  let testedDateB = null
  if(typeof dateA === 'number') {
    testedDateA = new Date(dateA)
  }
  else if(typeof dateA.getMonth === 'function') {
    testedDateA = dateA
  } else {
    console.error('Invalid dateA object')
    return false
  }

  if(typeof dateB === 'number') {
    testedDateB = new Date(dateB)
  }
  else if(typeof dateB.getMonth === 'function') {
    testedDateB = dateB
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

  if(dayA !== dayB && validOptions.day) return false
  if(monthA !== monthB && validOptions.month) return false
  if(yearA !== yearB && validOptions.year) return false
  return true
}

export function isToday(date, options) {
  return isEqualDate(date, Date.now(), options)
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
    const dateVar = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    const currentMonth = dateVar.getMonth()
    let firstWeekDayOfMonth = -dateVar.getDay() + 2
    if(firstWeekDayOfMonth > 1) firstWeekDayOfMonth -= 7
    dateVar.setDate(firstWeekDayOfMonth)

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

  getYear(callback = null) {
    const dateVar = new Date(this.date.getFullYear(), 0, 1)

    const rows = []
    for(let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row = []
      for(let columnIndex = 0; columnIndex < 3; columnIndex++) {
        const dateObj = new Date(dateVar.getFullYear(), dateVar.getMonth() + 1, 0)
        const monthLength = dateObj.getDate()
        const currentDay = this.date.getDate()
        if(currentDay < monthLength) dateObj.setDate(currentDay)
        const isCurrentMonth = isToday(dateObj, {
          day: false,
        })
        const monthName = getMonthName(dateObj.getMonth())
        const column = {
          date: dateObj,
          name: monthName,
          currentMonth: isCurrentMonth
        }
        const callbackReturn = typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setMonth(dateVar.getMonth() + 1)
      }
      rows.push(row)
    }

    return rows
  }

  getYears(callback = null) {
    const currentYear = this.date.getFullYear()
    const startYear = currentYear - (currentYear % 20)
    const dateVar = new Date(startYear, 0, 1)
    const rows = []

    for(let rowIndex = 0; rowIndex < 5; rowIndex++) {
      const row = []
      for(let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const year = dateVar.getFullYear()
        const dateObj = new Date(year, this.date.getMonth() + 1, 0)
        const monthLength = dateObj.getDate()
        const currentDay = this.date.getDate()
        if(currentDay < monthLength) dateObj.setDate(currentDay)
        const isCurrentYear = isToday(dateObj, {
          day: false,
          month: false,
        })
        const column = {
          date: dateObj,
          number: year,
          currentYear: isCurrentYear,
        }

        const callbackReturn = typeof callback === 'function' ? callback.call(column, column) : column
        row.push(callbackReturn)

        dateVar.setFullYear(dateVar.getFullYear() + 1)
      }
      rows.push(row)
    }
    return rows
  }
}