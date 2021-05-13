package br.com.diogo.bank.config.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

@Component
public class TokenAuthenticationService {
	
	private static final String TOKEN_PREFIX = "Bearer";
	
	private static final String AUTHORIZATION_HEADER_STRING = "Authorization";
	
	private static final String ACCESS_CONTROL_EXPOSE_HEADERS_HEADER_STRING = "Access-Control-Expose-Headers";
	
	private Long expirationTime;
	
	private String privateKey;
	
	public TokenAuthenticationService(Long expirationTime, String privateKey) {
		super();
		this.expirationTime = expirationTime;
		this.privateKey = privateKey;
	}
	
	public void addAuthentication(HttpServletResponse response, String username) {

		String JWT = Jwts.builder()
	            .setSubject(username)
	            .setExpiration(new Date(System.currentTimeMillis() + this.expirationTime))
	            .signWith(SignatureAlgorithm.HS512, this.privateKey)
	            .compact();

	    response.setHeader(ACCESS_CONTROL_EXPOSE_HEADERS_HEADER_STRING, AUTHORIZATION_HEADER_STRING);
	    response.addHeader(AUTHORIZATION_HEADER_STRING, TOKEN_PREFIX + " " + JWT);
	}
	
	public String getAuthentication(HttpServletRequest request) {
	    String token = request.getHeader(AUTHORIZATION_HEADER_STRING);
	    
	    String username = null;
	    
	    if (token != null) {
	        username = Jwts.parser()
	                .setSigningKey(this.privateKey)
	                .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
	                .getBody()
	                .getSubject();
	    }
	    
	    return username;
	}
    
}