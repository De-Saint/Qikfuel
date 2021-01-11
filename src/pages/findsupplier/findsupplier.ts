import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { suppliers } from '../../models/suppliers';
import { RequestPage } from '../request/request';
import { Dataservice } from '../../providers/dataservice';
import { Content } from 'ionic-angular';
@Component({
  selector: 'page-findsupplier',
  templateUrl: 'findsupplier.html'
})
export class FindsupplierPage {
  @ViewChild(Content) content: Content;
  resultlist: any;
  supplierlist: suppliers[];
  originalsupplierlist: suppliers[];
  list: suppliers[];
  nosup: any;
  sup: any;
  code: any;
  error: any;
  productquantity: any;
  producttype: any;
  customerid: any;
  searchQuery;
  state: any;
  lga: any;
  town: any;
  firstcount = 0;
  supplierscount: any;
  constructor(public dataservice: Dataservice, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
    let loading = this.loadingCtrl.create({
      content: "Loading available suppliers please wait...",
    });
    loading.present();
    this.producttype = this.navParams.get('producttype');
    this.productquantity = this.navParams.get('pquantity');
    this.customerid = this.navParams.get('customerid');
    this.state = this.navParams.get('state');
    this.town = this.navParams.get('town');
    this.lga = this.navParams.get('lga');

    this.suplist(loading);
    this.searchQuery = '';
  }

  suplist(loading) {
    let firstCount = "0"
    this.dataservice.searchProductSuppliers(firstCount, this.productquantity, this.producttype, this.state, this.lga, this.town)
      .subscribe(result => {
        this.code = result[0];
        if (this.code != 200) {
          loading.dismiss().catch(() => { });
          this.error = result[1];
          this.nosup = "empty";
        } else {
          this.list = result[1];
          if (this.list.length === 0) {
            this.nosup = "empty";
          } else {
            this.nosup = "full";
            this.supplierlist = result[1];
            this.supplierscount = this.supplierlist[0].count;
            this.originalsupplierlist = result[1];
          }
          loading.dismiss().catch(() => { });
        }
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
  GoToDetails(supplierid, name, price) {
    let producttype = this.producttype;
    let quantity = this.productquantity;
    let customerid = this.customerid;
    this.navCtrl.push(RequestPage, { supplierid, name, price, producttype, quantity, customerid });
  }
  SearchSuppliers(searchEvent) {
    let term = searchEvent.target.value
    if (term.trim() === '' || term.trim().length < 0) {
      this.nosup = "full";
      this.supplierlist = this.originalsupplierlist;
    } else {
      //to search an already popolated arraylist
      this.supplierlist = [];
      this.supplierlist = this.originalsupplierlist.filter((v) => {
        if (v.company_name.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
          this.nosup = "full";
          return true;
        } else {
          if (this.supplierlist.length === 0) {
            this.nosup = "empty";
          }
          return false;
        }
      });
    }
  }
  loadmoresup(infiniteScroll: any) {
    setTimeout(() => {
      if (this.supplierscount === undefined || this.supplierscount === null) {
        infiniteScroll.complete();
        infiniteScroll.enable(false);
        return false;
      } else {
        let mc = parseInt(this.supplierscount);
        this.firstcount += mc;
        this.dataservice.searchProductSuppliers(this.firstcount.toString(), this.productquantity, this.producttype, this.state, this.lga, this.town).subscribe(newusers => {
          this.code = newusers[0];
          if (this.code === "400") {
            this.error = newusers[1];
            this.nosup = 'none';
            infiniteScroll.complete();
            infiniteScroll.enable(false);
          }
          else {
            this.supplierlist = [];
            this.supplierlist = this.originalsupplierlist.concat(newusers[1]);
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
  totop() {
    this.content.scrollToTop();
  }
}//end of class
