import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, Platform, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { LoginPage } from '../login/login';
import { States } from '../../models/states';
import { Lga } from '../../models/lga';
import { loginUser } from '../../models/loginUser';
import { HomePage } from '../home/home';
import { Terms2Page } from '../terms2/terms2';
import { Push, PushToken } from '@ionic/cloud-angular';
@Component({
  selector: 'page-usersignup',
  templateUrl: 'usersignup.html'
})
export class UsersignupPage {
  states: States[];
  selectedstate: States[];
  lgas: Lga[];
  id: string;
  user: string;
  loggedInUserDetails: loginUser[];
  code: any;
  errormsg: any;
  Details: any;
  UserDetails: any;
  usertype: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  Username: any;
  userid: any;
  signup: {
    firstname?: string,
    lastname?: string,
    email?: string,
    phone?: string,
    password?: string,
    selectedstateid?: number,
    lga?: string,
    town?: string,
    street?: string,
    question?: string,
    answer?: string,
    terms?: string
  } = {};
  submitted = false;
  stateid: number;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public dataservice: Dataservice,
    public storage: Storage,
    public push: Push, public alertCtrl: AlertController,
    public platform: Platform,
    public events: Events, public toastCtrl: ToastController
  ) {
    let loading = this.loadingCtrl.create({
      content: "Loading states please wait...",
    });
    loading.present();
    this.getStates(loading);
  }

  getStates(loading) {
    this.dataservice.getStates().subscribe(states => {
      this.states = states;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  onSelect(stateid) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.dataservice.getLga(stateid).subscribe(lgas => {
      this.lgas = lgas;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });

  }

  onUserSignup(form) {
    let loading = this.loadingCtrl.create({
      content: "Creating account please wait...",
    });
    this.submitted = true;

    if (form.valid) {
      loading.present();
      this.dataservice.UserSignup(
        this.signup.firstname,
        this.signup.lastname,
        this.signup.email,
        this.signup.phone,
        this.signup.password,
        this.signup.selectedstateid,
        this.signup.lga,
        this.signup.town,
        this.signup.street,
        this.signup.question, this.signup.answer
      ).subscribe(user => {
        this.user = user;
        if (this.user == "success") {
          this.dataservice.login(this.signup.email, this.signup.password)
            .subscribe(loggedInUserDetails => {
              this.loggedInUserDetails = loggedInUserDetails;
              this.code = loggedInUserDetails[0];
              if (this.code != 200) {
                this.errormsg = loggedInUserDetails[1];
                   this.showToast('bottom', "Login Error "+ this.errormsg);
                this.events.publish('user:logout');
                loading.dismiss().catch(() => { });
              } else {
                this.dataservice.SetloggedInUserDetails(this.loggedInUserDetails);
                this.storage.ready().then(() => {
                  this.storage.set(this.HAS_LOGGED_IN, true);
                });
                this.Details = loggedInUserDetails[1];
                this.UserDetails = loggedInUserDetails[2];
                this.usertype = this.Details.type;
                this.Username = this.Details.lastname + " " + this.Details.firstname;
                this.showToast('top', "Welcome "+ this.Username);
                this.userid = this.Details.userid;
                this.registerDeviceToken(this.userid);
                this.gotoHomePage(loading);
                this.events.publish('user:login', this.usertype, this.Username);
              }
              loading.dismiss().catch(() => { });
            }, (err) => {
              loading.dismiss().catch(() => { });
              this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
              return false;
            });
        }else{
          this.displayAlert("Error ", this.user);
        }
        loading.dismiss().catch(() => { });
      });
    }
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

    displayAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  registerDeviceToken(userid) {
    this.platform.ready().then(() => {
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        this.dataservice.SaveAndUpdateDeviceToken(userid, t.id, t.token).subscribe(value => {
          this.storage.set("tokenid", t.id);
          this.storage.set("devicetoken", t.token);
          this.storage.set("tokenregistered", t.registered);
          this.storage.set("tokensaved", t.token);
        });
      });
    });
  }
  ShowRegister() {
    this.navCtrl.popTo(LoginPage);
  }
  gotoHomePage(loading) {
    this.navCtrl.setRoot(HomePage).then(() => {
      this.storage.set('hasSeenLogin', true);
      loading.dismiss().catch(() => { });
    });
  }
  ShowTerms2() {
    this.navCtrl.push(Terms2Page);
  }

  onCheck(check) {
    if (check === false) {
      document.getElementById("createuserbtn").setAttribute("disabled", "true");
    } else if (check === true) {
      document.getElementById("createuserbtn").removeAttribute("disabled");

    }
  }
}
