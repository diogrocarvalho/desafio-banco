package br.com.diogo.bank;

import br.com.diogo.bank.domain.BankAccount;
import br.com.diogo.bank.domain.User;
import br.com.diogo.bank.exceptions.BankAccountException;
import br.com.diogo.bank.service.BankAccountService;
import br.com.diogo.bank.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.E;
import io.cucumber.java.pt.Então;
import io.cucumber.java.pt.Quando;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


public class TransferBankAccountStep {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private UserService userService;

    private JSONObject payload;
    private JSONObject successResponse;

    private String errorMessage;

    @Dado("que existam as seguintes contas para transferência")
    public void createBankAccount(DataTable table) throws JSONException, BankAccountException {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        BankAccount bankAccount = new BankAccount();
        User user = userService.create(new User("Jhon Doe", "123456", "17448936590", "jhondoe@test.com"));

        for (Map<String, String> columns : rows) {
            bankAccount.setAccountNumber(columns.get("Numero Conta"));
            bankAccount.setBalance(Double.valueOf(columns.get("Saldo")));
            bankAccount.setUser(user);

            this.bankAccountService.create(bankAccount);
        }

    }

    @Dado("que seja solicitada um transferência com as seguintes informações")
    public void queSejaSolicitadaUmTransferênciaComAsSeguintesInformações() {
    }

    @Quando("for executada a operação de transferência")
    public void forExecutadaAOperaçãoDeTransferência() {
    }

    @Então("deverá ser apresentada a seguinte mensagem de transferencia {string}")
    public void deveráSerApresentadaASeguinteMensagemDeTransferencia(String arg0) {
    }

    @E("o saldo da conta do solicitante {string} deverá ser de {string}")
    public void oSaldoDaContaDoSolicitanteDeveráSerDe(String arg0, String arg1) {
    }

    @E("o saldo da conta do beneficiário {string} deverá ser de {string}")
    public void oSaldoDaContaDoBeneficiárioDeveráSerDe(String arg0, String arg1) {
    }
}
