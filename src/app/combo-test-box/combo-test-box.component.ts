import { Component, ViewChild } from '@angular/core';
import { ComboBoxComponent } from '../widgets-module/combo-box/combo-box.component';

@Component({
  selector: 'app-combo-test-box',
  templateUrl: './combo-test-box.component.html',
  styleUrls: ['./combo-test-box.component.scss']
})
export class ComboTestBoxComponent{
  @ViewChild('cb') childComponent!: ComboBoxComponent;

  itemNumber = 1;

  addItem(): void {
    this.childComponent.addItem(`Item ${this.itemNumber}`);
    this.itemNumber += 1;
  }

  removeItem(): void {
    this.childComponent.removeItem(`Item ${this.itemNumber - 1}`);
    this.itemNumber -= 1;
  }

  addItems(): void {
    const arr = [ ...Array(4).keys() ].map( i => `Item ${this.itemNumber + i}`);
    this.childComponent.addItems(arr);
    this.itemNumber += 4;
  }

  removeItems(): void {
    const arr = [ ...Array(4).keys() ].map( i => `Item ${this.itemNumber - 4 + i}`);
    this.childComponent.removeItems(arr);
    this.itemNumber -= 4;
  }

}
