import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Http } from "@angular/http";
import { loginUser } from '../models/loginuser';
import { Lga } from '../models/lga';
import { States } from '../models/states';
import { suppliers } from '../models/suppliers';
import { users } from '../models/users';
import { transporters } from '../models/transporters';
import { orders } from '../models/orders';
import { messages } from '../models/messages';
import { Recovery } from '../models/recovery';
import { checksupplier } from '../models/checksupplier';
import { Platform } from 'ionic-angular';
import { AppRate } from 'ionic-native';
@Injectable()
export class Dataservice {
  onDevice: boolean;
  appRate: any = AppRate;
  body: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_WELCOME = 'hasSeenWelcome';
  // baseUrl: string = 'http://www.qikfuelapp.com/Qikfuel/';
  baseUrl: string = 'http://localhost:8084/Qikfuel/';
  constructor(public http: Http, public storage: Storage, public platform: Platform) {
    this.platform.ready().then(() => {

      AppRate.preferences = {
        openStoreInApp: true,
        displayAppName: 'Qikfuel',
        usesUntilPrompt: 5,
        promptAgainForEachNewVersion: false,
        storeAppURL: {
          android: 'market://details?id=com.qikfuel.qikfuel'
        },
        customLocale: {
          title: "Rate Qikfuel",
          message: "If you enjoy using Qikfuel, would you mind taking a moment to rate it?",
          cancelButtonLabel: "No, Thanks",
          rateButtonLabel: "Rate",
          laterButtonLabel: "Later"
        }
      };
    });

  }

  login(emailphone: string, password: string): Observable<loginUser[]> {
    let loginurl = this.baseUrl + 'UserServlet';
    let type = "Login";
    let logindata = JSON.stringify({ emailphone, password, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        <loginUser[]>
        res.json())
  }

  UpdateProfile(id: string, usertype: string, firstname: string, lastname: string, email: string, phone: string, password: string, stateid: number, lgaid: string, town: string, street: string) {
    let signupurl = this.baseUrl + 'UserServlet';
    let type = "UpdateProfile";
    let signupdata = JSON.stringify({ type, id, usertype, firstname, lastname, email, phone, password, stateid, lgaid, town, street });
    return this.http.post(signupurl, signupdata)
      .map(res => (res.json()))
  }
  getStates(): Observable<States[]> {
    let statesurl = this.baseUrl + 'UserServlet';
    let type = "getStates";
    let statesdata = JSON.stringify({ type });
    return this.http.post(statesurl, statesdata)
      .map(res => <States[]>(res.json()))
  }
  getLga(stateid: number): Observable<Lga[]> {
    let lgaurl = this.baseUrl + 'UserServlet';
    let type = "getLGAs";
    let lgadata = JSON.stringify({ stateid, type });
    return this.http.post(lgaurl, lgadata)
      .map(res => <Lga[]>(res.json()))
  }


  UserSignup(firstname: string, lastname: string, email: string, phone: string,
    password: string, selectedstate: number, lga: any, town: any, street: string,
    question: string, answer: string) {
    let signupurl = this.baseUrl + 'UserServlet';
    let type = "UserRegistration";
    let signupdata = JSON.stringify({ type, firstname, lastname, email, phone, password, selectedstate, lga, town, street, question, answer });
    return this.http.post(signupurl, signupdata)
      .map(res => (res.json()))
  }

  SupplierSignup(dprnumber: string, companyname: string, firstname: string, lastname: string, email: string,
    phone: string, password: string, selectedstate: number, lga: any,
    town: any, street: any, question: string, answer: string) {
    let signupurl = this.baseUrl + 'UserServlet';
    let type = "SupplierRegistration";
    let signupdata = JSON.stringify({
      type, dprnumber, companyname, firstname, lastname, email, phone,
      password, selectedstate, lga, town, street, question, answer
    });
    return this.http.post(signupurl, signupdata)
      .map(res => (res.json()))
  }

  ChechEmail(email: string): Observable<Recovery> {
    let verifyurl = this.baseUrl + 'UserServlet';
    let type = "getRecoveryDetails";
    let verifydata = JSON.stringify({ email, type });
    return this.http.post(verifyurl, verifydata)
      .map(res => <Recovery>(res.json()))
  }

  TransporterSignup(firstname: string, lastname: string, email: string, phone: string, password: string, selectedstate: number, lga: any, town: any, street: any,
    platenumber: any, tankcapacity: any, enginenumber: any, supplierid: any, question: string, answer: string) {
    let signupurl = this.baseUrl + 'UserServlet';
    let type = "TransporterRegistration";
    let signupdata = JSON.stringify({
      type, firstname, lastname, email, phone, password, selectedstate, lga, town, street, platenumber, tankcapacity, enginenumber, supplierid, question, answer,
    });
    return this.http.post(signupurl, signupdata)
      .map(res => (res.json()))
  }
  getAllSuppliers(count: string): Observable<suppliers> {
    let supurl = this.baseUrl + 'AdminServlet';
    let type = "getAllSuppliers";
    let supdata = JSON.stringify({ type, count });
    return this.http.post(supurl, supdata)
      .map(res => <suppliers>(res.json()))
  }
  getAllUsers(count: string): Observable<users> {
    let usersurl = this.baseUrl + 'AdminServlet';
    let type = "getAllUsers";
    let userdata = JSON.stringify({ type, count });
    return this.http.post(usersurl, userdata)
      .map(res => <users>(res.json()))
  }
  getAllTransporter(count: string): Observable<users> {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getAllTransporters";
    let transdata = JSON.stringify({ type, count });
    return this.http.post(transurl, transdata)
      .map(res => <users>(res.json()))
  }
  activateSupplier(supplierid: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "ActivateSupplierAccount";
    let transdata = JSON.stringify({ type, supplierid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeactivateSupplier(supplierid: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeActivateSupplierAccount";
    let transdata = JSON.stringify({ type, supplierid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  getSupplierDetails(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getSupplierDetails";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }

  GetSupplierTransporters(supplierid: string, count: string): Observable<transporters> {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getSupplierTransporters";
    let transdata = JSON.stringify({ type, supplierid, count });
    return this.http.post(transurl, transdata)
      .map(res => <transporters>(res.json()))
  }
  getSupplierProducts(supplierid: string): Observable<suppliers> {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getSupplierProducts";
    let transdata = JSON.stringify({ type, supplierid });
    return this.http.post(transurl, transdata)
      .map(res => <suppliers>(res.json()))
  }

  getTransporterDetails(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getTransporterDetails";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }

  getTransporterSuppliersDetails(transporterid: string): Observable<transporters> {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getTransporterSuppliers";
    let transdata = JSON.stringify({ type, transporterid });
    return this.http.post(transurl, transdata)
      .map(res => <transporters>(res.json()))
  }

  getProductDetails(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getProductDetails";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  GetProductDet(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "GetProductDet";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }

  getCustomerDetails(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getCustomerDetails";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  getAdminDetails(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getAdminDetails";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  getUserCustomerDetails(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "getUserCustomerDetails";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  GetCustomerDetails(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "GetCustomerDetails";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }

  searchProductSuppliers(count:string, quantity: string, ptype: string, stateid: string, lgaid: string, town: string) {
    let signupurl = this.baseUrl + 'BookingServlet';
    let type = "searchProductSuppliers";
    let signupdata = JSON.stringify({ type, count, quantity, ptype, stateid, lgaid, town });
    return this.http.post(signupurl, signupdata)
      .map(res => (res.json()))
  }

  getPlacedOrderDetails(orderid: string) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getPlacedOrderDetails";
    let statesdata = JSON.stringify({ type, orderid });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }

  PlaceOrder(customerid: string, supplierid: string, producttype: string, price: string, quantity: string,
    deliverytype: string, deliverydate: string, regaddress: string, amount: string, transactiontype: string, paymentplan): Observable<orders> {
    let signupurl = this.baseUrl + 'BookingServlet';
    let type = "PlaceOrder";
    let signupdata = JSON.stringify({ type, customerid, supplierid, producttype, price, quantity, deliverytype, deliverydate, regaddress, amount, transactiontype, paymentplan });
    return this.http.post(signupurl, signupdata)
      .map(res => <orders>(res.json()))
  }

  getPlacedOrders(id: string, ordertype: string, count: string, usertype) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getPlacedOrders";
    let statesdata = JSON.stringify({ type, id, ordertype, count, usertype });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }

  getPlacedOrdersdetails(orderid) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getPlacedOrdersdetails";
    let statesdata = JSON.stringify({ type, orderid });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }
  getSupplierRequestOrders(supplierid: string, ordertype: string) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getSupplierRequestOrders";
    let statesdata = JSON.stringify({ type, supplierid, ordertype });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }
  AssignRequest(transporterid: string, orderid: string) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "AssignTransporterToRequest";
    let statesdata = JSON.stringify({ type, transporterid, orderid });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }
  getTransporterRequests(transporterid: string, ordertype: string) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getTransporterRequests";
    let statesdata = JSON.stringify({ type, transporterid, ordertype });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }

  getTransactionHistory(id: string, usertype: string, count: string) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getTransactionsHistory";
    let statesdata = JSON.stringify({ type, id, usertype, count });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }

  getTransactiondetails(transactionid: string) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getTransactiondetails";
    let statesdata = JSON.stringify({ type, transactionid });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }

  getAllRequests(ordertype: string) {
    let statesurl = this.baseUrl + 'BookingServlet';
    let type = "getAllRequests";
    let statesdata = JSON.stringify({ type, ordertype });
    return this.http.post(statesurl, statesdata)
      .map(res => (res.json()))
  }

  approveTransporter(transporterid: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "ActivateTransporterAccount";
    let transdata = JSON.stringify({ type, transporterid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  disapproveTransporter(transporterid: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "DeativateTransporterAccount";
    let transdata = JSON.stringify({ type, transporterid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteTransporterAccount(id: string, usertype: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteTransporterAccount";
    let transdata = JSON.stringify({ type, id, usertype });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteCustomerAccount(id: string, usertype: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteCustomerAccount";
    let transdata = JSON.stringify({ type, id, usertype });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteSupplierAccount(id: string, usertype: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteSupplierAccount";
    let transdata = JSON.stringify({ type, id, usertype });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteOrder(id: string, usertype: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteOrder";
    let transdata = JSON.stringify({ type, id, usertype });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteTransaction(id: string, usertype: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteTransaction";
    let transdata = JSON.stringify({ type, id, usertype });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }

  DeleteMessage(id: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "DeleteMessage";
    let transdata = JSON.stringify({ type, id });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  ConfirmOrder(orderid: string, id: string, note: string, usertype: string) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "ConfirmOrder";
    let data = JSON.stringify({ type, orderid, id, note, usertype });
    return this.http.post(url, data)
      .map(res => (res.json()))
  }
  CancelOrder(orderid: string, id: string, usertype: string, note: string) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "CancelOrder";
    let data = JSON.stringify({ type, orderid, id, usertype, note });
    return this.http.post(url, data)
      .map(res => (res.json()))
  }
  Search(searchvalue: string): Observable<suppliers> {
    let verifyurl = this.baseUrl + 'BookingServlet';
    let type = "SearchSuppliers";
    let verifydata = JSON.stringify({ searchvalue, type });
    return this.http.post(verifyurl, verifydata)
      .map(res => <suppliers>(res.json()))
  }
  SearchTransporter(searchvalue: string): Observable<transporters> {
    let verifyurl = this.baseUrl + 'BookingServlet';
    let type = "SearchTransporters";
    let verifydata = JSON.stringify({ searchvalue, type });
    return this.http.post(verifyurl, verifydata)
      .map(res => <transporters>(res.json()))
  }
  SearchUsers(searchvalue: string): Observable<loginUser> {
    let verifyurl = this.baseUrl + 'BookingServlet';
    let type = "SearchCustomers";
    let verifydata = JSON.stringify({ searchvalue, type });
    return this.http.post(verifyurl, verifydata)
      .map(res => <loginUser>(res.json()))
  }
  CheckStatus(searchvalue: string): Observable<orders> {
    let verifyurl = this.baseUrl + 'UserServlet';
    let type = "CheckOrderStatus";
    let verifydata = JSON.stringify({ searchvalue, type });
    return this.http.post(verifyurl, verifydata)
      .map(res => <orders>(res.json()))
  }
  Messages(id: string, usertype: string, count: string): Observable<messages> {
    let url = this.baseUrl + 'BookingServlet';
    let type = "Messages";
    let data = JSON.stringify({ id, type, usertype, count });
    return this.http.post(url, data)
      .map(res => <messages>(res.json()))
  }

  getMessageDetails(messageid: string) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "getMessageDetails";
    let data = JSON.stringify({ type, messageid });
    return this.http.post(url, data)
      .map(res => (res.json()))
  }
  checkSupplierMinQuantity(supplierid: string, quantity: string, producttype) {
    let url = this.baseUrl + 'SupplierServlet';
    let type = "checkSupplierMinQuantity";
    let data = JSON.stringify({ type, supplierid, quantity, producttype });
    return this.http.post(url, data)
      .map(res => (res.json()))
  }

  getBalances(id: string, usertype: string) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "getBalances";
    let data = JSON.stringify({ type, id, usertype });
    return this.http.post(url, data)
      .map(res => (res.json()))
  }
  GetBalances(id: string, usertype: string) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetBalances";
    let data = JSON.stringify({ type, id, usertype });
    return this.http.post(url, data)
      .map(res => (res.json()))
  }
  ApplyCharges(supplierid: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "ApplyCharges";
    let transdata = JSON.stringify({ type, supplierid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  RemoveCharges(supplierid: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "RemoveCharges";
    let transdata = JSON.stringify({ type, supplierid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  ResetBookings(supplierid: string, bookingnumber: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = "ResetBooking";
    let transdata = JSON.stringify({ type, supplierid, bookingnumber });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  ResetCurrentSupplyNumber(supplierid: string, bookingnumber: string) {
    let transurl = this.baseUrl + 'AdminServlet';
    let type = " ResetCurrentSupplyNumber";
    let transdata = JSON.stringify({ type, supplierid, bookingnumber });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteProduct(productid: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "DeleteProduct";
    let transdata = JSON.stringify({ type, productid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  DeleteGasProduct(productid: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "DeleteGasProduct";
    let transdata = JSON.stringify({ type, productid });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  ResetProductPriceAndQuantity(productid: string, newprice: string, newquantity: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "ResetProductPriceAndQuantity";
    let transdata = JSON.stringify({ type, productid, newprice, newquantity });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  UpdateGas(id: string, price: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "UpdateGas";
    let transdata = JSON.stringify({ type, id, price });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  AddProduct(supplierid: string, price: string, quantity: string, ptype: string, minquantity: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "AddProduct";
    let transdata = JSON.stringify({ type, supplierid, price, quantity, ptype, minquantity });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  CheckUserDeliveryDate(userdate: string) {
    let transurl = this.baseUrl + 'SupplierServlet';
    let type = "CheckUserDeliveryDate";
    let transdata = JSON.stringify({ type, userdate });
    return this.http.post(transurl, transdata)
      .map(res => (res.json()))
  }
  VerifyInput(searchvalue: string): Observable<checksupplier> {
    let verifyurl = this.baseUrl + 'UserServlet';
    let type = "SearchForSupplier";
    let verifydata = JSON.stringify({ searchvalue, type });
    return this.http.post(verifyurl, verifydata)
      .map(res => <checksupplier>(res.json()))
  }
  AddCookingGas(supplierid: string, totalquantity: string,
    size1price: string, size2price: string, size3price: string,
    size4price: string, size5price: string, size6price: string,
    size7price: string, size8price: string, size9price: string,
    size10price: string, size11price: string, minquantity: string) {
    let url = this.baseUrl + 'SupplierServlet';
    let type = "AddCookingGas";
    let data = JSON.stringify({
      type, supplierid, totalquantity, size1price, size2price,
      size3price, size4price, size5price, size6price,
      size7price, size8price, size9price, size10price,
      size11price, minquantity
    });
    return this.http.post(url, data)
      .map(res => (res.json()))
  }
  ResetPassword(userid: string, password: string, confirmpassword: string) {
    let loginurl = this.baseUrl + 'UserServlet';
    let type = "ResetPassword";
    let logindata = JSON.stringify({ userid, password, confirmpassword, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }
  SaveAndUpdateDeviceToken(userid: string, tokenid: string, devicetoken: string) {
    let loginurl = this.baseUrl + 'UserServlet';
    let type = "SaveAndUpdateDeviceToken";
    let logindata = JSON.stringify({ userid, tokenid, devicetoken, type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }

  TotalCustomers() {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "TotalCustomers";
    let logindata = JSON.stringify({ type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }
  TotalSuppliers() {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "TotalSuppliers";
    let logindata = JSON.stringify({ type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }

  TotalTransporters() {
    let loginurl = this.baseUrl + 'AdminServlet';
    let type = "TotalTransporters";
    let logindata = JSON.stringify({ type });
    return this.http.post(loginurl, logindata)
      .map(res =>
        res.json())
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };
  checkHasSeenWelcome() {
    return this.storage.get(this.HAS_SEEN_WELCOME).then((value) => {
      return value;
    })
  };
  SetloggedInUserDetails(loggedInUserDetails) {
    this.storage.set('loggedInUserDetails', loggedInUserDetails);
  };
  getloggedInUserDetails() {
    return this.storage.get('loggedInUserDetails').then((value) => {
      return value;
    });
  };

}
