import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { FuelApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { AccountsPage } from '../pages/accounts/accounts';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { FindsupplierPage } from '../pages/findsupplier/findsupplier';
import { GasPage } from '../pages/gas/gas';
import { HistoryPage } from '../pages/history/history';
import { HistorydetailsPage } from '../pages/historydetails/historydetails';
import { HomePage } from '../pages/home/home';
import { LocationPage } from '../pages/location/location';
import { LoginPage } from '../pages/login/login';
import { MessagesPage } from '../pages/messages/messages';
import { MessagesdetailsPage } from '../pages/messagesdetails/messagesdetails';
import { OrderPage } from '../pages/order/order';
import { OrderdetailsPage } from '../pages/orderdetails/orderdetails';
import { ProductsPage } from '../pages/products/products';
import { ProductdetailsPage } from '../pages/productdetails/productdetails';
import { ProfilePage } from '../pages/profile/profile';
import { RequestPage } from '../pages/request/request';
import { SettingPage } from '../pages/setting/setting';
import { SupplierdetailsPage } from '../pages/supplierdetails/supplierdetails';
import { SuppliersPage } from '../pages/suppliers/suppliers';
import { SuppliersignupPage } from '../pages/suppliersignup/suppliersignup';
import { TermsPage } from '../pages/terms/terms';
import { Terms2Page } from '../pages/terms2/terms2';
import { TrackorderPage } from '../pages/trackorder/trackorder';
import { TransporterPage } from '../pages/transporter/transporter';
import { TransporterdetailsPage } from '../pages/transporterdetails/transporterdetails';
import { TransportersignupPage } from '../pages/transportersignup/transportersignup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { UserPage } from '../pages/user/user';
import { UserdetailsPage } from '../pages/userdetails/userdetails';
import { UsersignupPage } from '../pages/usersignup/usersignup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { Dataservice } from '../providers/dataservice';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '7a5b911b'
  },
  'push': {
    'sender_id': '519916925235',
    'pluginConfig': {
      'ios': {
        'clearBadge': false,
        'badge': true,
        'sound': true,
        'alert': true,
      },
      'android': {
        'icon': 'icon.png',
        'sound': true,
        'vibrate': true,
        'clearBadge': false,
        'clearNotifications': false,
        'iconColor': '#d85a33'
      }
    }
  }
};

@NgModule({
  declarations: [
    FuelApp,
    AccountsPage,
    EditprofilePage,
    FindsupplierPage,
    GasPage,
    HistoryPage,
    HistorydetailsPage,
    HomePage,
    LocationPage,
    LoginPage,
    MessagesPage,
    MessagesdetailsPage,
    OrderPage,
    OrderdetailsPage,
    ProductsPage,
    ProductdetailsPage,
    ProfilePage,
    RequestPage,
    ResetpasswordPage,
    SettingPage,
    SupplierdetailsPage,
    SuppliersPage,
    SuppliersignupPage,
    TermsPage,
    Terms2Page,
    TrackorderPage,
    TransporterPage,
    TransporterdetailsPage,
    TransportersignupPage,
    TutorialPage,
    UserPage,
    UserdetailsPage,
    UsersignupPage
  ],
  imports: [
    IonicModule.forRoot(FuelApp),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FuelApp,
    AccountsPage,
    EditprofilePage,
    FindsupplierPage,
    GasPage,
    HistoryPage,
    HistorydetailsPage,
    HomePage,
    LocationPage,
    LoginPage,
    MessagesPage,
    MessagesdetailsPage,
    OrderPage,
    OrderdetailsPage,
    ProductsPage,
    ProductdetailsPage,
    ProfilePage,
    RequestPage,
    ResetpasswordPage,
    SettingPage,
    SupplierdetailsPage,
    SuppliersPage,
    SuppliersignupPage,
    TermsPage,
    Terms2Page,
    TrackorderPage,
    TransporterPage,
    TransporterdetailsPage,
    TransportersignupPage,
    TutorialPage,
    UserPage,
    UserdetailsPage,
    UsersignupPage
  ],
  providers: [Dataservice]
})
export class AppModule { }
