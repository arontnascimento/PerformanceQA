# Instruções para a execução do script

## Pré requisitos

- Instalar o java JRE de acordo com o que é esperado para a versão do jmeter escolhida
- Instalar o jmeter 5.5 ou superior
- Realizar o clone do repositório


## Como executar por linha de comando

- Navegue para o diretório onde o repositório foi clonado
- Verifique a necessidade de alterar as configurações do script ( requisições, usuários, duração do teste, etc )
- Comando para execução (**)jmeter -n -t SCRIPT_DesafioPerformance_Carga_v1.jmx -l report.jtl -o html_report
