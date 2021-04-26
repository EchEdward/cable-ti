import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { RefDirective } from '../directives/ref.directive';
import { LabelComponent } from '../label/label.component';
import { LineEditComponent } from '../line-edit/line-edit.component';


interface TableItem {
  component: any;
  status: 'create' | 'none';
  example?: any;
}

interface TableRow {
  id: number;
  columns: TableItem[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  private idSet: Set<number> = new Set();
  private minId = 0;
  private maxId = 1000000000000;

  eventStream$: Subject<string> = new Subject();

  header: string[] = ['1', '2', '3'];
  rows: TableRow[] = [];

  @ViewChildren(RefDirective) refDirList!: QueryList<RefDirective>;

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
        }
        // задание свойств в Input
        // componentRef.instance.data .eventStream$ = this.eventStream$;
      }
    }, 0);
  }

  addRow(pos = -1): void {
    const id = this.getId();
    if (pos >= 0) {
      this.rows.splice(pos, 0, {id, columns: [
        {component: LabelComponent, status: 'create'},
        {component: ComboBoxComponent, status: 'create'},
        {component: LineEditComponent, status: 'create'}
      ]});
    } else {
      this.rows.push({id, columns: [
        {component: LabelComponent, status: 'create'},
        {component: ComboBoxComponent, status: 'create'},
        {component: LineEditComponent, status: 'create'}
      ]});
    }
    this.ngAfterViewInit();
  }

  removeRow(pos = -1): void {
    let row;
    if (pos >= 0) {
      row = this.rows.splice(pos, 1);
    } else {
      row = this.rows.pop();
    }
    if (row) {
      this.idSet.delete((row as TableRow).id);
    }
    this.ngAfterViewInit();
  }

  private getId(): number {
    let rand;
    while (true) {
      rand = this.minId + Math.random() * (this.minId + 1 - this.maxId);
      if (!this.idSet.has(rand)) {
        this.idSet.add(rand);
        break;
      }
    }
    return rand;
  }
}
