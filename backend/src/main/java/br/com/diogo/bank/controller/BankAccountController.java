package br.com.diogo.bank.controller;

import br.com.diogo.bank.domain.BankAccount;
import br.com.diogo.bank.domain.User;
import br.com.diogo.bank.enums.BankAccountMessages;
import br.com.diogo.bank.exceptions.BankAccountException;
import br.com.diogo.bank.service.BankAccountService;
import br.com.diogo.bank.service.UserService;
import br.com.diogo.bank.util.ResourcesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/bank-accounts")
public class BankAccountController {

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<BankAccount>> index(Pageable pageable, @RequestParam("q") Optional<String> q) {
        Page<BankAccount> page = this.bankAccountService.findByAccountNumber(pageable, q);
        return ResponseEntity.ok()
                .headers(ResourcesUtils.addPaginationHeader(page))
                .body(page.getContent());
    }

    @PostMapping()
    public ResponseEntity<?> save(@RequestBody Map<String, Object> payload) {
        try {
            Double balance = Double.valueOf(String.valueOf(payload.get("balance")));
            String accountNumber = String.valueOf(payload.get("accountNumber"));
            User user = this.userService.getUserByCpf(String.valueOf(payload.get("cpf")));

            if(user == null) {
                user = this.userService.create(payload);
            }

            BankAccount bankAccount = this.bankAccountService.validateAndSave(new BankAccount(user, balance, accountNumber));

            Map<String, Object> result = new HashMap<>();
            result.put("bankAccount", bankAccount);
            result.put("message", BankAccountMessages.SUCCESSFUL_CREATED.label);

            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (BankAccountException bankAccountException) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, bankAccountException.getMessage());
        }
    }

    @PatchMapping("withdraw/{id}")
    public ResponseEntity<?> withdraw(@PathVariable Long id, @RequestBody Map<String, Object> payload) {

        BankAccount bankAccount = this.getBankAccountByIdOr404(id);

        try {
            Double parsedAmount = Double.valueOf(String.valueOf(payload.get("amount")));
            BankAccount updated = this.bankAccountService.withdraw(bankAccount, parsedAmount);

            Map<String, Object> result = new HashMap<>();
            result.put("bankAccount", updated);
            result.put("message", BankAccountMessages.SUCCESSFUL_WITHDRAW.label);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (BankAccountException bankAccountException) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, bankAccountException.getMessage());
        }
    }

    @PatchMapping("deposit/{id}")
    public ResponseEntity<?> deposit(@PathVariable Long id, @RequestBody Map<String, Object> payload) {

        BankAccount bankAccount = this.getBankAccountByIdOr404(id);

        Double parsedAmount = Double.valueOf(String.valueOf(payload.get("amount")));
        BankAccount updated = this.bankAccountService.deposit(bankAccount, parsedAmount);

        Map<String, Object> result = new HashMap<>();
        result.put("bankAccount", updated);
        result.put("message", BankAccountMessages.SUCCESSFUL_DEPOSIT.label);

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @PutMapping("transfer/{id}")
    public ResponseEntity<?> transfer(@PathVariable Long id, @RequestBody Map<String, Object> payload) {

        Double parsedAmount = Double.valueOf(String.valueOf(payload.get("amount")));
        Long incomingBankAccountId = Long.valueOf(String.valueOf(payload.get("incomingBankAccountId")));

        BankAccount outgoingBankAccount = this.getBankAccountByIdOr404(id);
        BankAccount incomingBankAccount = this.getBankAccountByIdOr404(incomingBankAccountId);

        try {
            this.bankAccountService.transfer(outgoingBankAccount, incomingBankAccount, parsedAmount);

            Map<String, Object> result = new HashMap<>();
            result.put("message", BankAccountMessages.SUCCESSFUL_TRANSFER.label);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (BankAccountException bankAccountException) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, bankAccountException.getMessage());
        }
    }

    private BankAccount getBankAccountByIdOr404(Long id) {
        return this.bankAccountService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma conta encontrada"));
    }
}
