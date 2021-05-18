import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ComboBoxComponent } from '../combo-box/combo-box.component';
import { TabRefDirective } from '../directives/tab-ref.directive';
import { TableComponent } from '../table/table.component';


interface Tab {
  id: number;
  title: string;
  component: any;
  example?: any;
}

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterViewInit {

  tabs: Tab[] = [
    {id: 1, title: 'One', component: TableComponent},
    {id: 2, title: 'Two', component: ComboBoxComponent},
    {id: 3, title: 'Tree', component: ComboBoxComponent},
  ];

  list = this.tabs.length;


  @ViewChildren(TabRefDirective) refDirList!: QueryList<TabRefDirective>;

  constructor(private resolver: ComponentFactoryResolver) { }



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // setTimeout use for not throw error
    setTimeout(() => {
      for (const ref of this.refDirList) {
        ref.containerRef.clear();
        const componentRef = ref.containerRef.createComponent(
          this.resolver.resolveComponentFactory(ref.component)
        );
        const tabsIdx = this.tabs.findIndex((tab: Tab) => {
          return tab.id === ref.ID;
        });
        this.tabs[tabsIdx].example = componentRef;
        // задание свойств в Input
        // componentRef.instance.data
      }
    }, 0);
  }

  setList(val: number): void {
    this.list = val;
  }

}
