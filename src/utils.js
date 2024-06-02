import { toRaw } from 'vue'
import jsSHA from 'jssha'

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

export function hashPassword(password) {
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" })
  shaObj.update(password)
  return shaObj.getHash("HEX")
  // Change to Argon2
}