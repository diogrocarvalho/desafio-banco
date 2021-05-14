package br.com.diogo.bank.config.security.jwt;

import br.com.diogo.bank.config.security.CustomUserDetailsService;
import br.com.diogo.bank.domain.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JWTAuthenticationFilter extends GenericFilterBean {

	private TokenAuthenticationService tokenAuthenticationService;

	private CustomUserDetailsService customUserDetailsService;

	public JWTAuthenticationFilter(CustomUserDetailsService customUserDetailsService, TokenAuthenticationService tokenAuthenticationService) {
		this.tokenAuthenticationService = tokenAuthenticationService;
		this.customUserDetailsService = customUserDetailsService;
	}
	
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {		
	    String username = null;
	    
	    try {
	    	username = this.tokenAuthenticationService.getAuthentication((HttpServletRequest) request);
	    } catch (ExpiredJwtException e) {	    	
	    	((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED);
	    	return;
	    } catch (SignatureException e) {
	    	((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED);
	    	return;
	    } catch (MalformedJwtException e) {
			((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED);
		}
	    
	    Authentication authentication =	null;
	    
	    if (username != null) {        	
		    UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(username);
		    
		    authentication = new UsernamePasswordAuthenticationToken((User) userDetails, null, userDetails.getAuthorities());
	    }
	    
	    SecurityContextHolder.getContext().setAuthentication(authentication);
	    filterChain.doFilter(request,response);
	}
    
}