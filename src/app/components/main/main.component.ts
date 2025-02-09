import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MarketDataComponent } from '../market-data/market-data.component';
import { ChartComponent } from '../chart/chart.component';
import { ChartsService } from '../../services/charts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IExchanges } from '../../models/exchanges.model';
import { IInstrument, IInstruments } from '../../models/instruments.model';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ICountBackRequest } from '../../models/count-back-request.model';
import { Period } from '../../enums/periodisity.enum';
import { IBar } from '../../models/bar.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, MarketDataComponent, ChartComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  public exchanges!: IExchanges;
  public providers!: string[];
  public instruments!: IInstruments;
  public selectedInstrument!: IInstrument;
  public selectedBarsCountBack!: IBar[];
  public isLoading = true;

  private chartsService = inject(ChartsService);
  private route = inject(ActivatedRoute);

  readonly #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isLoading = true;
    this.route.data
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((data) => {
        if (data['isAuthenticated']) {
          this.getData();
        }
      });
  }

  getData() {
    forkJoin([
      this.chartsService.getInstruments(),
      this.chartsService.getExchanges(),
      this.chartsService.getProviders(),
    ])
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(([instruments, exchanges, providers]) => {
        this.instruments = instruments;
        this.selectedInstrument = instruments.data[0];
        this.exchanges = exchanges;
        this.providers = providers;
        this.isLoading = false;
      });
  }

  onInstrumentSubscribed(instrument: IInstrument) {
    this.selectedInstrument = instrument;
    const request: ICountBackRequest = {
      periodicity: Period.MINUTE,
      instrumentId: this.selectedInstrument.id,
      provider: 'oanda',
      interval: 5,
      barsCount: 20,
    };
    this.chartsService.getBarsCountBack(request).pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(data => {
      this.selectedBarsCountBack = data;
    });
  }
}
