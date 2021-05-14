import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountResumeComponent } from './bank-account-resume.component';

describe('BankAccountResumeComponent', () => {
  let component: BankAccountResumeComponent;
  let fixture: ComponentFixture<BankAccountResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
