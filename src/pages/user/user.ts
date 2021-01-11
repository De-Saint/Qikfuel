import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController, ActionSheetController, AlertController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { UserdetailsPage } from '../userdetails/userdetails';
import { Content } from 'ionic-angular';
import { users } from '../../models/users';
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  @ViewChild(Content) content: Content;
  code: any;
  error: any;
  nouser: any;
  user: any;
  users: users[];
  usercount: any;
  firstcount = 0;
  originalUsers: users[];
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public dataservice: Dataservice,
    public navParams: NavParams) { }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.getUsers(loading);
  }
  getUsers(loading) {
    let firstCount = "0";
    this.dataservice.getAllUsers(firstCount).subscribe(users => {
      this.code = users[0];
      if (this.code != 200) {
        this.error = users[1];
        this.nouser = "nouser";
        loading.dismiss().catch(() => { });
      } else {
        this.nouser = "full";
        this.users = users[1];
        this.usercount = this.users[0].count;
        this.originalUsers = users[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  loadmoreusers(infiniteScroll: any) {
    setTimeout(() => {
      if (this.usercount === undefined || this.usercount === null) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let mc = parseInt(this.usercount);
        this.firstcount += mc;
        this.dataservice.getAllUsers(this.firstcount.toString()).subscribe(newusers => {
          this.code = newusers[0];
          if (this.code === "400") {
            this.error = newusers[1];
            this.nouser = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          }
          else {
            this.users = [];
            this.users = this.originalUsers.concat(newusers[1]);
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
  goToDetails(id, name) {
    let actionSheet = this.actionSheetCtrl.create({
      title: name,
      buttons: [
        {
          text: 'View',
          handler: ($event) => {
            this.navCtrl.push(UserdetailsPage, { id, name });
          }
        },
        {
          text: 'Delete Account',
          handler: ($event) => {
            let usertype = "User";
            this.DeleteUser(id, usertype);
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

  DeleteUser(id, usertype) {
    let loading = this.loadingCtrl.create({
      content: "Deleting please wait...",
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Delete Customer Account?',
      buttons: [
        {
          text: 'No',
          handler: () => {//
            this.navCtrl.setRoot(UserPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.dataservice.DeleteCustomerAccount(id, usertype).subscribe(msg => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Customer account deleted");
              this.dataservice.appRate.promptForRating(false);
              this.navCtrl.setRoot(UserPage);
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

  SearchUsers(searchEvent) {
    let term = searchEvent.target.value
    if (term.trim() === '' || term.trim().length < 0) {
      this.users = this.originalUsers;
    } else {
      this.dataservice.SearchUsers(term).subscribe(users => {
        this.code = users[0];
        if (this.code != 200) {
          this.error = users[1];
          this.users = [];
          this.originalUsers = [];
          this.nouser = "nouser";
        } else {
          this.users = users[1];
          this.originalUsers = users[1];
          this.nouser = "full";
        }
      });
    }
  }

  totop() {
    this.content.scrollToTop();
  }

}
