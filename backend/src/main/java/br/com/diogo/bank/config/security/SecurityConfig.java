package br.com.diogo.bank.config.security;

import br.com.diogo.bank.config.security.jwt.JWTAuthenticationFilter;
import br.com.diogo.bank.config.security.jwt.JWTLoginFilter;
import br.com.diogo.bank.config.security.jwt.TokenAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	
    @Value("${token.expiration.in.milliseconds}")
    private Long expirationTime;
    
    @Value("${token.private.key}")
    private String privateKey;
    
	@Override
	protected void configure(AuthenticationManagerBuilder auth) {
	    auth.authenticationProvider(authenticationProvider());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.headers().frameOptions().sameOrigin()
		    .and()
		  .csrf()
		    .disable()
		  .cors()
		    .and()
		  .sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			.and()
		  .authorizeRequests()
		    .antMatchers(HttpMethod.POST, "/login").permitAll()
		    .antMatchers(HttpMethod.GET, "/h2/*").permitAll()
		    .antMatchers(HttpMethod.POST, "/h2/*").permitAll()
		    .antMatchers(HttpMethod.GET, "/bank-accounts*").permitAll()
		    .antMatchers(HttpMethod.POST, "/bank-accounts**").permitAll()
		    .antMatchers(HttpMethod.PATCH, "/bank-accounts/**").permitAll()
		    .antMatchers(HttpMethod.PUT, "/bank-accounts/**").permitAll()
			.antMatchers(HttpMethod.POST, "/users").permitAll()
			.antMatchers(HttpMethod.GET, "/users").permitAll()
		    .anyRequest().authenticated()
		    .and()
			.addFilterBefore(new JWTLoginFilter("/login", authenticationManager(), tokenAuthenticationService()),
			        UsernamePasswordAuthenticationFilter.class)
			.addFilterBefore(new JWTAuthenticationFilter(this.customUserDetailsService, tokenAuthenticationService()),
			        UsernamePasswordAuthenticationFilter.class);
	}
	
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration configuration = new CorsConfiguration().applyPermitDefaultValues();
        configuration.setAllowCredentials(true);
		configuration.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "HEAD", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Content-Disposition", "X-Total-Count"));
        
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
	
	@Bean
	public TokenAuthenticationService tokenAuthenticationService() {
		return new TokenAuthenticationService(this.expirationTime, this.privateKey);
	}
	
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        final DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(this.customUserDetailsService);
        authProvider.setPasswordEncoder(encoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder encoder() {
        final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder;
    }
	
}
