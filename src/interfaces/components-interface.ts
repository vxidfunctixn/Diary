import type { Settings } from '@/interfaces/store-interface'
export interface ButtonProps {
  icon?: string
  title?: string
  small?: boolean
  disabled?: boolean
  accent?: boolean
  negative?: boolean
  submit?: boolean
  width?: string
  center?: boolean
  stick?: 'left' | 'right' | 'both'
  monospace?: boolean
  active?: boolean
  iconButton?: boolean
}

export interface IconProps {
  name?: string
  size?: number
  color?: string | null
}

export interface InputUpdateEvent<K extends keyof Settings> {
  name: K
  value: Settings[K]
}

export interface UpdateEvent {
  name: string
  value: number
}
