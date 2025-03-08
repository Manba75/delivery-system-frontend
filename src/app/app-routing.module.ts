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

const routes: Routes = [
  {path: '',component: HomeComponent},
  {path:'login/:userType',component:LoginpageComponent},
  {path:'customer/signup',component:CustomerSignupComponent},
  {path:'deliverypartners/signup',component:DpartnerSignupComponent},
  { path:'forgot-password/:userType',component:ForgotpasswordpageComponent},
  {path:'reset-password/:userType',component:ResetpasswordpageComponent},
  {path:'verify-otp/:userType',component:VerifyOTPpageComponent},
  {path:'reset-password-success',component:ResetpasswordsuccesspageComponent},
  {path:'about',component:AboutpageComponent},
  {path:'contact',component:ContactpageComponent},






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
