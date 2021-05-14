import { Component, Input, OnInit } from '@angular/core';
import { BankAccount } from '../shared/bank-account.model';

@Component({
  selector: 'app-bank-account-resume',
  templateUrl: './bank-account-resume.component.html',
  styleUrls: ['./bank-account-resume.component.scss']
})
export class BankAccountResumeComponent implements OnInit {

  @Input()
  bankAccount: BankAccount;

  @Input()
  isTransfer = false;

  constructor() { }

  ngOnInit(): void {
  }

}
