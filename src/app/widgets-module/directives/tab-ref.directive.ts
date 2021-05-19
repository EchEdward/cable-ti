import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appTabRef]'
})
export class TabRefDirective {

    @Input('appTabRef') component!: any;
    @Input() idxTab!: number;
    refType = 'tab';

    constructor(public containerRef: ViewContainerRef) {
    }

}
