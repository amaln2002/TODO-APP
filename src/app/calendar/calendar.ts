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
  today = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.buildWeek();
  }

buildWeek(): void {
  // 1. Get TODAY
  const now = new Date();  // e.g. Wed Oct 16, 2024

  // 2. What day is today? (0=Sun,1=Mon,2=Tue,3=Wed...)
  const dayOfWeek = now.getDay();  // e.g. 3 (Wed)

  // 3. How many days back to Monday?
  // Normal: Mon(1)=0, Tue(2)=-1, Wed(3)=-2, Thu(4)=-3...
  // Sun(0) special: -6 days to prev Mon
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
  // Wed(3): 1-3= -2 ✓

  // 4. Start from today, copy
  const monday = new Date(now);

  // 5. Jump to Monday: today + back_days + week_offset*7
  monday.setDate(now.getDate() + diffToMonday + this.weekOffset * 7);
  // weekOffset=0: Wed16 + (-2) = Mon14
  // weekOffset=1: Wed16 + (-2) +7 = Mon21 (next)


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

  private getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}