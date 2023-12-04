import { Component, AfterContentInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public data: any = {};
  constructor(
    public action: ActionService
  ) {
    this.data['user'] = {}
    this.data['type'] = this.action.getItem()
  }

  async ngAfterContentInit(): Promise<void> {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.data['country'] = await this.action.getCountries();
  }

  country = () => {
    //   this.data.cout;
    this.data.user['country'] = this.data.cout.name;
    this.data.user['currency'] = this.data.cout.currency.code;
  }

  proceed = async () => {
    try {
      this.data.loading = true;
      const request = this.data.type == 'login' ? await this.action.RequestNoSecure('login', this.data.user, 'POST') : (delete this.data.user.pass1, await this.action.RequestNoSecure('register', this.data.user, 'POST'));
      this.data.loading = false;
      if (!request.data.success) {
        this.action.toast('error', request.data.message)
      }
      const user: { token: string } = request.data.data;
      user.token = request.data.token;
      this.action.secureSave(user, 'user');
      this.action.modalClose({ success: true, data: {} })
      this.action.navigate('/profile');
      //console.log(user)
    } catch (error: any) {
      //console.log(error)
      this.data.loading = false;
      this.action.toast('error', error.response.data ? error.response.data.message : error)
    }
  }

}
