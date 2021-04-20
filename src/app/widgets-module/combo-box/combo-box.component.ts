import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent implements OnInit {

  selectedValue = '';

  items: string[] = ['one', 'two', 'three'];

  constructor() { }

  ngOnInit(): void {
    this.selectedValue = this.items[1];
  }

  change(): void {
    console.log('was changed:', this.selectedValue);
  }

  selected(): void {
    console.log();
  }

}
