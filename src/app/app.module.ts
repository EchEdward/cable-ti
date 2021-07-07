import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { from } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WidgetsModule } from './widgets-module/widgets.module';
import { TableTestTabComponent } from './table-test-tab/table-test-tab.component';
import { ComboTestBoxComponent } from './combo-test-box/combo-test-box.component';

@NgModule({
  declarations: [
    AppComponent,
    TableTestTabComponent,
    ComboTestBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    WidgetsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
