import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { transporters } from '../../models/transporters';
import { suppliers } from '../../models/suppliers';
import { SupplierdetailsPage } from '../supplierdetails/supplierdetails';

@Component({
  selector: 'page-transporterdetails',
  templateUrl: 'transporterdetails.html'
})
export class TransporterdetailsPage {
  transporterid: any;
  name: any;
  code: any;
  error: any;
  nosup: any;
  sup: any;
  UDetails: any;
  usertype: any;
  transporter: transporters;
  suppliers: suppliers[];
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public dataservice: Dataservice,
    public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.CheckUser();
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.transporterid = this.navParams.get('id');
    this.name = this.navParams.get('name');
    this.getTransporterDetails(this.transporterid, loading);
    this.getTransporterSuppliersDetails(this.transporterid, loading);
  }

  getTransporterDetails(transporterid, loading) {
    this.dataservice.getTransporterDetails(transporterid).subscribe(transporters => {
      this.transporter = transporters;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  getTransporterSuppliersDetails(transporterid, loading) {
    this.dataservice.getTransporterSuppliersDetails(transporterid).subscribe(suppliers => {
      this.code = suppliers[0];
      if (this.code != 200) {
        this.error = suppliers[1];
        this.nosup = "nosup";
        loading.dismiss().catch(() => { });
      } else {
        this.suppliers = suppliers[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  goToDetails(id, name) {
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
          text: 'Close',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
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
