import { Component, OnInit, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';

interface ComboStyle {
  select: { [atrr: string]: string };
}

export interface ComboEvent {
  event: 'add' | 'remove' | 'select' ;
  item: string | string[];
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

  getComboList(): string[] {
    return Array.from(this._items);
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
      this.selectedValue = this.inputItems.length > 0 ? this.inputItems[0] : '';
    } else {
      this._items.add(this.inputItems as string);
      this.selectedValue = this.inputItems as string;
    }
  }

  change(): void {
    console.log('was changed:', this.selectedValue);
    this.eventStream$.next({
      event: 'select',
      item: this.selectedValue
    });
  }

  currentItem(): string {
    return this.selectedValue;
  }

  setCurrentItem(str: string): void {
    if (this._items.has(str)) {
      this.selectedValue = str;
    }
  }

  addItem(str: string): void {
    this.eventStream$.next({
      event: 'add',
      item: Array.from(this.difference<string>(new Set([str]), this._items))
    });
    this._items.add(str);
  }

  addItems(itemList: string[]): void {
    this.eventStream$.next({
      event: 'add',
      item: Array.from(this.difference<string>(new Set(itemList), this._items))
    });
    for (const item of itemList) {
      this._items.add(item);
    }
  }

  removeItem(str: string): void {
    this.eventStream$.next({
      event: 'remove',
      item: Array.from(this.intersection<string>(new Set([str]), this._items))
    });
    this._items.delete(str);
  }

  removeItems(itemList: string[]): void {
    this.eventStream$.next({
      event: 'remove',
      item: Array.from(this.intersection<string>(new Set(itemList), this._items))
    });
    for (const item of itemList) {
      this._items.delete(item);
    }
  }

  private isSuperset<T>(set: Set<T>, subset: Set<T>): boolean {
      for (const elem of subset) {
          if (!set.has(elem)) {
              return false;
          }
      }
      return true;
  }

  private union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
      // tslint:disable-next-line: variable-name
      const _union = new Set(setA);
      for (const elem of setB) {
          _union.add(elem);
      }
      return _union;
  }

  private intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
      // tslint:disable-next-line: variable-name
      const _intersection = new Set<T>();
      for (const elem of setB) {
          if (setA.has(elem)) {
              _intersection.add(elem);
          }
      }
      return _intersection;
  }

  private difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
      // tslint:disable-next-line: variable-name
      const _difference = new Set(setA);
      for (const elem of setB) {
          _difference.delete(elem);
      }
      return _difference;
  }

}
