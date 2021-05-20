import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { TabComponent } from './tab/tab.component';
import { TableComponent } from './table/table.component';
import { LineEditComponent } from './line-edit/line-edit.component';
import { CheckBoxComponent } from './check-box/check-box.component';
import { TabRefDirective } from './directives/tab-ref.directive';
import { TableCellRefDirective } from './directives/table-cell-ref.directive';
import { NumericDirective} from './directives/numeric.directive';
import { LabelComponent } from './label/label.component';

import { ToRedDirective} from './directives/tored.directive';


@NgModule({
  declarations: [
      ComboBoxComponent,
      TableComponent,
      TabComponent,
      LineEditComponent,
      CheckBoxComponent,
      TabRefDirective,
      TableCellRefDirective,
      LabelComponent,
      NumericDirective,
      ToRedDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [],
  exports: [
    ComboBoxComponent,
    TableComponent,
    TabComponent,
    LineEditComponent,
    CheckBoxComponent,
    NumericDirective
  ],
})
export class WidgetsModule { }
