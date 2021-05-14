package br.com.diogo.bank.service;

import br.com.diogo.bank.domain.BankAccount;
import br.com.diogo.bank.domain.User;
import br.com.diogo.bank.enums.BankAccountMessages;
import br.com.diogo.bank.repository.BankAccountRepository;
import br.com.diogo.bank.repository.UserRepository;
import br.com.diogo.bank.exceptions.BankAccountException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BankAccountService {
    Double accountCreateLimit = 50.0;
    Double withdrawLimit = 500.0;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public BankAccountService(){}

    public BankAccount create(BankAccount bankAccount) throws BankAccountException {
        return this.bankAccountRepository.save(bankAccount);
    }

    public BankAccount validateAndSave(BankAccount bankAccount) throws BankAccountException {
        if(bankAccount.getBalance() < this.accountCreateLimit) {
            throw new BankAccountException(BankAccountMessages.INSUFFICIENT_BALANCE);
        }

        String accountNumber = String.valueOf(bankAccount.getAccountNumber());

        if(accountNumber.isEmpty() || accountNumber.equals("null")) {
            long count = this.bankAccountRepository.count();
            StringBuilder countString = new StringBuilder(String.valueOf(count > 0 ? count + 1 : 0));

            while(countString.length() < 6) {
                countString.insert(0, "0");
            }

            bankAccount.setAccountNumber(countString.toString());
        }

        return this.create(bankAccount);
    }

    public BankAccount update(BankAccount bankAccount) {
        return this.bankAccountRepository.save(bankAccount);
    }

    public Page<User> findByNameOrUsername(Pageable pageable, Optional<String> q) {
        String s = "";
        if(q.isPresent()) {
            s = q.get();
        }
        return this.userRepository.findByNameOrUsername(pageable, "%" + s + "%");
    }

    public Page<BankAccount> getBankAccountByCpf(Pageable pageable, String cpf) {
        return this.bankAccountRepository.findByUserCpf(pageable, cpf);
    }

    public List<BankAccount> findAll() {
        return this.bankAccountRepository.findAll();
    }

    public Page<BankAccount> findByAccountNumber(Pageable pageable, Optional<String> q) {
        String s = "";
        if(q.isPresent()) {
            s = q.get();
        }
        return this.bankAccountRepository.findByAccountNumberContains(pageable, s);
    }

    public BankAccount findByAccountNumber( String accountNumber) {
        return this.bankAccountRepository.findByAccountNumber(accountNumber);
    }

    public Optional<BankAccount> findById(Long id) {
        return this.bankAccountRepository.findById(id);
    }

    public BankAccount withdraw(BankAccount bankAccount, Double amount) throws BankAccountException {
        Double balance = bankAccount.getBalance();

        if(amount > this.withdrawLimit) {
            throw new BankAccountException(BankAccountMessages.WITHDRAW_LIMIT_REACHED);
        } else if(amount > balance) {
            throw new BankAccountException(BankAccountMessages.INSUFFICIENT_FUNDS);
        }

        bankAccount.setBalance(balance - amount);
        return this.bankAccountRepository.save(bankAccount);
    }

    public BankAccount deposit(BankAccount bankAccount, Double amount) {
        Double balance = bankAccount.getBalance();

        bankAccount.setBalance(balance + amount);
        return this.bankAccountRepository.save(bankAccount);
    }

    public void transfer(BankAccount outgoingBankAccount, BankAccount incomingBankAccount, Double amount) throws BankAccountException {
        if(amount > outgoingBankAccount.getBalance()) {
            throw new BankAccountException(BankAccountMessages.INSUFFICIENT_FUNDS);
        }

        if(amount > this.withdrawLimit) {
            throw new BankAccountException(BankAccountMessages.WITHDRAW_LIMIT_REACHED);
        }

        outgoingBankAccount.setBalance(outgoingBankAccount.getBalance() - amount);
        incomingBankAccount.setBalance(incomingBankAccount.getBalance() + amount);

        this.bankAccountRepository.save(outgoingBankAccount);
        this.bankAccountRepository.save(incomingBankAccount);
    }

    public void delete(BankAccount bankAccount) {
        this.bankAccountRepository.delete(bankAccount);
    }

}
