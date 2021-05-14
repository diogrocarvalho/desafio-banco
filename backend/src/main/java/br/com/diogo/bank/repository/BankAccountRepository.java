package br.com.diogo.bank.repository;

import br.com.diogo.bank.domain.BankAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
	@Query("SELECT ba FROM BankAccount ba JOIN User u on u.cpf = :cpf")
	Page<BankAccount> findByUserCpf(Pageable pageable, String cpf);

	Page<BankAccount> findByAccountNumberContains(Pageable pageable,String accountNumber);

	@Query("SELECT DISTINCT ba FROM BankAccount ba where ba.accountNumber = :accountNumber")
    BankAccount findByAccountNumber(String accountNumber);

	@Override
	void deleteAll();
}
