import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { TableCellRefDirective } from '../directives/table-cell-ref.directive';
import { WidgetEvent } from '../interfaces/event-interface';

import { NumericDirective } from '../directives/numeric.directive';
import { ToRedDirective } from '../directives/tored.directive';

import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { LabelComponent } from '../label/label.component';
import { LineEditComponent } from '../line-edit/line-edit.component';


interface TableItem {
  component: any;
  status: 'create' | 'none';
  example?: any;
  directives: any[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {


  eventStream$: Subject<WidgetEvent> = new Subject();

  header: string[] = [];
  rows: Array<TableItem[]> = [];

  // tslint:disable-next-line: variable-name
  private _rowCount = 0;
  // tslint:disable-next-line: variable-name
  private _columnCount = 0;

  @ViewChildren(TableCellRefDirective) refDirList!: QueryList<TableCellRefDirective>;

  constructor(private resolver: ComponentFactoryResolver, private renderer: Renderer2) {
    // tslint:disable-next-line: deprecation
    this.eventStream$.subscribe(value => {
      console.log(value);
    });
  }

  getEventStream(): Observable<WidgetEvent> {
    return this.eventStream$.asObservable();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // setTimeout use for not throw error
    setTimeout(() => {
      for (const ref of this.refDirList) {
        if (this.rows[ref.row][ref.column].status === 'create') {
          ref.containerRef.clear();
          // динмаическое определение типа из переменной
          const componentRef = ref.containerRef.createComponent<typeof ref.component>(
            this.resolver.resolveComponentFactory(ref.component)
          );
          this.rows[ref.row][ref.column].status = 'none';
          this.rows[ref.row][ref.column].example = componentRef;
          componentRef.instance.eventStream$ = this.eventStream$;
          componentRef.instance.tableCellRef = ref;
          // const num: ToRedDirective = new ToRedDirective(componentRef, this.renderer);

        }
        // задание свойств в Input
        // componentRef.instance.data .eventStream$ = this.eventStream$;
      }
    }, 0);
  }

  setColumnCount(columns: number, defaultComponent: any, defaultDirectives: any[]): void {
    if (this._columnCount < columns) {
      for (let i = 0; i < this._rowCount; i++) {
        for (let j = this._columnCount; j < columns; j++) {
          this.rows[i].push({
              component: defaultComponent,
              status: 'create',
              directives: defaultDirectives
            });
        }
      }
      for (let j = this._columnCount; j < columns; j++) {
        this.header.push((j + 1).toString());
      }
      this._columnCount = columns;
      this.ngAfterViewInit();
    } else if (this._columnCount > columns) {
      for (let i = 0; i < this._rowCount; i++) {
        this.rows[i].splice(columns, this._columnCount - columns);
      }
      this.header.splice(columns, this._columnCount - columns);
      this._columnCount = columns;
      this.ngAfterViewInit();
    }
  }

  setRowCount(rows: number, defaultComponent: any, defaultDirectives: any[]): void {
    if (this._rowCount < rows) {
      for (let i = this._rowCount; i < rows; i++) {
        const row: TableItem[] = [];
        for (let j = 0; j < this._columnCount; j++) {
          row.push({
            component: defaultComponent,
            status: 'create',
            directives: defaultDirectives
          });
        }
        this.rows.push(row);
      }
      this._rowCount = rows;
      this.ngAfterViewInit();
    } else if (this._rowCount > rows) {
      this.rows.splice(rows, this._rowCount - rows);
      this._rowCount = rows;
      this.ngAfterViewInit();
    }
  }

  addRow(pos = -1): void {
    pos = (this.rows.length < pos || pos === -1) ? this.rows.length : pos;
    this.rows.splice(pos, 0, );
    /*
    {columns: [
      {component: LabelComponent, status: 'create'},
      {component: ComboBoxComponent, status: 'create'},
      {component: LineEditComponent, status: 'create'}
    ]}
     */
    this.ngAfterViewInit();
  }

  removeRow(pos = -1): void {
    if (this.rows.length === 0) {
      return;
    }
    pos = this.rows.length < pos ? this.rows.length : pos;
    if (pos >= 0) {
      this.rows.splice(pos, 1);
    } else {
      this.rows.pop();
    }
    this.ngAfterViewInit();
  }


}
