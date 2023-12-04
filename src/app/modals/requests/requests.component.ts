import { Component } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {
  public data: any = {};
  constructor(
    public action: ActionService
  ) {
    this.data['user'] = {}
  }

  async ngAfterContentInit(): Promise<void> {
    this.action.getItem() == 'withdraw' ? this.data['current'] = 'amount' : '';
  }

  public checker = (type: string) => {
    const items = type == 'invest' ? [
      "total",
      "phone",
      "postCode",
      "address",
      "town",
      "lname",
      "fname",
    ] : type == 'bank' ? [
      'name',
      'accountNumber',
      'routingNumber',
      'bank',
      'iban'
    ] : type == 'withdraw' ? [
      'total',
      'details',
      'type'
    ] : []
    let check: Array<boolean> = [];
    items.forEach((res) => {
      if (this.data.user[res] == '' || this.data.user[res] == undefined || !this.data.user[res]) { check.push(true) }
      else { check.push(false) }
    });
    return check.includes(true);
  }

  public proceed = async (type: string) => {
    try {
      this.data['loading'] = true;
      const payload = {
        ...this.data.user,
        type: 'credit',
        field: type == 'invest' ? 'invested' : '',
        ref: this.action.genRef()
      }
      const get = await this.action.RequestNoSecure('transaction/create', payload, 'POST');
      this.data.loading = false;
      if (!get.data.success) {
        this.action.toast('success', `${get.data.message}`);
        return;
      }
      this.action.toast('success', `Congratulations, you have succeesfully added ${this.data.user.total} investment`)
      this.action.modalClose({ success: true, data: {} })
    } catch (error: any) {
      this.data.loading = false;
      this.action.alertConfirm(error)
    }
  }

  public withdraw = async () => {
    try {
      this.data['loading'] = true;
      const payload = {
        ...this.data.user,
        ref: this.action.genRef(),
      }
      console.log(payload)
      const check = await this.action.RequestNoSecure('transaction/withdraw', payload, 'POST');
      if (!check.data.success) {
        this.action.toast('error', check.data.message);
        return;
      };
      this.action.alertConfirm(check.data.message);
      this.action.modalClose({
        success: true,
        data: {}
      })
    } catch (error: any) {
      this.data.loading = false;
      this.action.alertConfirm(error)
    }
  }


  public saveBank = async () => {
    try {
      this.data['loading'] = true;
      // console.log(this.data.user)
      const check = await this.action.RequestNoSecure('user/bank', this.data.user, 'POST');
      if (!check.data.success) {
        this.action.toast('error', check.data.message);
        return;
      }
      this.data.loading = false;
      this.action.toast('success', check.data.message);
      this.data.current = 'withdraw';
      this.data.user = {};
    } catch (error: any) {
      this.data.loading = false;
      this.action.alertConfirm(error)
    }
  }
  public checkAccount = async () => {
    try {
      this.data['loading'] = true;
      const check = await this.action.RequestNoSecure('user/bank', {}, 'GET');
      this.data.loading = false;
      if (!check.data.success) {
        this.action.toast('error', check.data.message);
        return;
      }
      const total = this.data.user.total;
      check.data.data.hasAccount ? (this.data.current = 'withdraw', this.data['user'] = {}, this.data.user['total'] = total) : (this.data.current = 'saveAccount', this.data['user'] = {}, this.data.user['total'] = total);

    } catch (error: any) {
      this.data['loading'] = false;
      this.action.toast('error', error)
    }
  }
}
