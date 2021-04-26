import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-line-edit',
  templateUrl: './line-edit.component.html',
  styleUrls: ['./line-edit.component.scss']
})
export class LineEditComponent implements OnInit {

  @Input() eventStream$!: Subject<string>;

  constructor() { }

  ngOnInit(): void {
  }

  focusOut(): void {
    console.log('aaaaaaaaaaa');
    if (this.eventStream$) {
      this.eventStream$.next('test');
    }
  }

}
