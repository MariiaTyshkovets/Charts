import { Component, Input } from '@angular/core';
import { IInstrument } from '../../models/instruments.model';
import { IBar } from '../../models/bar.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.scss'
})
export class MarketDataComponent {
  @Input()
  selectedInstrument!: IInstrument;

  @Input()
  selectedBarsCountBack!: IBar[];
}
