import { Component } from '@angular/core';
import { NavController, Platform, ToastController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { ProductsPage } from '../products/products';
@Component({
  selector: 'page-gas',
  templateUrl: 'gas.html'
})
export class GasPage {
  message: any;
  title: any;
  g: any;
  p: any;
  k: any;
  d: any;
  me: {
    pick?: string
  } = {}
  pet: {
    quantity?: string,
    price?: string;
    minquantity?: string;
  } = {}
  kero: {
    quantity?: string,
    price?: string;
    minquantity?: string;
  } = {}
  diese: {
    quantity?: string,
    price?: string;
    minquantity?: string;
  } = {}
  gas: {
    totalquantity?: string,
    size1price?: string,
    size2price?: string,
    size3price?: string,
    size4price?: string,
    size5price?: string,
    size6price?: string,
    size7price?: string,
    size8price?: string,
    size9price?: string,
    size10price?: string,
    size11price?: string,
    minquantity?: string;
  } = {};
  addedmsg: any;
  supplierid: any;
  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController, public platform: Platform,
    public dataservice: Dataservice, public toastCtrl: ToastController,
    public events: Events, public navParams: NavParams,
    public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    this.supplierid = this.navParams.get('supplierid');
  }
  onAddGas(form) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    if (form.valid) {
      loading.present();
      this.dataservice.AddCookingGas(
        this.supplierid,
        this.gas.totalquantity,
        this.gas.size1price,
        this.gas.size2price,
        this.gas.size3price,
        this.gas.size4price,
        this.gas.size5price,
        this.gas.size6price,
        this.gas.size7price,
        this.gas.size8price,
        this.gas.size9price,
        this.gas.size10price,
        this.gas.size11price, this.gas.minquantity
      ).subscribe(addedmsg => {
        this.addedmsg = addedmsg;
        loading.dismiss().catch(() => { });
        if (this.addedmsg[1] === "Successful") {
          this.showToast('bottom', "Cooking gas added");
        } else {
           this.showToast('bottom', "Cooking Gas has already been added");
        }
        this.navCtrl.setRoot(ProductsPage);
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
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
  onKeroseneUpdate(form) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    if (form.valid) {
      loading.present();
      this.dataservice.AddProduct(this.supplierid, this.kero.price, this.kero.quantity, this.me.pick, this.kero.minquantity).subscribe(addedmsg => {
        this.addedmsg = addedmsg;
        if (this.addedmsg[1] === "Successful") {
          this.showToast('bottom', "Kerosene added");
          loading.dismiss().catch(() => { });
        } else {
          loading.dismiss().catch(() => { });
           this.showToast('bottom', "Kerosene has already been added");
        }
        this.navCtrl.setRoot(ProductsPage);
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
    }
  }
  onDieselUpdate(form) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    if (form.valid) {
      loading.present();
      this.dataservice.AddProduct(this.supplierid, this.diese.price, this.diese.quantity, this.me.pick, this.diese.minquantity).subscribe(addedmsg => {
        this.addedmsg = addedmsg;
        loading.dismiss().catch(() => { });
        if (this.addedmsg[1] === "Successful") {
           this.showToast('bottom', "Diesel added");
           this.dataservice.appRate.promptForRating(false);
        } else {
           this.showToast('bottom', "Diesel has already been added");
        }
        this.navCtrl.setRoot(ProductsPage);
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
    }
  }
  onPetrolUpdate(form) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    if (form.valid) {
      loading.present();
      this.dataservice.AddProduct(this.supplierid, this.pet.price, this.pet.quantity, this.me.pick, this.pet.minquantity).subscribe(addedmsg => {
        this.addedmsg = addedmsg;
        loading.dismiss().catch(() => { });
        if (this.addedmsg[1] == "Successful") {
          this.showToast('bottom', "Petrol added");
        } else {
           this.showToast('bottom', "Petrol has already has added");
        }
        this.navCtrl.setRoot(ProductsPage);
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
    }
  }
  ShowBack() {
    this.navCtrl.setRoot(ProductsPage);
  }
  onSelect(typevalue) {
    if (typevalue === "Cooking Gas") {
      this.g = typevalue;
      this.k = "";
      this.p = "";
      this.d = "";
    } else if (typevalue === "Kerosene") {
      this.k = typevalue;
      this.p = "";
      this.d = "";
      this.g = "";
    } else if (typevalue === "Petrol") {
      this.p = typevalue;
      this.k = "";
      this.d = "";
      this.g = "";
    } else if (typevalue === "Diesel") {
      this.d = typevalue;
      this.p = "";
      this.g = "";
      this.k = "";
    }
  }
}
