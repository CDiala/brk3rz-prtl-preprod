import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-auth',
  imports: [MatButtonModule, MatInputModule, RouterOutlet, NgOptimizedImage],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
