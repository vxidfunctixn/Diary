export class Color {
  constructor(h, s, l, a = '100%') {
    this.h = h
    this.s = s
    this.l = l
    this.hsl = `hsl(${h}, ${s}, ${l})`
    this.hsla = `hsla(${h}, ${s}, ${l}, ${a})`,
    this.value = a === '100%' ? `hsl(${h}, ${s}, ${l})` : `hsla(${h}, ${s}, ${l}, ${a})`
  }
}

export class Theme {
  constructor(hue) {
    this.hue = hue
  }

  dark() {
    return {
      hue:    { value: this.hue },
      F1:     new Color(this.hue, '10%', '85%'),
      F1T:    new Color(this.hue, '10%', '85%', '50%'),
      F2:     new Color(this.hue, '8%', '30%'),
      HL1:    new Color(this.hue, '25%', '19%'),
      HL2:    new Color(this.hue, '26%', '14%'),
      HL3:    new Color(this.hue, '35%', '11%'),
      BG1:    new Color(this.hue, '36%', '11%'),
      BG2:    new Color(this.hue, '42%', '9%'),
      BG2T:   new Color(this.hue, '42%', '9%', '80%'),
      BG3:    new Color(this.hue, '24%', '8%'),
      BG4:    new Color(this.hue, '42%', '5%'),
      A1:     new Color(this.hue, '88%', '57%'),
      A2:     new Color(this.hue, '79%', '49%'),
      A3:     new Color(this.hue, '73%', '36%'),
      A4:     new Color(this.hue, '68%', '26%'),
      yellow: new Color(54, '100%', '51%'),
      red:    new Color(0, '95%', '40%'),
    }
  }

  light() {
    return this.dark() // To-do
  }
}