import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { RouterModule } from '@angular/router';
import { UserFormDialogComponent } from './user/user-form-dialog/user-form-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { ApplicationRoutingModule } from './application-routing.module';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserChangePasswordComponent } from './user/user-change-password/user-change-password.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { BankAccountListComponent } from './bank-accounts/list/bank-account-list.component';
import { BankAccountFormDialogComponent } from './bank-accounts/bank-account-form-dialog/bank-account-form-dialog.component';
import { BankAccountFormComponent } from './bank-accounts/bank-account-form/bank-account-form.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BankAccountWithdrawDepositFormDialogComponent } from './bank-accounts/bank-account-withdraw-deposit-form-dialog/bank-account-withdraw-deposit-form-dialog.component';
import { BankAccountResumeComponent } from './bank-accounts/bank-account-resume/bank-account-resume.component';
import { BankAccountTransferFormDialogComponent } from './bank-accounts/bank-account-transfer-form-dialog/bank-account-transfer-form-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  nullable: true
};

@NgModule({
  declarations: [
    ApplicationComponent,
    UserFormDialogComponent,
    UserCreateComponent,
    UserListComponent,
    UserEditComponent,
    UserChangePasswordComponent,
    UserFormComponent,
    BankAccountListComponent,
    BankAccountFormDialogComponent,
    BankAccountFormComponent,
    BankAccountWithdrawDepositFormDialogComponent,
    BankAccountResumeComponent,
    BankAccountTransferFormDialogComponent
  ],
  imports: [
    ApplicationRoutingModule,
    CommonModule,
    RouterModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    FormsModule,
    MatDividerModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxMaskModule.forRoot(),
    MatAutocompleteModule
  ]
})
export class ApplicationModule { }
