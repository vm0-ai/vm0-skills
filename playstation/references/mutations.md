# PlayStation Mutation Reference

Read the parent `SKILL.md` mutation-safety rules before using this file. Every route here is default denied. A firewall grant authorizes the transport, not the business effect.

## Contents

- [Required preflight](#required-preflight)
- [Friend requests and friendships](#friend-requests-and-friendships)
- [Groups and messages](#groups-and-messages)
- [Store GraphQL helper](#store-graphql-helper)
- [Wishlist](#wishlist)
- [Eligible library claims](#eligible-library-claims)
- [Ratings and reviews](#ratings-and-reviews)
- [Unsupported mutations](#unsupported-mutations)

## Required Preflight

Before every mutation:

1. Read the current resource state.
2. Resolve human-readable input to a stable account, group, concept, product, or SKU ID.
3. Show the exact target and effect to the user.
4. Confirm the user explicitly requested that effect. Do not treat a request to inspect or explain as mutation authorization.
5. Send one request. Inspect the response and current state before any retry.

Use a unique operation only once when a timeout makes the result uncertain. A transport error after sending does not prove the mutation failed.

## Friend Requests and Friendships

`PUT` accepts an incoming request. It is not a verified endpoint for sending a new friend request.

Read the relationship first:

```bash
TARGET_ACCOUNT_ID="1234567890123456789"

curl -fsS \
  "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/friends/$TARGET_ACCOUNT_ID/summary" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN" | jq .
```

Accept a confirmed incoming request:

```bash
curl --fail-with-body --silent --show-error \
  --request PUT \
  "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/friends/$TARGET_ACCOUNT_ID" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN"
```

Decline an incoming request or remove an existing friend. State which effect applies before sending:

```bash
curl --fail-with-body --silent --show-error \
  --request DELETE \
  "https://m.np.playstation.com/api/userProfile/v1/internal/users/me/friends/$TARGET_ACCOUNT_ID" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN"
```

Success is normally HTTP 204 with no JSON body. Re-read the relationship instead of expecting response content.

## Groups and Messages

All Gaming Lounge requests need `Accept-Language`. Read group detail to obtain the real main thread ID before sending a message.

```bash
GROUP_ID="replace-with-group-id"
THREAD_ID="replace-with-thread-id"
TARGET_ACCOUNT_ID="1234567890123456789"
```

Create or reuse a group with invitees:

```bash
jq -nc --arg accountId "$TARGET_ACCOUNT_ID" \
  '{invitees:[{accountId:$accountId}]}' |
  curl --fail-with-body --silent --show-error \
    --request POST \
    "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups" \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept-Language: en-US" \
    --header "Content-Type: application/json" \
    --data-binary @- | jq .
```

Rename a non-DM group:

```bash
NEW_GROUP_NAME="Confirmed group name"

jq -nc --arg name "$NEW_GROUP_NAME" '{groupName:{value:$name}}' |
  curl --fail-with-body --silent --show-error \
    --request PATCH \
    "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/$GROUP_ID" \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept-Language: en-US" \
    --header "Content-Type: application/json" \
    --data-binary @-
```

Invite a member to an existing group. This dedicated route is present in a current client but has weaker recent traffic evidence than group creation; stop if the API rejects it rather than falling back to another write:

```bash
jq -nc --arg accountId "$TARGET_ACCOUNT_ID" \
  '{invitees:[{accountId:$accountId}]}' |
  curl --fail-with-body --silent --show-error \
    --request POST \
    "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/$GROUP_ID/invitees" \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept-Language: en-US" \
    --header "Content-Type: application/json" \
    --data-binary @-
```

Send a confirmed text message:

```bash
MESSAGE="Confirmed message text"

jq -nc --arg body "$MESSAGE" '{messageType:1,body:$body}' |
  curl --fail-with-body --silent --show-error \
    --request POST \
    "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/$GROUP_ID/threads/$THREAD_ID/messages" \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept-Language: en-US" \
    --header "Content-Type: application/json" \
    --data-binary @- | jq .
```

Upload a PNG or JPEG no larger than 1 MiB, then send it as a message. Confirm both the upload and the visible message:

```bash
IMAGE_PATH="/absolute/path/to/image.png"
CONTENT_TYPE="image/png"

RESOURCE_ID="$(
  curl --fail-with-body --silent --show-error \
    --request POST \
    "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/$GROUP_ID/resources" \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept-Language: en-US" \
    --header "Content-Type: $CONTENT_TYPE" \
    --data-binary "@$IMAGE_PATH" | jq -er '.resourceId'
)"

jq -nc --arg resourceId "$RESOURCE_ID" \
  '{messageType:3,messageDetail:{imageMessageDetail:{resourceId:$resourceId}}}' |
  curl --fail-with-body --silent --show-error \
    --request POST \
    "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/$GROUP_ID/threads/$THREAD_ID/messages" \
    --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
    --header "Accept-Language: en-US" \
    --header "Content-Type: application/json" \
    --data-binary @- | jq .
```

Kick a member or leave a group only after showing the group and account IDs:

```bash
curl --fail-with-body --silent --show-error \
  --request DELETE \
  "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/$GROUP_ID/members/$TARGET_ACCOUNT_ID" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
  --header "Accept-Language: en-US"

curl --fail-with-body --silent --show-error \
  --request DELETE \
  "https://m.np.playstation.com/api/gamingLoungeGroups/v1/groups/$GROUP_ID/members/me" \
  --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
  --header "Accept-Language: en-US"
```

## Store GraphQL Helper

The web Store uses persisted-query POST for mutations. The hashes below were derived from the first-party Store documents current on 2026-07-16 and can rotate.

```bash
psn_store_post() {
  local operation="$1"
  local variables="$2"
  local hash="$3"

  jq -nc \
    --arg operationName "$operation" \
    --argjson variables "$variables" \
    --arg hash "$hash" \
    '{operationName:$operationName,variables:$variables,extensions:{persistedQuery:{version:1,sha256Hash:$hash}}}' |
    curl --fail-with-body --silent --show-error \
      --request POST \
      "https://web.np.playstation.com/api/graphql/v1/op" \
      --header "Authorization: Bearer $PLAYSTATION_TOKEN" \
      --header "Accept: application/json" \
      --header "Accept-Language: en-US" \
      --header "X-Psn-Store-Locale-Override: en-US" \
      --header "DISABLE_QUERY_WHITELIST: false" \
      --header "Content-Type: application/json" \
      --data-binary @-
}
```

Inspect `.errors` even on HTTP 200. Some Store mutations can require browser-session state or anti-abuse data in addition to a bearer token. If the bearer-backed connector is rejected, stop; do not substitute cookies or fabricate a fingerprint.

## Wishlist

Read the current wishlist before and after a mutation. Use a released product ID or unreleased concept ID exactly as returned by Store catalog data.

Add an item after confirming the item name and ID:

```bash
ITEM_ID="replace-with-product-or-concept-id"
VARIABLES="$(jq -nc --arg itemId "$ITEM_ID" '{input:{itemId:$itemId}}')"

psn_store_post \
  "wcaAddItemToStoreWishlist" \
  "$VARIABLES" \
  "df73492bad783fcce23c5b647cc1ba39ce286941a8da472fbf36bfed953901fe" |
  jq '{result: .data.storeWishlistAddItem, errors}'
```

Remove an item after confirmation:

```bash
VARIABLES="$(jq -nc --arg itemId "$ITEM_ID" '{input:{itemId:$itemId}}')"

psn_store_post \
  "wcaRemoveItemFromStoreWishlist" \
  "$VARIABLES" \
  "2c7db29bf47f8edfcd41e206ce485adc7522f016c827d60e93910d1162de7804" |
  jq '{result: .data.storeWishlistRemoveItem, errors}'
```

## Eligible Library Claims

`backgroundPurchase` is not generic game purchasing. Use it only when current Store catalog data shows all of the following:

- The action is exactly `BACKGROUND_PURCHASE` or `BACKGROUND_PURCHASE_AND_DOWNLOAD`.
- The selected SKU is free, already entitled, or otherwise explicitly eligible for a no-payment claim.
- No cart, payment instrument, tax, or paid-order confirmation is required.
- The user confirms the exact title, edition, SKU, and add-to-library effect.

If any condition is uncertain, do not call it.

```bash
SKU_ID="replace-with-verified-eligible-sku-id"
VARIABLES="$(jq -nc --arg skuId "$SKU_ID" '{skuItems:[{skuId:$skuId}]}')"

psn_store_post \
  "backgroundPurchase" \
  "$VARIABLES" \
  "fd4beca09885846c2b83df9820937839c8dc219f2a675aebcb13f02fa77cbddb" |
  jq '{result: .data.webCheckoutCartBuyNow, errors}'
```

After a successful claim, verify the entitlement or purchased library. Do not repeat the mutation because the library view has not updated immediately.

## Ratings and Reviews

All rating and review changes are public account activity. Confirm the product, rating, review text, spoiler flag, vote, or report reason first. For add or modify review, separately require the user to agree to the current review terms before setting `agreeToTermsAndConditions` to `true`.

| Operation | Variables | SHA-256 |
| --- | --- | --- |
| `addStarRatings` | `productId`, rating string `1`-`5` | `70632c710198b27c2def0118746a5f84b5e9711221b5116534f338a5b7cce6a8` |
| `updateStarRatings` | `productId`, rating string `1`-`5` | `b78e16fdc6cc120c24734be0c7dec2542677533b7fb73078ffa01c1addbeeadc` |
| `addProductReview` | product, title, comment, spoiler, terms agreement, optional fingerprint, rating, optional submission properties | `3799e944235544925383412d42de38b80530fd68a794c63f1cda4f5aa48adc71` |
| `modifyReviewForProduct` | same shape as add | `740c108e758bfd44ada1c6f7ad2366a73fa7964b05835e839847b33f3e849884` |
| `deleteReview` | product ID and required Bazaarvoice fingerprint | `7906981664670752538d50df387a7fe0eb99430ed4c2f9d39df1315daf5a2969` |
| `VoteReview` | review ID and `UPVOTE` | `d060c6f983acec32709c308d2b9085768ede4e86f3930f350079d26c25a36b59` |
| `addTextReviewReport` | review ID, numeric reason, optional description | `286eb4de41c91670302f4866d3b1dca2f762940e0bb31ab8c4a1d3591aceaf3c` |

Add a confirmed star rating:

```bash
PRODUCT_ID="replace-with-product-id"
RATING="5"
VARIABLES="$(jq -nc --arg productId "$PRODUCT_ID" --arg rating "$RATING" '{productId:$productId,rating:$rating}')"

psn_store_post \
  "addStarRatings" \
  "$VARIABLES" \
  "70632c710198b27c2def0118746a5f84b5e9711221b5116534f338a5b7cce6a8" |
  jq '{result: .data.addUserRatingForProduct, errors}'
```

Add a confirmed text review:

```bash
REVIEW_TITLE="Confirmed review title"
REVIEW_COMMENT="Confirmed review text"
RATING="5"

VARIABLES="$(jq -nc \
  --arg productId "$PRODUCT_ID" \
  --arg reviewTitle "$REVIEW_TITLE" \
  --arg reviewComment "$REVIEW_COMMENT" \
  --arg rating "$RATING" \
  '{productId:$productId,reviewTitle:$reviewTitle,reviewComment:$reviewComment,reviewIsSpoiler:false,agreeToTermsAndConditions:true,rating:$rating}')"

psn_store_post \
  "addProductReview" \
  "$VARIABLES" \
  "3799e944235544925383412d42de38b80530fd68a794c63f1cda4f5aa48adc71" |
  jq '{result: .data.addReviewForProduct, errors}'
```

Do not invent `fingerPrintForBazaarVoice`. Delete or fingerprint-gated review operations are unavailable if the user does not already have valid current browser-derived fingerprint data.

## Unsupported Mutations

Do not attempt these through this skill:

- Generic paid checkout or purchasing a priced game.
- Cart management without a current complete contract.
- Purchase transaction history through the retired REST endpoint.
- Remote install or delete; no current concrete request contract is available.
- Cloud-save mutation.
- Sending a brand-new friend request; only accepting an incoming request is verified.
- Dynamic push WebSocket control; the firewall currently covers server discovery only.
