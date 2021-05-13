package br.com.diogo.bank.service;

import br.com.diogo.bank.domain.User;
import br.com.diogo.bank.enums.BankAccountMessages;
import br.com.diogo.bank.exceptions.BankAccountException;
import br.com.diogo.bank.repository.UserRepository;
import br.com.diogo.bank.util.CheckCPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(){}

    public User create(User user) {
        String password = user.getPassword();
        if(password != null) {
            user.setPassword(this.encodePassword(password));
        }
        return this.userRepository.save(user);
    }

    public User update(User currentUser, User updatedUser) {
        currentUser.setName(updatedUser.getName());
        return this.userRepository.save(currentUser);
    }

    public String encodePassword(String password) {
        return this.passwordEncoder.encode(password);
    }

    public User changePassword(User u, Map<String,?> map) {
        u.setPassword(this.encodePassword(String.valueOf(map.get("password"))));
        return this.userRepository.save(u);
    }

    public Page<User> findByNameOrUsername(Pageable pageable, Optional<String> q) {
        String s = "";
        if(q.isPresent()) {
            s = q.get();
        }
        return this.userRepository.findByNameOrUsername(pageable, "%" + s + "%");
    }

    public User getUserByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public User create(Map<String, Object> payload) throws BankAccountException {
        String cpf = String.valueOf(payload.get("cpf"));
        String name = String.valueOf(payload.get("name"));

        if( cpf.equals("null") || cpf.isEmpty()) {
            throw new BankAccountException(BankAccountMessages.NULL_CPF);
        } else if (!CheckCPF.isCPF(cpf)) {
            throw new BankAccountException(BankAccountMessages.INVALID_CPF);
        }

        if( name.equals("null") || name.isEmpty() ) {
            throw new BankAccountException(BankAccountMessages.INVALID_NAME);
        }

        User user = new User(name, "123456", cpf, this.getCustomUserName(name));
        return this.create(user);

    }

    public String getCustomUserName(String name) {
        name = name.replaceAll("[^a-zA-Z]", " ").replaceAll("\\s", "");
        return name + "@test.com".toLowerCase(Locale.ROOT);
    }

    public User getUserByCpf(String cpf) {
        return this.userRepository.findByCpf(cpf);
    }
}
