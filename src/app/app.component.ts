import { Component } from '@angular/core';
import { ActionService } from './services/action.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'preshSite';
  constructor(
public action:ActionService
  ){

  }
}
