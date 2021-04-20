import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { TabComponent } from './tab/tab.component';
import { TableComponent } from './table/table.component';
import { LineEditComponent } from './line-edit/line-edit.component';
import { CheckBoxComponent } from './check-box/check-box.component';
import { RefDirective } from './directives/ref.directive';




@NgModule({
  declarations: [
      ComboBoxComponent,
      TableComponent,
      TabComponent,
      LineEditComponent,
      CheckBoxComponent,
      RefDirective
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
    CheckBoxComponent
  ],
})
export class WidgetsModule { }
