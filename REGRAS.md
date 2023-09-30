## APP 

ClinicMed 


## RFs (Requisitos funcionais) 

- [x] Deve ser possível cadastrar um usuário
- [x] Deve se autenticar
- [x] Deve ser possível visualizar o perfil do usuário cadastrado

### Medicos
- [ ] Deve ser possível cadastrar um médico
  ->      Nome
          E-mail
          Telefone
          CRM
          Especialidade (Ortopedia, Cardiologia, Ginecologia ou Dermatologia)
          Endereço completo (logradouro, número, complemento, bairro, cidade, UF e CEP);

- [ ] Deve ser possível listar os médicos cadastrados;
- [ ] Deve ser possível atualizar os dados cadastrais dos médicos;
- [ ] Deve ser possível a exclusão de médicos.

### Pacientes
- [ ] Deve ser possível cadastrar um paciente
    ->    Nome
          E-mail
          Telefone
          CPF
          Endereço completo (logradouro, número, complemento, bairro, cidade, UF e CEP);

- [ ] Deve ser possível listar os pacientes cadastrados;
- [ ] Deve ser possível atualizar os dados cadastrais dos pacientes;
- [ ] Deve ser possível a exclusão de pacientes.

### Consultas
- [ ] O sistema deve permitir um agendamento de consulta;
    ->  Para agendamento de consulta será necessário ao menos um paciente, um médico, data e hora da consulta

- [ ] O sistema deve permitir um cancelamento de consulta.
    ->  Para cancelamento de consulta é necessário a consulta a ser cancelada e o motivo 




## RNs (Regras de negócio) 

- [ ] O usuário não poderá se cadastrar com um Login já utilizado


- [ ] Para cadastro de médicos todos os campos devem ser obrigatórios, exceto número e complemento do endereço;
- [ ] Não é permitido a mudança do e-mail, CRM, e especialidade do médico;
- [ ] A exclusão do médico não deve apagar os dados do médico, mas sim torná-lo 'inativo' no sistema. 


- [ ] Para cadastro de pacientes todos os campos devem ser obrigatórios, exceto número e complemento do endereço;
- [ ] Não é permitido a mudança do e-mail e CPF do paciente;
- [ ] A exclusão do paciente não deve apagar os dados do médico, mas sim torná-lo 'inativo' no sistema. 

- [ ] O horário de funcionamento da clínica é de segunda a sábado, das 07:00 às 19:00;
- [ ] As consultas tem duração fixa de 1 hora;
- [ ] As consultas devem ser agendadas com antecedência mínima de 30 minutos;
- [ ] Não permitir o agendamento de consultas com pacientes inativos no sistema;
- [ ] Não permitir o agendamento de consultas com médicos inativos no sistema;
- [ ] Não permitir o agendamento de mais de uma consulta no mesmo dia para um mesmo paciente;
- [ ] Não permitir o agendamento de uma consulta com um médico que já possui outra consulta agendada na mesma data/hora;
- [ ] A escolha do médico é opcional, sendo que nesse caso o sistema deve escolher aleatoriamente algum médico disponível na data/hora preenchida.

- [ ] É obrigatório informar o motivo do cancelamento da consulta, dentre as opções: paciente desistiu, médico cancelou ou outros;
- [ ] Uma consulta somente poderá ser cancelada com antecedência mínima de 24 horas.




## RNFs (Requisitos não funcionais)
- [x] A senha do usuário deve está criptografada;
- [ ] Os dados devem está persistidos em um banco dados PostgreSQL
- [ ] O usuário deve ser indentificado por um JWT

- [ ] A listagem de médicos deverá trazer apenas 10 registros por página;
- [ ] A listagem deverá ser ordenada pelo nome do médico, de maneira crescente;


- [ ] A listagem de pacientes deverá trazer apenas 10 registros por página;
- [ ] A listagem deverá ser ordenada pelo nome do paciente, de maneira crescente;