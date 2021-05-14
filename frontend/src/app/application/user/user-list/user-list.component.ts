import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../shared/user.model';
import {UserService} from '../shared/user.service';
import {MatSort} from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { ListFilter } from '../../../shared/data-source/list-filter';
import { SnackService } from '../../../shared/snack/snack-service';
import { AuthService } from '../../../auth/auth.service';
import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';
import { PaginatedDataSource } from '../../../shared/data-source/paginated-data-source';


@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator, { static: true })
    paginator!: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort!: MatSort;

    @ViewChild('searchInput', {static: true}) searchInput!: ElementRef;
    search!: string;

    filter: ListFilter = new  ListFilter({q: this.search});

    displayedColumns: string[] = ['name', 'username', 'actions'];
    dataSource!: PaginatedDataSource<User>;
    authenticatedUser!: User | null;

    constructor(private userService: UserService,
                private dialog: MatDialog,
                private snackService: SnackService,
                private authService: AuthService) { }


    ngOnInit(): void {
        this.getAuthenticatedUser();
        this.initDataSource();
    }

    ngAfterViewInit(): void {
      this.filter.debouncedSearch(this.searchInput);
    }

    initDataSource(): void {
        this.dataSource = new PaginatedDataSource(this.userService, this.snackService);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filter = this.filter;
    }

    delete(user: User): void {
        this.userService.delete(user).subscribe(() => {
            this.snackService.openSnack('Usuário excluído com sucesso.');
            this.dataSource.update();
        }, (error: HttpErrorResponse) => {
            this.snackService.showError(error);
        });
    }


    openDeleteDialog(user: User): void {
        const dialogRef: MatDialogRef<DeleteDialogComponent> = this.dialog.open(DeleteDialogComponent, {
            width: '400px',
            data: {
                title: user.name,
                entity: 'Usuário'
            }
        });

        dialogRef.componentInstance.yes.subscribe(() => {
           this.delete(user);
        });
    }

    openCreateUserDialog(user: User = new User(), edit = false): void {
        const dialogRef = this.dialog.open(UserFormDialogComponent, {
            data: {
                user,
                edit
            }
        });
        dialogRef.componentInstance.done.subscribe(() => this.dataSource.update());
    }

    getAuthenticatedUser(): void {
        this.authService.getAuthenticatedUser().subscribe((user: User | null) => {
            this.authenticatedUser = user;
        });
    }
}
