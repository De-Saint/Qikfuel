import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { messages } from '../../models/messages';
import { Dataservice } from '../../providers/dataservice';
import { MessagesPage } from '../messages/messages';
@Component({
  selector: 'page-messagesdetails',
  templateUrl: 'messagesdetails.html'
})
export class MessagesdetailsPage {
  messageid: any;
  subject: any;
  title: any;
  content: any;
  message: messages;
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public dataservice: Dataservice, public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Loading message details please wait...",
    });
    loading.present();
    this.messageid = this.navParams.get('id');
    this.subject = this.navParams.get('subject');
    this.getMessageDetails(this.messageid, loading);
  }
  getMessageDetails(messageid, loading) {
    this.dataservice.getMessageDetails(messageid).subscribe(messages => {
      this.message = messages;
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

  DeleteMessage() {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Delete Message?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(MessagesPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.dataservice.DeleteMessage(this.messageid).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Message Deleted");
              this.navCtrl.setRoot(MessagesPage);
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

