import { Directive, ElementRef, HostListener, Input} from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appNumeric]'
})
export class NumericDirective {
  @Input() switch = false;
  @Input() decimals = 0;
  @Input() negative = false;
  @Input() directiveEventStream$!: Subject<string>;


  private chars = new Map([
    ['1',  '1'],
    ['2',  '2'],
    ['3',  '3'],
    ['4',  '4'],
    ['5',  '5'],
    ['6',  '6'],
    ['7',  '7'],
    ['8',  '8'],
    ['9',  '9'],
    ['0',  '0'],
    ['.',  '.'],
    [',',  '.'],
    ['-',  '-'],
  ]);

  private check(value: string): string {
    const arr: string[] = [];
    let minCount = 0;
    let dotCount = 0;
    let demCount = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < value.length; i++) {
      if (this.chars.has(value[i])) {
        const ch = this.chars.get(value[i]) as string;
        if (ch === '-') {
          if ((minCount > 0 && this.negative) || !this.negative || (i > 0 && minCount === 0 && this.negative)) {
            continue;
          } else {
            minCount += 1;
            arr.push(ch);
          }
        } else if (ch === '.') {
          if ((dotCount > 0 && this.decimals > 0) || this.decimals === 0) {
            continue;
          } else {
            dotCount += 1;
            arr.push(ch);
          }
        } else if (dotCount > 0) {
          if (demCount >= this.decimals) {
            continue;
          } else {
            demCount += 1;
            arr.push(ch);
          }
        } else {
          arr.push(ch);
        }
      }
    }
    return arr.join('');

  }

  private run(): void {
    setTimeout(() => {
      this.el.nativeElement.value = this.check(this.el.nativeElement.value);
      if (this.directiveEventStream$) {
        this.directiveEventStream$.next(this.el.nativeElement.value);
      }
    });
  }

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.switch) {
      this.run();
    }
  }

  @HostListener('change', ['$event'])
  onChange(event: KeyboardEvent): void {
    if (this.switch) {
      this.run();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (this.switch) {
      this.run();
    }
  }
}
