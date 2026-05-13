# Loadwise

Sistema de monitorização de balanceamento de carga desenvolvido como projeto PAP. Demonstra containerização com Docker, balanceamento de carga round-robin e observabilidade em tempo real através de um dashboard React.

---

## Arquitetura

```
[Browser]
    |
    | :3000  (npm start)
    v
[Frontend React]
    |
    | :8080  (node balancer.js)
    v
[Balanceador Round-Robin]
   /            \
  / :3001        \ :3002
 v                v
[Service A]    [Service B]
 [Docker]       [Docker]
```

Os dois serviços correm em containers Docker isolados.
O balanceador e o frontend correm localmente com Node.js.

---

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Arranque

### 1. Iniciar os servidores (Docker)

```bash
docker compose up -d
```

Confirmar que estão a correr:

```bash
docker ps
```

Deverás ver `service_a` (porta 3001) e `service_b` (porta 3002) com estado `healthy`.

### 2. Iniciar o balanceador de carga

```bash
node balancer.js
```

Deixa este terminal aberto. O balanceador fica a correr na porta **8080** e distribui os pedidos em round-robin entre os dois serviços.

### 3. Iniciar o dashboard (novo terminal)

```bash
cd frontend/loadwise-dashboard
npm install        # apenas na primeira vez
npm start
```

O browser abre automaticamente em **http://localhost:3000**.

---

## Testar o balanceamento

```bash
# Cada pedido alterna entre Service A e Service B
curl http://localhost:8080/
curl http://localhost:8080/slow
```

---

## Simular falha de servidor

```bash
# Parar o Service B
docker stop service_b

# Após ~10 segundos o dashboard mostra Service B como OFFLINE
# O balanceador redireciona todo o tráfego para Service A automaticamente

# Retomar o Service B
docker start service_b
```

---

## Parar tudo

```bash
# Parar os containers
docker compose down

# Parar o balanceador → Ctrl+C no terminal do balancer.js
# Parar o frontend   → Ctrl+C no terminal do npm start
```

---

## Testes

```bash
cd frontend/loadwise-dashboard
npm test
```

27 testes a cobrir: lógica da API (`computeStats`, `fetchBackendStatus`), componentes (`MetricsCard`, `ServerStatus`) e navegação do dashboard (`App`).

---

## Endpoints dos serviços

| Endpoint      | Descrição                                               |
|---------------|---------------------------------------------------------|
| `GET /`       | Resposta padrão com nome do serviço                     |
| `GET /slow`   | Resposta com delay de 500ms (simula latência elevada)   |
| `GET /cpu`    | Cálculo de primos — Crivo de Eratóstenes (simula CPU)   |
| `GET /health` | Healthcheck usado pelo Docker                           |

---

## Stack Tecnológica

| Camada        | Tecnologia                 |
|---------------|----------------------------|
| Frontend      | React 19                   |
| Balanceador   | Node.js (http nativo)      |
| Backend       | Node.js (http nativo)      |
| Containers    | Docker + Docker Compose    |
| Testes        | Jest + Testing Library     |

---

## Estrutura do Projeto

```
Loadwise/
├── docker-compose.yml          # Orquestra service-a e service-b
├── balancer.js                 # Balanceador round-robin local
├── service-a/
│   ├── Dockerfile
│   ├── .env.example            # Variáveis de ambiente do serviço
│   └── server.js               # Backend Node.js — Service A
├── service-b/
│   ├── Dockerfile
│   ├── .env.example            # Variáveis de ambiente do serviço
│   └── server.js               # Backend Node.js — Service B
└── frontend/loadwise-dashboard/
    └── src/
        ├── api.js              # fetchBackendStatus + computeStats
        ├── App.jsx             # Estado global + routing + polling
        ├── components/
        │   ├── Navbar.jsx
        │   ├── MetricsCard.jsx
        │   ├── ServerStatus.jsx
        │   └── LatencyChart.jsx
        └── pages/
            ├── DashboardPage.jsx
            ├── MetricsPage.jsx
            ├── ServersPage.jsx
            └── LogsPage.jsx
```

---

## Variáveis de Ambiente

Cada serviço suporta as seguintes variáveis (definidas no `docker-compose.yml`):

| Variável       | Padrão      | Descrição                        |
|----------------|-------------|----------------------------------|
| `SERVICE_NAME` | `Service A` | Nome devolvido nas respostas JSON |
| `PORT`         | `3000`      | Porta em que o serviço escuta    |

Ver `.env.example` em cada pasta de serviço.

---

## Conceitos Demonstrados

- **Containerização** — Service A e Service B isolados em containers Docker com healthchecks
- **Balanceamento de carga** — distribuição round-robin com failover automático
- **Alta disponibilidade** — deteção de servidores offline e redirecionamento de tráfego
- **Observabilidade** — latência, P95, débito, taxa de sucesso em tempo real
- **Stress testing** — teste de carga com burst de pedidos simultâneos

---

Desenvolvido para a **PAP — Prova de Aptidão Profissional**
Curso: Gestão e Programação de Sistemas Informáticos
