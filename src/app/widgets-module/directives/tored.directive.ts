import { Directive, ComponentRef, Renderer2 } from '@angular/core';


@Directive({
  selector: '[appToRed]'
})
export class ToRedDirective {
    constructor(private comp: ComponentRef<any>, private r: Renderer2) {
      // this.r.setStyle(this.comp.nativeElement, 'color', 'blue');
      this.r.setStyle(this.comp.location.nativeElement.children[0], 'background', 'blue');
      // this.r.addClass(this.comp.location.nativeElement, 'inputBackground');
    }
}
