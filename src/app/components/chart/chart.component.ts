import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  BarController,
  BarElement,
} from 'chart.js';
import { IBar } from '../../models/bar.model';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController
);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input()
  selectedBarsCountBack: IBar[] = [
    {
      t: '2025-02-07T20:40:00+00:00',
      o: 0.8961,
      h: 0.89611,
      l: 0.89586,
      c: 0.89602,
      v: 236,
    },
  ];

  public chart: any;

  ngOnInit() {
    this.createEmptyChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedBarsCountBack'] && this.selectedBarsCountBack && this.selectedBarsCountBack.length > 0) {
      this.updateChart();
    }
  }

  createEmptyChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Open',
              data: [],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Close',
              data: [],
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { type: 'category' },
            y: { beginAtZero: false },
          },
        },
      });
    }
  }

  createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.selectedBarsCountBack.map((data) =>
            new Date(data.t).toLocaleTimeString()
          ),
          datasets: [
            {
              label: 'Open',
              data: this.selectedBarsCountBack.map((data) => data.o),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Close',
              data: this.selectedBarsCountBack.map((data) => data.c),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category',
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    }
  }

  updateChart() {
    this.chart.data.labels = this.selectedBarsCountBack.map((data) => new Date(data.t).toLocaleTimeString());
    this.chart.data.datasets[0].data = this.selectedBarsCountBack.map((data) => data.o);
    this.chart.data.datasets[1].data = this.selectedBarsCountBack.map((data) => data.c);
    this.chart.update();
  }
}
