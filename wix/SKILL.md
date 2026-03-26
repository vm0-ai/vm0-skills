---
name: wix
description: Wix API for website management. Use when user mentions "Wix", "wix.com",
  "wixsite.com", shares a Wix link, "Wix site", or asks about Wix CMS.
vm0_secrets:
  - WIX_TOKEN
---

# Wix API

Manage contacts, blog posts, store products, and orders on a connected Wix site.

> Official docs: `https://dev.wix.com/docs/rest`

## When to Use

- View and manage site contacts and CRM data
- Create, read, and update blog posts
- Query store products and inventory
- View and manage orders
- Get site information and stats

## Prerequisites


> **Note:** The CRM Contacts, Blog, Store, and Orders APIs are only available if the corresponding features are enabled on the Wix site. A blank site will return 404 for these endpoints.

## Core APIs

### Get Site Info

```bash
curl -s "https://www.wixapis.com/apps/v1/instance" --header "Authorization: Bearer $(printenv WIX_TOKEN)" | jq '{instanceId: .instance.instanceId, appName: .instance.appName, siteName: .site.siteDisplayName, ownerEmail: .site.ownerEmail}'
```

### List Contacts

Requires CRM feature enabled on the site.

```bash
cat > /tmp/request.json << 'EOF'
{
  "search": {
    "paging": {
      "limit": 20,
      "offset": 0
    }
  }
}
EOF
curl -s -X POST "https://www.wixapis.com/crm/v3/contacts/search" --header "Authorization: Bearer $(printenv WIX_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.contacts[] | {id, email: .primaryInfo.email, name: .info.name}'
```

### Get a Contact

Replace `<contact-id>` with the contact's ID:

```bash
curl -s "https://www.wixapis.com/crm/v3/contacts/<contact-id>" --header "Authorization: Bearer $(printenv WIX_TOKEN)" | jq '{id, name: .info.name, emails: .info.emails, phones: .info.phones, createdDate}'
```

### Create a Contact

```bash
cat > /tmp/request.json << 'EOF'
{
  "info": {
    "name": {
      "first": "Jane",
      "last": "Doe"
    },
    "emails": {
      "items": [
        {
          "email": "jane.doe@example.com",
          "tag": "MAIN"
        }
      ]
    },
    "phones": {
      "items": [
        {
          "phone": "+1-555-0100",
          "tag": "MOBILE"
        }
      ]
    }
  }
}
EOF
curl -s -X POST "https://www.wixapis.com/crm/v3/contacts" --header "Authorization: Bearer $(printenv WIX_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id: .contact.id, name: .contact.info.name}'
```

### Update a Contact

Replace `<contact-id>` with the contact's ID:

```bash
cat > /tmp/request.json << 'EOF'
{
  "info": {
    "name": {
      "first": "Jane",
      "last": "Smith"
    }
  }
}
EOF
curl -s -X PATCH "https://www.wixapis.com/crm/v3/contacts/<contact-id>" --header "Authorization: Bearer $(printenv WIX_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.contact | {id, name: .info.name}'
```

### List Blog Posts

Requires Blog feature enabled on the site.

```bash
cat > /tmp/request.json << 'EOF'
{
  "paging": {
    "limit": 10,
    "offset": 0
  },
  "fieldsets": ["URL", "RICH_CONTENT"]
}
EOF
curl -s -X POST "https://www.wixapis.com/blog/v3/posts/list" --header "Authorization: Bearer $(printenv WIX_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.posts[] | {id, title, status, publishedDate, url: .url.base}'
```

### Get a Blog Post

Replace `<post-id>` with the post's ID:

```bash
curl -s "https://www.wixapis.com/blog/v3/posts/<post-id>" --header "Authorization: Bearer $(printenv WIX_TOKEN)" | jq '{id, title, status, publishedDate, excerpt}'
```

### Create a Draft Blog Post

Requires Blog feature enabled on the site. The `memberId` field is optional — omit it if you don't have a specific author ID.

```bash
cat > /tmp/request.json << 'EOF'
{
  "draftPost": {
    "title": "My New Blog Post",
    "excerpt": "A brief summary of the post."
  }
}
EOF
curl -s -X POST "https://www.wixapis.com/blog/v3/draft-posts" --header "Authorization: Bearer $(printenv WIX_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '{id: .draftPost.id, title: .draftPost.title, status: .draftPost.status}'
```

### Query Store Products

Requires Wix Stores feature enabled on the site.

```bash
cat > /tmp/request.json << 'EOF'
{
  "query": {
    "paging": {
      "limit": 20,
      "offset": 0
    }
  }
}
EOF
curl -s -X POST "https://www.wixapis.com/stores/v1/products/query" --header "Authorization: Bearer $(printenv WIX_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.products[] | {id, name, description, price: .price.formatted.price, inStock}'
```

### Get a Product

Replace `<product-id>` with the product's ID:

```bash
curl -s "https://www.wixapis.com/stores/v1/products/<product-id>" --header "Authorization: Bearer $(printenv WIX_TOKEN)" | jq '{id, name, description, price: .product.price.formatted.price, stock: .product.stock}'
```

### Search Orders

Requires Wix Stores feature enabled on the site.

```bash
cat > /tmp/request.json << 'EOF'
{
  "search": {
    "paging": {
      "limit": 20,
      "offset": 0
    }
  }
}
EOF
curl -s -X POST "https://www.wixapis.com/ecom/v1/orders/search" --header "Authorization: Bearer $(printenv WIX_TOKEN)" --header "Content-Type: application/json" -d @/tmp/request.json | jq '.orders[] | {id, number, status, buyerInfo: .buyerInfo.email, total: .priceSummary.total.formattedAmount, createdDate}'
```

### Get an Order

Replace `<order-id>` with the order's ID:

```bash
curl -s "https://www.wixapis.com/ecom/v1/orders/<order-id>" --header "Authorization: Bearer $(printenv WIX_TOKEN)" | jq '{id, number, status, buyer: .buyerInfo.email, total: .priceSummary.total.formattedAmount, lineItems: [.lineItems[] | {name: .productName.original, quantity, price: .price.formattedAmount}]}'
```

## Notes

- All API endpoints require a Wix site to have the VM0 app installed
- The access token is tied to the specific site where the app was installed
- CRM, Blog, and Store APIs only work if the site has those features installed/enabled
- Contacts API: use `MAIN` tag for primary email/phone
- The `memberId` field in blog post creation is optional — omit it if no specific author ID is available
