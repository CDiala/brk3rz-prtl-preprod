import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from '@insurFlow/loading';

@Component({
  imports: [RouterOutlet, Loading],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'web';
}
