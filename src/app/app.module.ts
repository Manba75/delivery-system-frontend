import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';


import { HeroComponent } from './components/home/hero/hero.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { FeaturebtnComponent } from './components/featurebtn/featurebtn.component';
import { Section1Component } from './components/home/section1/section1.component';
import { Section2Component } from './components/home/section2/section2.component';
import { Section3Component } from './components/home/section3/section3.component';
import { Section4Component } from './components/home/section4/section4.component';
import { LoginComponent } from './components/auth/login/login.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { CustomerSignupComponent } from './pages/customer/customer-signup/customer-signup.component';
import { DpartnerSignupComponent } from './pages/deliverypartners/dpartner-signup/dpartner-signup.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DeliverypartnersignupComponent } from './components/auth/deliverypartnersignup/deliverypartnersignup.component';
import { ForgotpasswordComponent } from './components/auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { ForgotpasswordpageComponent } from './pages/forgotpasswordpage/forgotpasswordpage.component';
import { ResetpasswordpageComponent } from './pages/resetpasswordpage/resetpasswordpage.component';
import { ResetpasswordsuccesspageComponent } from './pages/resetpasswordsuccesspage/resetpasswordsuccesspage.component';
import { VerifyOTPpageComponent } from './pages/verify-otppage/verify-otppage.component';
import { VerifyOTPComponent } from './components/auth/verify-otp/verify-otp.component';
import { AboutComponent } from './components/about/about/about.component';
import { ContactComponent } from './components/contact/contact/contact.component';
import { AboutpageComponent } from './pages/aboutpage/aboutpage.component';
import { ContactpageComponent } from './pages/contactpage/contactpage.component';
import { ContactsectionComponent } from './components/contact/contactsection/contactsection.component';
import { CustomerprofileComponent } from './components/customers/profile/customerprofile/customerprofile.component';
import { CustomerdashboardComponent } from './components/customers/dashboard/customerdashboard/customerdashboard.component';
import { CustomerprofilepageComponent } from './pages/customer/customerprofilepage/customerprofilepage.component';
import { CustomerdashboardpageComponent } from './pages/customer/customerdashboardpage/customerdashboardpage.component';
import { DpartnerdashboardpageComponent } from './pages/deliverypartners/dpartnerdashboardpage/dpartnerdashboardpage.component';
import { DpartnerprofilepageComponent } from './pages/deliverypartners/dpartnerprofilepage/dpartnerprofilepage.component';
import { DpartnerprofileComponent } from './components/deliverypartners/profile/dpartnerprofile/dpartnerprofile.component';
import { DpartnerdashboardComponent } from './components/deliverypartners/dashboard/dpartnerdashboard/dpartnerdashboard.component';
import { SelectCityComponent } from './components/order/select-city/select-city.component';
import { SelectVehicletypeComponent } from './components/order/select-vehicletype/select-vehicletype.component';
import { SelectAddressComponent } from './components/order/select-address/select-address.component';
import { LiveTrackingComponent } from './components/order/live-tracking/live-tracking.component';
import { SelectCitypageComponent } from './pages/order/select-citypage/select-citypage.component';
import { SelectVehicletypepageComponent } from './pages/order/select-vehicletypepage/select-vehicletypepage.component';
import { SelectAddresspageComponent } from './pages/order/select-addresspage/select-addresspage.component';
import { LiveTrackingpageComponent } from './pages/order/live-trackingpage/live-trackingpage.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { ConfirmOrderPageComponent } from './pages/confirm-order-page/confirm-order-page.component';
import { VerifyEmailPageComponent } from './pages/verify-email-page/verify-email-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { VerifyemailComponent } from './components/verifyemail/verifyemail.component';
import { OrderHistroryComponent } from './components/order/order-histrory/order-histrory.component';
import { OrderhistroryComponent } from './pages/orderhistrory/orderhistrory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './utils/loader/loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NotificationComponent } from './utils/notification/notification.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './services/auth.intercepter';

@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FeaturebtnComponent,
    Section1Component,
    Section2Component,
    Section3Component,
    Section4Component,

    LoginComponent,
    LoginpageComponent,
    SignupComponent,
    CustomerSignupComponent,
    DpartnerSignupComponent,
    DeliverypartnersignupComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    ForgotpasswordpageComponent,
    ResetpasswordpageComponent,
    ResetpasswordsuccesspageComponent,
    VerifyOTPpageComponent,
    VerifyOTPComponent,
    AboutComponent,
    ContactComponent,
    AboutpageComponent,
    ContactpageComponent,
    ContactsectionComponent,
    CustomerprofileComponent,
    CustomerdashboardComponent,
    CustomerprofilepageComponent,
    CustomerdashboardpageComponent,
    DpartnerdashboardpageComponent,
    DpartnerprofilepageComponent,
    DpartnerprofileComponent,
    DpartnerdashboardComponent,
    SelectCityComponent,
    SelectVehicletypeComponent,
    SelectAddressComponent,
    LiveTrackingComponent,
    SelectCitypageComponent,
    SelectVehicletypepageComponent,
    SelectAddresspageComponent,
    LiveTrackingpageComponent,
    ErrorPageComponent,
    ConfirmOrderPageComponent,
    VerifyEmailPageComponent,
    PaymentPageComponent,
    VerifyemailComponent,
    OrderHistroryComponent,
    OrderhistroryComponent,
    LoaderComponent,
    NotificationComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // Required for animations
    ToastrModule.forRoot({
      positionClass: 'toast-top-center', // Change position to top-center
      timeOut: 1000,
      progressBar: true,
      closeButton: true,
      preventDuplicates: true,
      newestOnTop: true
    })


  ],
  exports: [
    SignupComponent,
    NotificationComponent,
    LoaderComponent,
    VerifyemailComponent,
    VerifyOTPComponent,
    LoginComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    DeliverypartnersignupComponent,
    CustomerprofileComponent,
    CustomerdashboardComponent,
    DpartnerprofileComponent,
    DpartnerdashboardComponent,
    SelectCityComponent,
    SelectVehicletypeComponent,
    SelectAddressComponent,
    LiveTrackingComponent,
    AboutComponent,
    ContactComponent,


  ],
  providers: [CookieService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
