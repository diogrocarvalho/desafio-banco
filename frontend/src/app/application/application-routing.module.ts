import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAccountListComponent } from './bank-accounts/list/bank-account-list.component';
import { UserListComponent } from './user/user-list/user-list.component';

const routes: Routes = [
  { path: 'contas',
    component: BankAccountListComponent },
  { path: 'usuarios',
    component: UserListComponent },
  { path: '',
    redirectTo: 'contas'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
