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
  dExamples?: any[];
}

interface CellInd {
  i: number;
  j: number;
}

interface TableStyle {
  table: { [atrr: string]: string };
  thead: { [atrr: string]: string };
  tbody: { [atrr: string]: string };
  theadcell: { [atrr: string]: string };
  theadfirstcell: { [atrr: string]: string };
  tbodycell: { [atrr: string]: string };
  tbodyfirstcell: { [atrr: string]: string };
  tbodyrow: { [atrr: string]: string };
}

interface ColumnWidth {
  tp: 'px' | '%';
  width: number[];
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
  // tslint:disable-next-line: variable-name
  private _currentCell: CellInd = {i: -1, j: -1};
  // tslint:disable-next-line: variable-name
  _style: TableStyle = {
    table: {},
    thead: {},
    tbody: {},
    theadcell: {},
    theadfirstcell: {},
    tbodycell: {},
    tbodyfirstcell: {},
    tbodyrow: {},
  };

  // tslint:disable-next-line: variable-name
  _columnWidth: ColumnWidth = {tp: '%', width: []};


  @ViewChildren(TableCellRefDirective) refDirList!: QueryList<TableCellRefDirective>;

  constructor(private resolver: ComponentFactoryResolver, private renderer: Renderer2) {
    // tslint:disable-next-line: deprecation
    this.eventStream$.subscribe(value => {
      console.log(value);
    });

    // .bind(this) привязываем к методу его this this.eventHandler.bind(this)
    // tslint:disable-next-line: deprecation
    this.eventStream$.subscribe(value => this.eventHandler(value));
    // console.log(this.childComponent);
  }

  private updateColumnWidth(before: number, after: number, pos = -1): void {
    if (before === 0 && after > 0) {
      this._columnWidth.tp = '%';
      this.setStyle('table', {width: '100%'});
      this._columnWidth.width = new Array(after).fill(Math.round(100 / after));

    } else if (before > 0 && after === 0) {
      this._columnWidth.tp = '%';
      this.setStyle('table', {width: '100%'});
      this._columnWidth.width = [];

    } else if (before > 0 && after > 0 && (after > before || after < before)) {
      if (this._columnWidth.tp === '%') {
        if (after < before) {
          if (pos !== -1 && before - after === 1) {
            this._columnWidth.width = this._columnWidth.width.map((item) => Math.round(item * before / after)).splice(pos, 1);
          } else {
            this._columnWidth.width = this._columnWidth.width.map((item) => Math.round(item * before / after)).slice(0, after);
          }
        } else {
          const width = Math.round((this._columnWidth.width.reduce((a, b) => a + b, 0) / before) * before / after);
          const arr = this._columnWidth.width.map((item) => Math.round(item * before / after));
          if (pos !== -1 && after - before === 1) {
            arr.splice(pos, 0, width);
          } else {
            arr.push(...new Array(after - before).fill(width));
          }
          this._columnWidth.width = arr;
        }
      } else if (this._columnWidth.tp === 'px') {
        if (after < before) {
          if (pos !== -1 && before - after === 1) {
            this._columnWidth.width.splice(pos, 1);
          } else {
            this._columnWidth.width.splice(after, before - after);
          }
        } else {
          const width = Math.round(this._columnWidth.width.reduce((a, b) => a + b, 0) / before);
          if (pos !== -1 && after - before === 1) {
            this._columnWidth.width.splice(pos, 0, width);
          } else {
            this._columnWidth.width.push(...new Array(after - before).fill(width));
          }
        }
        this.setStyle('table', {width: this._columnWidth.width.reduce((a, b) => a + b, 0).toString() + 'px'});
      }
    }
  }

  setColumnWidth(tp: 'px' | '%', width: number | number[], pos = -1): void {
    if (width.constructor === Array) {
      if (tp === 'px') {
        let arr: number[] = [];
        if (width.length >= this._columnWidth.width.length) {
          arr = width.slice(0, this._columnWidth.width.length);
        } else {
          if (this._columnWidth.tp === 'px') {
            arr = [...width, ...this._columnWidth.width.slice(width.length, this._columnWidth.width.length)];
          } else {
            arr = [...width,
              ...new Array(this._columnWidth.width.length - width.length).fill(
                Math.round(width.reduce((a, b) => a + b, 0) / width.length))
            ];
          }
        }
        this._columnWidth.tp = 'px';
        this._columnWidth.width = arr;
        this.setStyle('table', {width: arr.reduce((a, b) => a + b, 0).toString() + 'px'});
      } else if (tp === '%') {
        if (width.length >= this._columnWidth.width.length) {
          const arr = width.slice(0, this._columnWidth.width.length);
          const sm = arr.reduce((a, b) => a + b, 0);
          this._columnWidth.width = arr.map((item) => Math.round(item * 100 / sm));
        } else {
          if (this._columnWidth.tp === '%') {
            const arr = [...width, ...this._columnWidth.width.slice(width.length, this._columnWidth.width.length)];
            const sm = arr.reduce((a, b) => a + b, 0);
            this._columnWidth.width = arr.map((item) => Math.round(item * 100 / sm));
          } else {
            const arr = [...width,
              ...new Array(this._columnWidth.width.length - width.length).fill(
                Math.round(width.reduce((a, b) => a + b, 0) / width.length))
            ];
            const sm = arr.reduce((a, b) => a + b, 0);
            this._columnWidth.width = arr.map((item) => Math.round(item * 100 / sm));
          }
        }
        this._columnWidth.tp = '%';
        this.setStyle('table', {width: '100%'});
      }
    } else {
      if (tp === 'px' && this._columnWidth.tp === 'px' && pos > -1 && pos < this._columnWidth.width.length) {
        this._columnWidth.width[pos] = width as number;
        this.setStyle('table', {width: this._columnWidth.width.reduce((a, b) => a + b, 0).toString() + 'px'});
      } else if (tp === '%' && this._columnWidth.tp === '%' &&
                 pos > -1 && pos < this._columnWidth.width.length &&
                 width <= 100) {
        this._columnWidth.width = this._columnWidth.width.map((item, i, arr) => {
          if (i === pos) {
            return width as number;
          }
          return Math.round((item * (100 - (width as number))) / (100 - arr[pos]));
        });
      }
    }
  }

  setStyle(el: 'table' | 'thead' | 'tbody' | 'theadcell' | 'theadfirstcell' | 'tbodycell' | 'tbodyfirstcell' | 'tbodyrow',
           style: { [atrr: string]: string }): void {
    this._style[el] = {...this._style[el], ...style};
  }

  clearStyle(el: 'table' | 'thead' | 'tbody' | 'theadcell' | 'theadfirstcell' | 'tbodycell' | 'tbodyfirstcell' | 'tbodyrow'): void {
    this._style[el] = {};
  }

  private eventHandler(event: WidgetEvent): void {
    if (event.event === 'focus') {
      this.setCurrentCellPos(event);
    }
  }

  private setCurrentCellPos(event: WidgetEvent): void {
    this._currentCell = {i: event.ref.row, j: event.ref.column};
  }

  getCurrentCellPos(): CellInd {
    return {...this._currentCell};
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
        if (this.rows[ref.row][ref.column].status === 'create' && this.rows[ref.row][ref.column].component) {
          ref.containerRef.clear();
          // динмаическое определение типа из переменной
          const componentRef = ref.containerRef.createComponent<typeof ref.component>(
            this.resolver.resolveComponentFactory(ref.component)
          );
          this.rows[ref.row][ref.column].status = 'none';
          this.rows[ref.row][ref.column].example = componentRef;
          componentRef.instance.eventStream$ = this.eventStream$;
          componentRef.instance.tableCellRef = ref;
          if (this.rows[ref.row][ref.column].directives && this.rows[ref.row][ref.column].directives.length > 0) {
            const dExamples: any[] = [];
            for (const direct of this.rows[ref.row][ref.column].directives) {
              dExamples.push(new direct(componentRef, this.renderer));
            }
            this.rows[ref.row][ref.column].dExamples = dExamples;
          }
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
      this.updateColumnWidth(this._columnCount, columns);
      this._columnCount = columns;
      this.ngAfterViewInit();
    } else if (this._columnCount > columns) {
      for (let i = 0; i < this._rowCount; i++) {
        this.rows[i].splice(columns, this._columnCount - columns);
      }
      this.header.splice(columns, this._columnCount - columns);
      this.updateColumnWidth(this._columnCount, columns);
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

  addRow(component: any | any[], directives: any[] | Array<any[]>, pos = -1, ): void {
    pos = (this.rows.length < pos || pos === -1) ? this.rows.length : pos;
    const row: TableItem[] = [];
    if (component.constructor === Array) {
      for (let j = 0; j < this._columnCount; j++) {
        row.push({
          component: component[j],
          status: 'create',
          directives: directives[j]
        });
      }
    } else {
      for (let j = 0; j < this._columnCount; j++) {
        row.push({
          component,
          status: 'create',
          directives
        });
      }
    }
    this._rowCount += 1;
    this.rows.splice(pos, 0, row);
    this.ngAfterViewInit();
  }

  removeRow(pos = -1): void {
    if (this.rows.length === 0) {
      return;
    }
    pos = this.rows.length < pos ? this.rows.length : pos;
    this.rows.splice(pos, 1);
    this._rowCount -= 1;
    this.ngAfterViewInit();
  }

  addColumn(component: any | any[], directives: any[] | Array<any[]>, pos = -1, ): void {
    pos = (this._columnCount < pos || pos === -1) ? this._columnCount : pos;
    if (component.constructor === Array) {
      for (let i = 0; i < this._rowCount; i++) {
        this.rows[i].splice(pos, 0, {
          component: component[i],
          status: 'create',
          directives: directives[i]
        });
      }
    } else {
      for (let i = 0; i < this._rowCount; i++) {
        this.rows[i].splice(pos, 0, {
          component,
          status: 'create',
          directives
        });
      }
    }
    this.header.splice(pos, 0, (pos + 1).toString());
    this.updateColumnWidth(this._columnCount, this._columnCount + 1, pos);
    this._columnCount += 1;
    this.ngAfterViewInit();
  }

  removeColumn(pos = -1): void {
    if (this._columnCount === 0) {
      return;
    }
    pos = this._columnCount < pos ? this._columnCount : pos;
    for (let i = 0; i < this._rowCount; i++) {
      this.rows[i].splice(pos, 1);
    }
    this.header.splice(pos, 1);
    this.updateColumnWidth(this._columnCount, this._columnCount - 1, pos);
    this._columnCount -= 1;
    this.ngAfterViewInit();
  }

  setHeader(lst: string[] | string, pos = -1): void {
    if (lst.constructor === Array) {
      for (let j = 0; j < this._columnCount; j++) {
        this.header[j] = lst[j];
      }
    } else {
      pos = (this._columnCount < pos || pos === -1) ? this._columnCount : pos;
      this.header[pos] = lst as string;
    }
  }

  getHeader(): string[] {
    return [...this.header];
  }

  public get columnCount(): number {
    return this._columnCount;
  }

  public get rowCount(): number {
    return this._rowCount;
  }

  cell(row: number, column: number): any {
    if (row < this._rowCount && row > -1 && row < this._columnCount && column > -1) {
      return this.rows[row][column].example;
    }
  }

  setCell(row: number, column: number, component: any, directives: any[]): void {
    if (row < this._rowCount && row > -1 && row < this._columnCount && column > -1) {
      this.rows[row][column] = {
        component,
        status: 'create',
        directives
      };
    }
  }

  addDirective(row: number, column: number, directives: any[] | any): void {
    if (row < this._rowCount && row > -1 && row < this._columnCount && column > -1) {
      if (directives.constructor === Array) {
        for (const direct of  directives) {
          this.rows[row][column].directives.push(direct);
          this.rows[row][column].dExamples?.push(new direct(this.rows[row][column].example, this.renderer));
        }
      } else {
        this.rows[row][column].directives.push(directives);
        this.rows[row][column].dExamples?.push(new directives(this.rows[row][column].example, this.renderer));
      }
    }
  }


}
