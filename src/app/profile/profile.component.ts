import { Component } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActionService } from '../services/action.service';
import { RequestsComponent } from '../modals/requests/requests.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  data: any = {}
  constructor(
    public action: ActionService
  ) {

  }

  async ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.start()
  }

  public start = async () => {
    try {
      if (!this.action.secureGet('user') || this.action.secureGet('user') == null) {
        this.action.navigate('')
      }
      this.data.user = this.action.secureGet('user');
      // console.log(this.data.user)
      const request = await Promise.all([this.action.RequestNoSecure('user', {}, 'GET'), this.action.RequestNoSecure('transaction/details', {}, 'GET')]);
      if (!request[0].data.success || !request[1].data.success) {
        this.action.toast('error', request[0].data.message)
      }
      this.data['details'] = request[0].data.data;
      this.data['wallet'] = request[1].data.data;
      // console.log(this.data.wallet)
    } catch (error: any) {
      this.data.loading = false;
      this.action.toast('error', error.response.data ? error.response.data.message : error)
    }
  }

  logout = async () => {
    const confirm = await this.action.alertConfirm('Are you sure you want to logout');
    if (confirm) {
      localStorage.clear();
      this.action.navigate('home')
    }
  }

  createReq = async (type: string) => {
    this.action.saveItem(type);
    this.data.side = false;
    const create = await this.action.modalCreate(RequestsComponent, {
      header: type == 'withdraw' ? 'Withdraw funds' : 'Invest',
      width: '50%',
      height: 'auto'
    });
    create?.data?.success ? this.start() : ''
  }
}
