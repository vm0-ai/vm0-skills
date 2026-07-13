---
name: expensify
description: Expensify Integration Server API for exporting expense reports, reconciling transactions, and updating report status. Use when the user mentions Expensify, expense reports, receipts, or reconciliation.
---

## Prerequisites

1. Connect Expensify in Zero at Settings > Connectors > Expensify.
2. Requests require `EXPENSIFY_PARTNER_USER_ID` and `EXPENSIFY_PARTNER_USER_SECRET`.
3. All requests use `https://integrations.expensify.com/Integration-Server/ExpensifyIntegrations`.

## Troubleshooting

If requests fail, run `zero doctor check-connector --url https://integrations.expensify.com/Integration-Server/ExpensifyIntegrations --method POST`.

## Export Reports

Write the job description template to `/tmp/expensify_job_template.json`:

```json
{
  "type": "file",
  "credentials": {
    "partnerUserID": "",
    "partnerUserSecret": ""
  },
  "onReceive": {
    "immediateResponse": ["returnRandomFileName"]
  },
  "inputSettings": {
    "type": "combinedReportData",
    "filters": {
      "startDate": "2026-07-01",
      "endDate": "2026-07-31",
      "reportState": "APPROVED,REIMBURSED"
    }
  },
  "outputSettings": {
    "fileExtension": "json"
  }
}
```

Inject the connector credentials into a temporary request without printing them, then run the export:

```bash
jq --arg user "$EXPENSIFY_PARTNER_USER_ID" --arg secret "$EXPENSIFY_PARTNER_USER_SECRET" '.credentials.partnerUserID = $user | .credentials.partnerUserSecret = $secret' /tmp/expensify_job_template.json > /tmp/expensify_job.json
```

```bash
curl -sS -X POST "https://integrations.expensify.com/Integration-Server/ExpensifyIntegrations" --data-urlencode "requestJobDescription@/tmp/expensify_job.json"
```

The response is a generated file name. Write `/tmp/expensify_download_template.json` with that value:

```json
{
  "type": "download",
  "credentials": {
    "partnerUserID": "",
    "partnerUserSecret": ""
  },
  "fileName": "<generated-file-name>",
  "fileSystem": "integrationServer"
}
```

Inject the credentials and download the export:

```bash
jq --arg user "$EXPENSIFY_PARTNER_USER_ID" --arg secret "$EXPENSIFY_PARTNER_USER_SECRET" '.credentials.partnerUserID = $user | .credentials.partnerUserSecret = $secret' /tmp/expensify_download_template.json > /tmp/expensify_download.json
```

```bash
curl -sS --get "https://integrations.expensify.com/Integration-Server/ExpensifyIntegrations" --data-urlencode "requestJobDescription@/tmp/expensify_download.json" --output /tmp/expensify_export.json
```

## Report Templates

For CSV exports, add a `template` field containing an Expensify FreeMarker template and set `fileExtension` to `csv`. Keep templates in a separate file when they are longer than a few lines.

## Guidelines

1. Expensify credentials are embedded in `requestJobDescription`; never log the completed payload.
2. Exports are asynchronous file jobs. Save the returned file name and download it in a second request.
3. Use the narrowest date range and report state filter that answers the request.
4. Ask before marking reports, reimbursing expenses, or changing report state.
5. Delete local exports after use because they contain sensitive employee and financial data.
6. Delete completed credential-bearing request files from `/tmp` after each operation.

## API Reference

- https://integrations.expensify.com/Integration-Server/doc/
