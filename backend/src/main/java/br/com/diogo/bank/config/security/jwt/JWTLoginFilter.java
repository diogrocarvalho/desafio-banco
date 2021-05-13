package br.com.diogo.bank.config.security.jwt;

import org.springframework.boot.json.BasicJsonParser;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StreamUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class JWTLoginFilter extends AbstractAuthenticationProcessingFilter {
	
	private final static String USERNAME_FIELD = "username";
	
	private final static String PASSWORD_FIELD = "password";
	
	private TokenAuthenticationService tokenAuthenticationService;
	
	public JWTLoginFilter(String url, AuthenticationManager authManager, TokenAuthenticationService tokenAuthenticationService) {
	    super(new AntPathRequestMatcher(url));
	    super.setAuthenticationManager(authManager);
	    this.tokenAuthenticationService = tokenAuthenticationService;
	}
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
		String jsonString = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
	    Map<String, Object> jsonMap = new BasicJsonParser().parseMap(jsonString);
	    return getAuthenticationManager().authenticate(
	            new UsernamePasswordAuthenticationToken(
	            		jsonMap.get(USERNAME_FIELD),
	            		jsonMap.get(PASSWORD_FIELD)
	            )
	    );
	}
	
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication auth) throws IOException, ServletException {
		this.tokenAuthenticationService.addAuthentication(response, auth.getName());
	}
    
}