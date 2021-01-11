import { Component, ViewChild } from '@angular/core';
import { Events, App, MenuController, AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';


import { AccountsPage } from '../pages/accounts/accounts';
import { HomePage } from '../pages/home/home';
import { HistoryPage } from '../pages/history/history';
import { LocationPage } from '../pages/location/location';
import { LoginPage } from '../pages/login/login';
import { MessagesPage } from '../pages/messages/messages';
import { OrderPage } from '../pages/order/order';
import { OrderdetailsPage } from '../pages/orderdetails/orderdetails';
import { ProfilePage } from '../pages/profile/profile';
import { ProductsPage } from '../pages/products/products';
import { SettingPage } from '../pages/setting/setting';
import { SuppliersPage } from '../pages/suppliers/suppliers';
import { SupplierdetailsPage } from '../pages/supplierdetails/supplierdetails';
import { TrackorderPage } from '../pages/trackorder/trackorder';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { TransporterPage } from '../pages/transporter/transporter';
import { UserPage } from '../pages/user/user';
import { Dataservice } from '../providers/dataservice';
import { Push } from '@ionic/cloud-angular';
export interface PageInterface {
  icon: string;
  title: string;
  logsOut?: boolean;
  component: any
};

@Component({
  templateUrl: 'app.html'
})
export class FuelApp {
  @ViewChild(Nav) nav: Nav;
  Userfullname: any;
  Details: any;
  UserDetails: any;
  usertype: any;
  loggedInUserPages: PageInterface[] = [
    { icon: 'home', title: 'Home', component: HomePage },
    { icon: 'md-color-fill', title: 'Place Order', component: LocationPage },
    { icon: 'person', title: 'Profile', component: ProfilePage },
    { icon: 'cart', title: 'Orders', component: OrderPage },
    { icon: 'search', title: 'Check Status', component: TrackorderPage },
    { icon: 'swap', title: 'Transactions', component: HistoryPage },
    { icon: 'md-mail', title: 'Messages', component: MessagesPage },
    { icon: 'settings', title: 'Setting', component: SettingPage },
    { icon: 'construct', title: 'User Guide', component: TutorialPage },
    { icon: 'log-out', title: 'Logout', logsOut: true, component: LoginPage }
  ];
  loggedInAdminPages: PageInterface[] = [
    { icon: 'home', title: 'Home', component: HomePage },
    { icon: 'person', title: 'Profile', component: ProfilePage },
    { icon: 'logo-usd', title: 'Accounts', component: AccountsPage },
    { icon: 'contacts', title: 'Customers', component: UserPage },
    { icon: 'contacts', title: 'Suppliers', component: SuppliersPage },
    { icon: 'contacts', title: 'Transporters', component: TransporterPage },
    { icon: 'cart', title: 'Orders', component: OrderPage },
    { icon: 'swap', title: 'Transactions', component: HistoryPage },
    { icon: 'md-mail', title: 'Messages', component: MessagesPage },
    { icon: 'settings', title: 'Setting', component: SettingPage },
    { icon: 'construct', title: 'User Guide', component: TutorialPage },
    { icon: 'log-out', title: 'Logout', logsOut: true, component: LoginPage }
  ];
  loggedInSupplierPages: PageInterface[] = [
    { icon: 'home', title: 'Home', component: HomePage },
    { icon: 'person', title: 'Profile', component: ProfilePage },
    { icon: 'logo-usd', title: 'Accounts', component: AccountsPage },
    { icon: 'swap', title: 'Transactions', component: HistoryPage },
    { icon: 'cart', title: 'Requests', component: OrderPage },
    { icon: 'contacts', title: 'Transporters', component: TransporterPage },
    { icon: 'md-color-fill', title: 'Products', component: ProductsPage },
    { icon: 'md-mail', title: 'Messages', component: MessagesPage },
    { icon: 'settings', title: 'Setting', component: SettingPage },
    { icon: 'construct', title: 'User Guide', component: TutorialPage },
    { icon: 'log-out', title: 'Logout', logsOut: true, component: LoginPage }
  ];
  loggedInTransporterPages: PageInterface[] = [
    { icon: 'home', title: 'Home', component: HomePage },
    { icon: 'person', title: 'Profile', component: ProfilePage },
    { icon: 'swap', title: 'Transactions', component: HistoryPage },
    { icon: 'cart', title: 'Requests', component: OrderPage },
    { icon: 'md-mail', title: 'Messages', component: MessagesPage },
    { icon: 'settings', title: 'Setting', component: SettingPage },
    { icon: 'construct', title: 'User Guide', component: TutorialPage },
    { icon: 'log-out', title: 'Logout', logsOut: true, component: LoginPage }
  ];
  loggedOutPages: PageInterface[] = [
    { icon: 'settings', title: 'Setting', component: SettingPage }
  ];
  rootPage: any;
  activePage: any;
  constructor(
    public events: Events,
    public menu: MenuController,
    public platform: Platform,
    public storage: Storage, public app: App,
    public alertCtrl: AlertController, public push: Push,
    public dataservice: Dataservice) {
    this.storage.ready().then(() => {
      // Check if the user has already seen the WelcomePage
      this.storage.get('hasSeenWelcome')
        .then((hasSeenWelcome) => {
          if (hasSeenWelcome) {
            this.storage.get('hasSeenLogin') // Check if the user has already seen the LoginPage
              .then((hasSeenLogin) => {
                if (hasSeenLogin) {
                  this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                    if (loggedInUserDetails === null) {
                    } else {
                      this.rootPage = HomePage;
                    }
                  });
                } else {
                  this.rootPage = LoginPage;
                }
              });
          } else {
            this.rootPage = LoginPage;
          }
          this.platformReady()
        });

      this.dataservice.hasLoggedIn().then((hasLoggedIn) => {
        this.storage.ready().then(() => {
          this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
            if (loggedInUserDetails == null) {
            } else {
              this.Details = loggedInUserDetails[1];
              this.Userfullname = this.Details.lastname;
              this.usertype = this.Details.type;
              this.enableMenu(hasLoggedIn === true, this.usertype);
            }
          });
        });
      });
      this.listenToLoginEvents();
    });
  }

  openPage(page: PageInterface) {
    this.menu.close();
    this.nav.setRoot(page.component);
    this.activePage = page;
    if (page.logsOut === true) {
      let confirm = this.alertCtrl.create({
        title: 'Logging Out',
        message: 'Are you sure you want to logout?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.nav.setRoot(HomePage);
            }
          },
          {
            text: 'Yes',
            handler: () => {
              setTimeout(() => {
                this.storage.remove('userid');
                this.storage.remove('hasLoggedIn');
                this.storage.remove('hasSeenLogin');
                this.storage.remove('hasSeenWelcome');;
                this.storage.remove('loggedInUserDetails');;
                this.events.publish('user:logout');
                this.push.unregister();
              }, 1000);
            }
          }
        ]
      });
      confirm.present();
    }

  }
  platformReady() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.hideSplash();
      this.backbutton();
      this.storage.ready().then(() => {
        this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
          if (loggedInUserDetails == null) {
          } else {
            this.Details = loggedInUserDetails[1];
            this.Userfullname = this.Details.lastname;
          }
        });
      });
      this.push.rx.notification()
        .subscribe((msg) => {
          if (msg.app.asleep) {
            if (msg.title === "Placed Order") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              let confirmAlert = this.alertCtrl.create({
                title: msg.title,
                message: msg.text,
                buttons: [{
                  text: 'Ignore',
                  role: 'cancel'
                }, {
                  text: 'View',
                  handler: () => {
                    this.nav.push(OrderdetailsPage, { id });
                  }
                }]
              });
              confirmAlert.present();
            } else if (msg.title === "Account Activation") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              let confirmAlert = this.alertCtrl.create({
                title: msg.title,
                message: msg.text,
                buttons: [{
                  text: 'Ignore',
                  role: 'cancel'
                }, {
                  text: 'View',
                  handler: () => {
                    this.nav.push(SupplierdetailsPage, { id });
                  }
                }]
              });
              confirmAlert.present();
            } else if (msg.title === "Account Deactivation") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              let confirmAlert = this.alertCtrl.create({
                title: msg.title,
                message: msg.text,
                buttons: [{
                  text: 'Ignore',
                  role: 'cancel'
                }, {
                  text: 'View',
                  handler: () => {
                    this.nav.push(SupplierdetailsPage, { id });
                  }
                }]
              });
              confirmAlert.present();
            } else if (msg.title === "Order Cancelled") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              let confirmAlert = this.alertCtrl.create({
                title: msg.title,
                message: msg.text,
                buttons: [{
                  text: 'Ignore',
                  role: 'cancel'
                }, {
                  text: 'View',
                  handler: () => {
                    this.nav.push(OrderdetailsPage, { id });
                  }
                }]
              });
              confirmAlert.present();
            } else if (msg.title === "Request Confirmed") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              let confirmAlert = this.alertCtrl.create({
                title: msg.title,
                message: msg.text,
                buttons: [{
                  text: 'Ignore',
                  role: 'cancel'
                }, {
                  text: 'View',
                  handler: () => {
                    this.nav.push(OrderdetailsPage, { id });
                  }
                }]
              });
              confirmAlert.present();
            } else if (msg.title === "Order Delivered") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              let confirmAlert = this.alertCtrl.create({
                title: msg.title,
                message: msg.text,
                buttons: [{
                  text: 'Ignore',
                  role: 'cancel'
                }, {
                  text: 'View',
                  handler: () => {
                    this.nav.push(OrderdetailsPage, { id });
                  }
                }]
              });
              confirmAlert.present();
            }
          } else if (msg.app.closed) {
            if (msg.title === "Placed Order") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              this.nav.push(OrderdetailsPage, { id });
            } else if (msg.title === "Account Activation") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              this.nav.push(SupplierdetailsPage, { id });
            } else if (msg.title === "Account Deactivation") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              this.nav.push(SupplierdetailsPage, { id });
            } else if (msg.title === "Order Cancelled") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              this.nav.push(OrderdetailsPage, { id });
            } else if (msg.title === "Request Confirmed") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              this.nav.push(OrderdetailsPage, { id });
            } else if (msg.title === "Order Delivered") {
              let text = msg.text;
              var newtext = text.split(":");
              let id = newtext[1].toString();
              this.nav.push(OrderdetailsPage, { id });
            }
          }
        });

    });
  }

  hideSplash() {
    setTimeout(() => {
      Splashscreen.hide();
    }, 100)
  }
  listenToLoginEvents() {
    this.events.subscribe('user:signup', () => {
      this.enableMenu(true, "");
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false, "");
      this.nav.setRoot(LoginPage);
    });

    this.events.subscribe('user:netwkerror', () => {
      this.enableMenu(false, "");
      this.nav.setRoot(LoginPage);
    });

    this.events.subscribe('user:login', (usertype, Userfullname) => {
      this.Userfullname = Userfullname;
      this.enableMenu(true, usertype);
    })
  }
  enableMenu(showmenu, usertype) {
    if (usertype === "User") {
      this.menu.enable(showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInTransporterMenu');
      this.menu.enable(!showmenu, 'loggedInSupplierMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Admin") {
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedInTransporterMenu');
      this.menu.enable(!showmenu, 'loggedInSupplierMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Supplier") {
      this.menu.enable(showmenu, 'loggedInSupplierMenu');
      this.menu.enable(!showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedInTransporterMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Transporter") {
      this.menu.enable(showmenu, 'loggedInTransporterMenu');
      this.menu.enable(!showmenu, 'loggedInSupplierMenu');
      this.menu.enable(!showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInUserMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else {
      this.menu.enable(showmenu, 'loggedOutMenu');
    }
  }
  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.component) {
        return 'primary';
      }
      return;
    }
    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }
  backbutton() {
    this.platform.registerBackButtonAction(() => {
      let nav = this.app.getActiveNav();
      if (nav.canGoBack()) { //Can we go back?
        nav.pop();
      } else {
        let actionSheet = this.alertCtrl.create({
          title: 'Exit Qikfuel?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                this.platform.exitApp(); //Exit from app
              }
            }, {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();
      }
    });
  }
}
