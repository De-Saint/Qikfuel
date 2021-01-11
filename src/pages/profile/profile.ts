import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { Storage } from '@ionic/storage';
import { suppliers } from '../../models/suppliers';
import { transporters } from '../../models/transporters';
import { products } from '../../models/products';
import { TransporterdetailsPage } from '../transporterdetails/transporterdetails';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { users } from '../../models/users';
import { SupplierdetailsPage } from '../supplierdetails/supplierdetails';
import { Content } from 'ionic-angular';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  @ViewChild(Content) content: Content;
  UserDetails: any;
  UDetails: any;
  usertype: any;
  supplierid: any;
  customerid: any;
  transporterid: any;
  adminid: any;
  code: any;
  error: any;
  notrans: any;
  trans: any;
  noprod: any;
  prod: any;
  supplier: suppliers;
  transporters: transporters[];
  originalTransporters: transporters[];
  products: products[];
  customer: users;
  admin: users;
  nosup: any;
  sup: any;
  transcount: any;
  firstcount = 0;
  transporter: transporters;
  suppliers: suppliers[];
  constructor(public toastCtrl: ToastController, public dataservice: Dataservice, public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Loading please wait...",
    });
    loading.present();
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UserDetails = loggedInUserDetails[2];
          this.UDetails = loggedInUserDetails[1];
          this.usertype = this.UDetails.type;
          this.supplierid = this.UserDetails.supplierid;
          this.transporterid = this.UserDetails.transporterid;
          this.customerid = this.UserDetails.customerid;
          this.adminid = this.UserDetails.adminid;
          if (this.usertype == "Supplier") {
            this.getSupplierDetails(this.supplierid, loading);
            this.getSupplierTransporterDetails(this.supplierid, loading);
            this.getSupplierProducts(this.supplierid, loading);
          } else if (this.usertype == "User") {
            this.GetCustomerDetails(this.customerid, loading);
          }
          else if (this.usertype == "Transporter") {
            this.getTransporterDetails(this.transporterid, loading);
            this.getTransporterSuppliersDetails(this.transporterid, loading);
          }
          else if (this.usertype == "Admin") {
            this.GetAdminDetails(this.adminid, loading);
          }
        }
      });
    });
  }

  getSupplierDetails(supplierid, loading) {
    this.dataservice.getSupplierDetails(supplierid).subscribe(suppliers => {
      this.supplier = suppliers;
      loading.dismiss().catch(() => { });
    });

  }
  getSupplierTransporterDetails(supplierid, loading) {
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
    let supplierid = this.supplierid;
    let actionSheet = this.actionSheetCtrl.create({
      title: type,
      buttons: [
        {
          text: 'View',
          handler: ($event) => {
            this.navCtrl.push(ProductdetailsPage, { id, type, supplierid });
          }
        },
        {
          text: 'Add Product',
          handler: ($event) => {
            this.navCtrl.push(ProductdetailsPage, { id, type, supplierid });
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

  GetCustomerDetails(customerid, loading) {
    this.dataservice.GetCustomerDetails(customerid).subscribe(customers => {
      this.customer = customers;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });

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
  GetAdminDetails(adminid, loading) {
    this.dataservice.getAdminDetails(adminid).subscribe(admins => {
      this.admin = admins;
      loading.dismiss().catch(() => { });
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
