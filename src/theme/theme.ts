import type { ThemeColors } from '@/interfaces/theme-interface'

export class Color {
  h: number
  s: string
  l: string
  hsl: string
  hsla: string
  value: string

  constructor(h: number, s: string, l: string, a: string = '100%') {
    this.h = h
    this.s = s
    this.l = l
    this.hsl = `hsl(${h}, ${s}, ${l})`
    ;((this.hsla = `hsla(${h}, ${s}, ${l}, ${a})`), (this.value = this.hsl))
  }
}

export class Theme {
  private hue: number

  constructor(hue: number) {
    this.hue = hue
  }

  private getDangerHue(): number {
    const defaultDHue = 0

    const normalizedHue = this.hue % 360
    const threshold = 15

    if (normalizedHue <= threshold || normalizedHue >= 360 - threshold) {
      return defaultDHue + 25
    }

    return defaultDHue
  }

  dark(): ThemeColors {
    const dangerHue = this.getDangerHue()
    return {
      hue: { value: this.hue },

      white: new Color(0, '0%', '100%'),
      black: new Color(0, '0%', '0%'),

      foreground_100: new Color(this.hue, '31%', '94%'), // hsl(143, 31%, 94%)
      foreground_200: new Color(this.hue, '11%', '85%'), // hsl(143, 11%, 85%)
      foreground_300: new Color(this.hue, '9%', '66%'), //  hsl(143, 9%, 66%)
      foreground_400: new Color(this.hue, '10%', '61%'), // hsl(143, 10%, 61%)
      foreground_500: new Color(this.hue, '9%', '47%'), //  hsl(143, 9%, 47%)
      foreground_600: new Color(this.hue, '8%', '39%'), //  hsl(143, 8%, 39%)
      foreground_700: new Color(this.hue, '8%', '30%'), //  hsl(143, 8%, 30%)
      foreground_800: new Color(this.hue, '8%', '25%'), //  hsl(143, 8%, 25%)
      foreground_900: new Color(this.hue, '6%', '19%'), //  hsl(143, 6%, 19%)

      accent_100: new Color(this.hue, '97%', '76%'), // hsl(143, 97%, 76%)
      accent_200: new Color(this.hue, '96%', '67%'), // hsl(143, 96%, 67%)
      accent_300: new Color(this.hue, '88%', '57%'), // hsl(143, 88%, 57%)
      accent_400: new Color(this.hue, '79%', '49%'), // hsl(143, 79%, 49%)
      accent_500: new Color(this.hue, '73%', '36%'), // hsl(143, 73%, 36%)
      accent_600: new Color(this.hue, '68%', '26%'), // hsl(143, 68%, 26%)
      accent_700: new Color(this.hue, '64%', '22%'), // hsl(143, 64%, 22%)
      accent_800: new Color(this.hue, '65%', '18%'), // hsl(143, 65%, 18%)
      accent_900: new Color(this.hue, '69%', '14%'), // hsl(143, 69%, 14%)

      background_100: new Color(this.hue, '26%', '19%'), // hsl(143, 26%, 19%)
      background_200: new Color(this.hue, '38%', '15%'), // hsl(143, 38%, 15%)
      background_300: new Color(this.hue, '37%', '13%'), // hsl(143, 37%, 13%)
      background_400: new Color(this.hue, '36%', '11%'), // hsl(143, 36%, 11%)
      background_500: new Color(this.hue, '43%', '9%'), //  hsl(143, 43%, 9%)
      background_600: new Color(this.hue, '22%', '8%'), //  hsl(143, 22%, 8%)
      background_700: new Color(this.hue, '42%', '5%'), //  hsl(143, 42%, 5%)
      background_800: new Color(this.hue, '51%', '3%'), //  hsl(143, 51%, 3%)
      background_900: new Color(this.hue, '57%', '2%'), //  hsl(143, 57%, 2%)

      danger_100: new Color(dangerHue, '90%', '62%'), //  hsl(0, 90%, 62%)
      danger_200: new Color(dangerHue, '100%', '59%'), // hsl(0, 100%, 59%)
      danger_300: new Color(dangerHue, '80%', '50%'), //  hsl(0, 80%, 50%)

      warning_100: new Color(53, '87%', '62%'), //  hsl(53, 87%, 62%)
      warning_200: new Color(53, '100%', '51%'), // hsl(53, 100%, 51%)
      warning_300: new Color(53, '100%', '38%'), // hsl(53, 100%, 38%)

      success_100: new Color(92, '93%', '63%'), //  hsl(92, 93%, 63%)
      success_200: new Color(92, '100%', '52%'), // hsl(92, 100%, 52%)
      success_300: new Color(92, '100%', '36%') //  hsl(92, 100%, 36%)
    }
  }

  light(): ThemeColors {
    const dangerHue = this.getDangerHue()
    return {
      hue: { value: this.hue },

      white: new Color(0, '0%', '100%'),
      black: new Color(0, '0%', '0%'),

      foreground_100: new Color(this.hue, '40%', '8%'), //  hsl(143, 40%, 8%)
      foreground_200: new Color(this.hue, '35%', '12%'), // hsl(143, 35%, 12%)
      foreground_300: new Color(this.hue, '30%', '18%'), // hsl(143, 30%, 18%)
      foreground_400: new Color(this.hue, '25%', '24%'), // hsl(143, 25%, 24%)
      foreground_500: new Color(this.hue, '20%', '30%'), // hsl(143, 20%, 30%)
      foreground_600: new Color(this.hue, '18%', '38%'), // hsl(143, 18%, 38%)
      foreground_700: new Color(this.hue, '15%', '45%'), // hsl(143, 15%, 45%)
      foreground_800: new Color(this.hue, '12%', '52%'), // hsl(143, 12%, 52%)
      foreground_900: new Color(this.hue, '10%', '60%'), // hsl(143, 10%, 60%)

      accent_100: new Color(this.hue, '75%', '25%'), // hsl(143, 75%, 25%)
      accent_200: new Color(this.hue, '78%', '32%'), // hsl(143, 78%, 32%)
      accent_300: new Color(this.hue, '80%', '38%'), // hsl(143, 80%, 38%)
      accent_400: new Color(this.hue, '82%', '45%'), // hsl(143, 82%, 45%)
      accent_500: new Color(this.hue, '85%', '52%'), // hsl(143, 85%, 52%)
      accent_600: new Color(this.hue, '88%', '60%'), // hsl(143, 88%, 60%)
      accent_700: new Color(this.hue, '90%', '68%'), // hsl(143, 90%, 68%)
      accent_800: new Color(this.hue, '92%', '75%'), // hsl(143, 92%, 75%)
      accent_900: new Color(this.hue, '94%', '82%'), // hsl(143, 94%, 82%)

      background_100: new Color(this.hue, '10%', '75%'), // hsl(143, 10%, 75%)
      background_200: new Color(this.hue, '12%', '80%'), // hsl(143, 12%, 80%)
      background_300: new Color(this.hue, '15%', '85%'), // hsl(143, 15%, 85%)
      background_400: new Color(this.hue, '18%', '88%'), // hsl(143, 18%, 88%)
      background_500: new Color(this.hue, '20%', '91%'), // hsl(143, 20%, 91%)
      background_600: new Color(this.hue, '22%', '94%'), // hsl(143, 22%, 94%)
      background_700: new Color(this.hue, '25%', '96%'), // hsl(143, 25%, 96%)
      background_800: new Color(this.hue, '28%', '98%'), // hsl(143, 28%, 98%)
      background_900: new Color(this.hue, '30%', '99%'), // hsl(143, 30%, 99%)

      danger_100: new Color(dangerHue, '80%', '40%'), // hsl(0, 80%, 40%)
      danger_200: new Color(dangerHue, '85%', '50%'), // hsl(0, 85%, 50%)
      danger_300: new Color(dangerHue, '90%', '65%'), // hsl(0, 90%, 65%)

      warning_100: new Color(53, '95%', '45%'), // hsl(53, 95%, 45%)
      warning_200: new Color(53, '95%', '55%'), // hsl(53, 95%, 55%)
      warning_300: new Color(53, '90%', '70%'), // hsl(53, 90%, 70%)

      success_100: new Color(92, '95%', '40%'), // hsl(92, 95%, 40%)
      success_200: new Color(92, '95%', '55%'), // hsl(92, 95%, 55%)
      success_300: new Color(92, '90%', '70%') //  hsl(92, 90%, 70%)
    }
  }
}
