import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { accounts } from '../../models/accounts';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html'
})
export class AccountsPage {
  adminid = 0;
  account: accounts;
  transactionnumber: any;
  totalbalance: any;
  UserDetails: any;
  UDetails: any;
  usertype: any;
  supplierid: any;
  noamount: any;
  totalcustomers: any;
  totalsuppliers: any;
  totalactivatedsuppliers: any;
  totalnonactivatedsuppliers: any;
  totaltransporters: any;
  totalactivatedtransporters: any;
  totalnonactivatedtransporters: any;
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public dataservice: Dataservice) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.CheckUser(loading);
  }
  CheckUser(loading) {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UserDetails = loggedInUserDetails[2];
          this.UDetails = loggedInUserDetails[1];
          this.usertype = this.UDetails.type;
          this.supplierid = this.UserDetails.supplierid;
          if (this.usertype == "Supplier") {
            this.GetBalances(this.supplierid, this.usertype, loading);
          }
          else if (this.usertype == "Admin") {
            this.getBalances(this.adminid, this.usertype, loading);
            this.getTotalCustomers();
            this.getTotalSuppliers();
            this.getTotalTransporters();
          }
        }
      });
    });
  }
  getTotalCustomers() {
    this.dataservice.TotalCustomers().subscribe(total => {
      this.totalcustomers = total;
    }, (err) => {
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  getTotalSuppliers() {
    this.dataservice.TotalSuppliers().subscribe(total => {
      this.totalsuppliers = total[0];
      this.totalactivatedsuppliers = total[1];
      this.totalnonactivatedsuppliers = total[2];
    }, (err) => {
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  getTotalTransporters() {
    this.dataservice.TotalTransporters().subscribe(total => {
      this.totaltransporters = total[0];
      this.totalactivatedtransporters = total[1];
      this.totalnonactivatedtransporters = total[2];
    }, (err) => {
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
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
  getBalances(id, usertype, loading) {
    this.dataservice.getBalances(id, usertype).subscribe(accounts => {
      let code = accounts[0];
      if (code === 400) {
        this.noamount = "nobalance";
        loading.dismiss().catch(() => { });
      } else {
        this.account = accounts[1];
        this.transactionnumber = this.account.transactionnumber;
        this.totalbalance = this.account.totalbalance;
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  GetBalances(id, usertype, loading) {
    this.dataservice.GetBalances(id, usertype).subscribe(accounts => {
      let code = accounts[0];
      if (code === 400) {
        this.noamount = "nobalance";
        loading.dismiss().catch(() => { });
      } else {
        this.account = accounts[1];
        this.transactionnumber = this.account.transactionnumber;
        this.totalbalance = this.account.totalbalance;
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
}
