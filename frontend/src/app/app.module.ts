import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { RolePipe } from './application/user/shared/role.pipe';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { JWT_TOKEN } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SnackMessageComponent } from './shared/snack/snack-message.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RolePipe,
    PageNotFoundComponent,
    SnackMessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(JWT_TOKEN),
        allowedDomains: ['localhost:8080', '*']
      }
    }),
    MatIconModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
  exports: [
    RolePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
