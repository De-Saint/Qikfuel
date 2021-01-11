import { Component} from '@angular/core';
import { NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Dataservice } from '../../providers/dataservice';
import { FindsupplierPage } from '../findsupplier/findsupplier';
import { States } from '../../models/states';
import { Lga } from '../../models/lga';

@Component({
    selector: 'page-location',
    templateUrl: 'location.html'
})
export class LocationPage {
    private OrderForm: FormGroup;
    states: States[];
    selectedstate: States[];
    lgas: Lga[];
    map: any;
    title: any;
    message: any;
    UserDetails: any;
    UDetails: any;
    usertype: any;
    customerid: any;
    submitted = false;
    constructor(
        public navCtrl: NavController,
        public storage: Storage,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public dataservice: Dataservice,
        public formBuilder: FormBuilder,
        public navParams: NavParams) {
        this.usertype = this.navParams.get('usertype');
        if (this.usertype === undefined || this.usertype === null) {
            this.CheckUser();
        }
        this.OrderForm = this.formBuilder.group({
            state: [''],
            lga: [''],
            town: [''],
            producttype: [''],
            cookinggasquantity: [''],
            quantity: [''],
        });
    }
    ionViewDidLoad() {
        this.getStates();
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
    CheckUser() {
        this.storage.ready().then(() => {
            this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                if (loggedInUserDetails == null) {
                } else {
                    this.UserDetails = loggedInUserDetails[2];
                    this.UDetails = loggedInUserDetails[1];
                    this.usertype = this.UDetails.type;
                }
            });
        });
    }
    getStates() {
        let loading = this.loadingCtrl.create({
            content: "Loading states please wait...",
        });
        loading.present();
        this.dataservice.getStates().subscribe(states => {
            this.states = states;
            loading.dismiss().catch(() => { });
        }, (err) => {
            loading.dismiss().catch(() => { });
            this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
            return false;
        });

    }
    onStateSelect(stateid) {
        let loading = this.loadingCtrl.create({
            content: "Please wait...",
        });
        loading.present();
        this.dataservice.getLga(stateid).subscribe(lgas => {
            this.lgas = lgas;
            loading.dismiss().catch(() => { });
            document.getElementById("town").removeAttribute("hidden");
        }, (err) => {
            loading.dismiss().catch(() => { });
            this.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
            return false;
        });

    }

    onSelect(typevalue) {
        if (typevalue === "Cooking Gas") {
            document.getElementById("gas").removeAttribute("hidden");
            document.getElementById("quantity").setAttribute("hidden", "true");
        } else if (typevalue === "Diesel" || typevalue === "Kerosene" || typevalue === "Petrol") {
            document.getElementById("gas").setAttribute("hidden", "true");
            document.getElementById("quantity").removeAttribute("hidden");
        }
    }

    OnOrderForm() {

        this.submitted = true;
        this.storage.ready().then(() => {
            this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                if (loggedInUserDetails == null) {
                } else {
                    this.UserDetails = loggedInUserDetails[2];
                    this.customerid = this.UserDetails.customerid;
                    let pquantity = "";
                    if (this.OrderForm.value.cookinggasquantity === '' || this.OrderForm.value.cookinggasquantity === undefined || this.OrderForm.value.cookinggasquantity === null) {
                        pquantity = this.OrderForm.value.quantity
                        if (pquantity.length > 6 || pquantity === "") {
                            this.showToast('bottom', "Please specify correct litre");
                            return false;
                        }
                    } else {
                        pquantity = this.OrderForm.value.cookinggasquantity;
                    }
                    if (this.OrderForm.value.state === "" || this.OrderForm.value.state === null || this.OrderForm.value.state === undefined) {
                        this.showToast('bottom', "Please select a state");
                        return false;
                    }
                    if (this.OrderForm.value.producttype === "" || this.OrderForm.value.producttype === null || this.OrderForm.value.producttype === undefined) {
                        this.showToast('bottom', "Please select a product type");
                        return false;
                    }

                    this.getAllSuppliers(this.customerid, pquantity, this.OrderForm.value.producttype, this.OrderForm.value.state, this.OrderForm.value.lga, this.OrderForm.value.town);
                }
            });
        });
    }

    getAllSuppliers(customerid, pquantity, producttype, state, lga, town) {
        this.navCtrl.push(FindsupplierPage, { customerid, pquantity, producttype, state, lga, town });
    }
}
