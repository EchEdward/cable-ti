import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { WidgetEvent } from '../interfaces/event-interface';
import { TableCellRefDirective } from '../directives/table-cell-ref.directive';





@Component({
  selector: 'app-line-edit',
  templateUrl: './line-edit.component.html',
  styleUrls: ['./line-edit.component.scss'],
})
export class LineEditComponent implements OnInit {

  @Input() eventStream$!: Subject<WidgetEvent>;
  @Input() tableCellRef!: TableCellRefDirective;
  @Input() onlyNymeric = true;
  @Input() decimals = 0;
  @Input() negative = false;

  currentText = '';

  constructor() {
  }


  ngOnInit(): void {
  }


  changeEvent(txt: string): void {
    if (this.eventStream$) {
      if (this.tableCellRef) {
        this.eventStream$.next({
          event: 'change',
          from: 'cell',
          emiter: 'line-edit',
          previousState: this.currentText,
          currentState: txt,
          ref: this.tableCellRef
        });
      } else {
        this.eventStream$.next({
          event: 'change',
          emiter: 'line-edit',
          from: 'self',
          previousState: this.currentText,
          currentState: txt,
        });
      }
    }
    this.currentText = txt;
  }

  focusEvent(): void {
    if (this.eventStream$) {
      if (this.tableCellRef) {
        this.eventStream$.next({
          event: 'focus',
          from: 'cell',
          emiter: 'line-edit',
          previousState: this.currentText,
          currentState: this.currentText,
          ref: this.tableCellRef
        });
      } else {
        this.eventStream$.next({
          event: 'focus',
          from: 'self',
          emiter: 'line-edit',
          previousState: this.currentText,
          currentState: this.currentText,
        });
      }
    }
  }

  text(): string {
    return this.currentText;
  }

  setText(text: string): void {
    this.currentText = text;
  }


}
