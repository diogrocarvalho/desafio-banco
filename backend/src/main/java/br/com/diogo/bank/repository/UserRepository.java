package br.com.diogo.bank.repository;

import br.com.diogo.bank.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
	

	User findByUsername(String username);

	User findByName(@Param("name") String username);

	@Query("SELECT u FROM User u WHERE u.name LIKE :q OR u.username LIKE :q")
	Page<User> findByNameOrUsername(Pageable pageable, String q);

    User findByCpf(String cpf);
}