export interface WidgetEvent {
    event: 'change' | 'select' | 'focus';
    emiter: 'line-edit' | 'combo-box' | 'check-box';
    from: 'cell' | 'self';
    previousState: string;
    currentState: string;
    ref?: any;
  }
