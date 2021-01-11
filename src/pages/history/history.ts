import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { Storage } from '@ionic/storage';
import { transactions } from '../../models/transactions';
import { HistorydetailsPage } from '../historydetails/historydetails';
import { Content } from 'ionic-angular';
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  @ViewChild(Content) content: Content;
  code: any;
  error: any;
  notrans: any;
  trans: any;
  title: any;
  transactions: transactions[];
  originalTransactions: transactions[];
  message: any;
  UserDetails: any;
  UDetails: any;
  supplierid: any;
  customerid: any;
  transporterid: any;
  usertype: any;
  adminid = 0;
  transactioncount: any;
  firstcount = 0;
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public dataservice: Dataservice,
    public storage: Storage,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
    let loading = this.loadingCtrl.create({
      content: "Loading transactions please wait...",
    });
    loading.present();
    this.CheckUser(loading);
  }
  CheckUser(loading) {
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
          if (this.usertype == "Supplier") {
            this.getTransactionHistory(this.supplierid, "Supplier", loading);
          } else if (this.usertype == "User") {
            this.getTransactionHistory(this.customerid, "User", loading);
          }
          else if (this.usertype == "Transporter") {
            this.getTransactionHistory(this.transporterid, "Transporter", loading);
          }
          else if (this.usertype == "Admin") {
            this.getTransactionHistory(this.adminid.toString(), "Admin", loading);
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
  getTransactionHistory(id, type, loading) {
    let firstCount = "0";
    this.dataservice.getTransactionHistory(id, type, firstCount).subscribe(transactions => {
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
  GoToDetails(id) {
    let usertype = this.usertype;
    this.navCtrl.push(HistorydetailsPage, { id, usertype });
  }

  SearchTransactions(searchEvent) {
    let term = searchEvent.target.value
    if (term.trim() === '' || term.trim().length < 0) {
      this.notrans = "full";
      this.transactions = this.originalTransactions;
    } else {
      //to search an already popolated arraylist
      this.transactions = [];
      this.transactions = this.originalTransactions.filter((v) => {
        if (v.description.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
          this.notrans = "full";
          return true;
        } else {
          if (this.transactions.length === 0) {
            this.notrans = "notrans";
          }
          return false;
        }

      });
    }
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

  totop() {
    this.content.scrollToTop();
  }
}//end of class
