import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SnackService } from '../../../shared/snack/snack-service';
import { BankAccount } from '../shared/bank-account.model';
import { BankAccountService } from '../shared/bank-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-bank-account-transfer-form-dialog',
  templateUrl: './bank-account-transfer-form-dialog.component.html',
  styleUrls: ['./bank-account-transfer-form-dialog.component.scss']
})
export class BankAccountTransferFormDialogComponent implements OnInit{
  outgoingBankAccount: BankAccount;
  incomingBankAccount: BankAccount;

  searchIncomingBankAccountControl = new FormControl('', [Validators.required]);
  incomingBankAccountFormControl = new FormControl('', [Validators.required]);
  bankAccountsOpts: BankAccount[] = [];
  filteredOptions!: Observable<BankAccount[]>;

  isWithdraw: boolean;

  private done$: Subject<void> = new Subject();
  public done = this.done$.asObservable();

  amountFormControl = new FormControl('', [Validators.required]);
  matcher = new BankAccountTransferErrorStateMatcher();

  constructor(private dialogRef: MatDialogRef<BankAccountTransferFormDialogComponent>,
              private bankAccountService: BankAccountService,
              private matSnack: MatSnackBar,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) data: {outgoingBankAccount},
  ) {
    this.outgoingBankAccount = {...data.outgoingBankAccount};
  }

  ngOnInit(): void {
    this.getBankAccounts();
  }

  private getBankAccounts(): void {
    const param = new HttpParams().set('size', '1000');

    this.bankAccountService.paginate(param).subscribe(bankAccounts => {
      this.bankAccountsOpts = bankAccounts.body;
      this.filteredOptions = this.searchIncomingBankAccountControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.accountNumber),
        map(title => title ? this._filter(title) : this.bankAccountsOpts.filter(b => b.id !== this.outgoingBankAccount.id))
      );
    });
  }
  private _filter(value: string): BankAccount[] {
    const filterValue = value.toLowerCase();
    return this.bankAccountsOpts.filter(option => option.id !== this.outgoingBankAccount.id
      && option.accountNumber?.toLowerCase().includes(filterValue));
  }

  save(): void{
    const amount = parseFloat(this.amountFormControl.value.toFixed(2));
    this.transfer(amount);
  }

  transfer(amount: number): void {

    this.bankAccountService.transfer(this.outgoingBankAccount, this.incomingBankAccount, amount).subscribe((resp) => {
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

  displayFn(bankAccount: BankAccount): string {
    return bankAccount && bankAccount.accountNumber ? bankAccount.accountNumber : '';
  }

  selectIncomingBankAccountEvent(bankAccount: MatAutocompleteSelectedEvent): void {
    this.incomingBankAccount = bankAccount.option.value;
    this.incomingBankAccountFormControl.setValue(this.incomingBankAccount);
  }

  setIncomingBankAccountName(): void {
    if (this.outgoingBankAccount) {
      this.searchIncomingBankAccountControl.setValue(this.outgoingBankAccount);
    }
  }
}
export class BankAccountTransferErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
