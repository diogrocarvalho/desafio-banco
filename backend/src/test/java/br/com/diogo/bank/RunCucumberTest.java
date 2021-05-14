package br.com.diogo.bank;


import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import io.cucumber.spring.CucumberContextConfiguration;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

@AutoConfigureMockMvc
@SpringBootTest
@CucumberContextConfiguration
@ContextConfiguration(classes = Application.class)
@RunWith(Cucumber.class)
@CucumberOptions(
        features = "classpath:br/com/diogo/bank/features",
        plugin = {"pretty"})
public class RunCucumberTest {
}
