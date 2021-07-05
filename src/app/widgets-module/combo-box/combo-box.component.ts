import { Component, OnInit, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';

interface ComboStyle {
  select: { [atrr: string]: string };
}

export interface ComboEvent {
  event: 'add' | 'remove' | 'select' ;
  item?: string | string[];
}

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent implements OnInit {
  @Input() inputItems: string | string[] = '';

  selectedValue = '';

  items: string[] = ['one', 'two', 'three'];

  // tslint:disable-next-line: variable-name
  _items = new Set<string>();
  // tslint:disable-next-line: variable-name
  _style: ComboStyle = {
    select: {},
  };

  eventStream$: Subject<ComboEvent> = new Subject();

  getEventStream(): Observable<ComboEvent> {
    return this.eventStream$.asObservable();
  }

  setStyle(el: 'select' = 'select', style: { [atrr: string]: string }): void {
    this._style[el] = {...this._style[el], ...style};
  }

  clearStyle(el: 'select' = 'select'): void {
    this._style[el] = {};
  }

  getStyle(el: 'select' = 'select'): { [atrr: string]: string } {
    return {...this._style[el]};
  }

  constructor() { }

  ngOnInit(): void {
    if (this.inputItems.constructor === Array) {
      this._items = new Set<string>(this.inputItems);
    } else {
      this._items.add(this.inputItems as string);
    }
    this.selectedValue = this.items[1];
  }

  change(): void {
    console.log('was changed:', this.selectedValue);
  }

  currentItem(): string {
    return this.selectedValue;
  }

  addItem(str: string): void {
    this._items.add(str);
  }

  addItems(itemList: string[]): void {
    for (const item of itemList) {
      this._items.add(item);
    }
  }

  removeItem(str: string): void {
    this._items.delete(str);
  }

  removeItems(itemList: string[]): void {
    for (const item of itemList) {
      this._items.delete(item);
    }
  }

  setCurrentItem(str: string): void {
    if (this._items.has(str)) {
      this.selectedValue = str;
    }
  }
  /* 
  function isSuperset(set, subset) {
      for (var elem of subset) {
          if (!set.has(elem)) {
              return false;
          }
      }
      return true;
  }

  function union(setA, setB) {
      var _union = new Set(setA);
      for (var elem of setB) {
          _union.add(elem);
      }
      return _union;
  }

  function intersection(setA, setB) {
      var _intersection = new Set();
      for (var elem of setB) {
          if (setA.has(elem)) {
              _intersection.add(elem);
          }
      }
      return _intersection;
  }

  function difference(setA, setB) {
      var _difference = new Set(setA);
      for (var elem of setB) {
          _difference.delete(elem);
      }
      return _difference;
  }
  */
}
