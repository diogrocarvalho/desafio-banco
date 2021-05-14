package br.com.diogo.bank;

import br.com.diogo.bank.domain.BankAccount;
import br.com.diogo.bank.domain.User;
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

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TransferBankAccountStep {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private UserService userService;

    JSONObject payload;
    private JSONObject successResponse;

    private String errorMessage;

    BankAccount outgoingBankAccount;
    BankAccount incomingBankAccount;

    Double amount;

    User user ;


    @Dado("que existam as seguintes contas para transferência")
    public void queExistamAsSeguintesContasParTransferencia(DataTable table) throws Exception {

        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        user = userService
                .create(new User("Jhon Doe", "123456", "17448936590", "jhondoe@test.com"));
        for (Map<String, String> columns : rows) {
            BankAccount bankAccount = new BankAccount(
                    user,
                    Double.valueOf(columns.get("Saldo")),
                    columns.get("Numero Conta"));

            if(bankAccountService.findByAccountNumber(columns.get("Numero Conta")) == null) {
                this.bankAccountService.create(bankAccount);
            } else {
                this.bankAccountService.update(bankAccount);
            }
        }
    }

    @Dado("que seja solicitada um transferência com as seguintes informações")
    public void queSejaSolicitadaUmTransferenciaComAsSeguintesInformacoes(DataTable table) {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        System.out.println("Conta do Solicitante: " + rows.get(0).get("Conta do Solicitante"));
        System.out.println(rows.get(0).get("Conta do Beneficiario"));
        this.outgoingBankAccount = bankAccountService.findByAccountNumber(rows.get(0).get("Conta do Solicitante"));
        this.incomingBankAccount = bankAccountService.findByAccountNumber(rows.get(0).get("Conta do Beneficiario"));
        this.amount = Double.valueOf(rows.get(0).get("Valor"));
    }

    @Quando("for executada a operação de transferência")
    public void forExecutadaAOperacaoDeTransferencia() throws Exception {
        this.payload = new JSONObject();
        this.payload.put("amount", this.amount);
        this.payload.put("incomingBankAccountId", this.incomingBankAccount.getId());

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .put("/bank-accounts/transfer/" + this.outgoingBankAccount.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.payload.toString())
                .accept(MediaType.APPLICATION_JSON))
                .andDo(MockMvcResultHandlers.print())
                .andReturn();

        int status = result.getResponse().getStatus();

        if (status == HttpStatus.BAD_REQUEST.value()) {
            this.errorMessage = result.getResponse().getErrorMessage();
        } else if (status == HttpStatus.OK.value()) {
            String successResp = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
            this.successResponse = new JSONObject(successResp);
        }
    }

    @Então("deverá ser apresentada a seguinte mensagem de erro de transferencia {string}")
    public void deveraSerApresentadaASeguinteMensagemDeErroDeTransferencia(String message) {
        assertEquals(message, this.errorMessage);
    }

    @Então("deverá ser apresentada a seguinte mensagem de transferencia {string}")
    public void deveraSerApresentadaASeguinteMensagemDeTransferencia(String message) throws JSONException {
        assertEquals(message, this.successResponse.get("message"));
    }

    @E("o saldo da conta do solicitante {string} deverá ser de {string}")
    public void oSaldoDaContaDoSolicitanteDeveraSerDe(String outgoingBankAccount, String balance) {
        this.outgoingBankAccount = bankAccountService.findByAccountNumber(outgoingBankAccount);
        assertEquals(this.outgoingBankAccount.getBalance(), Double.valueOf(balance));
    }

    @E("o saldo da conta do beneficiário {string} deverá ser de {string}")
    public void oSaldoDaContaDoBeneficiarioDeveraSerDe(String incomingBankAccount, String balance) {
        this.incomingBankAccount = bankAccountService.findByAccountNumber(incomingBankAccount);
        assertEquals(this.incomingBankAccount.getBalance(), Double.valueOf(balance));
    }

    @After
    public void clearAll() {
        this.bankAccountRepository.deleteAll();
    }

}
