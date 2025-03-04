# 📌 is.sues Web

## 📖 Visão Geral
O **is.sues Web** é a versão para navegadores do aplicativo **is.sues**, um sistema de gestão de problemas e demandas corporativas. A plataforma permite que empresas organizem tarefas, departamentos e usuários de maneira eficiente, garantindo um fluxo de trabalho produtivo e bem estruturado.

## 🚀 Tecnologias Utilizadas

### **Frontend**
- **Next.js** - Framework baseado em React.js
- **Tailwind CSS** - Framework de estilos para estilização eficiente
- **TypeScript** - Tipagem segura para JavaScript
- **Framer Motion** - Animações fluidas para componentes
- **Axios** - Requisições HTTP para comunicação com a API

### **Backend**
- **Node.js** com **Express**
- **TypeScript**
- **Autenticação JWT**
- **Banco de Dados** PostgreSQL (via Prisma ORM)
- **Cloudinary** para armazenamento de imagens

---

## 📌 Funcionalidades

### **🔐 Autenticação e Segurança**
- Login e Logout seguros com JWT

### **🏢 Gestão Empresarial**
- Criar, visualizar e editar empresas
- Associação de usuários a empresas e departamentos
- Atualização de perfil e foto do usuário

### **📋 Gestão de Issues (Tarefas e Demandas)**
- Criar, visualizar e editar Issues
- Acompanhamento do status das tarefas
- Associação de responsáveis e departamentos

### **📍 Integração com Mapas**
- Localização da empresa
- Atualização da posição via Google Maps

### **📊 Painel Administrativo**
- Gestão de usuários e permissões
- Visualização de relatórios e métricas

---

## 🛠️ Configuração do Projeto

### **📦 Pré-requisitos**
- Node.js (versão 18 ou superior)
- PostgreSQL configurado
- Cloudinary para armazenamento de imagens

### **⚙️ Instalação**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/is.sues-web.git
cd is.sues-web

# Instale as dependências
yarn install # ou npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### **🔧 Rodando o Projeto**
```bash
# Rodar em desenvolvimento
yarn dev
```
O servidor estará disponível em **http://localhost:3000**

---


## 🔧 Configuração do Ambiente

### **🌍 Variáveis de Ambiente**
Crie um arquivo **.env** baseado no **.env.example** e preencha os seguintes valores:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 # URL da API Backend
NEXT_PUBLIC_CLOUDINARY_URL=your-cloudinary-url
```

---

## 🛠️ Contribuição
Contribuições são bem-vindas! Para colaborar:
1. Faça um **fork** do repositório
2. Crie uma nova branch (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'Minha nova feature'`)
4. Faça o push para a branch (`git push origin minha-feature`)
5. Abra um **Pull Request**

---

## 📜 Licença
Este projeto é distribuído sob a licença **MIT**. Sinta-se livre para modificar e distribuir conforme necessário.

**Desenvolvido por Israel Oliveira.**

