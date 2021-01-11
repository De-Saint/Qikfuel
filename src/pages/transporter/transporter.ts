import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { TransporterdetailsPage } from '../transporterdetails/transporterdetails';
import { TransportersignupPage } from '../transportersignup/transportersignup';
import { transporters } from '../../models/transporters';
import { Content } from 'ionic-angular';
@Component({
  selector: 'page-transporter',
  templateUrl: 'transporter.html'
})
export class TransporterPage {
  @ViewChild(Content) content: Content;
  code: any;
  error: any;
  notrans: any;
  trans: any;
  transporters: transporters[];
  originalTransporters: transporters[];
  UserDetails: any;
  UDetails: any;
  supplierid: any;
  usertype: any;
  adminid: any;
  transcount: any;
  firstcount = 0;
  constructor(public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public navParams: NavParams,
    public alertCtrl: AlertController,
    public storage: Storage, public dataservice: Dataservice) { }


  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UserDetails = loggedInUserDetails[1];
          this.usertype = this.UserDetails.type;
          this.UDetails = loggedInUserDetails[2];
          this.supplierid = this.UDetails.supplierid;
          this.adminid = this.UDetails.adminid;
          if (this.usertype == "Supplier") {
            this.getSupplierTransporter(this.supplierid, loading);
          } else if (this.usertype == "Admin") {
            this.getTransporters(loading);
          }
        }
      });
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
  getTransporters(loading) {
    let firstCount = "0";
    this.dataservice.getAllTransporter(firstCount).subscribe(transporters => {
      this.code = transporters[0];
      if (this.code != 200) {
        this.error = transporters[1];
        this.notrans = "notrans";
        loading.dismiss().catch(() => { });
      } else {
        this.notrans = "full";
        this.transporters = transporters[1];
        this.transcount = this.transporters[0].count;
        this.originalTransporters = transporters[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  loadmoretransporters(infiniteScroll: any) {
    setTimeout(() => {
      if (this.transcount === undefined || this.transcount === null) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let mc = parseInt(this.transcount);
        this.firstcount += mc;
        if (this.usertype == "Supplier") {
          this.dataservice.GetSupplierTransporters(this.supplierid, this.firstcount.toString()).subscribe(newtrans => {
            this.code = newtrans[0];
            if (this.code === "400") {
              this.error = newtrans[1];
              this.notrans = 'none';
              infiniteScroll.complete();
              infiniteScroll.enable(false);
            }
            else {
              this.transporters = [];
              this.transporters = this.originalTransporters.concat(newtrans[1]);
              infiniteScroll.complete();
            }
          }, (err) => {
            infiniteScroll.complete();
            this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
            return false;
          });
        }
        else if (this.usertype == "Admin") {
          this.dataservice.getAllTransporter(this.firstcount.toString()).subscribe(newtrans => {
            this.code = newtrans[0];
            if (this.code === "400") {
              this.error = newtrans[1];
              this.notrans = 'none';
              infiniteScroll.complete();
              infiniteScroll.enable(false);
            }
            else {
              this.transporters = [];
              this.transporters = this.originalTransporters.concat(newtrans[1]);
              infiniteScroll.complete();
            }
          }, (err) => {
            infiniteScroll.complete();
            this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
            return false;
          });
        }

      }

      infiniteScroll.complete();
    }, 2000);

  }
  getSupplierTransporter(supplierid, loading) {
    let firstCount = "0";
    this.dataservice.GetSupplierTransporters(supplierid, firstCount).subscribe(transporters => {
      this.code = transporters[0];
      if (this.code != 200) {
        this.error = transporters[1];
        this.notrans = "notrans";
        loading.dismiss().catch(() => { });
      } else {
        this.notrans = "full";
        this.transporters = transporters[1];
        this.transcount = transporters[1].count;
        this.originalTransporters = transporters[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });

  }



  goToTransDetails(id, name) {
    let actionSheet = this.actionSheetCtrl.create({
      title: name,
      buttons: [
        {
          text: 'View',
          handler: ($event) => {
            this.navCtrl.push(TransporterdetailsPage, { id, name });
          }
        },
        {
          text: 'Activate Transporter Account',
          handler: ($event) => {
            this.ApproveTransporter(id);
          }
        },
        {
          text: 'Deactivate Transporter Account',
          handler: ($event) => {
            this.DisapproveTransporter(id);
          }
        },
        {
          text: 'Delete Account',
          handler: ($event) => {
            let usertype = "Transporter";
            this.DeleteTransporter(id, usertype);
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
  ApproveTransporter(id) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.approveTransporter(id).subscribe(msg => {
      if (msg[0] === "400") {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Transporter account bes already been activated");
        this.navCtrl.setRoot(TransporterPage);
      } else {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Transporter account activated");
        this.navCtrl.setRoot(TransporterPage);
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  DisapproveTransporter(id) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.disapproveTransporter(id).subscribe(msg => {
      if (msg[0] === "400") {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Transporter account bes already been deactivated");
        this.navCtrl.setRoot(TransporterPage);
      } else {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Transporter account deactivated");
        this.navCtrl.setRoot(TransporterPage);
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  DeleteTransporter(id, Transporter) {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Delete Transporter Account?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(TransporterPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.dataservice.DeleteTransporterAccount(id, Transporter).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Transporter account deleted");
              this.navCtrl.setRoot(TransporterPage);
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


  SearchTransporter(searchEvent) {
    let term = searchEvent.target.value
    if (term.trim() === '' || term.trim().length < 0) {
      this.transporters = this.originalTransporters;
    } else {
      this.dataservice.SearchTransporter(term).subscribe(transporters => {
        this.code = transporters[0];
        if (this.code != 200) {
          this.error = transporters[1];
          this.transporters = [];
          this.originalTransporters = [];
          this.notrans = "notrans";
        } else {
          this.transporters = transporters[1];
          this.originalTransporters = transporters[1];
          this.notrans = "full";
        }
      });
    }
  }

  ShowNewTransporter() {
    let supplierid = this.supplierid;
    let adminid = this.adminid;
    this.navCtrl.push(TransportersignupPage, { supplierid, adminid });
  }
  totop() {
    this.content.scrollToTop();
  }
}//end class




