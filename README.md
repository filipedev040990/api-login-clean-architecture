# LOGIN CLEAN ARCHITECTURE
API simples de login para aplicação dos conceitos de arquitetura limpa.

## Testando a API
* Clone o projeto
* Altere as variáveis do arquivo src/infra/config.ts
* Acesse http://localhost:3000/api/authenticate (aqui você informa a porta configurada no passo anterior)
### Método: POST

`{
	"email": "teste@email.com",
	"password": "123456789"
}`

## Repositorio In Memory
Esta API usa para testes um repositório In Memory localizado em src/infra/db/repositories

## Comandos úteis
`npm run start` => inicia a aplicação


`npm run test:verbose` => Executa testes exibindo todas as informações


`npm run test:unit` => Executa somente testes unitários que estão em desenvolvimento


`npm run test:ci` => Executa todos os testes e faz a análise de cobertura de testes

## Princípios aplicados
<ul>
    <li>Single Responsability Principle(SRP)</li>
    <li>Open Closed Principle(OCP)</li>
    <li>Liskov Substitution Principle(LSP)</li>
    <li>Interface Segregation Principle(ISP)</li>
    <li>Dependency Inversion Principle(DIP)</li>
    <li>Don't Repeat Yourself(DRY)</li>
    <li>Composition Over Inheritance</li>
    <li>Small Commits</li>
</ul>

## Bibliotecas e ferramentas utilizadas
<ul>
    <li>NPM</li>
    <li>Typescript</li>
    <li>Git</li>
    <li>Docker</li>
    <li>Jest</li>
    <li>Bcrypt</li>
    <li>JsonWebToken</li>
    <li>Validator</li>
    <li>Express</li>
    <li>Husky</li>
    <li>Lint Staged</li>
    <li>Eslint</li>
    <li>Standard Javascript Style</li>
    <li>Nodemon</li>
</ul>

