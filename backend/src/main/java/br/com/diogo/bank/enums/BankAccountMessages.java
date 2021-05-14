package br.com.diogo.bank.enums;

import org.springframework.http.HttpStatus;

public enum BankAccountMessages {
    INSUFFICIENT_BALANCE("Saldo insuficiente para abertura de nova conta."),
    NULL_CPF("É necessário informar um cpf para abertura de nova conta."),
    INVALID_CPF("CPF informado para criação de conta está inválido."),
    SUCCESSFUL_CREATED("Conta cadastrada com sucesso!"),

    INVALID_NAME("É necessário informar um nome"),
    WITHDRAW_LIMIT_REACHED("Operação de transferência tem um limite máximo de 500 por operação."),
    INSUFFICIENT_FUNDS("Saldo insuficiente para a operação."),

    SUCCESSFUL_DEPOSIT("Depósito realizado com sucesso!"),
    SUCCESSFUL_WITHDRAW("Saque realizado com sucesso!"),
    SUCCESSFUL_TRANSFER("Transferência realizada com sucesso!");

    public final String label;

    BankAccountMessages(String label) {
        this.label = label;
    }
}
