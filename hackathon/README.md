# DiagramGuard MVP

Monorepo do MVP do DiagramGuard — um SaaS que gera relatórios STRIDE a partir de diagramas de arquitetura.

## Arquitetura da Solução

+---------------------+         +---------------------------+
|  Lambda 1           |         | Lambda 2                  |
| (Recepção/Tratamento|-------> | Reconhecimento YOLO       |
|  de Imagem)         |         |                           |
+---------------------+         +---------------------------+
         ^                                 |
         |                                 v
+---------------------+         +---------------------------+
|    Frontend (BFF)   |<--------|  Salva relatório no S3    |
|     (Next.js)       |         +-----------+---------------+
+---------------------+                     |
                                            v
                                 +---------------------+
                                 |      Amazon S3      |
                                 +---------------------+

- **Lambda 1:** Recebe e trata a imagem enviada pelo frontend (validação, pré-processamento, etc).
- **Lambda 2:** Executa o modelo YOLO para reconhecimento dos elementos do diagrama e salva o relatório final no Amazon S3.
- **Frontend:** Interface Next.js para upload e visualização dos resultados (buscando o relatório no S3).
- **Amazon S3:** Armazena os relatórios STRIDE gerados para consulta e download.

## Estrutura do Projeto

```
diagram-guard/
├─ package.json          # npm-workspaces root
├─ README.md
├─ .eslintrc.cjs
├─ .prettierrc
├─ jest.config.cjs
├─ tsconfig.base.json
├─ frontend/             # Next.js 14 (App Router) + TypeScript
├─ infra/                # AWS SAM (Lambda Python)
└─ python_code/          # Código Python das Lambdas (ver descrição abaixo)
```

### python_code/
Diretório para scripts Python das Lambdas:
- Recepção e tratamento de imagens
- Reconhecimento de diagramas com YOLO

Adicione aqui seus scripts, módulos e notebooks relacionados ao processamento e reconhecimento de imagens. Documente cada novo arquivo ou subdiretório criado.

## Pré-requisitos

- Node.js 18+
- AWS CLI + SAM CLI
- Docker (para emular a Lambda)

## Instalação

```bash
# clonar repositório
git clone <repo-url>
cd diagram-guard
npm install            # instala dependências raiz (dev only)
# instala workspaces
npm --workspace frontend install
```

## Ambiente local

```bash
# 1. Emular Lambda localmente
cd infra
sam build && sam local start-api -p 3001

# 2. Rodar frontend
cd ../frontend
npm run dev
```

Acesse `http://localhost:3000` e faça upload de uma imagem.

## Testes

```bash
npm test
```

## Deploy

### Lambda (AWS)
```bash
cd infra
sam deploy --guided   # informe variáveis e segredos OpenAI
```

## Componentes de Treinamento (YOLO)

> Adicione aqui detalhes sobre datasets, scripts de treinamento, checkpoints, configurações e demais componentes usados para treinar o modelo YOLO.

---

```

### Frontend (Vercel)
```bash
npm run deploy:vercel # requer Vercel CLI autenticado
```