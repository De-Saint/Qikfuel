import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { Dataservice } from '../../providers/dataservice';
import { Recovery } from '../../models/recovery';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html'
})
export class ResetpasswordPage {
  queryText = '';
  recovery: Recovery;
  code: any;
  error: any;
  section1: {
    answer?: string
  } = {};

  section2: {
    password1?: string
    password2?: string
  } = {};
  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController,  public dataservice: Dataservice, public navCtrl: NavController, public navParams: NavParams) { }


  checkemail(searchterm) {
    let searchvalue = this.queryText;
    if (searchvalue.trim() != '' || searchvalue.trim().length > 10) {
      this.dataservice.ChechEmail(searchvalue).subscribe(recovery => {
        this.recovery = recovery;
      }, (err) => {
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
    }
  }
  Next(form) {
    if (this.section1.answer === this.recovery.answer) {
      document.getElementById("section2").removeAttribute("hidden");
      document.getElementById("section1").setAttribute("hidden", "true");
    } else {
      this.showToast('bottom', "Invalid answer");
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

  SubmitPassword(form) {
    let loading = this.loadingCtrl.create({
      content: "Loading please wait...",
    });
    loading.present();
    this.dataservice.ResetPassword(this.recovery.userid, this.section2.password1, this.section2.password2)
      .subscribe(msg => {
        this.code = msg[0];
        if (this.code != 200) {
          this.showToast('bottom', "Server error, try again");

          loading.dismiss().catch(() => { });
        } else {
          this.showToast('bottom', "Password has been reset: login with your new password");
          loading.dismiss().catch(() => { });
          this.navCtrl.push(LoginPage);
        }
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
        return false;
      });
  }
}
