import { Component, ViewChild } from '@angular/core';
import { TabComponent } from './widgets-module/tab/tab.component';
import { ComboBoxComponent } from './widgets-module/combo-box/combo-box.component';
import { TableComponent } from './widgets-module/table/table.component';
import { TableTestTabComponent } from './table-test-tab/table-test-tab.component';
import { ComboTestBoxComponent } from './combo-test-box/combo-test-box.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 1;
  @ViewChild('cmp') childComponent!: TabComponent;

  addTab(): void {
    if (this.childComponent) {
      if (this.title === 1) {
        this.childComponent.addTab(this.title.toString(), TableTestTabComponent, {}, []);
      } else if (this.title === 2) {
        this.childComponent.addTab(this.title.toString(), ComboTestBoxComponent, {}, []);
      } else {
        this.childComponent.addTab(this.title.toString(), TableComponent, {}, []);
      }
      // this.childComponent.addTab(this.title.toString(), TableComponent);
      this.title += 1;
    }
  }

  removeTab(): void {
    if (this.childComponent) {
      this.childComponent.removeTab();
    }
  }
  setCurrentTab(): void {
    if (this.childComponent) {
      this.childComponent.setCurrentTab(2);
    }
  }
  setTabTitle(str: string): void {
    if (this.childComponent) {
      this.childComponent.setTabTitle(2, str);
    }
  }

  setTabComponent(): void {
    if (this.childComponent) {
      this.childComponent.setTabComponent(2, ComboBoxComponent);
    }
  }
}
