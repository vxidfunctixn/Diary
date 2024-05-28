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