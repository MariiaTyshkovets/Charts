import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IInstrument } from '../../models/instruments.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input()
  public instruments!: IInstrument[];

  @Input()
  public selectedInstrument: IInstrument | undefined;

  @Output()
  public instrumentSubscribed = new EventEmitter<IInstrument>();

  public isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: IInstrument) {
    this.selectedInstrument = option;
    this.isDropdownOpen = false;
  }

  selectionSubscribed() {
    this.instrumentSubscribed.emit(this.selectedInstrument);
  }
}
