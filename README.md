# Instruções para a execução do script

## Pré requisitos

- Instalar o java JRE de acordo com o que é esperado para a versão do jmeter escolhida
- Instalar o jmeter 5.5 ou superior
- Realizar o clone do repositório


## Como executar por linha de comando

- Navegue para o diretório onde o repositório foi clonado
- Verifique a necessidade de alterar as configurações do script ( requisições, usuários, duração do teste, etc )
- Comando para execução **jmeter -n -t SCRIPT_DesafioPerformance_Carga_v1.jmx -l report.jtl -o html_report**


## Relatórios

- Os relatórios do teste de carga e pico estão na raiz do repositório, respectivamente **report-teste-carga** e **report-teste-pico**
- Os relatórios de análise conclusiva dos testes também estão na raiz do repositório, respectivamente **Relatório-conclusivo-teste-pico.pdf** e **Relatório-conclusivo-teste-Carga.pdf**

## Informações adicionais

- O projeto possui uma **pipeline** que é acionada ao realizar um push na branch main
- O teste írá rodar em um **container** e o relatório será disponibilizado.
- Para acessar o relatório, vá até **Actions**, clique na execução mais recente e posteriormente verifique o relatório que está em **Artifacts**
