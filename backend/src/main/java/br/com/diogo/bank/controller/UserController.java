package br.com.diogo.bank.controller;

import br.com.diogo.bank.domain.User;
import br.com.diogo.bank.repository.UserRepository;
import br.com.diogo.bank.service.UserService;
import br.com.diogo.bank.util.ResourcesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // @PreAuthorize("hasRole('ROLE_LIST_USERS')")
    @GetMapping
    public ResponseEntity<List<User>> index(Pageable pageable, @RequestParam("q") Optional<String> q) {
        Page<User> page = this.userService.findByNameOrUsername(pageable, q);
        return ResponseEntity.ok()
                .headers(ResourcesUtils.addPaginationHeader(page))
                .body(page.getContent());
    }

    // @PreAuthorize("hasRole('ROLE_READ_USER')")
    @GetMapping("{id}")
    public ResponseEntity<User> get(@PathVariable("id") Long id) {
        return this.userRepository.findById(id).map(u -> ResponseEntity.ok().body(u)).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody User user) {
        if (this.userRepository.findByUsername(user.getUsername()) != null) {
            Map<String, Object> result = new HashMap<>();
            result.put("errors", "Username already exists.");
            return new ResponseEntity<Map<String, Object>>(result, HttpStatus.CONFLICT);
        }
        User u = this.userService.create(user);
        return new ResponseEntity<>(u, HttpStatus.CREATED);
    }

    // @PreAuthorize("hasRole('ROLE_UPDATE_USER')")
    @PutMapping("{id}")
    public ResponseEntity<User> update(@PathVariable("id") Long id, @RequestBody User user) {
        return this.userRepository.findById(id)
                .map(u -> ResponseEntity.ok().body(this.userService.update(u, user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // @PreAuthorize("hasRole('ROLE_DELETE_USER')")
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        return this.userRepository.findById(id).map(u -> {
            this.userRepository.deleteById(id);

            return ResponseEntity.ok().body(u);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("me")
    public ResponseEntity<?> currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok().body(auth.getPrincipal());
    }

    @PutMapping("/{id}/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> changePassword(@PathVariable("id") Long id, @RequestBody Map<String, ?> map) {
        return this.userRepository.findById(id).map(u ->
           ResponseEntity.ok().body(this.userService.changePassword(u, map))
        ).orElse(ResponseEntity.notFound().build());
    }

}
