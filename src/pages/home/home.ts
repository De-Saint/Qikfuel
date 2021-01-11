import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { messages } from '../../models/messages';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { orders } from '../../models/orders';
import { OrderdetailsPage } from '../orderdetails/orderdetails';
import { transactions } from '../../models/transactions';
import { accounts } from '../../models/accounts';
import { HistorydetailsPage } from '../historydetails/historydetails';
import { Content } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  customerid: any;
  UserDetails: any;
  UDetails: any;
  usertype: any;
  supplierid: any;
  transporterid: any;
  notrans: any;
  error: any;
  nomsg: any;
  code: any;
  noorder: any;
  title: any;
  message: any;
  orders: orders[];
  messages: messages[];
  transactions: transactions[];
  adminid = 0;
  account: accounts;
  transactionnumber: any;
  totalbalance: any;
  transactioncount: any;
  firstcount = 0;
  ocount: any
  ordercount: any
  originalOrders: orders[];
  originalTransactions: transactions[];
  constructor(public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController, public storage: Storage, public dataservice: Dataservice,
    public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {

  }
  ionViewWillEnter() {
    this.CheckUser();
  }
  CheckUser() {
    this.storage.ready().then(() => {
      let loading = this.loadingCtrl.create({
        content: "Please wait...",
      });
      loading.present();
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UserDetails = loggedInUserDetails[2];
          this.UDetails = loggedInUserDetails[1];
          this.usertype = this.UDetails.type;
          this.customerid = this.UserDetails.customerid;
          this.supplierid = this.UserDetails.supplierid;
          this.transporterid = this.UserDetails.transporterid;
          if (this.usertype == "Supplier") {
            this.getPlacedOrders(this.supplierid, loading, "Delivered");
            this.getTransactionHistory(this.supplierid, this.usertype, loading);
          }
          else if (this.usertype == "User") {
            this.getPlacedOrders(this.customerid, loading, "Delivered");
            this.getTransactionHistory(this.customerid, this.usertype, loading);
          }
          else if (this.usertype == "Transporter") {
            this.getPlacedOrders(this.transporterid, loading, "Delivered");
            this.getTransactionHistory(this.transporterid, this.usertype, loading);
          }
          else if (this.usertype == "Admin") {
            let id = "0";
            this.getPlacedOrders(id, loading, "Delivered");
            this.getTransactionHistory(this.adminid, this.usertype, loading);
          }
        }
      });
    });
  }

  getPlacedOrders(id, loading, ordertype) {
    let firstcount = "0";
    this.dataservice.getPlacedOrders(id, ordertype, firstcount, this.usertype).subscribe(orders => {
      this.code = orders[0];
      if (this.code != "200") {
        this.error = orders[1];
        this.noorder = "noorder";
        loading.dismiss().catch(() => { });
      } else {
        this.orders = orders[1];
        for (let order of this.orders) {
          this.ocount = order.count;
        }
        this.ordercount = this.ocount
        if (this.orders.length === 0) {
          this.noorder = "noorder";
        } else {
          this.noorder = "full";
          this.originalOrders = orders[1];
        }
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  GoToDetails(id, type) {
    let usertype = this.usertype;
    this.navCtrl.push(OrderdetailsPage, { id, type, usertype });
  }
  loadmoreorder(infiniteScroll: any, ordertype) {
    setTimeout(() => {
      if (this.ordercount === undefined || this.ordercount === null) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let mc = parseInt(this.ordercount);
        this.firstcount += mc;
        let id = "";
        if (this.usertype == "Supplier") {
          id = this.supplierid;
        }
        else if (this.usertype == "Admin") {
          let adminid = 0;
          id = adminid.toString();
        }
        else if (this.usertype == "Transporter") {
          id = this.transporterid;
        }
        else if (this.usertype == "User") {
          id = this.customerid;
        }
        this.dataservice.getPlacedOrders(id, ordertype, this.firstcount.toString(), this.usertype, ).subscribe(newtrans => {
          this.code = newtrans[0];
          if (this.code === "400") {
            this.error = newtrans[1];
            this.noorder = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          }
          else {
            this.orders = [];
            this.orders = this.originalOrders.concat(newtrans[1]);
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

  GoToSupDetails(id, type, quantity) {
    let actionSheet = this.actionSheetCtrl.create({
      title: type,
      buttons: [
        {
          text: 'Accept & View Order',
          handler: ($event) => {
            this.navCtrl.push(OrderdetailsPage, { id, type, quantity });
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
  GoToTransDetails(id, type) {
    this.navCtrl.push(OrderdetailsPage, { id, type });
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

  getTransactionHistory(adminid, type, loading) {
    let firstCount = "0";
    this.dataservice.getTransactionHistory(adminid, type, firstCount).subscribe(transactions => {
      this.code = transactions[0];
      if (this.code != 200) {
        this.error = transactions[1];
        this.notrans = "notrans";
        loading.dismiss().catch(() => { });
      } else {
        this.notrans = "full";
        this.transactions = transactions[1];
        this.originalTransactions = transactions[1];
        this.transactioncount = this.transactions[0].count;
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  GoToHistoryDetails(id) {
    let usertype = this.usertype;
    this.navCtrl.push(HistorydetailsPage, { id, usertype });
  }
  loadmoretransactions(infiniteScroll: any) {
    setTimeout(() => {
      if (this.transactioncount === undefined || this.transactioncount === null) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let mc = parseInt(this.transactioncount);
        this.firstcount += mc;
        let id = "";
        if (this.usertype == "Supplier") {
          id = this.supplierid;
        }
        else if (this.usertype == "Admin") {
          id = this.adminid.toString();
        }
        else if (this.usertype == "Transporter") {
          id = this.transporterid;

        }
        else if (this.usertype == "User") {
          id = this.customerid;
        }
        this.dataservice.getTransactionHistory(id, this.usertype, this.firstcount.toString()).subscribe(newtrans => {
          this.code = newtrans[0];
          if (this.code === "400") {
            this.error = newtrans[1];
            this.notrans = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          }
          else {
            this.transactions = [];
            this.transactions = this.originalTransactions.concat(newtrans[1]);
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


}
