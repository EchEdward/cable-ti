import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appTableCellRef]'
})
export class TableCellRefDirective {

    @Input('appTableCellRef') component!: any;
    @Input() row!: number;
    @Input() column!: number;

    refType = 'table';

    constructor(public containerRef: ViewContainerRef) {
    }

}
