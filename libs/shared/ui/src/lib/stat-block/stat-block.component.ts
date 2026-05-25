import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-stat-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-block.component.html',
  styleUrl: './stat-block.component.css',
})
export class StatBlockComponent {
  @Input() value!: string;
  @Input() label!: string;
}
