import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { RefDirective } from '../directives/ref.directive';

interface List {
  id: number;
  title: string;
}

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterViewInit {

  tabs: List[] = [
    {id: 1, title: 'One'},
    {id: 2, title: 'Two'},
    {id: 3, title: 'Tree'},
  ];

  list = this.tabs.length;


  @ViewChildren(RefDirective) refDirList!: QueryList<RefDirective>;

  constructor(private resolver: ComponentFactoryResolver) { }



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // setTimeout use for not throw error
    setTimeout(() => {
      for (const ref of this.refDirList) {
        const modalFactory = this.resolver.resolveComponentFactory(ComboBoxComponent);
        ref.containerRef.clear();
        ref.containerRef.createComponent(modalFactory);
      }
    }, 0);
  }

  setList(val: number): void {
    this.list = val;
  }

}
