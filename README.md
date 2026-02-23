# 🚀 LoadWise - Gestão de Contentores e Load Balancing

Este projeto foi desenvolvido no âmbito da **Prova de Aptidão Profissional (PAP)** para o curso de Gestão e Programação de Sistemas Informáticos. A aplicação demonstra uma infraestrutura de microserviços utilizando **Docker**, um balanceador de carga **NGINX** e um dashboard em **React** para monitorização de performance e alta disponibilidade.

---

## 🛠️ Configuração e Instalação (Novos Ambientes)

Se estás a configurar este projeto noutro computador, segue estes passos por ordem:

### 1. Preparar o Frontend

Navega até à pasta raiz do projeto e instala as dependências necessárias do Node.js:
```bash
npm install
```

### 2. Levantar a Infraestrutura Docker

Certifica-te de que o **Docker Desktop** está a correr. Este comando irá construir as imagens e iniciar os serviços de backend e o Load Balancer:
```bash
docker-compose up -d --build
```

### 3. Iniciar o Dashboard

Após os contentores estarem ativos, inicia o servidor de desenvolvimento do React:
```bash
npm start
```

O dashboard abrir-se-á automaticamente em [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Funcionalidades Implementadas

- **Auto-start** — Todos os serviços (Backend A, Backend B e Nginx) estão configurados com políticas de `restart: always`, iniciando automaticamente com o sistema operativo.
- **IP Dinâmico** — O frontend deteta automaticamente o endereço do servidor através de `window.location.hostname`, eliminando a necessidade de configurações manuais de rede.
- **Load Balancing** — Distribuição de tráfego inteligente via Nginx (Round-Robin).
- **Monitorização de Latência** — Cálculo em tempo real do tempo de resposta (RTT) entre cliente e servidor.

---

## 🔍 Comandos Úteis de Diagnóstico

| Ação | Comando |
|---|---|
| Listar serviços ativos | `docker ps` |
| Ver logs do Load Balancer | `docker logs load_balancer` |
| Parar toda a infraestrutura | `docker-compose down` |
| Reiniciar um serviço | `docker-compose restart <serviço>` |
| Ver logs em tempo real | `docker-compose logs -f` |

---

## 📋 To Do

- [ ] **IP Automatico** — Quando o react começa verificar o ip e iniciar as coisas nesse ip automaticamente, sem ter de alterar consuante o novo ip no proprio codigo
- [ ] **Containers Auto-Start** - Os containers iniciam sozinho sem ter de inicia-los manualmente
- [ ] **Frontend UI Upgrade** - Melhorar o UI do Front-end, e separar em 2 partes, uma parte para simulação dos serviços e a outra parte para controlo e verificação dos serviços
- [ ] **Padrão MVC/MVP** - Modelos para organizar a aplicação
- [ ] **Classe para Servidores** - Criar uma classe para poupar linhas de codigo para iniciar os 2 servidores

---

## 🧑‍💻 Autor

Desenvolvido para a **PAP — Prova de Aptidão Profissional**  
Curso: Gestão e Programação de Sistemas Informáticos
