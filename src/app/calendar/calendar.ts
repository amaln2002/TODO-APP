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

  // receives selected date from parent
  selectedDate = input.required<string>();

  // sends clicked date to parent
  dateSelected = output<string>();

  days: CalendarDay[] = [];
  weekOffset = 0;         // 0 = current week, -1 = last week, +1 = next week
  weekLabel = '';
  today = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.buildWeek();
  }

  // builds 7 days starting from Monday of the current week + offset
  buildWeek(): void {
    const now = new Date();

    // go to Monday of the current week
    const dayOfWeek = now.getDay();                    // 0=Sun, 1=Mon...
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + this.weekOffset * 7);

    // build 7 days Mon → Sun
    this.days = [];
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.days.push({
        date: d.toISOString().split('T')[0],
        dayName: dayNames[i],
        dayNumber: d.getDate()
      });
    }

    // build week label e.g. "Week 16 of 2026"
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
    this.dateSelected.emit(date);   // tell parent which day was clicked
  }

  isToday(date: string): boolean {
    return date === this.today;
  }

  isSelected(date: string): boolean {
    return date === this.selectedDate();
  }

  // calculates ISO week number
  private getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}