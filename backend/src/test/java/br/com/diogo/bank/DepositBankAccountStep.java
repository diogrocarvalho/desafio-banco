package br.com.diogo.bank;

import br.com.diogo.bank.domain.BankAccount;
import br.com.diogo.bank.domain.User;
import br.com.diogo.bank.exceptions.BankAccountException;
import br.com.diogo.bank.repository.BankAccountRepository;
import br.com.diogo.bank.service.BankAccountService;
import br.com.diogo.bank.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.After;
import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.E;
import io.cucumber.java.pt.Então;
import io.cucumber.java.pt.Quando;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;


public class DepositBankAccountStep {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private UserService userService;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    private JSONObject payload;
    private JSONObject successResponse;
    private BankAccount bankAccount;


    @Dado("que existam as seguintes contas para depósito")
    public void queExistamAsSeguintesContasParaDeposito(DataTable table) throws BankAccountException {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        BankAccount bankAccount = new BankAccount();

        for (Map<String, String> columns : rows) {
            bankAccount.setAccountNumber(columns.get("Numero Conta"));
            bankAccount.setBalance(Double.valueOf(columns.get("Saldo")));
        }

        User user = userService.create(
                new User("Jhon Doe", "123456", "17448936590", "jhondoe@test.com"));
        bankAccount.setUser(user);
        this.bankAccount = bankAccountService.create(bankAccount);
    }

    @E("que seja solicitado um depósito de {string}")
    public void queSejaSolicitadoUmDepositoDe(String amount) throws JSONException {
        this.payload = new JSONObject();
        this.payload.put("amount", amount);
    }

    @Quando("for executada a operação de depósito")
    public void forExecutadaAOperacaoDeDeposito() throws Exception {
        MvcResult result = mockMvc.perform(
                MockMvcRequestBuilders.patch("/bank-accounts/deposit/" + this.bankAccount.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.payload.toString())
                .accept(MediaType.APPLICATION_JSON))
                .andDo(MockMvcResultHandlers.print())
                .andReturn();

        String successResp = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
        this.successResponse = new JSONObject(successResp);
    }

    @Então("deverá ser apresentada a seguinte mensagem de deposito bem sucedido {string}")
    public void shouldShowSuccessMessage(String message) throws JSONException {
        assertEquals(message, this.successResponse.get("message"));
    }

    @E("o saldo da conta {string} deverá ser de {string}")
    public void deveraSerApresentadaASeguinteMensagemDeDepositoBemSucedido(String accountNumber, String newBalance)
            throws JSONException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        BankAccount bankAccount = objectMapper
                .readValue(this.successResponse.get("bankAccount").toString(), BankAccount.class);

        assertEquals(accountNumber, bankAccount.getAccountNumber());
        assertEquals(Double.valueOf(newBalance), bankAccount.getBalance());
    }


    @After
    public void clearAll() {
        this.bankAccountRepository.deleteAll();
    }
}
