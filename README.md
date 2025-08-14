# API Node Nest – H2 (PostgreSQL Mode)

API de exemplo com NestJS usando H2 Database em modo PostgreSQL para fins didáticos. Inclui autenticação JWT, CRUD de usuários e documentação Swagger.

## Requisitos
- Node.js LTS (>= 18)
- npm (ou yarn/pnpm)
- Docker Desktop

## Arquitetura
- NestJS (TypeScript)
- H2 Database 2.1.214 em modo PostgreSQL (porta 5435)
- Driver pg (protocolo/SQL compatível PostgreSQL)
- JWT + Passport
- Swagger/OpenAPI

## Configuração do Banco (Docker)
O projeto inclui um docker-compose para subir o H2 em modo PostgreSQL.

1) Verifique/atualize o docker-compose.yml:

```yaml
version: '3.8'
services:
  h2-database:
    image: openjdk:11-jre-slim
    container_name: h2-db
    ports:
      - "5435:5435"      # PostgreSQL protocol
      # - "8082:8082"   # (opcional) Console Web do H2
    volumes:
      - h2_data:/opt/h2-data
    working_dir: /opt
    command: >
      bash -c "
      apt-get update && apt-get install -y curl &&
      curl -L -o h2.jar https://repo1.maven.org/maven2/com/h2database/h2/2.1.214/h2-2.1.214.jar &&
      java -cp h2.jar org.h2.tools.Server
      -pg -pgAllowOthers -pgPort 5435
      # -web -webAllowOthers -webPort 8082     # (descomente para console)
      -baseDir /opt/h2-data -ifNotExists
      "
volumes:
  h2_data:
```

2) Suba o banco:
```powershell
docker-compose up -d
docker ps
docker logs -f h2-db
```

Você deverá ver algo como:
- “PG server running at pg://0.0.0.0:5435”
- (se habilitado) “Web Console server running at http://0.0.0.0:8082”

## Variáveis de Ambiente (.env)
Crie um arquivo .env na raiz com:

```env
# Database H2 (PostgreSQL mode)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5435
DB_USER=sa
DB_PASSWORD=
DB_NAME=testdb

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development
```

Observações:
- Campo birth_date é do tipo DATE no banco. A API envia/espera “YYYY-MM-DD”.
- Em H2 PG mode, evite recursos específicos de PostgreSQL que não sejam suportados.

## Instalação e Execução
```powershell
# instalar dependências
npm install

# desenvolvimento
npm run start:dev

# produção (build + start)
npm run build
npm run start:prod
```

API:
- Base URL: http://localhost:3000
- Swagger: http://localhost:3000/api

## Autenticação e Usuário Padrão (didático)
- A aplicação possui um usuário admin padrão criado na configuração do database (seed didático).
- Credenciais:
  - email: admin@admin.com
  - senha: Admin123!
- Por ser um projeto de demonstração/estudo, manter o usuário no código-fonte é intencional. Não há fluxo de alteração de senha.

Fluxo:
1) Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"Admin123!"}'
```
2) Use o token JWT retornado no header Authorization:
```
Authorization: Bearer <token>
```

## Endpoints Principais
- POST /auth/login
- GET /users
- GET /users/{id}
- POST /users
- PUT /users/{id}
- DELETE /users/{id}

Consulte o Swagger para contratos completos e exemplos.

## Formatos Importantes
- birthDate: “YYYY-MM-DD”
- cpf: somente dígitos (11 caracteres)

## Troubleshooting
- Banco não conecta:
  - Verifique docker ps e logs: docker logs -f h2-db
  - Confirme .env: DB_HOST=localhost, DB_PORT=5435
  - Porta 5435 livre no host

- Erros de data:
  - Envie birthDate como string “YYYY-MM-DD”.

- Swagger vazio/sem schemas:
  - Garanta que DTOs têm decorators do Swagger (@ApiProperty) e que os controllers referenciam os DTOs com @ApiBody({ type: ... }).
  - Verifique tsconfig com “experimentalDecorators” e “emitDecoratorMetadata”.


## Aviso
Este projeto é voltado à demonstração de tecnologia (NestJS + H2 em modo PostgreSQL). Boas práticas de produção, como gestão segura de segredos, rotação/alteração de senha e RBAC, não estão implementadas