import { Renderer2, ComponentRef} from '@angular/core';

export type TabDirectiveType<C> = new(comp: ComponentRef<C>, r: Renderer2) => object;


