# language: pt
@TransferenciaTeste
Funcionalidade: Transferência de valores entre contas

  Cenário de Fundo: Criação das contas
    Dado que existam as seguintes contas para transferência
      | Numero Conta | Saldo  |
      | 123456       | 1000.0 |
      | 654321       | 700.0  |

  Cenário: 01 - Transferência acima do valor máximo por operação
    Dado que seja solicitada um transferência com as seguintes informações
      | Conta do Solicitante | Valor | Conta do Beneficiario |
      | 123456               | 501.0 | 654321                |
    Quando for executada a operação de transferência
    Então deverá ser apresentada a seguinte mensagem de transferencia "Operação de transferência tem um limite máximo de 500 por operação."

#  Cenário: 02 - Transferência acima do valor que o solicitante possui na conta
#    Dado que seja solicitada um transferência com as seguintes informações
#      | Conta do Solicitante | Valor | Conta do Beneficiario |
#      | 654321               | 701.0 | 123456                |
#    Quando for executada a operação de transferência
#    Então deverá ser apresentada a seguinte mensagem de transferencia "Saldo insuficiente para a operação."
#
#  Cenário: 03 - Transferência com sucesso
#    Dado que seja solicitada um transferência com as seguintes informações
#      | Conta do Solicitante | Valor | Conta do Beneficiario |
#      | 123456               | 500.0 | 654321                |
#    Quando for executada a operação de transferência
#    Então deverá ser apresentada a seguinte mensagem de transferencia "Transferência realizada com sucesso!"
#    E o saldo da conta do solicitante "123456" deverá ser de "500.0"
#    E o saldo da conta do beneficiário "654321" deverá ser de "1200.0"