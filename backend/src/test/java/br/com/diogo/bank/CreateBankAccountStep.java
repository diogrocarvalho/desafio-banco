package br.com.diogo.bank;

import br.com.diogo.bank.domain.BankAccount;
import br.com.diogo.bank.repository.BankAccountRepository;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;


public class CreateBankAccountStep {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    private JSONObject payload;
    private JSONObject successResponse;
    private String errorMessage;


    @Dado("que seja solicitada a criação de uma nova conta com os seguintes valores")
    public void queSejaSolicitadaACriacaoDeUmaNovaContaComOsSeguintesValores(DataTable table) throws Exception {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);

        for (Map<String, String> columns : rows) {
            this.payload = new JSONObject();
            this.payload.put("balance", columns.get("Saldo"));
            this.payload.put("name", columns.get("Nome"));
            this.payload.put("cpf", columns.get("Cpf"));
        }
    }

    @Quando("for enviada a solicitação de criação de nova conta")
    public void forEnviadaASolicitacaoDeCriacaoDeNovaConta() throws Exception {

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/bank-accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.payload.toString())
                .accept(MediaType.APPLICATION_JSON))
                .andDo(MockMvcResultHandlers.print())
                .andReturn();

        int status = result.getResponse().getStatus();

        if (status == HttpStatus.BAD_REQUEST.value()) {
            this.errorMessage = result.getResponse().getErrorMessage();
        } else if (status == HttpStatus.CREATED.value()) {
            String successResp = result.getResponse().getContentAsString();
            this.successResponse = new JSONObject(successResp);
        }
    }

    @Então("deverá ser apresentada a seguinte mensagem de erro {string}")
    public void deveraSerApresentadaASeguinteMensagemDeErro(String message) {
        assertEquals(message, this.errorMessage);
    }

    @Então("deverá ser retornado o número da conta criada")
    public void deveraSerRetornadoONumeroDaContaCriada() throws JSONException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        BankAccount bankAccount = objectMapper
                .readValue(this.successResponse.get("bankAccount").toString(), BankAccount.class);

        assertNotNull(bankAccount.getAccountNumber());
    }

    @E("deverá ser apresentada a seguinte mensagem {string}")
    public void deveraSerApresentadaASeguinteMensagem(String message) throws JSONException {
        assertEquals(message, this.successResponse.get("message"));
    }

    @After
    public void clearAll() {
        this.bankAccountRepository.deleteAll();
    }
}
