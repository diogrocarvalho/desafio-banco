package br.com.diogo.bank.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "groups")
public class Group implements Serializable {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "name")
	private String name;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
			name = "groups_authorities",
			joinColumns = @JoinColumn(
					name = "group_id",
					referencedColumnName = "id"
			),
			inverseJoinColumns = @JoinColumn(
					name = "authority_id",
					referencedColumnName = "id"
			)
	)
	private List<Authority> authorities;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Authority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(List<Authority> authorities) {
		this.authorities = authorities;
	}
	
}
