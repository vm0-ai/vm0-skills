# Connector-Skill Consistency Audit

## 1. Env Variable Mismatches

The connector's `environmentMapping` keys are the actual env var names injected at runtime.
If a skill uses `$FOO_API_KEY` but the connector injects `FOO_TOKEN`, the var will be empty.

### computer
- Connector provides: `['COMPUTER_CONNECTOR_DOMAIN']`
- **Not referenced in skill body**: `['COMPUTER_CONNECTOR_DOMAIN']`

### deepseek
- Connector provides: `['DEEPSEEK_TOKEN']`
- **Wrong name**: skill uses `$DEEPSEEK_API_KEY` → should be `$DEEPSEEK_TOKEN`

### devto
- Connector provides: `['DEVTO_TOKEN']`
- **Wrong name**: skill uses `$DEVTO_API_KEY` → should be `$DEVTO_TOKEN`

### doppler
- Connector provides: `['DOPPLER_TOKEN']`
- **Not referenced in skill body**: `['DOPPLER_TOKEN']`

### elevenlabs
- Connector provides: `['ELEVENLABS_TOKEN']`
- **Wrong name**: skill uses `$ELEVENLABS_API_KEY` → should be `$ELEVENLABS_TOKEN`

### github
- Connector provides: `['GH_TOKEN', 'GITHUB_TOKEN']`
- **Not referenced in skill body**: `['GH_TOKEN', 'GITHUB_TOKEN']`

### infisical
- Connector provides: `['INFISICAL_CLIENT_ID', 'INFISICAL_CLIENT_SECRET']`
- **Not referenced in skill body**: `['INFISICAL_CLIENT_ID', 'INFISICAL_CLIENT_SECRET']`

### lark
- Connector provides: `['LARK_APP_ID', 'LARK_TOKEN']`
- Used correctly: `['LARK_APP_ID']`
- **Wrong name**: skill uses `$LARK_APP_SECRET` → should be `$LARK_TOKEN`

### mailsac
- Connector provides: `['MAILSAC_TOKEN']`
- **Wrong name**: skill uses `$MAILSAC_API_KEY` → should be `$MAILSAC_TOKEN`

### minimax
- Connector provides: `['MINIMAX_TOKEN']`
- **Wrong name**: skill uses `$MINIMAX_API_KEY` → should be `$MINIMAX_TOKEN`

### openai
- Connector provides: `['OPENAI_TOKEN']`
- **Wrong name**: skill uses `$OPENAI_API_KEY` → should be `$OPENAI_TOKEN`

### pdf4me
- Connector provides: `['PDF4ME_TOKEN']`
- **Wrong name**: skill uses `$PDF4ME_API_KEY` → should be `$PDF4ME_TOKEN`

### pdfco
- Connector provides: `['PDFCO_TOKEN']`
- **Wrong name**: skill uses `$PDFCO_API_KEY` → should be `$PDFCO_TOKEN`

### perplexity
- Connector provides: `['PERPLEXITY_TOKEN']`
- **Wrong name**: skill uses `$PERPLEXITY_API_KEY` → should be `$PERPLEXITY_TOKEN`

### pika
- Connector provides: `['PIKA_TOKEN']`
- **Not referenced in skill body**: `['PIKA_TOKEN']`

### podchaser
- Connector provides: `['PODCHASER_TOKEN']`
- **Not referenced in skill body**: `['PODCHASER_TOKEN']`

### qiita
- Connector provides: `['QIITA_TOKEN']`
- **Not referenced in skill body**: `['QIITA_TOKEN']`

### reddit
- Connector provides: `['REDDIT_TOKEN']`
- **Not referenced in skill body**: `['REDDIT_TOKEN']`

### zeptomail
- Connector provides: `['ZEPTOMAIL_TOKEN']`
- **Wrong name**: skill uses `$ZEPTOMAIL_API_KEY` → should be `$ZEPTOMAIL_TOKEN`

**Total: 19 connectors with env var issues.**


## 2. Endpoint vs Firewall Coverage

API endpoints used in SKILL.md code blocks that are NOT covered by the firewall.

### deel
- Firewall bases: `['https://api.letsdeel.com']`
- **Uncovered**: `['https://api.deel.com']`

### docusign
- Firewall bases: `['https://www.docusign.net', 'https://na2.docusign.net', 'https://na3.docusign.net', 'https://na4.docusign.net', 'https://eu.docusign.net', '...and 3 more']`
- **Uncovered**: `['https://account.docusign.com']`

### imgur
- Firewall bases: `['https://api.imgur.com']`
- **Uncovered**: `['https://i.imgur.com']`

### lark
- Firewall bases: `['https://open.larksuite.com', 'https://open.feishu.cn']`
- **Uncovered**: `['https://open.larkoffice.com']`

### zapier
- Firewall bases: `['https://nla.zapier.com']`
- **Uncovered**: `['https://actions.zapier.com']`

**Total: 5 connectors with uncovered endpoints.**


## 3. Connectors Without Matching Skill

- **garmin-connect**: provides `['GARMIN_CONNECT_TOKEN']`
- **outlook-calendar**: provides `['OUTLOOK_CALENDAR_TOKEN']`
- **outlook-mail**: provides `['OUTLOOK_MAIL_TOKEN']`