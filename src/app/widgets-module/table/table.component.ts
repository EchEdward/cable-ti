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
}

interface TableRow {
  columns: TableItem[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {


  eventStream$: Subject<WidgetEvent> = new Subject();

  header: string[] = ['1', '2', '3'];
  rows: TableRow[] = [];

  rowCount = 0;
  columnCount = 0;

  @ViewChildren(TableCellRefDirective) refDirList!: QueryList<TableCellRefDirective>;

  constructor(private resolver: ComponentFactoryResolver, private renderer: Renderer2) {
    // tslint:disable-next-line: deprecation
    this.eventStream$.subscribe(value => {
      console.log(value);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // setTimeout use for not throw error
    setTimeout(() => {
      for (const ref of this.refDirList) {
        if (this.rows[ref.row].columns[ref.column].status === 'create') {
          ref.containerRef.clear();
          // динмаическое определение типа из переменной
          const componentRef = ref.containerRef.createComponent<typeof ref.component>(
            this.resolver.resolveComponentFactory(ref.component)
          );
          this.rows[ref.row].columns[ref.column].status = 'none';
          this.rows[ref.row].columns[ref.column].example = componentRef;
          componentRef.instance.eventStream$ = this.eventStream$;
          componentRef.instance.tableCellRef = ref;
          // const num: ToRedDirective = new ToRedDirective(componentRef, this.renderer);

        }
        // задание свойств в Input
        // componentRef.instance.data .eventStream$ = this.eventStream$;
      }
    }, 0);
  }

  setColumnCount(columns: number, defaultComponent: any, defaultDirective: any): void {

  }

  setRowCount(rows: number, defaultComponent: any, defaultDirective: any): void {

  }

  addRow(pos = -1): void {
    pos = (this.rows.length < pos || pos === -1) ? this.rows.length : pos;
    this.rows.splice(pos, 0, {columns: [
      {component: LabelComponent, status: 'create'},
      {component: ComboBoxComponent, status: 'create'},
      {component: LineEditComponent, status: 'create'}
    ]} );
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

  getEventStream(): Observable<WidgetEvent> {
    return this.eventStream$.asObservable();
  }

}
