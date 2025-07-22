import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  template: `
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      (click)="btnClicked.emit()"
    >
      {{ label() }}
    </button>
  `,
  styles: ``,
})
export class ButtonComponent {
  label = input.required<string>();

  btnClicked = output();
}
