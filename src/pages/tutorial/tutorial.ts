import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  usertype: any;
  UserDetails: any;
  Details: any;
  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.Details = loggedInUserDetails[1];
          this.usertype = this.Details.type;
        }
      });
    });
  }
}
