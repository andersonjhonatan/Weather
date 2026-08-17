# Weather K2

Aplicação meteorológica moderna da K2 Tech, reformulada a partir do projeto original de 2023 para funcionar como projeto de portfólio: responsivo, instalável e sem chave de API exposta no front-end.

## O que o projeto entrega

- clima atual por cidade ou CEP;
- geolocalização pelo navegador;
- sugestões de cidades durante a busca;
- temperatura e sensação térmica;
- umidade, vento, rajadas, pressão, visibilidade, nuvens e precipitação;
- previsão das próximas horas;
- previsão para 7 dias;
- nascer e pôr do sol;
- favoritos e pesquisas recentes salvos no navegador;
- alternância entre Celsius e Fahrenheit;
- tema visual dinâmico conforme condição climática e período do dia;
- tratamento de carregamento e erro;
- layout mobile-first e acessível;
- PWA com manifesto, ícone e service worker;
- metadata para SEO e compartilhamento.

## Dados meteorológicos

O projeto usa a API pública da Open-Meteo para geocodificação e previsão do tempo. Nenhuma chave privada é embutida no bundle do navegador.

- Documentação de previsão: https://open-meteo.com/en/docs
- Documentação de geocodificação: https://open-meteo.com/en/docs/geocoding-api

Para uso comercial ou em grande escala, revise os termos e limites atuais do provedor antes da publicação.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS (pipeline existente)
- React Icons
- Web APIs: Fetch, Geolocation, Local Storage e Service Worker

## Como executar

```bash
git clone https://github.com/andersonjhonatan/Weather.git
cd Weather
npm install
npm run dev
```

Abra o endereço informado pelo Vite no navegador.

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura principal

```text
src/
├── App.tsx        # interface e estado da experiência
├── weather.ts     # integração com clima, geocoding e utilitários
├── index.css      # design system e responsividade
└── main.tsx       # bootstrap React e registro do PWA

public/
├── manifest.webmanifest
├── sw.js
└── weather-icon.svg
```

## Segurança

A versão antiga continha uma chave da OpenWeatherMap diretamente em `src/APi/instance.ts`. Essa implementação foi removida. Como a chave esteve publicada no histórico Git, ela deve ser revogada no painel da OpenWeatherMap caso ainda esteja ativa.

## Créditos

Projeto original: Anderson Jhonatan dos Santos  
Reformulação e identidade: **K2 Tech**
