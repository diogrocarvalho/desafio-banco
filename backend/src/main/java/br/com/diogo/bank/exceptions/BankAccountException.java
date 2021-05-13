package br.com.diogo.bank.exceptions;
import br.com.diogo.bank.enums.BankAccountMessages;

public class BankAccountException extends Exception {

    BankAccountMessages message;

    public BankAccountException(String message) {
        super(message);
    }

    public BankAccountException(BankAccountMessages message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return this.message.label;
    }
}
