import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { orders } from '../../models/orders';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { OrderdetailsPage } from '../orderdetails/orderdetails';
import { Content } from 'ionic-angular';
@Component({
    selector: 'page-order',
    templateUrl: 'order.html'
})
export class OrderPage {
    @ViewChild(Content) content: Content;
    ORDER: string = 'pend';
    orders: orders[];
    originalOrders: orders[];
    customerid: any;
    UserDetails: any;
    UDetails: any;
    error: any;
    code: any;
    noorder: any;
    ord: any;
    title: any;
    message: any;
    usertype: any;
    supplierid: any;
    transporterid: any;
    ordercount: any;
    firstCount = 0;
    ordertype: any;
    ocount: any;
    constructor(public storage: Storage,
        public dataservice: Dataservice, public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,
        public navCtrl: NavController, public navParams: NavParams) {
        let loading = this.loadingCtrl.create({
            content: "Loading please wait...",
        });
        loading.present();
        this.usertype = this.navParams.get('usertype');
        if (this.usertype === undefined || this.usertype === null) {
            let ordertype = "Pending"
            this.CheckUser(loading, ordertype);
        } else {
            this.customerid = this.navParams.get('customerid');
            this.getPlacedOrders(this.customerid, loading, "Pending");

        }
    }
    CheckUser(loading, ordertype) {
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
                    if (this.usertype == "Supplier") {
                        this.getPlacedOrders(this.supplierid, loading, ordertype);
                    } else if (this.usertype == "User") {
                        this.getPlacedOrders(this.customerid, loading, ordertype);
                    }
                    else if (this.usertype == "Transporter") {
                        this.getPlacedOrders(this.transporterid, loading, ordertype);
                    }
                    else if (this.usertype == "Admin") {
                        let adminid = "0";
                        this.getPlacedOrders(adminid, loading, ordertype);
                    }
                }
            });
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


    GetPending() {
        let loading = this.loadingCtrl.create({
            content: "Loading please wait...",
        });
        loading.present();
        this.ordercount = "0";
        this.firstCount = 0;
        this.orders = [];
        this.ordertype = "Pending";
        this.CheckUser(loading, this.ordertype);
    }
    GetDelivered() {
        let loading = this.loadingCtrl.create({
            content: "Loading please wait...",
        });
        loading.present();
        this.ordercount = "0";
        this.firstCount = 0;
        this.orders = [];
        this.ordertype = "Delivered";
        this.CheckUser(loading, this.ordertype);

    }
    GetCancelled() {
        let loading = this.loadingCtrl.create({
            content: "Loading please wait...",
        });
        loading.present();
        this.ordercount = "0";
        this.firstCount = 0;
        this.orders = [];
        this.ordertype = "Cancelled";
        this.CheckUser(loading, this.ordertype);
    }
    getPlacedOrders(id, loading, ordertype) {
        let firstcount = "0";
        this.dataservice.getPlacedOrders(id, ordertype, firstcount, this.usertype).subscribe(orders => {
            this.code = orders[0];
            if (this.code != "200") {
                this.error = orders[1];
                this.noorder = "noorder";
                loading.dismiss().catch(() => { });
            } else {
                this.orders = orders[1];
                for (let order of this.orders) {
                    this.ocount = order.count;
                }
                this.ordercount = this.ocount
                if (this.orders.length === 0) {
                    this.noorder = "noorder";
                } else {
                    this.noorder = "full";
                    this.originalOrders = orders[1];
                }
                loading.dismiss().catch(() => { });
            }
        }, (err) => {
            loading.dismiss().catch(() => { });
            this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
            return false;
        });
    }

    GoToDetails(id, type) {
        let usertype = this.usertype;
        this.navCtrl.push(OrderdetailsPage, { id, type, usertype });

    }
    GoToSupDetails(id, type, quantity) {
        this.navCtrl.push(OrderdetailsPage, { id, type, quantity });
    }
    GoToTransDetails(id, type) {
        this.navCtrl.push(OrderdetailsPage, { id, type });
    }

    SearchPendingOrders(searchEvent) {
        let term = searchEvent.target.value
        if (term.trim() === '' || term.trim().length < 0) {
            this.noorder = "full";
            this.orders = [];
            this.orders = this.originalOrders;
        } else {
            //to search an already popolated arraylist
            this.orders = [];
            this.orders = this.originalOrders.filter((v) => {
                if (v.producttype.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.status.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
                    this.noorder = "full";
                    return true;
                } else {
                    if (this.orders.length === 0) {
                        this.noorder = "noorder";
                    }
                    return false;
                }
            });
        }

    }
    loadmoreorder(infiniteScroll: any, ordertype) {
        setTimeout(() => {
            if (this.ordercount === undefined || this.ordercount === null) {
                infiniteScroll.complete();
                infiniteScroll.enable(false);
                return false;
            } else {
                let mc = parseInt(this.ordercount);
                this.firstCount += mc;
                let id = "";
                if (this.usertype == "Supplier") {
                    id = this.supplierid;
                }
                else if (this.usertype == "Admin") {
                    let adminid = 0;
                    id = adminid.toString();
                }
                else if (this.usertype == "Transporter") {
                    id = this.transporterid;
                }
                else if (this.usertype == "User") {
                    id = this.customerid;
                }
                this.dataservice.getPlacedOrders(id, ordertype, this.firstCount.toString(), this.usertype, ).subscribe(newtrans => {
                    this.code = newtrans[0];
                    if (this.code === "400") {
                        this.error = newtrans[1];
                        this.noorder = 'none';
                        infiniteScroll.complete();
                        infiniteScroll.enable(false);
                    }
                    else {
                        this.orders = [];
                        this.orders = this.originalOrders.concat(newtrans[1]);
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

    SearchDeliveredOrders(searchEvent) {
        let term = searchEvent.target.value
        if (term.trim() === '' || term.trim().length < 0) {
            this.noorder = "full";
            this.orders = [];
            this.orders = this.originalOrders;
        } else {
            //to search an already popolated arraylist
            this.orders = [];
            this.orders = this.originalOrders.filter((v) => {
                if (v.producttype.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.status.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
                    this.noorder = "full";
                    return true;
                } else {
                    if (this.orders.length === 0) {
                        this.noorder = "noorder";
                    }
                    return false;
                }
            });
        }

    }
    SearchCancelledOrders(searchEvent) {
        let term = searchEvent.target.value
        if (term.trim() === '' || term.trim().length < 0) {
            this.noorder = "full";
            this.orders = [];
            this.orders = this.originalOrders;
        } else {
            //to search an already popolated arraylist
            this.orders = [];
            this.orders = this.originalOrders.filter((v) => {
                if (v.producttype.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.status.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
                    this.noorder = "full";
                    return true;
                } else {
                    if (this.orders.length === 0) {
                        this.noorder = "noorder";
                    }
                    return false;
                }
            });
        }

    }
    totop() {
        this.content.scrollToTop();
    }
}
