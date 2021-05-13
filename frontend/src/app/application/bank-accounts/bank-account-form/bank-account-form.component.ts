import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { BankAccount } from '../shared/bank-account.model';


@Component({
    selector: 'app-bank-account-form',
    templateUrl: './bank-account-form.component.html',
    styleUrls: ['./bank-account-form.component.scss']
})
export class BankAccountFormComponent implements OnInit {

    @Input()
    bankAccount!: BankAccount;

    @Input()
    dialog = false;

    @Output()
    save: EventEmitter<any> = new EventEmitter<any>();

    authenticatedBankAccount!: BankAccount | null;

    nameFormControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/[^\s]+/)
    ]);

    cpfFormControl =  new FormControl('');

    accountNumberFormControl =  new FormControl('');

    balanceFormControl = new FormControl(0.0, [
      Validators.required,
    ]);

    matcher = new BankAccountErrorStateMatcher();

    constructor() {}

    ngOnInit(): void {}

    onSave(): void {
        if (this.validateForm()) {
          const customFormData = {
            name: this.nameFormControl.value,
            accountNumber: this.accountNumberFormControl.value,
            cpf: this.cpfFormControl.value,
            balance: parseFloat(this.balanceFormControl.value.toFixed(2))
          };
          this.save.emit(customFormData);
        }
    }

    validateForm(): boolean {
        let isValid = true;

        isValid = isValid && this.nameFormControl.valid;

        return isValid;
    }

}

export class BankAccountErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;

        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
