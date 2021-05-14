import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount } from './bank-account.model';
import { PaginatedService } from '../../../shared/data-source/paginated-service';
import { ConfigService } from '../../../shared/config.service';


@Injectable({
    providedIn: 'root'
})
export class BankAccountService implements PaginatedService<BankAccount> {

    apiURL: string;
    resource = 'bank-accounts';

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiURL = this.configService.getSettings().apiURL;

    }

    paginate(params: HttpParams): Observable<HttpResponse<BankAccount[]>> {
        return this.http.get<BankAccount[]>(
            `${this.apiURL}${this.resource}/`,
            {
                observe: 'response',
                params
            }
        );
    }

    save(bankAccount: BankAccount): Observable<HttpResponse<any>> {
        return this.http.post<any>(
            `${this.apiURL}${this.resource}/`,
            bankAccount,
          {observe: 'response'}
        );
    }

    get(id: number): Observable<BankAccount> {
        return this.http.get<BankAccount>(
            `${this.apiURL}${this.resource}/${id}/`,
        );
    }

    update(bankAccount: BankAccount): Observable<BankAccount> {
        return this.http.put<BankAccount>(
            `${this.apiURL}${this.resource}/${bankAccount.id}/`,
            bankAccount
        );
    }

    delete(bankAccount: BankAccount): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiURL}${this.resource}/${bankAccount.id}/`,
            {
                observe: 'response'
            }
        );
    }

    withdraw(bankAccount: BankAccount, amount: number): Observable<HttpResponse<any>> {
      return this.http.patch(`${this.apiURL}${this.resource}/withdraw/${bankAccount.id}/`,
          {amount},
        {observe: 'response'});
    }

    deposit(bankAccount: BankAccount, amount: number): Observable<HttpResponse<any>> {
      return this.http.patch(`${this.apiURL}${this.resource}/deposit/${bankAccount.id}/`,
        {amount},
        {observe: 'response'});
    }

    transfer(outgoingBankAccount: BankAccount, incomingBankAccount: BankAccount, amount: number): Observable<HttpResponse<any>> {
      return this.http.put(`${this.apiURL}${this.resource}/transfer/${outgoingBankAccount.id}/`,
        {
          incomingBankAccountId: incomingBankAccount.id,
          amount
        },
        {observe: 'response'});
    }
}
