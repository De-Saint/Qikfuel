import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { MessagesdetailsPage } from '../messagesdetails/messagesdetails';
import { messages } from '../../models/messages';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { Content } from 'ionic-angular';
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  @ViewChild(Content) content: Content;
  messages: messages[];
  customerid: any;
  UserDetails: any;
  UDetails: any;
  usertype: any;
  supplierid: any;
  transporterid: any;
  error: any;
  nomsg: any;
  firstcount = 0;
  code: any;
  msgcount: any;
  originalmessages: messages[];
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public storage: Storage, public dataservice: Dataservice) {
    let loading = this.loadingCtrl.create({
      content: "Loading messages please wait...",
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
          this.customerid = this.UserDetails.customerid;
          this.supplierid = this.UserDetails.supplierid;
          this.transporterid = this.UserDetails.transporterid;
          if (this.usertype == "Supplier") {
            this.getMessages(this.supplierid, this.usertype, loading);
          }
          else if (this.usertype == "User") {
            this.getMessages(this.customerid, this.usertype, loading);
          }
          else if (this.usertype == "Transporter") {
            this.getMessages(this.transporterid, this.usertype, loading);
          }
          else if (this.usertype == "Admin") {
            let id = "0";
            this.getMessages(id, this.usertype, loading);
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
  getMessages(id, usertype, loading) {
    let firstcount = "0";
    this.dataservice.Messages(id, usertype, firstcount).subscribe(messages => {
      this.code = messages[0];
      if (this.code != 200) {
        this.error = messages[1];
        this.nomsg = "nomsg";
        loading.dismiss().catch(() => { });
      } else {
        this.nomsg = "full";
        this.messages = messages[1];
        this.msgcount = this.messages[0].count;
        this.originalmessages = messages[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  loadmoremessages(infiniteScroll: any) {

    let id = "";
    if (this.usertype == "Supplier") {
      id = this.supplierid;
    } else if (this.usertype == "User") {
      id = this.customerid;
    }
    else if (this.usertype == "Transporter") {
      id = this.transporterid;
    }
    else if (this.usertype == "Admin") {
      id = "0";
    }
    setTimeout(() => {
      if (this.msgcount === undefined || this.msgcount === null) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let mc = parseInt(this.msgcount);
        this.firstcount += mc;
        this.dataservice.Messages(id, this.usertype, this.firstcount.toString()).subscribe(newmsg => {
          this.code = newmsg[0];
          if (this.code === "400") {
            this.error = newmsg[1];
            this.nomsg = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          }
          else {
            this.messages = [];
            this.messages = this.originalmessages.concat(newmsg[1]);
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

  goToDetails(id, subject) {
    this.navCtrl.push(MessagesdetailsPage, { id, subject });
  }

  searchMsg(searchEvent) {
    let term = searchEvent.target.value
    if (term.trim() === '' || term.trim().length < 0) {
      this.nomsg = "full";
      this.messages = this.originalmessages;
    } else {
      //to search an already popolated arraylist
      this.messages = [];
      this.messages = this.originalmessages.filter((v) => {
        if (v.body.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
          this.nomsg = "full";
          return true;
        } else {
          if (this.messages.length === 0) {
            this.nomsg = "nomsg";
          }
          return false;
        }
      });
    }
  }
  totop() {
    this.content.scrollToTop();
  }

}
