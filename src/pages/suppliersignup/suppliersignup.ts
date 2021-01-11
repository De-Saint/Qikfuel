import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, Events, LoadingController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { LoginPage } from '../login/login';
import { States } from '../../models/states';
import { Lga } from '../../models/lga';
import { loginUser } from '../../models/loginUser';
@Component({
  selector: 'page-suppliersignup',
  templateUrl: 'suppliersignup.html'
})
export class SuppliersignupPage {
  states: States[];
  selectedstate: States[];
  lgas: Lga[];
  id: string;
  user: string;
  loggedInUserDetails: loginUser[];
  code: any;
  Username: any;
  Details: any;
  UserDetails: any;
  usertype: any;
  errormsg: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  supsignup: {
    dprnumber?: string,
    companyname?: string,
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
    answer?: string
  } = {};
  submitted = false;
  stateid: number;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public dataservice: Dataservice,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events) {
    let loading = this.loadingCtrl.create({
      content: "Loading states please wait...",
    });
    loading.present();
    this.getStates(loading);
  }
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
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
  onSupplierSignup(form) {
    let loading = this.loadingCtrl.create({
      content: "Creating account please wait...",
    });
    loading.present();
    if (form.valid) {
      this.dataservice.SupplierSignup(
        this.supsignup.dprnumber,
        this.supsignup.companyname,
        this.supsignup.firstname,
        this.supsignup.lastname,
        this.supsignup.email,
        this.supsignup.phone,
        this.supsignup.password,
        this.supsignup.selectedstateid,
        this.supsignup.lga,
        this.supsignup.town,
        this.supsignup.street,
        this.supsignup.question, this.supsignup.answer).subscribe(user => {
          this.user = user;
          loading.dismiss().catch(() => { });
          if (this.user == "success") {
            this.displayAlert("Account Created", "Please email info@qikfuel.com or call 08059330008 for Account Activation ");
            this.navCtrl.setRoot(LoginPage);
          } else {
            this.displayAlert("Error ", this.user);
          }
          loading.dismiss().catch(() => { });
        }, (err) => {
          loading.dismiss().catch(() => { });
          this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
          return false;
        });
    }
  }
  displayAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  ShowRegister() {
    this.navCtrl.popTo(LoginPage);
  }

}
