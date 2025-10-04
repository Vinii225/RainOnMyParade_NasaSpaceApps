# 🌟 Aurelito - Guia Interativo

## Descrição
Aurelito é o personagem guia interativo do Stellar Stories que acompanha os usuários durante toda a navegação pela página, oferecendo dicas, explicações e tornando a experiência mais divertida e educativa.

## Funcionalidades

### 1. **Aparição Flutuante**
- Aurelito aparece no canto inferior direito da tela
- Animação de flutuação suave para dar vida ao personagem
- Design responsivo que se adapta a diferentes tamanhos de tela

### 2. **Balão de Fala Dinâmico**
- Mensagens contextuais baseadas na seção atual da página
- Transições suaves entre mensagens
- Conteúdo educativo e encorajador

### 3. **Mudança de Expressões**
- 4 expressões diferentes do Aurelito:
  - **2HandsExplanation**: Postura explicativa (padrão)
  - **DoubtFace**: Expressão de dúvida
  - **Left**: Olhando para a esquerda
  - **Right**: Olhando para a direita
- Clique no Aurelito para mudar sua expressão aleatoriamente
- Expressões mudam automaticamente baseadas no contexto

### 4. **Mensagens por Seção**

#### Home
- Boas-vindas ao site
- Curiosidades sobre a distância do Sol
- Incentivo para começar a aventura

#### Histórias
- Dicas sobre as diferentes narrativas
- Explicação sobre as perspectivas únicas
- Incentivo para explorar

#### Sobre
- Informações sobre clima espacial
- Curiosidades científicas
- Explicações educativas

#### Clima Espacial
- Informações sobre dados em tempo real
- Importância do monitoramento solar
- Proteção tecnológica

### 5. **Botão de Minimizar/Maximizar**
- Botão flutuante para ocultar/mostrar o Aurelito
- Ícone muda de 💬 para 🌟 quando minimizado
- Permite que usuários controlem a exibição do guia

### 6. **Sistema Inteligente**
- Usa Intersection Observer para detectar mudanças de seção
- Atualiza mensagens automaticamente ao rolar a página
- Rotação de mensagens a cada 15 segundos
- Mensagem inicial aparece após 2 segundos de carregamento

## Detalhes Técnicos

### Arquivos Modificados
1. **index.html**: Adicionado componente HTML do Aurelito
2. **styles.css**: Estilos e animações do personagem
3. **script.js**: Lógica de interatividade e detecção de seções

### Tecnologias Utilizadas
- HTML5
- CSS3 (Animations, Gradients, Flexbox)
- JavaScript (Intersection Observer API)
- Responsive Design

### Animações CSS
- `float`: Movimento vertical suave
- `bubbleAppear`: Aparição do balão de fala
- `rotate`: Rotação do ícone do sol (navbar)

## Personalização

### Adicionar Novas Mensagens
Edite o objeto `aurelitoMessages` em `script.js`:

```javascript
const aurelitoMessages = {
    nomeDaSecao: [
        "Primeira mensagem",
        "Segunda mensagem",
        "Terceira mensagem"
    ]
};
```

### Mudar Tempo de Rotação
Altere o intervalo no final do código JavaScript:

```javascript
setInterval(() => {
    if (!isAurelitoMinimized) {
        updateAurelitoMessage(currentSection);
    }
}, 15000); // 15000ms = 15 segundos
```

### Adicionar Novas Expressões
1. Adicione a nova imagem em `Images/GuideCharacter/`
2. Adicione referência no objeto `aurelitoImages`:

```javascript
const aurelitoImages = {
    novaExpressao: './Images/GuideCharacter/nome-arquivo.png'
};
```

## Responsividade

### Desktop
- Tamanho do personagem: 150x150px
- Balão de fala: até 280px de largura

### Mobile (< 768px)
- Tamanho do personagem: 100x100px
- Balão de fala: até 200px de largura
- Posicionamento ajustado para melhor usabilidade

## Melhorias Futuras
- [ ] Integração com sistema de sons
- [ ] Mais expressões faciais
- [ ] Dicas personalizadas baseadas no histórico do usuário
- [ ] Animações de entrada/saída mais elaboradas
- [ ] Sistema de conquistas/badges com feedback do Aurelito
- [ ] Modo de voz (text-to-speech)
- [ ] Integração com as histórias interativas

## Créditos
Personagem criado para o projeto Stellar Stories - NASA Space Apps Challenge
