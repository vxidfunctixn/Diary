import { toRaw } from 'vue'

export function isProxyDifferent(proxy1, proxy2) {
  const obj1 = toRaw(proxy1)
  const obj2 = toRaw(proxy2)

  for (const [key, value] of Object.entries(obj1)) {
    if(!obj2[key] || obj2[key] !== value) return true
  }

  for (const [key, value] of Object.entries(obj2)) {
    if(!obj1[key] || obj1[key] !== value) return true
  }

  return false
}

export class DateTime {
  constructor(timestamp) {
    this.date = new Date(timestamp)
    this.hours = this.date.getHours()
    this.minutes = this.date.getMinutes()
    this.timeString = this.getTimeString()
  }

  getTimeString() {
    const hours = this.hours.toString().padStart(2, '0')
    const minutes = this.minutes.toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }


}