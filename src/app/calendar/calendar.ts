import { Component, input, output, OnInit } from '@angular/core';

interface CalendarDay {
  date: string;
  dayName: string;
  dayNumber: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarStripComponent implements OnInit {

  selectedDate = input.required<string>();
  dateSelected = output<string>();

  days: CalendarDay[] = [];
  weekOffset = 0;
  weekLabel = '';
  today = '';

  ngOnInit(): void {
    this.today = this.toDateString(new Date());
    this.buildWeek();
  }

  buildWeek(): void {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + this.weekOffset * 7);

    this.days = [];
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.days.push({
        date: this.toDateString(d),
        dayName: dayNames[i],
        dayNumber: d.getDate()
      });
    }

    const weekNum = this.getWeekNumber(monday);
    this.weekLabel = `Week ${weekNum} of ${monday.getFullYear()}`;
  }

  prevWeek(): void {
    this.weekOffset--;
    this.buildWeek();
  }

  nextWeek(): void {
    this.weekOffset++;
    this.buildWeek();
  }

  goToCurrentWeek(): void {
    this.weekOffset = 0;
    this.buildWeek();
  }

  onDayClick(date: string): void {
    this.dateSelected.emit(date);
  }

  isToday(date: string): boolean {
    return date === this.today;
  }

  isSelected(date: string): boolean {
    return date === this.selectedDate();
  }

  private toDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}