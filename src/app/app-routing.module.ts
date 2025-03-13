import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { CustomerSignupComponent } from './pages/customer/customer-signup/customer-signup.component';
import { DpartnerSignupComponent } from './pages/deliverypartners/dpartner-signup/dpartner-signup.component';
import { ForgotpasswordpageComponent } from './pages/forgotpasswordpage/forgotpasswordpage.component';
import { ResetpasswordpageComponent } from './pages/resetpasswordpage/resetpasswordpage.component';
import { ResetpasswordsuccesspageComponent } from './pages/resetpasswordsuccesspage/resetpasswordsuccesspage.component';
import { VerifyOTPpageComponent } from './pages/verify-otppage/verify-otppage.component';
import { AboutpageComponent } from './pages/aboutpage/aboutpage.component';
import { ContactpageComponent } from './pages/contactpage/contactpage.component';
import { CustomerprofilepageComponent } from './pages/customer/customerprofilepage/customerprofilepage.component';
import { DpartnerprofilepageComponent } from './pages/deliverypartners/dpartnerprofilepage/dpartnerprofilepage.component';
import { SelectCitypageComponent } from './pages/order/select-citypage/select-citypage.component';
import { SelectVehicletypepageComponent } from './pages/order/select-vehicletypepage/select-vehicletypepage.component';
import { SelectAddresspageComponent } from './pages/order/select-addresspage/select-addresspage.component';
import { LiveTrackingpageComponent } from './pages/order/live-trackingpage/live-trackingpage.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { VerifyEmailPageComponent } from './pages/verify-email-page/verify-email-page.component';
import { ConfirmOrderPageComponent } from './pages/confirm-order-page/confirm-order-page.component';
import { CustomerdashboardpageComponent } from './pages/customer/customerdashboardpage/customerdashboardpage.component';
import { CustomerprofileComponent } from './components/customers/profile/customerprofile/customerprofile.component';
import { LiveTrackingComponent } from './components/order/live-tracking/live-tracking.component';
import { DpartnerdashboardComponent } from './components/deliverypartners/dashboard/dpartnerdashboard/dpartnerdashboard.component';
import { DpartnerdashboardpageComponent } from './pages/deliverypartners/dpartnerdashboardpage/dpartnerdashboardpage.component';

const routes: Routes = [
  {path: '',component: HomeComponent},
  {path:'about',component:AboutpageComponent},
  {path:'contact',component:ContactpageComponent},
  {path:'customer/signup',component:CustomerSignupComponent},
  {path:'deliverypartners/signup',component:DpartnerSignupComponent},
  {path:'verify-email/:userType',component:VerifyEmailPageComponent},

  {path:'login/:userType',component:LoginpageComponent},
  { path:'forgot-password/:userType',component:ForgotpasswordpageComponent},
  {path:'reset-password/:userType',component:ResetpasswordpageComponent},
  {path:'verify-otp/:userType',component:VerifyOTPpageComponent},
  {path:'reset-password-success',component:ResetpasswordsuccesspageComponent},
  {path:'customer/profile',component:CustomerprofilepageComponent},
  {path:'deliverypartners/profile',component:DpartnerprofilepageComponent},
  {path:'order/select-city',component:SelectCitypageComponent},
  {path:'order/select-vehicletype',component:SelectVehicletypepageComponent},
  {path:'order/select-address',component:SelectAddresspageComponent},
  {path:'order/live-tracking',component:LiveTrackingpageComponent},
  {path:'order/payment',component:PaymentPageComponent},
  {path:'order/confirm-order',component:ConfirmOrderPageComponent},
  {path:'deliverypartners/dashboard',component:DpartnerdashboardpageComponent},

  {path:'dashboard',component:CustomerdashboardpageComponent},

  {path: '**',component:ErrorPageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
