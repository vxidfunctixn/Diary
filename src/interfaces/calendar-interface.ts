export interface DateCompareOptions {
  day?: boolean
  month?: boolean
  year?: boolean
}

export interface Time {
  hours: number
  minutes: number
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

export interface ExtendedCalendarDay extends CalendarDay {
  selected?: boolean
}

export interface ExtendedCalendarMonth extends CalendarMonth {
  selected?: boolean
}

export interface ExtendedCalendarYear extends CalendarYear {
  selected?: boolean
}
