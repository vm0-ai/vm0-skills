---
name: deel
description: Deel API for global payroll and contractors. Use when user mentions "Deel",
  "contractors", "global payroll", or "EOR".
---

## Troubleshooting

If requests fail, run `zero doctor check-connector --env-name DEEL_TOKEN` or `zero doctor check-connector --url https://api.letsdeel.com/rest/v2/contracts --method GET`

## Contracts

### List Contracts

```bash
curl -s "https://api.letsdeel.com/rest/v2/contracts?limit=20" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

Params: `limit` (max 100), `offset`, `statuses` (comma-separated), `types`, `worker_name`, `team_id`.

### Get Contract Details

```bash
curl -s "https://api.letsdeel.com/rest/v2/contracts/<contract-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Contractor Contract

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/contracts" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"type\": \"pay_as_you_go\", \"title\": \"Software Developer\", \"worker_email\": \"contractor@example.com\", \"currency\": \"USD\", \"rate\": 5000, \"cycle\": \"monthly\", \"start_date\": \"2026-05-01\", \"scope\": \"Full-stack development\"}"
```

Contract types: `pay_as_you_go` (contractor), `ongoing` (employee/EOR), `milestone` (project-based).

### Update Contract

```bash
curl -s -X PATCH "https://api.letsdeel.com/rest/v2/contracts/<contract-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"title\": \"Senior Software Developer\"}"
```

### Get Contract Amendments

```bash
curl -s "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/amendments" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Contract Amendment

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/amendments" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"rate\": 6000, \"effective_date\": \"2026-07-01\"}"
```

### Terminate Contract

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/terminations" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"termination_date\": \"2026-06-30\", \"reason\": \"End of project\"}"
```

### Send Contract Invitation

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/invitations" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Contract Preview

```bash
curl -s "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/preview" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## EOR Contracts

### Create EOR Contract

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/eor" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"country\": \"DE\", \"worker_email\": \"employee@example.com\", \"job_title\": \"Product Manager\", \"salary\": 80000, \"currency\": \"EUR\", \"start_date\": \"2026-06-01\"}"
```

### Get EOR Contract Details

```bash
curl -s "https://api.letsdeel.com/rest/v2/eor/contracts/<contract-id>/details" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get EOR Start Date Availability

```bash
curl -s "https://api.letsdeel.com/rest/v2/eor/start-date" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get EOR Country Validations

```bash
curl -s "https://api.letsdeel.com/rest/v2/eor/validations/<country-code>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## People

### List People

```bash
curl -s "https://api.letsdeel.com/rest/v2/people?limit=20" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Person Details

```bash
curl -s "https://api.letsdeel.com/rest/v2/people/<hris-profile-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Current User

```bash
curl -s "https://api.letsdeel.com/rest/v2/people/me" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Person's Custom Fields

```bash
curl -s "https://api.letsdeel.com/rest/v2/people/<worker-id>/custom_fields" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Update Person's Department

```bash
curl -s -X PUT "https://api.letsdeel.com/rest/v2/people/<id>/department" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"department_id\": \"<department-id>\"}"
```

### Update Personal Info

```bash
curl -s -X PATCH "https://api.letsdeel.com/rest/v2/people/<worker-id>/personal" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"first_name\": \"Jane\", \"last_name\": \"Doe\"}"
```

## Time Off

### List All Time Off Requests

```bash
curl -s "https://api.letsdeel.com/rest/v2/time_offs?limit=20" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Time Off by Profile

```bash
curl -s "https://api.letsdeel.com/rest/v2/time_offs/profile/<hris-profile-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Time Off Entitlements

```bash
curl -s "https://api.letsdeel.com/rest/v2/time_offs/profile/<hris-profile-id>/entitlements" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Time Off Policies

```bash
curl -s "https://api.letsdeel.com/rest/v2/time_offs/profile/<hris-profile-id>/policies" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Time Off Request

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/time_offs" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"contract_id\": \"<contract-id>\", \"type\": \"vacation\", \"start_date\": \"2026-04-01\", \"end_date\": \"2026-04-05\", \"reason\": \"Family vacation\"}"
```

Types: `vacation`, `sick_leave`, `personal`, `parental`, etc. Use `GET /time_offs/profile/{id}/policies` to discover available types.

### Review Time Off Request

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/time_offs/review" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"time_off_id\": \"<time-off-id>\", \"status\": \"approved\"}"
```

### Update Time Off Request

```bash
curl -s -X PATCH "https://api.letsdeel.com/rest/v2/time_offs/<time-off-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"end_date\": \"2026-04-07\"}"
```

### Delete Time Off Request

```bash
curl -s -X DELETE "https://api.letsdeel.com/rest/v2/time_offs/<time-off-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Invoice Adjustments

### List Invoice Adjustments

```bash
curl -s "https://api.letsdeel.com/rest/v2/invoice-adjustments?limit=20" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Invoice Adjustment

```bash
curl -s "https://api.letsdeel.com/rest/v2/invoice-adjustments/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Adjustments for Contract

```bash
curl -s "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/invoice-adjustments" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Invoice Adjustment

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/invoice-adjustments" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"contract_id\": \"<contract-id>\", \"amount\": 500, \"currency\": \"USD\", \"type\": \"bonus\", \"description\": \"Performance bonus Q1 2026\"}"
```

### Update Invoice Adjustment

```bash
curl -s -X PATCH "https://api.letsdeel.com/rest/v2/invoice-adjustments/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"amount\": 750, \"description\": \"Updated performance bonus\"}"
```

### Delete Invoice Adjustment

```bash
curl -s -X DELETE "https://api.letsdeel.com/rest/v2/invoice-adjustments/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Adjustments (Generic)

### List Adjustment Categories

```bash
curl -s "https://api.letsdeel.com/rest/v2/adjustments/categories" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Adjustment

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/adjustments" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"contract_id\": \"<contract-id>\", \"category_id\": \"<category-id>\", \"amount\": 200, \"description\": \"Expense reimbursement\"}"
```

## Accounting

### List Invoices

```bash
curl -s "https://api.letsdeel.com/rest/v2/invoices" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Invoice Details

```bash
curl -s "https://api.letsdeel.com/rest/v2/invoices/<invoice-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Download Invoice

```bash
curl -s "https://api.letsdeel.com/rest/v2/invoices/<id>/download" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  -o invoice.pdf
```

### List Deel Invoices

```bash
curl -s "https://api.letsdeel.com/rest/v2/invoices/deel" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Payments

```bash
curl -s "https://api.letsdeel.com/rest/v2/payments" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Payment Breakdown

```bash
curl -s "https://api.letsdeel.com/rest/v2/payments/<payment-id>/breakdown" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Payslips

### List EOR Payslips

```bash
curl -s "https://api.letsdeel.com/rest/v2/eor/workers/<worker-id>/payslips" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Download Payslip

```bash
curl -s "https://api.letsdeel.com/rest/v2/eor/workers/<worker-id>/payslips/<payslip-id>/download" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  -o payslip.pdf
```

### List GP Payslips

```bash
curl -s "https://api.letsdeel.com/rest/v2/gp/workers/<worker-id>/payslips" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Milestones

### List Milestones

```bash
curl -s "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/milestones" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Milestone

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/milestones" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"title\": \"Phase 1 Delivery\", \"amount\": 2000, \"currency\": \"USD\", \"due_date\": \"2026-05-15\"}"
```

### Delete Milestone

```bash
curl -s -X DELETE "https://api.letsdeel.com/rest/v2/contracts/<contract-id>/milestones/<milestone-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Timesheets

### List Timesheets

```bash
curl -s "https://api.letsdeel.com/rest/v2/timesheets?limit=20" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Timesheet

```bash
curl -s "https://api.letsdeel.com/rest/v2/timesheets/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Timesheet

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/timesheets" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"contract_id\": \"<contract-id>\", \"description\": \"Development work\", \"quantity\": 8, \"date\": \"2026-04-08\"}"
```

### Update Timesheet

```bash
curl -s -X PATCH "https://api.letsdeel.com/rest/v2/timesheets/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"quantity\": 10}"
```

### Review Timesheet

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/timesheets/<id>/reviews" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"status\": \"approved\"}"
```

### Delete Timesheet

```bash
curl -s -X DELETE "https://api.letsdeel.com/rest/v2/timesheets/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Organization

### Get Organization Info

```bash
curl -s "https://api.letsdeel.com/rest/v2/organizations" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Teams

```bash
curl -s "https://api.letsdeel.com/rest/v2/teams" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Departments

```bash
curl -s "https://api.letsdeel.com/rest/v2/departments" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Managers

```bash
curl -s "https://api.letsdeel.com/rest/v2/managers" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Roles

```bash
curl -s "https://api.letsdeel.com/rest/v2/roles" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Legal Entities

```bash
curl -s "https://api.letsdeel.com/rest/v2/legal-entities" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Working Locations

```bash
curl -s "https://api.letsdeel.com/rest/v2/working-locations" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Onboarding & Offboarding Tracker

### List Onboarding Tracker

```bash
curl -s "https://api.letsdeel.com/rest/v2/onboarding/tracker" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Get Onboarding by Profile

```bash
curl -s "https://api.letsdeel.com/rest/v2/onboarding/tracker/hris_profile/<hris-profile-id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Offboarding Tracker

```bash
curl -s "https://api.letsdeel.com/rest/v2/offboarding/tracker" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Lookups

### List Countries

```bash
curl -s "https://api.letsdeel.com/rest/v2/lookups/countries" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Currencies

```bash
curl -s "https://api.letsdeel.com/rest/v2/lookups/currencies" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Job Titles

```bash
curl -s "https://api.letsdeel.com/rest/v2/lookups/job-titles" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Seniorities

```bash
curl -s "https://api.letsdeel.com/rest/v2/lookups/seniorities" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Time Off Types

```bash
curl -s "https://api.letsdeel.com/rest/v2/lookups/time-off-types" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Webhooks

### List Webhooks

```bash
curl -s "https://api.letsdeel.com/rest/v2/webhooks" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### List Webhook Event Types

```bash
curl -s "https://api.letsdeel.com/rest/v2/webhooks/events/types" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Webhook

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/webhooks" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Contract Updates\", \"url\": \"https://example.com/webhook\", \"events\": [\"contract.created\", \"contract.updated\"]}"
```

### Update Webhook

```bash
curl -s -X PATCH "https://api.letsdeel.com/rest/v2/webhooks/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Updated Webhook\", \"events\": [\"contract.created\"]}"
```

### Delete Webhook

```bash
curl -s -X DELETE "https://api.letsdeel.com/rest/v2/webhooks/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Groups

### List Groups

```bash
curl -s "https://api.letsdeel.com/rest/v2/groups" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

### Create Group

```bash
curl -s -X POST "https://api.letsdeel.com/rest/v2/groups" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Engineering Team\"}"
```

### Update Group

```bash
curl -s -X PATCH "https://api.letsdeel.com/rest/v2/groups/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN" \
  --header "Content-Type: application/json" \
  -d "{\"name\": \"Engineering Team v2\"}"
```

### Delete Group

```bash
curl -s -X DELETE "https://api.letsdeel.com/rest/v2/groups/<id>" \
  --header "Authorization: Bearer $DEEL_TOKEN"
```

## Guidelines

1. **API versioning**: All endpoints use `/rest/v2/`.
2. **Contract types**: `pay_as_you_go` (contractor), `ongoing` (employee/EOR), `milestone` (project-based), `gp` (global payroll).
3. **Pagination**: Use `limit` (max 100) and `offset` query params. Default limit is 20.
4. **Time off types**: Discover available types per profile via `GET /time_offs/profile/{id}/policies`.
5. **Rate limits**: Back off on 429 responses with `Retry-After` header.
6. **Sandbox**: Use `https://api-sandbox.demo.deel.com` for testing (same endpoints, test data).
7. **Invoice adjustments**: Available for contractor contracts. Use the generic `adjustments` endpoints for broader adjustment types.
8. **EOR vs Contractor**: EOR contracts have separate endpoints under `/eor/` for country-specific compliance, amendments, and offboarding.
9. **HRIS Profile ID**: Many people/time-off endpoints use the HRIS profile ID, not the contract ID. Get it from the people endpoint.

## How to Look Up More API Details

- **API Reference**: https://developer.deel.com/reference
- **Contracts**: https://developer.deel.com/reference/list-contracts
- **People**: https://developer.deel.com/reference/list-people
- **Time Off**: https://developer.deel.com/reference/get-time-off-requests
- **Invoices**: https://developer.deel.com/reference/list-invoices
- **Webhooks**: https://developer.deel.com/reference/get-webhooks
- **Sandbox**: https://developer.deel.com/docs/sandbox
