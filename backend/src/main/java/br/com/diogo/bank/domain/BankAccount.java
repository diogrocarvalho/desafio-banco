package br.com.diogo.bank.domain;

import br.com.diogo.bank.exceptions.BankAccountException;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "balance")
    private Double balance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User user;

    @Transient
    String username;

    @Transient
    String cpf;

    public BankAccount(User user, Double balance, String accountNumber) {
        this.setUser(user);
        this.setBalance(balance);
        this.setAccountNumber(accountNumber);
    }

    public BankAccount() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BankAccount )) return false;
        return id != null && id.equals(((BankAccount) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public String getUsername() {
        return this.getUser().getName();
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCpf() {
        return this.getUser().getCpf();
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
}
