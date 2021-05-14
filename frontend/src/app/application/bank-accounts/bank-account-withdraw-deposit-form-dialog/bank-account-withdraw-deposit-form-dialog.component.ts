import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SnackService } from '../../../shared/snack/snack-service';
import { BankAccount } from '../shared/bank-account.model';
import { BankAccountService } from '../shared/bank-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';


@Component({
    selector: 'app-bank-account-withdraw-deposit-form-dialog',
    templateUrl: './bank-account-withdraw-deposit-form-dialog.component.html',
    styleUrls: ['./bank-account-withdraw-deposit-form-dialog.component.scss']
})
export class BankAccountWithdrawDepositFormDialogComponent {
    bankAccount: BankAccount;
    isWithdraw: boolean;

    private done$: Subject<void> = new Subject();
    public done = this.done$.asObservable();

    amountFormControl = new FormControl('', [Validators.required]);
    matcher = new BankAccountWithdrawErrorStateMatcher();

    constructor(private dialogRef: MatDialogRef<BankAccountWithdrawDepositFormDialogComponent>,
                private bankAccountService: BankAccountService,
                private matSnack: MatSnackBar,
                private router: Router,
                @Inject(MAT_DIALOG_DATA) data: {bankAccount: BankAccount, isWithdraw: boolean},
                private snackService: SnackService) {
            this.bankAccount = {...data.bankAccount};
            this.isWithdraw = data.isWithdraw;
    }

    save(): void{
      const amount = parseFloat(this.amountFormControl.value.toFixed(2));
      if (this.isWithdraw) {
        this.withdraw(amount);
      }else {
        this.deposit(amount);
      }
    }

    withdraw(amount: number): void {

        this.bankAccountService.withdraw(this.bankAccount, amount).subscribe((resp) => {
            this.done$.next();
            this.done$.complete();
            this.dialogRef.close();
            this.showSnack(resp.body.message);
        }, error => {
            const message = {error}.error.error.message;
            this.showSnack(message);
        });
    }

    deposit(amount: number): void {

      this.bankAccountService.deposit(this.bankAccount, amount).subscribe((resp) => {
        this.done$.next();
        this.done$.complete();
        this.dialogRef.close();
        this.showSnack(resp.body.message);
      }, error => {
        const message = {error}.error.error.message;
        this.showSnack(message);
      });
    }

    showSnack(message: string): void {
      this.matSnack.open(message, 'Fechar', {duration: 500});
    }

    validateForm(): boolean {
      let isValid = true;

      isValid = isValid && this.amountFormControl.valid;

      return isValid;
    }
}
export class BankAccountWithdrawErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
