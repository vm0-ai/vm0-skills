---
name: google-cloud
description: Google Cloud REST APIs for projects, IAM, enabled services, Compute Engine, Cloud Storage, BigQuery, Cloud Run, GKE, Cloud Build, Secret Manager, Logging, Monitoring, Pub/Sub, Firestore, Spanner, Cloud SQL, and billing. Use when user mentions "Google Cloud", "GCP", "gcloud", "project", "IAM", "Compute Engine", "GKE", "Cloud Run", "BigQuery", or "Cloud Storage".
---

# Google Cloud

Use Google Cloud REST APIs for the same broad resource management surfaces commonly reached through `gcloud`: projects, IAM, enabled APIs, compute, storage, data, deployment, logs, and billing.

> Official docs: `https://cloud.google.com/apis/docs/overview`
> gcloud overview: `https://cloud.google.com/sdk/gcloud`

---

## When to Use

Use this skill when you need to:

- Discover accessible Google Cloud projects and their IAM policies
- Inspect enabled APIs and common infrastructure resources
- Work with Compute Engine, Cloud Storage, BigQuery, Cloud Run, GKE, Cloud Build, Artifact Registry, Secret Manager, Logging, Monitoring, Pub/Sub, Firestore, Spanner, Cloud SQL, or billing APIs
- Translate a `gcloud` task into direct REST API calls

---

## Prerequisites

Connect the **Google Cloud** connector at [app.vm0.ai/connectors](https://app.vm0.ai/connectors).

The access token is injected as `$GOOGLE_CLOUD_TOKEN`. The connector is not bound to a single project; Google IAM roles, enabled APIs, and organization policies decide which projects and resources are visible.

> **Troubleshooting:** If requests fail, run `zero doctor check-connector --env-name GOOGLE_CLOUD_TOKEN` or `zero doctor check-connector --url https://cloudresourcemanager.googleapis.com/v3/projects:search --method GET`

---

## API Surfaces

The Google Cloud connector is authorized for these API hosts:

- `https://cloudresourcemanager.googleapis.com`
- `https://serviceusage.googleapis.com`
- `https://iam.googleapis.com`
- `https://compute.googleapis.com`
- `https://appengine.googleapis.com`
- `https://sqladmin.googleapis.com`
- `https://bigquery.googleapis.com`
- `https://storage.googleapis.com`
- `https://run.googleapis.com`
- `https://cloudbuild.googleapis.com`
- `https://artifactregistry.googleapis.com`
- `https://container.googleapis.com`
- `https://cloudfunctions.googleapis.com`
- `https://secretmanager.googleapis.com`
- `https://logging.googleapis.com`
- `https://monitoring.googleapis.com`
- `https://cloudbilling.googleapis.com`
- `https://pubsub.googleapis.com`
- `https://firestore.googleapis.com`
- `https://spanner.googleapis.com`

Common `gcloud` equivalents:

| gcloud task | REST API |
| --- | --- |
| `gcloud projects list` | `GET https://cloudresourcemanager.googleapis.com/v3/projects:search` |
| `gcloud projects get-iam-policy` | `POST https://cloudresourcemanager.googleapis.com/v3/projects/{project}:getIamPolicy` |
| `gcloud services list` | `GET https://serviceusage.googleapis.com/v1/projects/{project-number}/services` |
| `gcloud iam service-accounts list` | `GET https://iam.googleapis.com/v1/projects/{project-id}/serviceAccounts` |
| `gcloud compute instances list` | `GET https://compute.googleapis.com/compute/v1/projects/{project-id}/aggregated/instances` |
| `gcloud storage buckets list` | `GET https://storage.googleapis.com/storage/v1/b?project={project-id}` |
| `bq ls` | `GET https://bigquery.googleapis.com/bigquery/v2/projects/{project-id}/datasets` |
| `gcloud run services list` | `GET https://run.googleapis.com/v2/projects/{project-id}/locations/{region}/services` |
| `gcloud container clusters list` | `GET https://container.googleapis.com/v1/projects/{project-id}/locations/-/clusters` |
| `gcloud builds list` | `GET https://cloudbuild.googleapis.com/v1/projects/{project-id}/builds` |
| `gcloud artifacts repositories list` | `GET https://artifactregistry.googleapis.com/v1/projects/{project-id}/locations/{location}/repositories` |
| `gcloud secrets list` | `GET https://secretmanager.googleapis.com/v1/projects/{project-id}/secrets` |
| `gcloud logging read` | `POST https://logging.googleapis.com/v2/entries:list` |
| `gcloud monitoring metrics descriptors list` | `GET https://monitoring.googleapis.com/v3/projects/{project-id}/metricDescriptors` |

---

## Projects and IAM

### Search Accessible Projects

```bash
curl -s "https://cloudresourcemanager.googleapis.com/v3/projects:search?pageSize=20" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.projects[]? | {name, projectId, displayName, state, parent}'
```

### Get Project Metadata

Use `name` from the project search response, for example `projects/123456789012`.

```bash
curl -s "https://cloudresourcemanager.googleapis.com/v3/projects/{project-number}" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '{name, projectId, displayName, state, parent, createTime, updateTime}'
```

### Get Project IAM Policy

Write to `/tmp/google_cloud_get_iam_policy.json`:

```json
{}
```

Then run:

```bash
curl -s -X POST "https://cloudresourcemanager.googleapis.com/v3/projects/{project-id-or-number}:getIamPolicy" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_cloud_get_iam_policy.json | jq '.bindings[]? | {role, members}'
```

### Test Project Permissions

Write to `/tmp/google_cloud_test_permissions.json`:

```json
{
  "permissions": [
    "resourcemanager.projects.get",
    "serviceusage.services.list",
    "compute.instances.list",
    "run.services.list"
  ]
}
```

Then run:

```bash
curl -s -X POST "https://cloudresourcemanager.googleapis.com/v3/projects/{project-id-or-number}:testIamPermissions" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_cloud_test_permissions.json | jq '.permissions // []'
```

### List Service Accounts

```bash
curl -s "https://iam.googleapis.com/v1/projects/{project-id}/serviceAccounts?pageSize=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.accounts[]? | {name, email, displayName, disabled}'
```

---

## Enabled APIs

Service Usage commonly requires the numeric project number in the path. Get it from `projects:search` first.

### List Enabled APIs

```bash
curl -s "https://serviceusage.googleapis.com/v1/projects/{project-number}/services?filter=state:ENABLED&pageSize=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.services[]? | {name, title: .config.title, state}'
```

### Enable an API

Only run this after the user confirms the project and API name.

```bash
curl -s -X POST "https://serviceusage.googleapis.com/v1/projects/{project-number}/services/run.googleapis.com:enable" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" --header "Content-Type: application/json" -d '{}' | jq '{name, done, error}'
```

---

## Compute Engine

### List Zones

```bash
curl -s "https://compute.googleapis.com/compute/v1/projects/{project-id}/zones" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.items[]? | {name, status, region}'
```

### List VM Instances Across All Zones

```bash
curl -s "https://compute.googleapis.com/compute/v1/projects/{project-id}/aggregated/instances?maxResults=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.items | to_entries[] | select(.value.instances) | {scope: .key, instances: [.value.instances[] | {name, status, machineType, zone, networkInterfaces}]}'
```

### List VM Instances in One Zone

```bash
curl -s "https://compute.googleapis.com/compute/v1/projects/{project-id}/zones/{zone}/instances?maxResults=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.items[]? | {name, status, machineType, zone, creationTimestamp}'
```

---

## Cloud Storage

### List Buckets

```bash
curl -s "https://storage.googleapis.com/storage/v1/b?project={project-id}&maxResults=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.items[]? | {name, location, storageClass, timeCreated}'
```

### List Objects in a Bucket

```bash
curl -s "https://storage.googleapis.com/storage/v1/b/{bucket-name}/o?maxResults=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.items[]? | {name, size, contentType, updated}'
```

### Download an Object

```bash
curl -s "https://storage.googleapis.com/storage/v1/b/{bucket-name}/o/{object-name-url-encoded}?alt=media" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" --output /tmp/google_cloud_object.bin
```

---

## BigQuery

### List Datasets

```bash
curl -s "https://bigquery.googleapis.com/bigquery/v2/projects/{project-id}/datasets?maxResults=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.datasets[]? | {id, datasetReference, location, friendlyName}'
```

### List Tables

```bash
curl -s "https://bigquery.googleapis.com/bigquery/v2/projects/{project-id}/datasets/{dataset-id}/tables?maxResults=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.tables[]? | {id, type, tableReference, creationTime}'
```

### Run a Query

Write to `/tmp/google_cloud_bigquery_query.json`:

```json
{
  "query": "SELECT CURRENT_DATE() AS today",
  "useLegacySql": false
}
```

Then run:

```bash
curl -s -X POST "https://bigquery.googleapis.com/bigquery/v2/projects/{project-id}/queries" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_cloud_bigquery_query.json | jq '{jobComplete, schema, rows}'
```

---

## Application Hosting and Deployments

### List Cloud Run Services

```bash
curl -s "https://run.googleapis.com/v2/projects/{project-id}/locations/{region}/services?pageSize=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.services[]? | {name, uri, latestReadyRevision, ingress, createTime, updateTime}'
```

### List GKE Clusters

Use location `-` to match all zones and regions.

```bash
curl -s "https://container.googleapis.com/v1/projects/{project-id}/locations/-/clusters" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.clusters[]? | {name, location, status, currentMasterVersion, currentNodeVersion}'
```

### List Cloud Build Builds

```bash
curl -s "https://cloudbuild.googleapis.com/v1/projects/{project-id}/builds?pageSize=20" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.builds[]? | {id, status, createTime, finishTime, logUrl}'
```

### List Artifact Registry Repositories

```bash
curl -s "https://artifactregistry.googleapis.com/v1/projects/{project-id}/locations/{location}/repositories?pageSize=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.repositories[]? | {name, format, description, createTime, updateTime}'
```

### List Cloud Functions

```bash
curl -s "https://cloudfunctions.googleapis.com/v2/projects/{project-id}/locations/{location}/functions?pageSize=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.functions[]? | {name, state, updateTime, url: .serviceConfig.uri}'
```

### List App Engine Services

```bash
curl -s "https://appengine.googleapis.com/v1/apps/{project-id}/services?pageSize=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.services[]? | {id, name, split}'
```

---

## Data and Messaging

### List Pub/Sub Topics

```bash
curl -s "https://pubsub.googleapis.com/v1/projects/{project-id}/topics" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.topics[]? | {name}'
```

### List Firestore Databases

```bash
curl -s "https://firestore.googleapis.com/v1/projects/{project-id}/databases" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.databases[]? | {name, locationId, type, concurrencyMode, appEngineIntegrationMode}'
```

### List Spanner Instances

```bash
curl -s "https://spanner.googleapis.com/v1/projects/{project-id}/instances" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.instances[]? | {name, config, displayName, state}'
```

### List Cloud SQL Instances

```bash
curl -s "https://sqladmin.googleapis.com/sql/v1beta4/projects/{project-id}/instances" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.items[]? | {name, databaseVersion, region, state, connectionName}'
```

---

## Security, Logs, and Metrics

### List Secrets

```bash
curl -s "https://secretmanager.googleapis.com/v1/projects/{project-id}/secrets?pageSize=50" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.secrets[]? | {name, labels, createTime, replication}'
```

### Access a Secret Version

Only read secret payloads when the user explicitly asks for that secret. The payload is base64-encoded in `.payload.data`.

```bash
curl -s "https://secretmanager.googleapis.com/v1/projects/{project-id}/secrets/{secret-id}/versions/latest:access" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '{name, data: .payload.data}'
```

### Query Recent Logs

Write to `/tmp/google_cloud_logs_query.json`:

```json
{
  "resourceNames": ["projects/{project-id}"],
  "filter": "timestamp >= \"2026-06-10T00:00:00Z\"",
  "orderBy": "timestamp desc",
  "pageSize": 20
}
```

Then run:

```bash
curl -s -X POST "https://logging.googleapis.com/v2/entries:list" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" --header "Content-Type: application/json" -d @/tmp/google_cloud_logs_query.json | jq '.entries[]? | {timestamp, severity, logName, resource, textPayload, jsonPayload}'
```

### List Monitoring Metric Descriptors

```bash
curl -s "https://monitoring.googleapis.com/v3/projects/{project-id}/metricDescriptors?pageSize=20" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '.metricDescriptors[]? | {type, metricKind, valueType, displayName}'
```

---

## Billing

### Get Project Billing Info

```bash
curl -s "https://cloudbilling.googleapis.com/v1/projects/{project-id}/billingInfo" --header "Authorization: Bearer $GOOGLE_CLOUD_TOKEN" | jq '{name, billingAccountName, billingEnabled, projectId}'
```

---

## Guidelines

1. Discover projects first with Cloud Resource Manager before using project-specific APIs.
2. Use the project number where Service Usage or Resource Manager returns `projects/{number}`; use the project ID where product APIs document `{project}` or `{projectId}`.
3. Check enabled APIs before assuming a product endpoint is usable.
4. Google IAM is the source of truth for permissions. A connected OAuth token does not bypass IAM, organization policy, VPC Service Controls, or API enablement.
5. Prefer read-only inspection before mutations. Ask for explicit confirmation before enabling APIs, changing IAM, creating resources, deleting resources, or reading secret payloads.
6. Handle pagination with `nextPageToken` or `pageToken` for large projects.
7. Use URL encoding for bucket object names, filters, and labels that contain slashes, spaces, quotes, or special characters.
