import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TabRefDirective } from '../directives/tab-ref.directive';
import { Subject, Observable } from 'rxjs';


interface Tab {
  title: string;
  status: 'create' | 'none';
  component: any;
  example?: any;
}

export interface TabEvent {
  event: 'add' | 'remove' | 'select' | 'titleUpdate' | 'componentUpdate';
  pos: number;
}

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, AfterViewInit {

  tabs: Tab[] = [
  ];

  currentTab = -1;
  eventStream$: Subject<TabEvent> = new Subject();

  @ViewChildren(TabRefDirective) refDirList!: QueryList<TabRefDirective>;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  getEventStream(): Observable<TabEvent> {
    return this.eventStream$.asObservable();
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // setTimeout use for not throw error
    setTimeout(() => {
      for (const ref of this.refDirList) {
        if (this.tabs[ref.idxTab].status === 'create') {
          ref.containerRef.clear();
          const componentRef = ref.containerRef.createComponent<typeof ref.component>(
            this.resolver.resolveComponentFactory(ref.component)
          );
          this.tabs[ref.idxTab].status = 'none';
          this.tabs[ref.idxTab].example = componentRef;
        }
      }
    }, 0);
  }

  setCurrentTab(val: number): void {
    this.currentTab = val;
    this.eventStream$.next({
      event: 'select',
      pos: val
    });
  }

  getCurrentTab(): number {
    return this.currentTab;
  }

  getTabTitle(pos: number): string {
    if (pos < this.tabs.length && pos > -1) {
      return this.tabs[pos].title;
    }
    return '';
  }

  setTabTitle(pos: number, str: string): void {
    if (pos < this.tabs.length && pos > -1) {
      this.tabs[pos].title = str;
      this.eventStream$.next({
        event: 'titleUpdate',
        pos
      });
    }
  }

  getTabComponent(pos: number): any {
    if (pos < this.tabs.length && pos > -1) {
      return this.tabs[pos].example.instance;
    }
    return undefined;
  }

  setTabComponent(pos: number, component: any): any {
    if (pos < this.tabs.length && pos > -1) {
      this.tabs[pos].component = component;
      this.tabs[pos].status = 'create';
      this.ngAfterViewInit();
      this.eventStream$.next({
        event: 'componentUpdate',
        pos
      });
    }
  }

  addTab(title: string, component: any, pos = -1): void {
    pos = (this.tabs.length < pos || pos === -1) ? this.tabs.length : pos;
    this.tabs.splice(pos, 0, {
      title,
      status: 'create',
      component
    });
    this.currentTab = pos;
    this.ngAfterViewInit();
    this.eventStream$.next({
      event: 'add',
      pos
    });
  }

  removeTab(pos = -1): void {
    if (this.tabs.length === 0) {
      return;
    }
    pos = (this.tabs.length < pos || pos === -1) ? this.tabs.length - 1 : pos;
    this.tabs.splice(pos, 1);
    this.currentTab = this.tabs.length - 1;
    this.ngAfterViewInit();
    this.eventStream$.next({
      event: 'remove',
      pos
    });
  }

}
