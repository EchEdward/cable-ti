import { AfterViewInit, Component, ComponentFactoryResolver,
  OnInit, QueryList, ViewChildren, Renderer2, ComponentRef} from '@angular/core';
import { TabRefDirective } from '../directives/tab-ref.directive';
import { Subject, Observable } from 'rxjs';

import {TabDirectiveType} from '../interfaces/types';


interface Tab {
  title: string;
  status: 'create' | 'none';
  component: any;
  example?: any;
  instance: { [atrr: string]: any };
  directives: any[];
  dExamples?: any[];
}

interface TabStyle {
  tabbar: { [atrr: string]: string };
  tabbaritem: { [atrr: string]: string };
  tabbaritemactive: { [atrr: string]: string };
  tabcontent: { [atrr: string]: string };
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
  // tslint:disable-next-line: variable-name
  _currentTab = -1;
  eventStream$: Subject<TabEvent> = new Subject();

  // tslint:disable-next-line: variable-name
  _style: TabStyle = {
    tabbar: {},
    tabbaritem: {},
    tabbaritemactive: {},
    tabcontent: {}
  };

  @ViewChildren(TabRefDirective) refDirList!: QueryList<TabRefDirective>;

  constructor(private resolver: ComponentFactoryResolver, private renderer: Renderer2) {
  }

  getEventStream(): Observable<TabEvent> {
    return this.eventStream$.asObservable();
  }

  setStyle(el: 'tabbar' | 'tabbaritem' | 'tabbaritemactive' | 'tabcontent',
           style: { [atrr: string]: string }): void {
    this._style[el] = {...this._style[el], ...style};
  }

  clearStyle(el: 'tabbar' | 'tabbaritem' | 'tabbaritemactive' | 'tabcontent'): void {
    this._style[el] = {};
  }

  getStyle(el: 'tabbar' | 'tabbaritem' | 'tabbaritemactive' | 'tabcontent'): { [atrr: string]: string } {
    return {...this._style[el]};
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

          for (const inst of Object.keys(this.tabs[ref.idxTab].instance)) {
            componentRef.instance[inst] = this.tabs[ref.idxTab].instance[inst];
          }

          if (this.tabs[ref.idxTab].directives && this.tabs[ref.idxTab].directives.length > 0) {
            const dExamples: any[] = [];
            for (const direct of this.tabs[ref.idxTab].directives) {
              dExamples.push(new direct(componentRef, this.renderer));
            }
            this.tabs[ref.idxTab].dExamples = dExamples;
          }
        }
      }
    }, 0);
  }

  setCurrentTab(val: number): void {
    this._currentTab = val;
    this.eventStream$.next({
      event: 'select',
      pos: val
    });
  }

  getCurrentTab(): number {
    return this._currentTab;
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

  getTabComponent(pos: number): object | undefined {
    if (pos < this.tabs.length && pos > -1) {
      return this.tabs[pos].example.instance;
    }
    return undefined;
  }

  setTabComponent<C>(pos: number, component: C): void {
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

  addTab(title: string, component: any, instance: { [atrr: string]: any }, directives: any[], pos = -1): void {
    pos = (this.tabs.length < pos || pos === -1) ? this.tabs.length : pos;
    this.tabs.splice(pos, 0, {
      title,
      status: 'create',
      component,
      directives,
      instance
    });
    this._currentTab = pos;
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
    this._currentTab = this.tabs.length - 1;
    this.ngAfterViewInit();
    this.eventStream$.next({
      event: 'remove',
      pos
    });
  }

  addDirective<D extends TabDirectiveType<TabComponent>>(pos: number, directives: D[] | D): void {
    if (pos < this.tabs.length && pos > -1) {
      if (directives.constructor === Array) {
        for (const direct of  directives) {
          this.tabs[pos].directives.push(direct);
          this.tabs[pos].dExamples?.push(new direct(this.tabs[pos].example, this.renderer));
        }
      } else {
        this.tabs[pos].directives.push(directives);
        this.tabs[pos].dExamples?.push(new (directives as D)(this.tabs[pos].example, this.renderer));
      }
    }
  }

}
