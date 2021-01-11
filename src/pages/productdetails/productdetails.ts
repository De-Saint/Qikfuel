import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { products } from '../../models/products';
import { Dataservice } from '../../providers/dataservice';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html'
})
export class ProductdetailsPage {
  productid: any;
  product: products;
  gases: products[];
  update: {
    price?: string,
    quantity?: string
  } = {};

  gasupdate: {
    gasprice?: string
  } = {};

  pquanity: any;
  title: string;
  code: any;
  message: any;
  errormsg: any;
  Details: any;
  UserDetails: any;
  usertype: any;
  fname: any;
  lname: any;
  UDetails: any;
  submitted = false;
  supplierid: any;
  ptype: any;
  gprice: any;
  newPrice: string;
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public dataservice: Dataservice,
    public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Loading details please wait...",
    });
    loading.present();
    this.productid = this.navParams.get('id');
    this.supplierid = this.navParams.get('supplierid');
    this.ptype = this.navParams.get('type');
    if (this.ptype == "Cooking Gas") {
      this.GetCookingGasDet(this.productid, loading);
    } else {
      this.getOtherProductDetails(this.productid, loading);
    }
  }
  GetCookingGasDet(productid, loading) {
    this.dataservice.GetProductDet(productid).subscribe(products => {
      this.code = products[0];
      if (this.code === 200) {
        loading.dismiss().catch(() => { });
      } else {
        this.gases = products[1];
        this.product = products[2];
      }
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
  getOtherProductDetails(productid, loading) {
    this.dataservice.getProductDetails(productid).subscribe(products => {
      this.product = products;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  onUpdate(form) {
    this.submitted = true;
    let loading = this.loadingCtrl.create({
      content: "Updating Please wait...",
    });
    if (form.valid) {
      loading.present();
      this.dataservice.ResetProductPriceAndQuantity(this.productid,
        this.update.price,
        this.update.quantity).subscribe(msg => {
          loading.dismiss().catch(() => { });
          this.code = msg[0];
          if (this.code === 200) {
            this.showToast('bottom', "Server error, try again");
            this.navCtrl.setRoot(ProductsPage);
          } else {
            this.showToast('bottom', "Product updated");
            this.navCtrl.setRoot(ProductsPage);
          }
        }, (err) => {
          loading.dismiss().catch(() => { });
          this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
          return false;
        });
    }
  }
  updateGas(id, oldprice) {
    let prompt = this.alertCtrl.create({
      title: 'New Price',
      message: "Type the New Price here",
      inputs: [
        {
          name: 'price',
          placeholder: oldprice
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Update',
          handler: data => {
            let me = JSON.stringify(data);
            var value = me.split(":");
            this.newPrice = value[1].toString();
            let pp = this.newPrice.length;
            this.newPrice = this.newPrice.substring(1, pp - 1);
            let p = this.newPrice.length;
            this.newPrice = this.newPrice.substring(0, p - 1);
            let price = this.newPrice;
            let loading = this.loadingCtrl.create({
              content: "Updating Please wait...",
            });
            loading.present();
            this.dataservice.UpdateGas(id, price).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.code = msg[0];
              if (this.code === 200) {
                this.showToast('bottom', "Cooking gas updated");
                this.navCtrl.setRoot(ProductsPage);
              } else {
                this.showToast('bottom', "Server error, try again");
                this.navCtrl.setRoot(ProductsPage);
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
    prompt.present();
  }
  onDeleteGas(id) {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });

    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to Delete Product?',
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
            this.dataservice.DeleteGasProduct(id).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Cooking gas deleted");
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
