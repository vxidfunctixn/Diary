export interface DateCompareOptions {
  day?: boolean
  month?: boolean
  year?: boolean
}

export interface CalendarDay {
  date: Date
  number: number
  currentMonth: boolean
  currentDay: boolean
}

export interface CalendarMonth {
  date: Date
  name: string
  currentMonth: boolean
}

export interface CalendarYear {
  date: Date
  number: number
  currentYear: boolean
}
