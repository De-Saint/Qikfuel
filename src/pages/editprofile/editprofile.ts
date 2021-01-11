import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Dataservice } from '../../providers/dataservice';
import { SettingPage } from '../setting/setting';
import { States } from '../../models/states';
import { Lga } from '../../models/lga';
import { loginUser } from '../../models/loginUser';
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})
export class EditprofilePage {
  states: States[];
  selectedstate: States[];
  lgas: Lga[];

  user: string;
  loggedInUserDetails: loginUser[];
  title: string;
  code: any;
  message: any;
  errormsg: any;
  Details: any;
  UserDetails: any;
  usertype: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  fname: any;
  lname: any;
  ema: any;
  pho: any;
  pass: any;
  addre: any;
  utype: any
  id: any;
  UDetails: any;
  update: {
    firstname?: string,
    lastname?: string,
    email?: string,
    phone?: string,
    password?: string,
    selectedstateid?: number,
    lga?: string,
    town?: string,
    street?: string
  } = {};
  submitted = false;
  stateid: number;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public dataservice: Dataservice,
    public storage: Storage,
    public navParams: NavParams,
    public events: Events,
    public alertCtrl: AlertController) {
    let loading = this.loadingCtrl.create({
      content: "Loading states Please wait...",
    });
    loading.present();
    this.getStates(loading);
    this.getDetails();
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
  ShowBack() {
    this.navCtrl.setRoot(SettingPage);
  }
  getDetails() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UserDetails = loggedInUserDetails[2];
          this.UDetails = loggedInUserDetails[1];
          this.usertype = this.UDetails.type;
          if (this.usertype == "Supplier") {
            this.id = this.UserDetails.supplierid;
            this.lname = this.UDetails.lastname;
            this.fname = this.UDetails.firstname;
            this.pass = this.UDetails.pass;
            this.ema = this.UDetails.email;
            this.pho = this.UDetails.phone;
            this.addre = this.UserDetails.address;
            this.utype = this.usertype;
          } else if (this.usertype == "User") {
            this.id = this.UserDetails.customerid;
            this.lname = this.UDetails.lastname;
            this.fname = this.UDetails.firstname;
            this.pass = this.UDetails.password;
            this.ema = this.UDetails.email;
            this.pho = this.UDetails.phone;
            this.addre = this.UserDetails.address;
            this.utype = this.usertype;
          }
          else if (this.usertype == "Transporter") {
            this.id = this.UserDetails.transporterid;
            this.lname = this.UDetails.lastname;
            this.fname = this.UDetails.firstname;
            this.pass = this.UDetails.pass;
            this.ema = this.UDetails.email;
            this.pho = this.UDetails.phone;
            this.addre = this.UserDetails.address;
            this.utype = this.usertype;
          }
          else if (this.usertype == "Admin") {
            this.id = this.UserDetails.adminid;
            this.lname = this.UDetails.lastname;
            this.fname = this.UDetails.firstname;
            this.pass = this.UDetails.pass;
            this.ema = this.UDetails.email;
            this.pho = this.UDetails.phone;
            this.addre = this.UserDetails.address;
            this.utype = this.usertype;
          }
        }
      });
    });
  }
  onUpdate(form) {
    let loading = this.loadingCtrl.create({
      content: "Updating Please wait...",
    });
    if(this.update.town === "" || this.update.town ===  null || this.update.town === undefined){
      this.showToast('buttom', "Please fill your town");
      return false;
    }
    if(this.update.selectedstateid  ===  null || this.update.selectedstateid  === undefined){
      this.showToast('buttom', "Please select your state");
      return false;
    }
    if(this.update.lga === "" || this.update.lga ===  null || this.update.lga === undefined){
      this.showToast('buttom', "Please fill your lga");
      return false;
    }
    if(this.update.street === "" || this.update.street ===  null || this.update.street === undefined){
      this.showToast('buttom', "Please fill your street");
      return false;
    }
    loading.present();
    this.submitted = true;
    this.dataservice.UpdateProfile(
      this.id,
      this.usertype,
      this.update.firstname,
      this.update.lastname,
      this.update.email,
      this.update.phone,
      this.update.password,
      this.update.selectedstateid,
      this.update.lga,
      this.update.town,
      this.update.street).subscribe(user => {
        this.user = user;
        loading.dismiss().catch(() => { });
        this.code = user[0];
        if (this.code === 200) {
          this.message = user[1];
          this.showToast('bottom', "Server error, try again")
          this.navCtrl.setRoot(SettingPage);
        } else {
          this.message = user[1];
          this.showToast('bottom', "Details updated")
          this.events.publish('user:logout');
        }
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
  }


}
