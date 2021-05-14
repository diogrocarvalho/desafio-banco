package br.com.diogo.bank;

import br.com.diogo.bank.domain.BankAccount;
import br.com.diogo.bank.domain.User;
import br.com.diogo.bank.exceptions.BankAccountException;
import br.com.diogo.bank.repository.BankAccountRepository;
import br.com.diogo.bank.service.BankAccountService;
import br.com.diogo.bank.service.UserService;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.After;
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


public class WithdrawBankAccountStep {

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
    private String errorMessage;


    @Dado("que existam as seguintes contas")
    public void queExistamAsSeguintesContas(DataTable table) throws JSONException, BankAccountException {
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

    @Dado("que seja solicitado um saque de {string}")
    public void queSejaSolicitadoUmSaqueDe(String amount) throws JSONException {
        this.payload = new JSONObject();
        this.payload.put("amount", amount);
    }

    @Quando("for executada a operação de saque")
    public void forExecutadaAOperacaoDeSaque() throws Exception {
        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders.patch("/bank-accounts/withdraw/" + this.bankAccount.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.payload.toString())
                .accept(MediaType.APPLICATION_JSON))
                .andDo(MockMvcResultHandlers.print())
                .andReturn();

        int status = result.getResponse().getStatus();

        if (status == HttpStatus.BAD_REQUEST.value()) {
            this.errorMessage = result.getResponse().getErrorMessage();
        } else if (status == HttpStatus.OK.value()) {
            String successResp = result.getResponse().getContentAsString();
            this.successResponse = new JSONObject(successResp);
        }
    }

    @Então("deverá ser apresentada a seguinte mensagem de erro em saque {string}")
    public void deveraSerApresentadaASeguinteMensagemDeErroEmSaque(String message){
        assertEquals(message, this.errorMessage);
    }

    @E("o saldo da conta para saque {string} deverá ser de {string}")
    public void oSaldoDaContaParaSaqueDeveraSerDe(String accountNumber, String newBalance) {

        Optional<BankAccount> bankAccount = this.bankAccountService.findById(this.bankAccount.getId());

        assertTrue(bankAccount.isPresent());
        assertEquals(accountNumber, bankAccount.get().getAccountNumber());
        assertEquals(Double.valueOf(newBalance), bankAccount.get().getBalance());

    }

    @Então("deverá ser apresentada a seguinte mensagem de sucesso em saque {string}")
    public void deveraSerApresentadaASeguinteMensagemDeSucessoEmSaque(String message) throws JSONException {
        assertEquals(message, this.successResponse.get("message"));
    }

    @After
    public void clearAll() {
        this.bankAccountRepository.deleteAll();
    }
}
