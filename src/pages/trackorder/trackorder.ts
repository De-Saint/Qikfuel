import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import {orders} from '../../models/orders';
import { Dataservice } from '../../providers/dataservice';
@Component({
  selector: 'page-trackorder',
  templateUrl: 'trackorder.html'
})
export class TrackorderPage {
queryText = '';
order: orders;
error: any;
code: any;
noorder: any;
  constructor(public toastCtrl: ToastController,public loadingCtrl: LoadingController, public dataservice: Dataservice, public navCtrl: NavController, public navParams: NavParams) {}

checkStatus(searchterm) {
    let searchvalue = this.queryText;
    if (searchvalue.trim() != '' || searchvalue.trim().length > 5) {
      this.dataservice.CheckStatus(searchvalue).subscribe(order => {
        this.order = order;
          this.code = order[0];
      if (this.code != 200) {
        this.order = order[1];
      } else {
        this.order = order[1]; 
      }
      }, (err) => {
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
    }else{
        return false;
    }
  }

 showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 3000,
      position: position
    });

    toast.present(toast);
  }  
}
