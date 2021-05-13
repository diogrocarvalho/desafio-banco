import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListFilter } from '../../../shared/data-source/list-filter';
import { SnackService } from '../../../shared/snack/snack-service';
import { AuthService } from '../../../auth/auth.service';
import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';
import { PaginatedDataSource } from '../../../shared/data-source/paginated-data-source';
import { BankAccount } from '../shared/bank-account.model';
import { BankAccountService } from '../shared/bank-account.service';
import { BankAccountFormDialogComponent } from '../bank-account-form-dialog/bank-account-form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankAccountWithdrawDepositFormDialogComponent } from '../bank-account-withdraw-deposit-form-dialog/bank-account-withdraw-deposit-form-dialog.component';
import { BankAccountTransferFormDialogComponent } from '../bank-account-transfer-form-dialog/bank-account-transfer-form-dialog.component';


@Component({
    selector: 'app-bank-account-list',
    templateUrl: './bank-account-list.component.html',
    styleUrls: ['./bank-account-list.component.scss']
})
export class BankAccountListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator, { static: true })
    paginator!: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort!: MatSort;

    @ViewChild('searchInput', {static: true}) searchInput!: ElementRef;
    search!: string;

    filter: ListFilter = new  ListFilter({q: this.search});

    displayedColumns: string[] = ['name', 'cpf', 'accountNumber', 'balance', 'actions'];
    dataSource!: PaginatedDataSource<BankAccount>;
    authenticatedBankAccount!: BankAccount | null;

    constructor(private bankAccountService: BankAccountService,
                private dialog: MatDialog,
                private snackService: SnackService,
                private matSnack: MatSnackBar
                ) { }


    ngOnInit(): void {
        this.initDataSource();
    }

    ngAfterViewInit(): void {
      this.filter.debouncedSearch(this.searchInput);
    }

    initDataSource(): void {
        this.dataSource = new PaginatedDataSource(this.bankAccountService, this.snackService);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filter = this.filter;
    }

    delete(bankAccount: BankAccount): void {
        this.bankAccountService.delete(bankAccount).subscribe(() => {
            this.matSnack.open('Conta bancária excluída com sucesso.');
            this.dataSource.update();
        }, (error: HttpErrorResponse) => {
            this.snackService.showError(error);
        });
    }


    openDeleteDialog(bankAccount: BankAccount): void {
        const dialogRef: MatDialogRef<DeleteDialogComponent> = this.dialog.open(DeleteDialogComponent, {
            width: '400px',
            data: {
                title: bankAccount.accountNumber,
                entity: 'Conta bancária'
            }
        });

        dialogRef.componentInstance.yes.subscribe(() => {
           this.delete(bankAccount);
        });
    }

    openCreateBankAccountDialog(bankAccount: BankAccount = new BankAccount(), edit = false): void {

      const dialogRef = this.dialog.open(BankAccountFormDialogComponent, {
          data: {
              bankAccount,
              edit
          }
      });
      dialogRef.componentInstance.done.subscribe(() => this.dataSource.update());
    }

    openWithdrawOrDepositDialog(bankAccount: BankAccount, isWithdraw = false): void {
      const dialogRef = this.dialog.open(BankAccountWithdrawDepositFormDialogComponent, {
        data: {
          bankAccount,
          isWithdraw
        }
      });
      dialogRef.componentInstance.done.subscribe(() => this.dataSource.update());
    }

    openTransferDialog(bankAccount: BankAccount): void {
      const dialogRef = this.dialog.open(BankAccountTransferFormDialogComponent, {
        data: {
          outgoingBankAccount: bankAccount
        }
      });
      dialogRef.componentInstance.done.subscribe(() => this.dataSource.update());
    }
}
