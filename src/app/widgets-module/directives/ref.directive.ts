import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appRef]'
})
export class RefDirective {

    @Input('appRef') component!: any;
    @Input() ID!: number;
    @Input() row!: number;
    @Input() column!: number;

    constructor(public containerRef: ViewContainerRef) {
    }

}
