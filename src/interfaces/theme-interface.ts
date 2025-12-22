import { Color } from '@/theme/theme'

export interface HueValue {
  value: number
}

export interface OldThemeColors {
  hue: HueValue
  F1: Color
  F1T: Color
  F2: Color
  F3: Color
  HL1: Color
  HL2: Color
  HL3: Color
  HL4: Color
  BG1: Color
  BG2: Color
  BG2T: Color
  BG3: Color
  BG4: Color
  A1: Color
  A2: Color
  A3: Color
  A4: Color
  yellow: Color
  red: Color
  D1: Color
  D2: Color
  D3: Color
}
export interface ThemeColors {
  hue: HueValue
  white: Color
  black: Color
  // Foregrounds
  foreground_100: Color
  foreground_200: Color
  foreground_300: Color
  foreground_400: Color
  foreground_500: Color
  foreground_600: Color
  foreground_700: Color
  foreground_800: Color
  foreground_900: Color
  // Accents
  accent_100: Color
  accent_200: Color
  accent_300: Color
  accent_400: Color
  accent_500: Color
  accent_600: Color
  accent_700: Color
  accent_800: Color
  accent_900: Color
  // Backgrounds
  background_100: Color
  background_200: Color
  background_300: Color
  background_400: Color
  background_500: Color
  background_600: Color
  background_700: Color
  background_800: Color
  background_900: Color
  // Additional Colors
  danger_100: Color
  danger_200: Color
  danger_300: Color

  warning_100: Color
  warning_200: Color
  warning_300: Color

  success_100: Color
  success_200: Color
  success_300: Color
}
