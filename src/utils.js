import { toRaw } from 'vue'

export function isProxyDifferent(proxy1, proxy2) {
  const obj1 = toRaw(proxy1)
  const obj2 = toRaw(proxy2)
  return JSON.stringify(obj1) !== JSON.stringify(obj2)
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