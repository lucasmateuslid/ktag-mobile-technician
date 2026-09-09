# K-Tag Técnicos

Aplicativo móvel para técnicos executarem ordens de serviço do K-Tag Manager, desenvolvido com Expo, React Native e TypeScript para Android e iOS.

## Funcionalidades

- Autenticação pelo Firebase Auth e proteção de acesso por biometria.
- Consulta de ordens de serviço com busca por placa, cliente ou número da OS.
- Execução de serviços com checklists, fotos e assinatura.
- Cache local em SQLite e filas de comandos e uploads para sincronização após reconexão.
- Envio de notas fiscais com anexos e acompanhamento do status de conferência.
- Consulta de valores a receber e histórico de pagamentos.
- Integração com notificações push do Expo.

Os dados operacionais passam pela API `/api/mobile/v1`. O Firebase Auth é usado para identidade. O envio de notas fiscais requer conexão.

## Requisitos

- Node.js e npm compatíveis com o Expo SDK 57 usado pelo projeto.
- Acesso à API do K-Tag Manager e a um projeto Firebase configurado para autenticação.
- Android Studio e SDK Android para compilação local Android.
- macOS com Xcode para compilação local iOS.
- Conta Expo e EAS CLI para builds pelo EAS.

## Configuração

```bash
git clone https://github.com/lucasmateuslid/ktag-mobile-technician.git
cd ktag-mobile-technician
npm ci
cp .env.example .env
```

Preencha o `.env` com as configurações do ambiente:

| Variável | Finalidade |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | URL base da API, sem o sufixo `/api/mobile/v1` |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Chave pública da configuração Firebase |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação Firebase |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Identificador do projeto Firebase |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket da configuração Firebase |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Identificador de mensagens Firebase |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Identificador do aplicativo Firebase |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | Identificador do projeto EAS usado no registro de push |

As variáveis `EXPO_PUBLIC_*` são incorporadas ao aplicativo; não coloque segredos de servidor nelas.

Para os builds nativos, disponibilize na raiz os arquivos do projeto Firebase referenciados em `app.json`:

- `google-services.json` para Android.
- `GoogleService-Info.plist` para iOS.

Os identificadores nativos configurados são `app.ktagfinder.technician` em ambas as plataformas. Os arquivos Firebase devem corresponder a esses aplicativos.

## Desenvolvimento

Compile e instale o aplicativo na plataforma desejada:

```bash
npm run android
# Ou, em macOS:
npm run ios
```

Para iniciar o servidor de desenvolvimento:

```bash
npm run start
```

O comando inicia o Expo com `--dev-client`. O perfil EAS `development` também prevê um Development Build; para usá-lo, é necessário instalar e configurar `expo-dev-client`, que ainda não consta nas dependências deste projeto.

Valide os recursos nativos em aparelho ou emulador com um build do aplicativo. Teste câmera, biometria, notificações, SQLite, assinaturas e o fluxo offline seguido de reconexão.

## Verificação

```bash
npm run lint
npm test
npx expo config --type public
```

`lint` executa a verificação de tipos TypeScript. Os testes cobrem regras de ordens de serviço e tratamento de referências a uploads pendentes na sincronização.

## Estrutura

```text
app/                  Rotas e telas com Expo Router
  (tabs)/             Ordens de serviço, financeiro, notas fiscais e perfil
  os/[id].tsx         Detalhes e execução da ordem de serviço
src/
  components/         Componentes compartilhados e proteção biométrica
  api.ts              Cliente da API mobile
  authStore.ts        Estado de autenticação
  contracts.ts        Contratos de dados
  database.ts         Cache SQLite e filas locais
  firebase.ts         Configuração Firebase
  orderRules.ts       Regras das ordens de serviço
  store.ts            Estado operacional do aplicativo
  sync.ts             Sincronização de dados, comandos e uploads
  uploadRules.ts      Resolução de referências a uploads
  notifications.ts    Registro de notificações push
tests/               Testes unitários
```

## Builds e distribuição

Os perfis estão definidos em `eas.json`: `development` para desenvolvimento, `preview` para distribuição interna e `production` para produção.

Com o EAS CLI instalado e o projeto configurado:

```bash
eas build --platform all --profile preview
eas build --platform all --profile production
```

O perfil de produção gera um Android App Bundle (AAB). Para distribuição corporativa, publique no Managed Google Play como aplicativo privado e, no iOS, como Custom App restrito à organização no Apple Business Manager. A publicação nas lojas exige configuração e credenciais próprias de cada plataforma.

O `.gitignore` exclui `.env`, arquivos Firebase nativos, dependências, saídas de build e credenciais de assinatura.
