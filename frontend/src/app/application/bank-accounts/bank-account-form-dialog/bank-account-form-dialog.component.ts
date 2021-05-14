import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SnackService } from '../../../shared/snack/snack-service';
import { BankAccount } from '../shared/bank-account.model';
import { BankAccountService } from '../shared/bank-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'app-bank-account-form-dialog',
    templateUrl: './bank-account-form-dialog.component.html',
    styleUrls: ['./bank-account-form-dialog.component.scss']
})
export class BankAccountFormDialogComponent {
    bankAccount: BankAccount;
    editMode: boolean;
    password!: string;

    private done$: Subject<void> = new Subject();
    public done = this.done$.asObservable();

    constructor(private dialogRef: MatDialogRef<BankAccountFormDialogComponent>,
                private bankAccountService: BankAccountService,
                private matSnack: MatSnackBar,
                private router: Router,
                @Inject(MAT_DIALOG_DATA) data: {bankAccount: BankAccount, edit: false},
                private snackService: SnackService) {
            this.bankAccount = {...data.bankAccount};
            this.editMode = data.edit;
    }

    save(bankAccount: BankAccount): void {
        if (this.editMode) {
            this.edit(bankAccount);
        } else {
            this.create(bankAccount);
        }

    }

    create(bankAccount: BankAccount): void {
        this.bankAccountService.save(bankAccount).subscribe((resp) => {
            this.done$.next();
            this.done$.complete();
            this.dialogRef.close();
            this.showSnack(resp.body.message);
        }, error => {
            const message = {error}.error.error.message;
            this.showSnack(message);
        });
    }

    edit(bankAccount: BankAccount): void {
        this.bankAccountService.update(bankAccount).subscribe((u: BankAccount) => {
            this.done$.next();
            this.done$.complete();
            this.dialogRef.close();
            this.showSnack(u.accountNumber);
        }, error => {
            this.snackService.showError(error);
        });
    }

    showSnack(message: string): void {
      this.matSnack.open(message, 'Fechar', {duration: 500});
    }
}
