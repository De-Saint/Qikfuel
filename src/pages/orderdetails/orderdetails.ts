import { Component } from '@angular/core';
import { NavController, Platform, ToastController, LoadingController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { orders } from '../../models/orders';
import { Dataservice } from '../../providers/dataservice';
import { transporters } from '../../models/transporters';
import { Storage } from '@ionic/storage';
import { OrderPage } from '../order/order';
import { HistoryPage } from '../history/history';
@Component({
  selector: 'page-orderdetails',
  templateUrl: 'orderdetails.html'
})
export class OrderdetailsPage {
  orderid: any;
  type: any;
  order: orders;
  allorder: orders;
  code: any;
  notrans: any;
  trans: any;
  title: any;
  UserDetails: any;
  UDetails: any;
  supplierid: any;
  usertype: any;
  quantity: any;
   error: any;
  newNote: string;
  firstcount = 0;
    transcount: any;
  originalTransporters: transporters[];
  transporters: transporters[];
  constructor(public navCtrl: NavController,
    public dataservice: Dataservice, public platform: Platform,
    public storage: Storage, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.CheckUser(loading);

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
  CheckUser(loading) {
    this.orderid = this.navParams.get('id');
    this.type = this.navParams.get('type');
    this.quantity = this.navParams.get('quantity');
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UserDetails = loggedInUserDetails[2];
          this.UDetails = loggedInUserDetails[1];
          this.usertype = this.UDetails.type;
          this.supplierid = this.UserDetails.supplierid;
          if (this.usertype == "Supplier") {
            this.getSupplierTransporter(this.supplierid, loading);
            this.getPlacedOrdersdetails(this.orderid, loading);
          } else if (this.usertype == "User") {
            this.getPlacedOrdersdetails(this.orderid, loading);
          } else if (this.usertype == "Transporter") {
            this.getPlacedOrdersdetails(this.orderid, loading);
          } else if (this.usertype == "Admin") {
            this.getPlacedOrdersdetails(this.orderid, loading);
          }
        }
      });
    });
  }
  DeleteOrder() {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to Delete this order?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(OrderPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.dataservice.DeleteOrder(this.orderid, this.usertype).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Order/Request Deleted");
              this.navCtrl.setRoot(OrderPage);
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

  getPlacedOrdersdetails(orderid, loading) {
    this.dataservice.getPlacedOrdersdetails(orderid).subscribe(orders => {
      this.order = orders;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  getSupplierTransporter(supplierid, loading) {
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

      infiniteScroll.complete();
    }, 2000);

  } 
  goToTransDetails(id, name, phone) {
    let actionSheet = this.actionSheetCtrl.create({
      title: name,
      buttons: [
        {
          text: 'Tap to Assign Request',
          handler: ($event) => {
            this.AssignRequest(id);
          }
        },
        {
          text: 'Phone: ' + phone,
          handler: ($event) => {
            this.showToast('bottom', "Call the Transporter to actually confirm status")
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
  AssignRequest(transporterid) {
    let loading = this.loadingCtrl.create({
      content: "Assigning request please wait...",
    });
    loading.present();
    this.dataservice.AssignRequest(transporterid, this.orderid).subscribe(assigned => {
      loading.dismiss().catch(() => { });
      if (assigned[1] == "success") {
        this.showToast('bottom', "Request has been assigned to transporter");
        this.navCtrl.setRoot(OrderPage);
      } else {
        this.showToast('bottom', "Server error, try again");
        this.navCtrl.setRoot(OrderPage);
      }

    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }

  UserConfirmation(id) {
    let note = "";
    this.OnDelivery(id, note);
  }
  OnDelivery(id, note) {
    let loading = this.loadingCtrl.create({
      content: "Processing please wait...",
    });
    loading.present();
    this.dataservice.ConfirmOrder(this.orderid, id, note, this.usertype).subscribe(historydetails => {
      this.GotoHistory();
      loading.dismiss().catch(() => { });
      this.dataservice.appRate.promptForRating(false);
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  GotoHistory() {
      this.navCtrl.setRoot(HistoryPage);
  }
  CancelOrder(id) {
    let prompt = this.alertCtrl.create({
      title: 'Cancel Order',
      message: "Reason",
      inputs: [
        {
          name: 'reason',
          placeholder: 'reason'
        },
      ],
      buttons: [
        {
          text: 'Close',
          handler: data => {
          }
        },
        {
          text: 'Cancel Order',
          handler: data => {
            let me = JSON.stringify(data);
            var value = me.split(":");
            this.newNote = value[1].toString();
            let pp = this.newNote.length;
            this.newNote = this.newNote.substring(1, pp - 1);
            let p = this.newNote.length;
            this.newNote = this.newNote.substring(0, p - 1);
            let note = this.newNote;
            this.CancelDelivery(id, note);
          }
        }
      ]
    });
    prompt.present();
  }
  CancelDelivery(id, note) {
    let loading = this.loadingCtrl.create({
      content: "Cancelling please wait...",
    });
    if (note === null || note === undefined || note === "") {
      this.showToast('bottom', "Please do provide a reason for cancelling order");
      return false;
    } else {
      loading.present();
      this.dataservice.CancelOrder(this.orderid, id, this.usertype, note).subscribe(msg => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Order has been cancelled");
        this.navCtrl.setRoot(OrderPage);
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
    }

  }

  TransporterConfirmation(id) {
    let prompt = this.alertCtrl.create({
      title: 'Confrimation',
      message: "Explain your reason for confirmation on behalf of the Customer",
      inputs: [
        {
          name: 'reason',
          placeholder: 'reason'
        },
      ],
      buttons: [
        {
          text: 'Close',
          handler: data => {
          }
        },
        {
          text: 'Confirm Order',
          handler: data => {
            let me = JSON.stringify(data);
            var value = me.split(":");
            this.newNote = value[1].toString();
            let pp = this.newNote.length;
            this.newNote = this.newNote.substring(1, pp - 1);
            let p = this.newNote.length;
            this.newNote = this.newNote.substring(0, p - 1);
            let note = this.newNote;
            this.OnDelivery(id, note);
          }
        }
      ]
    });
    prompt.present();
  }
}
