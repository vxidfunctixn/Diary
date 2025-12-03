// Button component props
export interface ButtonProps {
  icon?: string
  title?: string
  small?: boolean
  disabled?: boolean
  accent?: boolean
  submit?: boolean
  width?: string
  center?: boolean
  stick?: 'left' | 'right' | 'both'
  monospace?: boolean
}

// Icon component props
export interface IconProps {
  name?: string
  size?: number
  color?: string | null
  secondaryColor?: string
}
