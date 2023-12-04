import { Component, NgZone, HostListener, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { format, parseISO, getDate, getMonth, getYear } from 'date-fns';
import { Router, ActivatedRoute, ParamMap, NavigationExtras, RouterEvent } from '@angular/router';
import { Location, LocationStrategy, DOCUMENT } from '@angular/common';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var require: any;
interface dats {
}
@Injectable({
  providedIn: 'root'
})
export class ActionService {
  public data: any = {};

  constructor(
    public route: Router,
    public _location: Location,
    public modal: DialogService,
    public confirm: ConfirmationService,
    public msg: MessageService,
    public routeP: ActivatedRoute,
    public dialogConf: DynamicDialogConfig,
    private sanitize: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.data['modals'] = [];
  }


  public sanitizeUrl = (url: string) => {
    return this.sanitize.bypassSecurityTrustResourceUrl(url);
  }
  checkFullURL = (action: string): Promise<string> => {
    //call the init function
    this.init();
    return new Promise((resolve, reject) => {
      if (action.indexOf('http://') > -1 || action.indexOf('https://') > -1) {
        resolve(action);
      }
      else {
        resolve(this.data.url + action);
      }
    })
  }

  public genRef = (length: number = 10) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  getCountries = async (): Promise<Array<{}>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const request = await axios.request({
          url: './assets/static/countries.json',
        });
        resolve(request.data)
      } catch (error) {
        reject(error)
      }
    })
  }

  init = () => {
    //set headers
    let headers: any = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    //get the authororization
    this.secureGet('user') != null ? headers['x-auth-token'] = this.secureGet('user').token : '';
    this.data['headers'] = headers;
    //  console.log(this.secureGet('user'))

    //live url
    //this.data['url']='https://services.titan-xchange.com/api/v2/';

    //local url
    // this.data['url'] = 'http://127.0.0.1:1000/api/';
    this.data['url'] = 'http://3.248.208.35:1000/api/';

    //test server url
    // this.data['url']='https://9110.titan-xchange.com/api/v1/';
    this.data['server'] = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/';
    //console.log(this.data.server);

  };

  secureGet = (name: string): any => {
    //  console.log(this.data.secret);
    // if (isPlatformBrowser(this.platformId)) {
    // Client only code. Local storage code
    return localStorage.getItem(name) != null ? JSON.parse(localStorage.getItem(name) || '') : null;
    //}
  }

  checkBrowser = (): boolean => {
    return (isPlatformBrowser(this.platformId))
  }

  secureSave = (data: any, name: string) => {
    try {
      //  const sign=jwt.sign(data,this.data.secret);
      //console.log('here',sign)
      localStorage.setItem(name, JSON.stringify(data));

    } catch (error) {
      console.log(error)
    }
  }

  //console.log('called',data)
  async RequestNoSecure(action: string, data: dats = {}, method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT"): Promise<AxiosResponse> {
    //pass the data as a json web token first
    return new Promise((resolve, reject) => {
      //  console.log(this.checkFullURL(action))
      this.checkFullURL(action).then((res: any) => {
        axios.request({
          method: method,
          timeout: 1200000,
          url: res,
          headers: this.data.headers,
          data: data
        }).then((res: any) => {
          // const handle=token.verify(res.data,this.data.secret);
          //   res['data']=handle;
          // console.log(res)
          resolve(res);
        }).catch((err: any) => {
          //  const handle=token.verify(err.response.data,this.data.secret);
          // err.response['data']=handle;
          reject(err)
        })
      }).catch(err => {
        reject(err);
      })
    })
  }

  modalCreate = (component: any, config: DynamicDialogConfig = {}): Promise<{
    data: {
      success: boolean,
      data: {}
    }
  }> => {
    return new Promise((resolve, reject) => {
      this.data['modal'] = this.modal.open(component, config);
      this.data['modals'].push(this.data.modal)
      this.data.modal.onClose.subscribe((res: any) => {
        resolve(res)
      })
    })
  }

  modalClose = (data: { success: boolean, data: {} }) => {
    this.data.modal.close({
      data: {
        ...data
      }
    })
  }

  saveItem(item: any) {
    this.data['item'] = item;
    return "succces";
  }

  getItem() {
    return this.data.item;
  }
  navigate = (path: string) => {
    const token = this.secureGet('user') != null;
    this.route.navigateByUrl(path);
    this.data.defaultSide = true;
  }

  navigateExtra = (path: string, extra: {}) => {
    const extras: NavigationExtras = {
      state: {
        ...extra
      }
    }
    this.route.navigateByUrl(path, extras)
  }

  getNavItem = () => {
    //get navigation parameters here
    const item = this.route.getCurrentNavigation()?.extras.state;
    return item;
  }

  history = () => {
    this._location.back();
  }
  //toast here
  toast = (sev: "warning" | "success" | "error", mes: string, sum: string = '') => {
    this.msg.add({ severity: sev, detail: mes, summary: sum })
  }

  ids = (id: string) => {
    return document.getElementById(id);
  }

  createLoader = (message: string) => {
    this.data['blocked'] = true;
    this.data['loadingMessage'] = message;
  }

  removeLoader = () => {
    this.data['blocked'] = false;
    this.data['loadingMessage'] = null;
  }

  alertConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.confirm.confirm({
        //target: ev.target,
        message: message,
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-warning',
        rejectButtonStyleClass: 'p-button-white',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      });
    });
  }
}
