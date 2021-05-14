# desafio-banco
Projeto para o desafio da CAST

Passos para rodar o projeto:

***Frontend***

Acessar o diretório ./frontend

Executar os seguintes comandos:

```
$ npm install
$ ng serve
```

Acessar a aplicação via browser no endereço http://localhost:4200

***Backend***

Acessar o diretório ./backend

Executar o seguinte comando:

```
 $ mvn spring-boot:run
```

***Testes***

Os testes possuem as seguintes tags:

```
@CriarContaTeste
@DepositoTeste
@TransferenciaTeste
@SaqueTeste
```

Acessar o diretório ./backend

Executar o seguinte comando:

```
 $ mvn test
```

Se desejar executar um teste por tag específica (os testes de Transferência, por exemplo):

```
mvn test -Dcucumber.filter.tags="@TransferenciaTeste"

```

