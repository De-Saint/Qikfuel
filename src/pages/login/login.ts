import { Component } from '@angular/core';
import { NavController, ToastController, NavParams,AlertController, Platform, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { loginUser } from '../../models/loginUser';
import { Dataservice } from '../../providers/dataservice';
import { HomePage } from '../home/home';
import { ResetpasswordPage } from '../resetpassword/resetpassword';
import { UsersignupPage } from '../usersignup/usersignup';
import { TermsPage } from '../terms/terms';
import { Terms2Page } from '../terms2/terms2';
import { TransportersignupPage } from '../transportersignup/transportersignup';
import { SuppliersignupPage } from '../suppliersignup/suppliersignup';
import { Push, PushToken } from '@ionic/cloud-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  submitted = false;
  code: any;
  message: any;
  errormsg: any;
  loggedInUserDetails: loginUser[];
  Details: any;
  UserDetails: any;
  usertype: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  Username: any;
  userid: any;
  login: { emailphone?: string, password?: string } = {};
  constructor(
    public navCtrl: NavController,
    public storage: Storage, public toastCtrl: ToastController,
    public events: Events, public push: Push,
    public platform: Platform,  public alertCtrl: AlertController,
    public dataservice: Dataservice,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) { }

  onLogin(form) {
    this.submitted = true;
    if (form.valid) {
      this.validateLogin(this.login.emailphone, this.login.password);
    }
  }

  validateLogin(emailphone, password) {
    let loading = this.loadingCtrl.create({
      content: "Loading please wait...",
    });
    loading.present();
    this.dataservice.login(emailphone, password)
      .subscribe(loggedInUserDetails => {
        this.loggedInUserDetails = loggedInUserDetails;
        this.code = loggedInUserDetails[0];
        if (this.code != 200) {
          this.errormsg = loggedInUserDetails[1];
          this.displayAlert("Error ", this.errormsg);
          this.events.publish('user:logout');
          loading.dismiss().catch(() => { });
        } else {
          this.storage.ready().then(() => {
            this.storage.set('hasSeenWelcome', true);
            this.storage.set(this.HAS_LOGGED_IN, true);
          });
          this.dataservice.SetloggedInUserDetails(this.loggedInUserDetails);
          this.Details = loggedInUserDetails[1];
          this.UserDetails = loggedInUserDetails[2];
          this.usertype = this.Details.type;
          this.Username = this.Details.lastname + " " + this.Details.firstname;
           this.showToast('top', "Welcome "+ this.Username);
          this.gotoHomePage(loading);
          this.userid = this.Details.userid;
          this.registerDeviceToken(this.userid);
          this.events.publish('user:login', this.usertype, this.Username);
        }
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
  }
  showPassword(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
  registerDeviceToken(userid) {
    this.platform.ready().then(() => {
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {;
        this.dataservice.SaveAndUpdateDeviceToken(userid, t.id, t.token).subscribe(value => {
          this.storage.set("tokenid", t.id); 
          this.storage.set("devicetoken", t.token);
          this.storage.set("tokenregistered", t.registered);
          this.storage.set("tokensaved", t.token);
        });
      });
    });
  }
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  gotoHomePage(loading) {
    this.navCtrl.setRoot(HomePage).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
    });
  }

  ResetPassword() {
    this.navCtrl.push(ResetpasswordPage);
  }
  ShowSignup() {
    document.getElementById("signupcontainer").removeAttribute("class");
    document.getElementById("signincontainer").setAttribute("class", "hide");
  }
  ShowSignin() {
    document.getElementById("signincontainer").removeAttribute("class");
    document.getElementById("signupcontainer").setAttribute("class", "hide");
  }

  ShowUser() {
    this.navCtrl.push(UsersignupPage);
  }
  ShowTerms() {
    this.navCtrl.push(TermsPage);
  }
  ShowTerms2() {
    this.navCtrl.push(Terms2Page);
  }
  ShowTransporter() {
    this.navCtrl.push(TransportersignupPage);
  }
  ShowSupplier() {
    this.navCtrl.push(SuppliersignupPage);
  }

  displayAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

}
