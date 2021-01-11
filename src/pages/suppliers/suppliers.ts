import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController, AlertController, ActionSheetController, } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { suppliers } from '../../models/suppliers';
import { Content } from 'ionic-angular';
import { SupplierdetailsPage } from '../supplierdetails/supplierdetails';
@Component({
  selector: 'page-suppliers',
  templateUrl: 'suppliers.html'
})
export class SuppliersPage {
  @ViewChild(Content) content: Content;
  Details: any;
  memberid: any;
  suppliers: suppliers[];
  originalSuppliers: suppliers[];
  code: any;
  error: any;
  nosuppplier: any;
  sup: any;
  newvalue: string;
  resetvalue: string;
  suppliercount: any;
  firstcount = 0;
  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController, public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public dataservice: Dataservice) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Loading please wait...",
    });
    loading.present();
    this.getSuppliers(loading);
  }

  getSuppliers(loading) {
    let firstCount = "0";
    this.dataservice.getAllSuppliers(firstCount).subscribe(suppliers => {
      this.code = suppliers[0];
      if (this.code != 200) {
        this.nosuppplier = "nosuppplier";
        this.error = suppliers[1];
        loading.dismiss().catch(() => { });
      } else {
        this.nosuppplier = "full";
        this.suppliers = suppliers[1];
        this.suppliercount = this.suppliers[0].count;
        this.originalSuppliers = suppliers[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  loadmoresuppliers(infiniteScroll: any) {
    setTimeout(() => {
      if (this.suppliercount === undefined || this.suppliercount === null) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let mc = parseInt(this.suppliercount);
        this.firstcount += mc;
        this.dataservice.getAllSuppliers(this.firstcount.toString()).subscribe(newsupplier => {
          this.code = newsupplier[0];
          if (this.code === "400") {
            this.error = newsupplier[1];
            this.nosuppplier = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          }
          else {
            this.suppliers = [];
            this.suppliers = this.originalSuppliers.concat(newsupplier[1]);
            infiniteScroll.complete();
          }
        }, (err) => {
          infiniteScroll.complete();
          this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
          return false;
        });
      }
      infiniteScroll.complete();
    }, 2000);
  }
  GoToDetails(id, name) {
    let actionSheet = this.actionSheetCtrl.create({
      title: name,
      buttons: [
        {
          text: 'View',
          handler: ($event) => {
            this.navCtrl.push(SupplierdetailsPage, { id, name });
          }
        },
        {
          text: 'Activate',
          handler: ($event) => {
            this.ActivateAccount(id);
          }
        },
        {
          text: 'Deactivate',
          handler: ($event) => {
            this.DeActivateAccount(id);
          }
        },
        {
          text: 'Apply Charges',
          handler: ($event) => {
            this.ApplyCharges(id);
          }
        },
        {
          text: 'Remove Charges',
          handler: ($event) => {
            this.RemoveCharges(id);
          }
        },
        {
          text: 'Delete Account',
          handler: ($event) => {
            let usertype = "Supplier";
            this.DeleteSupplier(id, usertype);
          }
        },
        {
          text: 'Reset Supply Limit',
          handler: ($event) => {
            this.ResetBooking(id);
          }
        },
        {
          text: 'Reset Current Supply Limit',
          handler: ($event) => {
            this.ResetCurrentSupply(id);
          }
        },
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }
  DeleteSupplier(id, usertype) {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });
    loading.present();
    this.dataservice.DeleteSupplierAccount(id, usertype).subscribe(msg => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Supplier account deleted");
      this.navCtrl.setRoot(SuppliersPage);
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  ActivateAccount(id) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.activateSupplier(id).subscribe(msg => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Supplier account has been activated");
      this.dataservice.appRate.promptForRating(false);
      this.navCtrl.setRoot(SuppliersPage);
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  DeActivateAccount(id) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.DeactivateSupplier(id).subscribe(msg => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Supplier account has been deactivated");
      this.navCtrl.setRoot(SuppliersPage);
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  ApplyCharges(id) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.ApplyCharges(id).subscribe(msg => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Supplier payment charges applied");
      this.navCtrl.setRoot(SuppliersPage);
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  RemoveCharges(id) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    let confirm = this.alertCtrl.create({
      title: 'Charges',
      message: 'Remove Charges?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(SupplierdetailsPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.dataservice.RemoveCharges(id).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Supplier payment charges removed");

              this.navCtrl.setRoot(SuppliersPage);
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
              return false;
            });
          }
        }
      ]
    });
    confirm.present();

  }
  ResetBooking(id) {
    let prompt = this.alertCtrl.create({
      title: 'Reset',
      message: "Reset Number of Supply",
      inputs: [
        {
          name: 'number',
          placeholder: 'numbers'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Reset',
          handler: data => {
            let me = JSON.stringify(data);
            var value = me.split(":");
            this.newvalue = value[1].toString();
            let pp = this.newvalue.length;
            this.newvalue = this.newvalue.substring(1, pp - 1);
            let p = this.newvalue.length;
            this.newvalue = this.newvalue.substring(0, p - 1);
            let note = this.newvalue;
            this.ResetBookingNumber(id, note);
          }
        }
      ]
    });
    prompt.present();

  }
  ResetCurrentSupply(id) {
    let prompt = this.alertCtrl.create({
      title: 'Reset',
      message: "Reset Current Number of Supply",
      inputs: [
        {
          name: 'number',
          placeholder: 'numbers'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Reset',
          handler: data => {
            let me = JSON.stringify(data);
            var value = me.split(":");
            this.resetvalue = value[1].toString();
            let pp = this.resetvalue.length;
            this.resetvalue = this.resetvalue.substring(1, pp - 1);
            let p = this.resetvalue.length;
            this.resetvalue = this.resetvalue.substring(0, p - 1);
            let note = this.resetvalue;
            this.ResetCurrentSupplyNumber(id, note);
          }
        }
      ]
    });
    prompt.present();

  }
  Search(searchEvent) {
    let term = searchEvent.target.value
    if (term.trim() === '' || term.trim().length < 0) {
      this.suppliers = this.originalSuppliers;
    } else {
      this.dataservice.Search(term).subscribe(suppliers => {
        this.code = suppliers[0];
        if (this.code != 200) {
          this.error = suppliers[1];
          this.suppliers = [];
          this.originalSuppliers = [];
          this.nosuppplier = "nosup";
        } else {
          this.suppliers = suppliers[1];
          this.originalSuppliers = suppliers[1];
          this.nosuppplier = "full";
        }
      });
    }
  }

  ResetBookingNumber(id, value) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.ResetBookings(id, value).subscribe(msg => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "New supply limit has been set");

      this.navCtrl.setRoot(SuppliersPage);
    }, (err) => {
      loading.dismiss().catch(() => { });
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
  ResetCurrentSupplyNumber(id, value) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.ResetCurrentSupplyNumber(id, value).subscribe(msg => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "New supply limit number has been set");
      this.navCtrl.setRoot(SuppliersPage);
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  totop() {
    this.content.scrollToTop();
  }


}
