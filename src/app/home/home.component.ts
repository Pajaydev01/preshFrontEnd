import { Component } from '@angular/core';
import { AuthComponent } from '../modals/auth/auth.component';
import { ActionService } from '../services/action.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    public action: ActionService
  ) {
  }

  public getUser = (): Boolean => {
    //console.log(this.action.secureGet('user'))
    return this.action.secureGet('user') == null || this.action.secureGet('user') == "" ? false : true;
  }


  public auth = async (type: string) => {
    try {
      this.action.saveItem(type);
      this.action.modalCreate(AuthComponent, {
        width: '50%',
        height: 'auto',
        header: type == 'login' ? 'Sign in' : 'Register',
        maximizable: true
      })
    } catch (error) {

    }
  }
}
