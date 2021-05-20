import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../widgets-module/table/table.component';
import { ComboBoxComponent } from '../widgets-module/combo-box/combo-box.component';
import { LabelComponent } from '../widgets-module/label/label.component';
import { LineEditComponent } from '../widgets-module/line-edit/line-edit.component';


@Component({
  selector: 'app-table-test-tab',
  templateUrl: './table-test-tab.component.html',
  styleUrls: ['./table-test-tab.component.scss']
})
export class TableTestTabComponent {
  @ViewChild('tbl') childComponent!: TableComponent;

  addRow(): void {
    if (this.childComponent) {
      this.childComponent.addRow();
    }
  }

  removeRow(): void {
    if (this.childComponent) {
      this.childComponent.removeRow();
    }
  }

}
