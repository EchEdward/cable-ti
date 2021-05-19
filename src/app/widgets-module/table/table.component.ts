import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { LabelComponent } from '../label/label.component';
import { LineEditComponent } from '../line-edit/line-edit.component';
import { TableCellRefDirective } from '../directives/table-cell-ref.directive';
import { WidgetEvent } from '../interfaces/event-interface';
import { NumericDirective } from '../directives/numeric.directive';


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

  @ViewChildren(TableCellRefDirective) refDirList!: QueryList<TableCellRefDirective>;

  constructor(private resolver: ComponentFactoryResolver) {
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
          // const num: NumericDirective = new NumericDirective(componentRef.location);

        }
        // задание свойств в Input
        // componentRef.instance.data .eventStream$ = this.eventStream$;
      }
    }, 0);
  }

  addRow(pos = -1): void {
    pos = this.rows.length < pos ? this.rows.length : pos;
    if (pos >= 0) {
      this.rows.splice(pos, 0, {columns: [
        {component: LabelComponent, status: 'create'},
        {component: ComboBoxComponent, status: 'create'},
        {component: LineEditComponent, status: 'create'}
      ]});
    } else {
      this.rows.push({columns: [
        {component: LabelComponent, status: 'create'},
        {component: ComboBoxComponent, status: 'create'},
        {component: LineEditComponent, status: 'create'}
      ]});
    }
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

  getEventStream(): Subject<WidgetEvent> {
    return this.eventStream$;
  }

}
