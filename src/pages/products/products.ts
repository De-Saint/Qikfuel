import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { Storage } from '@ionic/storage';
import { products } from '../../models/products';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { GasPage } from '../gas/gas';
@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {
  UserDetails: any;
  UDetails: any;
  usertype: any;
  supplierid: any;
  products: products[];
  code: any;
  error: any;
  noprod: any;
  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public dataservice: Dataservice, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) { }

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
          if (this.usertype == "Supplier") {
            this.getSupplierProducts(this.supplierid, loading);
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
  goToProdDetails(id, type) {
    let supplierid = this.supplierid;
    let actionSheet = this.actionSheetCtrl.create({
      title: name,
      buttons: [
        {
          text: 'View / Update',
          handler: ($event) => {
            this.navCtrl.push(ProductdetailsPage, { id, type, supplierid });
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

  AddProduct() {
    let supplierid = this.supplierid;
    this.navCtrl.push(GasPage, { supplierid });
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
            this.navCtrl.setRoot(ProductsPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.dataservice.DeleteProduct(id).subscribe(msg => {
              loading.dismiss().catch(() => { });
               this.showToast('bottom', "Product deleted");
              this.navCtrl.setRoot(ProductsPage);
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
}
