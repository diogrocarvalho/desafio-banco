package br.com.diogo.bank.repository;

import br.com.diogo.bank.domain.BankAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
	@Query("SELECT ba FROM BankAccount ba JOIN User u on u.cpf = :cpf")
	Page<BankAccount> findByUserCpf(Pageable pageable, String cpf);

	Page<BankAccount> findByAccountNumberContains(Pageable pageable,String accountNumber);
}