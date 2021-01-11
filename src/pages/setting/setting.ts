import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';
import { EditprofilePage } from '../editprofile/editprofile';
import { TermsPage } from '../terms/terms';
import { Terms2Page } from '../terms2/terms2';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
  UserDetails: any;
  UDetails: any;
  usertype: any;
  customerid: any;
  supplierid: any;
  transporterid: any;
  adminid: any;
  constructor(public storage: Storage, public dataservice: Dataservice, public navCtrl: NavController, public navParams: NavParams) { }
  Edit() {
    this.navCtrl.push(EditprofilePage);
  }

  Terms() {
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
          this.adminid = this.UserDetails.adminid;
          if (this.usertype == "Supplier") {
            let id = this.supplierid;
            this.navCtrl.push(TermsPage, {id});
          } else if (this.usertype == "User") {
            this.navCtrl.push(Terms2Page);
          }
          else if (this.usertype == "Transporter") {
          let id = this.transporterid;
            this.navCtrl.push(TermsPage, {id});
          }
          else if (this.usertype == "Admin") {
           let id = this.adminid;
            this.navCtrl.push(TermsPage, {id});
          }
        }
      });
    });
  }
  How() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UserDetails = loggedInUserDetails[2];
          this.UDetails = loggedInUserDetails[1];
          this.usertype = this.UDetails.type;
          if (this.usertype == "Supplier") {
            this.gotoTutorial(this.usertype);
          } else if (this.usertype == "User") {
            this.gotoTutorial(this.usertype);
          }
          else if (this.usertype == "Transporter") {
            this.gotoTutorial(this.usertype);
          }
          else if (this.usertype == "Admin") {
            this.gotoTutorial(this.usertype);
          }
        }
      });
    });
  }
  gotoTutorial(usertype) {
    this.navCtrl.push(TutorialPage, { usertype });
  }

}
