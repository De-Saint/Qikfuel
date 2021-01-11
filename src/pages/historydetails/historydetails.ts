import { Component } from '@angular/core';
import { NavController,ToastController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { transactions } from '../../models/transactions';
import {HistoryPage} from '../history/history';
@Component({
  selector: 'page-historydetails',
  templateUrl: 'historydetails.html'
})
export class HistorydetailsPage {
  transactionid: any;
  usertype: any;
  transaction: transactions;
  message:any;
  title: any;
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public dataservice: Dataservice, public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Loading transaction details please wait...",
    });
    loading.present();
    this.transactionid = this.navParams.get('id');
    this.usertype = this.navParams.get('usertype');
    this.getTransactiondetails(this.transactionid, loading);
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
  getTransactiondetails(transid, loading) {
    this.dataservice.getTransactiondetails(transid).subscribe(transactions => {
      this.transaction = transactions;
        loading.dismiss().catch(() => { });
    }, (err) => {
            loading.dismiss().catch(() => { });
            this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
            return false;
        });
  }
 DeleteTransaction() {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Delete Transaction?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(HistoryPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.dataservice.DeleteTransaction(this.transactionid, this.usertype).subscribe(msg => {
              loading.dismiss().catch(() => { });
             this.showToast('bottom', "Transaction Deleted");
              this.navCtrl.setRoot(HistoryPage);
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
