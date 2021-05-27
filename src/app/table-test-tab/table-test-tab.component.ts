import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../widgets-module/table/table.component';
import { ComboBoxComponent } from '../widgets-module/combo-box/combo-box.component';
import { LabelComponent } from '../widgets-module/label/label.component';
import { LineEditComponent } from '../widgets-module/line-edit/line-edit.component';

import { ToRedDirective } from '../widgets-module/directives/tored.directive';


@Component({
  selector: 'app-table-test-tab',
  templateUrl: './table-test-tab.component.html',
  styleUrls: ['./table-test-tab.component.scss']
})
export class TableTestTabComponent {
  @ViewChild('tbl') childComponent!: TableComponent;

  addRow(): void {
    if (this.childComponent) {
      this.childComponent.addRow([LineEditComponent, LineEditComponent, LineEditComponent, LineEditComponent],
         [[ToRedDirective], [ToRedDirective], [ToRedDirective], [ToRedDirective]]);
    }
  }

  removeRow(): void {
    if (this.childComponent) {
      this.childComponent.removeRow();
    }
  }

  addColumn(): void {
    if (this.childComponent) {
      this.childComponent.addColumn(LineEditComponent, [ToRedDirective]);
    }
  }

  removeColumn(): void {
    if (this.childComponent) {
      this.childComponent.removeColumn();
    }
  }

  setColumnCount(): void {
    this.childComponent.setColumnCount(4, LineEditComponent, []);
  }

  setRowCount(): void {
    this.childComponent.setRowCount(4, LineEditComponent, []);
  }

  setHeader(): void {
    this.childComponent.setHeader(['5', '4', '3', '2']);
  }

  getCurrentCellPos(): void {
    console.log(this.childComponent.getCurrentCellPos());
  }

  setLeft(): void {
    // this.childComponent.setStyle('theadcell', {textAlign: 'left'});
    // this.childComponent.setStyle('theadfirstcell', {background: 'red'});
    this.childComponent.setColumnWidth('px', [200, 200, 200, 200]);
  }

  clearStyle(): void {
    // this.childComponent.clearStyle('theadcell');
    this.childComponent.setColumnWidth('%', [50, 30, 70]);
    // this.childComponent.setColumnWidth('px', 400, 1);
  }

}
