import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { users } from '../../models/users';
@Component({
  selector: 'page-userdetails',
  templateUrl: 'userdetails.html'
})
export class UserdetailsPage {
  customerid: any;
  name: any;
  customer: users;
  UDetails: any;
  usertype: any;
  constructor(public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public dataservice: Dataservice,
    public loadingCtrl: LoadingController, public storage: Storage, public navParams: NavParams) {
    this.CheckUser();
  }
  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.customerid = this.navParams.get('id');
    this.name = this.navParams.get('name');
    this.getCustomerDetails(this.customerid, loading);
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
  getCustomerDetails(customerid, loading) {
    this.dataservice.getCustomerDetails(customerid).subscribe(customers => {
      this.customer = customers;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });

  }
  CheckUser() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.usertype = this.UDetails.type;
        }
      });
    });
  }

}
