import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { LocationPage } from '../location/location';
import { users } from '../../models/users';
import { OrderPage } from '../order/order';
import { Platform } from 'ionic-angular';
@Component({
  selector: 'page-request',
  templateUrl: 'request.html'
})
export class RequestPage {
  supplierid: any;
  suppliercompanyname: any;
  supplierproductprice: any;
  user: users;
  amount: string;
  placeorder: any;
  customerid: any;
  producttype: any;
  productquantity: any;
  regaddress: any;
  submitted = false;
  quanti: any;
  UserDetails: any;
  UDetails: any;
  usertype: any;
  pprice: any;
  pamount: any;
  newamount; any;
  map: any;
  newlitre: string;
  deliverydate: string;
  cusphone: string;
  actualcusphone: string;
  supphone: string;
  actualsupphone: string;
  request: {
    deliverydate?: string,
    typepaddress?: string,
    myaddress?: string,
    quantity?: any,
    deliverytype?: string,
    transactiontype?: string,
    paymentplan?: string
  } = {};
  body: any;
  constructor(public storage: Storage,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dataservice: Dataservice, public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.supplierid = this.navParams.get('supplierid');
    this.suppliercompanyname = this.navParams.get('name');
    this.supplierproductprice = this.navParams.get('price');
    this.producttype = this.navParams.get('producttype');
    this.productquantity = this.navParams.get('quantity');
    this.customerid = this.navParams.get('customerid');
    if (this.producttype === "Cooking Gas") {
      this.amount = this.supplierproductprice
    } else {
      let amt = this.productquantity * this.supplierproductprice;
      this.amount = amt.toString();
    }
    let loading = this.loadingCtrl.create({
      content: "Processing please wait...",
    });
    loading.present();
    this.GetCustomerDetails(this.customerid, loading);
  }

  GetCustomerDetails(customerid, loading) {
    this.dataservice.GetCustomerDetails(customerid).subscribe(userdetails => {
      this.user = userdetails;
      loading.dismiss().catch(() => { });
    })
  }
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 4000,
      position: position
    });

    toast.present(toast);
  }
  OrderNow(form) {
    let loading = this.loadingCtrl.create({
      content: "Processing please wait...",
    });

    this.submitted = true;
    let SearchAddress = "";
    if (this.request.myaddress === "registered") {
      SearchAddress = this.regaddress;
    } else if (this.request.myaddress === "typeaddress") {
      if (this.request.typepaddress === "" || this.request.typepaddress === undefined || this.request.typepaddress === null) {
        this.showToast('bottom', "No delivery address selected");
        return false;
      } else {
        SearchAddress = this.request.typepaddress;
      }
    }
    if (SearchAddress.length === 0 || SearchAddress === "" || SearchAddress === undefined || SearchAddress === null) {
       this.showToast('bottom', "No delivery address selected");
      return false;
    }
    if (this.request.paymentplan === "" || this.request.paymentplan === undefined || this.request.paymentplan === null) {
    this.showToast('bottom', "No payment plan selected");
      return false;
    }
    if (this.request.deliverytype === "" || this.request.deliverytype === undefined || this.request.deliverytype === null) {
    this.showToast('bottom', "No delivery type selected");
      return false;
    }
    this.dataservice.CheckUserDeliveryDate(this.request.deliverydate).subscribe(value => {
      let result = value[1];
      if (result === "success") {
        loading.present();
        this.dataservice.PlaceOrder(this.customerid, this.supplierid, this.producttype,
          this.supplierproductprice, this.productquantity, this.request.deliverytype,
          this.request.deliverydate, SearchAddress, this.amount, this.request.transactiontype, this.request.paymentplan).subscribe(placeorder => {
            this.placeorder = placeorder[1];
            this.customerid = this.placeorder.customerid;
              this.storage.ready().then(() => {
                this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                  if (loggedInUserDetails == null) {
                  } else {
                    this.UserDetails = loggedInUserDetails[2];
                    this.UDetails = loggedInUserDetails[1];
                    this.usertype = this.UDetails.type;
                    this.getPlacedOrders(this.customerid, this.usertype, loading);
                  }
                });
              });
          });
      } else {
        loading.dismiss().catch(() => { });
         this.showToast('bottom', "Wrong date please pick another date");
        return false;
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });

  }

  getPlacedOrders(customerid, usertype, loading) {
    this.dataservice.appRate.promptForRating(true);
    this.navCtrl.setRoot(OrderPage, { customerid, usertype });
    loading.dismiss().catch(() => { });

  }
  CancelOrder() {
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(RequestPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.setRoot(LocationPage);
          }
        }
      ]
    });
    confirm.present();
    this.navCtrl.setRoot(LocationPage);
  }
  onChangeLitre(litre) {
    this.newlitre = litre;
    let loading = this.loadingCtrl.create({
      content: "Processing please wait...",
    });

    if (litre === '') {
      this.showToast('bottom', "Please specify litres");
    } else {
      if (this.newlitre.length > 6) {
        this.showToast('bottom', "Please check quantity and specify the correct litres");
        this.productquantity;
        return false;
      } else {
        loading.present();
        this.dataservice.checkSupplierMinQuantity(this.supplierid, litre, this.producttype).subscribe(msg => {
          loading.dismiss().catch(() => { });
          if (msg[1] === "success") {
            this.pprice = document.getElementById("pprice").innerText;
            this.newamount = this.pprice * litre;
            document.getElementById("pamount").innerText = this.newamount;
            loading.dismiss().catch(() => { });
          } else if (msg[1] === "error") {
            this.showToast('bottom', "Please increase quantity or check for other suppliers");
            document.getElementById("requestquantity").setAttribute("value", this.productquantity);
            loading.dismiss().catch(() => { });
          }
        }, (err) => {
          loading.dismiss().catch(() => { });
          this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
          return false;
        });
        loading.dismiss().catch(() => { });
      }

    }

  }
  onSelect(typevalue) {
    if (typevalue == "Schedule") {
      document.getElementById("deliveryd").removeAttribute("hidden");
    } else if (typevalue == "Instance") {
      document.getElementById("deliveryd").setAttribute("hidden", 'true');
    }
  }
  checkaddress(value) {
    if (value === "registered") {
      document.getElementById("raddress").removeAttribute("hidden");
      document.getElementById("typeAddress").setAttribute("hidden", "true");
      this.storage.ready().then(() => {
        this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
          if (loggedInUserDetails == null) {
          } else {
            this.UserDetails = loggedInUserDetails[2];
            this.regaddress = this.UserDetails.address;
          }
        });
      });
    } else if (value === "typeaddress") {
      document.getElementById("typeAddress").removeAttribute("hidden");
      document.getElementById("raddress").setAttribute("hidden", "true");
    }
  }

}//end of class
