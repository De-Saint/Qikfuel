import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { suppliers } from '../../models/suppliers';
import { transporters } from '../../models/transporters';
import { products } from '../../models/products';
import { TransporterdetailsPage } from '../transporterdetails/transporterdetails';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { Content } from 'ionic-angular';

@Component({
  selector: 'page-supplierdetails',
  templateUrl: 'supplierdetails.html'
})
export class SupplierdetailsPage {
  @ViewChild(Content) content: Content;

  supplierid: any;
  supName: any;
  code: any;
  message: any;
  error: any;
  notrans: any;
  trans: any;
  noprod: any;
  prod: any;
  supplier: suppliers;
  transporters: transporters[];
  UDetails: any;
  usertype: any;
  products: products[];
  transcount: any;
  originalTransporters: transporters[];
  firstcount = 0;
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public dataservice: Dataservice,
    public storage: Storage, public navParams: NavParams) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Loading please wait...",
    });
    loading.present();
    this.supplierid = this.navParams.get('id');
    this.supName = this.navParams.get('name');
    this.getSupplierDetails(this.supplierid, loading);
    this.GetSupplierTransporters(this.supplierid, loading);
    this.getSupplierProducts(this.supplierid, loading);
    this.CheckUser();
  }
  getSupplierDetails(supplierid, loading) {
    this.dataservice.getSupplierDetails(supplierid).subscribe(suppliers => {
      this.supplier = suppliers;
      loading.dismiss().catch(() => { });
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
  GetSupplierTransporters(supplierid, loading) {
    let firstCount = "0";
    this.dataservice.GetSupplierTransporters(supplierid, firstCount).subscribe(transporters => {
      this.code = transporters[0];
      if (this.code != 200) {
        this.error = transporters[1];
        this.notrans = "notrans";
        loading.dismiss().catch(() => { });
      } else {
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
      infiniteScroll.complete();
    }, 2000);

  }

  getSupplierProducts(supplierid, loading) {
    this.dataservice.getSupplierProducts(supplierid).subscribe(products => {
      this.code = products[0];
      if (this.code != 200) {
        this.error = products[1];
        this.noprod = "noprod";
        loading.dismiss().catch(() => { });
      } else {
        this.products = products[1];
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
          text: 'Close',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }
  goToProdDetails(id, type) {
    let actionSheet = this.actionSheetCtrl.create({
      title: type,
      buttons: [
        {
          text: 'View',
          handler: ($event) => {
            this.navCtrl.push(ProductdetailsPage, { id, type });
          }
        },
        {
          text: 'Delete Product',
          handler: ($event) => {
            this.DeleteProduct(id);
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
  DeleteProduct(id) {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Delete Product?',
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
            this.dataservice.DeleteProduct(id).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.code = msg[0];
              if (this.code === 200) {
                this.showToast('bottom', "Product deleted");
                this.dataservice.appRate.promptForRating(false);
              } else {
                this.message = msg[1];
                this.showToast('bottom', "Server error, try again");
              }
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
  totop() {
    this.content.scrollToTop();
  }
}
