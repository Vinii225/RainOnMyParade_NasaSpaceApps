# 🚀 Como Visualizar a Main Page - Stellar Stories

## 📋 Opção 1: Abrir Diretamente no Navegador (MAIS FÁCIL)

**Não precisa instalar nada!** Basta abrir o arquivo HTML no navegador:

### Windows:
1. Navegue até a pasta: `C:\Users\vinic\OneDrive\Documentos\RainOnMyParade\frontend\`
2. Clique duas vezes no arquivo **`index.html`**
3. A página abrirá no seu navegador padrão! 🎉

### Ou via PowerShell:
```powershell
cd C:\Users\vinic\OneDrive\Documentos\RainOnMyParade\frontend
start index.html
```

## 🎨 O Que Você Vai Ver

### ✨ Principais Seções da Main Page:

1. **Hero Section** 
   - Título animado com gradiente
   - Planeta Terra flutuando com erupções solares
   - Botões de navegação interativos
   - Fundo com estrelas animadas

2. **Estatísticas Interativas**
   - Contador animado de dados espaciais
   - 150 milhões de km até o Sol
   - 8 minutos para a luz chegar
   - 7 bilhões de pessoas impactadas

3. **Seção de Histórias** (6 histórias disponíveis)
   - 🌟 **A Jornada de Flarinha** - Perspectiva de uma erupção solar
   - 👨‍🚀 **Luna: Astronauta Corajosa** - Vida na Estação Espacial
   - 🌾 **GPS do Agricultor José** - Impacto na agricultura
   - ✈️ **Piloto nas Nuvens** - Rotas aéreas e radiação
   - 📸 **Caçador de Auroras** - Fotografia de auroras boreais
   - ⚡ **Guardiões da Rede Elétrica** - Proteção de infraestrutura

4. **Sobre Clima Espacial**
   - Explicação educativa
   - Diagrama Sol-Terra animado
   - Lista de fenômenos (Erupções, CME, Vento Solar)

5. **Clima Espacial em Tempo Real**
   - Dados da NASA DONKI API
   - Atividade solar atual
   - Última erupção solar registrada
   - Risco de tempestades
   - Previsão de auroras

6. **Footer**
   - Links úteis da NASA e NOAA
   - Informações do projeto

## 🎮 Recursos Interativos

- **Animações suaves** em scroll
- **Efeito de hover** nos cards de histórias
- **Estrelas piscando** no fundo
- **Terra flutuante** com atmosfera
- **Erupções solares** animadas
- **Contador de estatísticas** ao rolar a página
- **Navbar que desaparece** ao rolar para baixo
- **Easter egg** - Clique 5 vezes no ícone do Sol ☀️

## 📡 Dados em Tempo Real

A página se conecta automaticamente à API da NASA para buscar:
- Erupções solares recentes (últimos 30 dias)
- Nível de atividade solar
- Previsão de auroras
- Risco de tempestades geomagnéticas

**Nota:** Se a API não responder, dados simulados serão exibidos.

## 🎨 Design & Tecnologias

- **HTML5** puro - Estrutura semântica
- **CSS3** com animações e gradientes
- **JavaScript Vanilla** - Sem frameworks necessários
- **Canvas API** para animação de estrelas
- **Intersection Observer** para animações em scroll
- **Fetch API** para dados da NASA

## 🌈 Paleta de Cores

- **Primary:** `#6366f1` (Azul-violeta)
- **Secondary:** `#8b5cf6` (Roxo)
- **Accent:** `#ec4899` (Rosa)
- **Background:** Gradientes escuros espaciais
- **Text:** Tons de cinza claro

## 📱 Responsivo

A página é totalmente responsiva e funciona em:
- 💻 Desktop (1920px+)
- 💻 Laptop (1200px - 1920px)
- 📱 Tablet (768px - 1200px)
- 📱 Mobile (até 768px)

## 🔧 Personalização

### Alterar a NASA API Key:
Edite o arquivo `script.js`, linha ~200:
```javascript
const apiKey = 'DEMO_KEY'; // Substitua pela sua chave
```

Obtenha sua chave gratuita em: https://api.nasa.gov/

### Modificar Cores:
Edite o arquivo `styles.css`, linhas 1-10 (variáveis CSS):
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... */
}
```

## 🚀 Próximos Passos

Para desenvolver as histórias interativas:
1. Criar páginas individuais para cada história
2. Adicionar ilustrações customizadas
3. Implementar sistema de navegação entre capítulos
4. Adicionar quiz educativo
5. Sistema de progresso do usuário

## 🐛 Resolução de Problemas

### A página não carrega estilos:
- Verifique se `styles.css` está na mesma pasta que `index.html`

### Animações não funcionam:
- Verifique se `script.js` está na mesma pasta que `index.html`
- Abra o Console do navegador (F12) para ver erros

### Dados da NASA não carregam:
- Normal! A API DEMO_KEY tem limite de requisições
- Dados simulados serão exibidos automaticamente

## 📞 Suporte

Este projeto foi criado para o **NASA Space Apps Challenge 2025** - Desafio Stellar Stories.

---

**Divirta-se explorando o clima espacial! ☀️🌍✨**
