import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Events, LoadingController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { Dataservice } from '../../providers/dataservice';
import { LoginPage } from '../login/login';
import { States } from '../../models/states';
import { checksupplier } from '../../models/checksupplier';
import { Lga } from '../../models/lga';
import { loginUser } from '../../models/loginUser';
import { TransporterPage } from '../transporter/transporter';
@Component({
  selector: 'page-transportersignup',
  templateUrl: 'transportersignup.html'

})
export class TransportersignupPage {
  @ViewChild(Content) content: Content;
  HAS_LOGGED_IN = 'hasLoggedIn';
  queryText = '';
  states: States[];
  selectedstate: States[];
  lgas: Lga[];
  id: string;
  user: string;
  loggedInUserDetails: loginUser[];
  Details: any;
  UserDetails: any;
  verify: checksupplier;
  usertype: any;
  code: any;
  errormsg: any;
  Username: any;
  transportsignup: {
    firstname?: string,
    lastname?: string,
    email?: string,
    phone?: string,
    password?: string,
    selectedstateid?: number,
    lga?: string,
    town?: string,
    street?: string,
    platenumber?: string,
    tankcapacity?: string,
    enginenumber?: string,
    question?: string,
    answer?: string
  } = {};
  submitted = false;
  stateid: number;
  supplierid: any;
  searchsupplier: any;
  adminid: any;
  constructor(
    public navCtrl: NavController,
    public dataservice: Dataservice,
    public events: Events, public toastCtrl: ToastController,
    public storage: Storage, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    let loading = this.loadingCtrl.create({
      content: "Loading states please wait...",
    });
    loading.present();
    this.getStates(loading);

  }


  ionViewDidLoad() {
    this.supplierid = this.navParams.get('supplierid');
    this.adminid = this.navParams.get('adminid');
  }
  verifyValue(searchterm) {
    let searchvalue = this.queryText;
    if (searchvalue.trim() != '' || searchvalue.trim().length > 3) {
      this.dataservice.VerifyInput(searchvalue).subscribe(verify => {
        this.verify = verify;
      });
    }
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

  onTSignup(form) {
    this.signup(form, "");
  }
  onTransporterSignup(form, supplierid) {
    this.signup(form, supplierid);
  }
  signup(form, supplierid) {
    let loading = this.loadingCtrl.create({
      content: "Creating account please wait...",
    });
    loading.present();
    this.submitted = true;
    if (supplierid === '') {
      supplierid = this.supplierid;
    }
    if (form.valid) {
      this.dataservice.TransporterSignup(
        this.transportsignup.firstname,
        this.transportsignup.lastname,
        this.transportsignup.email,
        this.transportsignup.phone,
        this.transportsignup.password,
        this.transportsignup.selectedstateid,
        this.transportsignup.lga,
        this.transportsignup.town,
        this.transportsignup.street,
        this.transportsignup.platenumber,
        this.transportsignup.tankcapacity,
        this.transportsignup.enginenumber, supplierid,
        this.transportsignup.question, this.transportsignup.answer).subscribe(user => {
          this.user = user;
          if (this.user == "success") {
            this.CheckUser(loading);
          } else {
            loading.dismiss().catch(() => { });
            this.displayAlert("Error ", this.user);
          }
        }, (err) => {
          loading.dismiss().catch(() => { });
          this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
          return false;
        });
    }
  }
  ShowRegister() {
    this.navCtrl.popTo(LoginPage);
  }

  CheckUser(loading) {
    this.storage.ready().then(() => {
      this.storage.get('hasSeenLogin') // Check if the user has already seen the LoginPage
        .then((hasSeenLogin) => {
          if (hasSeenLogin) {
            loading.dismiss().catch(() => { });
            this.showToast('bottom', "Transporter account created");
            this.dataservice.appRate.promptForRating(false);
            this.navCtrl.setRoot(TransporterPage);
          } else {
            this.dataservice.login(this.transportsignup.email, this.transportsignup.password)
              .subscribe(loggedInUserDetails => {
                this.loggedInUserDetails = loggedInUserDetails;
                this.code = loggedInUserDetails[0];
                if (this.code != 200) {
                  this.errormsg = loggedInUserDetails[1];
                  this.showToast('bottom', "Login Error " + this.errormsg);
                  this.events.publish('user:logout');
                  loading.dismiss().catch(() => { });
                } else {
                  this.storage.set('hasSeenWelcome', true);
                  this.dataservice.SetloggedInUserDetails(this.loggedInUserDetails);
                  this.storage.set(this.HAS_LOGGED_IN, true);
                  this.Details = loggedInUserDetails[1];
                  this.UserDetails = loggedInUserDetails[2];
                  this.usertype = this.Details.type;
                  this.Username = this.Details.lastname + " " + this.Details.firstname;
                  this.showToast('bottom', "Welcome " + this.Username);
                  this.gotoHomePage(loading);
                  this.events.publish('user:login', this.usertype, this.Username);
                }
                loading.dismiss().catch(() => { });
              }, (err) => {
                loading.dismiss().catch(() => { });
              });
          }
          loading.dismiss().catch(() => { });
        });
    });
  }
  displayAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  gotoHomePage(loading) {
    this.navCtrl.setRoot(HomePage).then(() => {
      this.storage.set('hasSeenLogin', true);
      loading.dismiss().catch(() => { });
    });
  }
}