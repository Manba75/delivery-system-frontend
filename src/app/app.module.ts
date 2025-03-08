import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
