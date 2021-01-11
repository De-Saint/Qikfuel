import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SuppliersignupPage } from '../suppliersignup/suppliersignup';
import { LoginPage } from '../login/login';
import { SettingPage } from '../setting/setting';
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class TermsPage {
  id: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = this.navParams.get('id');
  }
  ShowSupplier() {
    this.navCtrl.push(SuppliersignupPage);
  }
  ShowRegister() {
    this.navCtrl.popTo(LoginPage);
  }
  ShowBack() {
    this.navCtrl.setRoot(SettingPage);
  }
}
