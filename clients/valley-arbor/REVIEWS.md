# Valley Arbor — live Google reviews

Goal: the reviews wall always shows Matt's **most recent 5-star** Google reviews, auto-updating, no third-party widget.

## How it is wired

```
Google  ->  fetcher (server-side, key hidden)  ->  reviews.json / /api/reviews  ->  concept.js renders the wall
```

- **Front end (done).** `concept.js` fetches the feed, keeps only `rating === 5`, sorts by `time` newest-first, and builds the scrolling cards. The static cards in the HTML stay as a no-JS / offline fallback. Each card shows the reviewer's name, photo and a link (required by Google's terms).
- **Feed contract.** See `site/reviews.json` (a stand-in feed so it renders today). Shape:
  ```json
  {
    "place": { "name": "...", "rating": 5.0, "total": 48, "url": "https://maps.google..." },
    "reviews": [
      { "author": "Sarah D.", "rating": 5, "time": "2026-06-06T09:12:00+10:00",
        "timeLabel": "4 days ago", "photo": "https://...", "url": "https://maps...",
        "text": "..." }
    ]
  }
  ```
- The site filters + sorts, so the feed can contain everything; non-5-star and older reviews fall off automatically.

## The catch: Google only gives 5 reviews via the easy path

| | **Places API** (New) | **Business Profile API** |
|---|---|---|
| Auth | just an API key | OAuth as the listing owner (Matt) |
| Reviews returned | **5 max**, "most relevant", **cannot be stored** | **all** reviews, true timestamps |
| Time to live | ~1 hour | a few days (access request + approval) |
| Meets "recent 5-star wall" | partly (Matt is 5.0, so the 5 are 5-star) | **fully** |
| Refs | [5-review limit](https://stackoverflow.com/questions/11623912/google-places-api-place-details-limited-to-5-reviews) · [caching policy](https://developers.google.com/maps/documentation/places/web-service/policies) | [get >5 reviews](https://featurable.com/blog/google-places-more-than-5-reviews) |

**Recommendation:** ship the Places path first (live this week, shows the latest 5), then upgrade to the Business Profile path for the full 5-star wall once access is approved.

### Path A - Places API (built: `site/api/reviews.js`)
1. Google Cloud console: create a project, enable **Places API (New)**, add billing.
2. Create an API key, restrict it (HTTP referrers = the live domain, API = Places).
3. Find Valley Arbor's **place id** (Google "Place ID Finder").
4. In Vercel set env vars `GOOGLE_PLACES_KEY` and `GOOGLE_PLACE_ID`. Done - `/api/reviews` goes live, cached 6h.

### Path B - Business Profile API (the full wall, documented)
1. Matt adds Isaiah as a **manager** on the Valley Arbor Google Business Profile (or Matt authorises via OAuth).
2. Request access to the **Business Profile APIs** in Google Cloud (approval form, a few days).
3. Reviews endpoint: `GET https://mybusiness.googleapis.com/v4/accounts/{account}/locations/{location}/reviews`
   returns every review with `starRating` (e.g. `FIVE`), `comment`, `createTime`, `reviewer.displayName`, `reviewer.profilePhotoUrl`.
4. Fetcher (a Vercel function on a cron, or an n8n daily job) maps `starRating === 'FIVE'`, sorts `createTime` desc, writes the feed. Since Matt owns the data, the full set can be served.

## Terms of service - do not skip

- **Attribution:** show each reviewer's name + photo + link to the review/profile (the cards do this).
- **Caching:** do not persist Places review bodies long-term; place ids may be stored. The Business Profile path (Matt's own data) is the one to use if we want to hold a fuller set.
- **Legal pages:** the live site needs a **Terms of Use** and a **Privacy Policy** that reference Google's. Add these before launch.

## 2026-07-08 - the Path A ceiling has been hit; Path B is now the route

Isaiah spotted that the live wall's "newest" review was 4 months old while the listing sat at
52 reviews. Diagnosis confirmed by hitting the APIs directly:

- **Places API (New) cannot deliver "newest".** It returns Google's own "most relevant" 5 with
  no sort parameter (checked docs + live response 2026-07-08: Feb 2026, Jan 2026 x2, Oct 2025,
  Oct 2024). Our code sorts those 5 newest-first, but Google picks the 5.
- **Legacy Places API is a dead end for this listing.** It does support `reviews_sort=newest`
  and our key CAN call it (verified against a known place), but Matt's listing does not exist
  in the legacy backend: place ID returns NOT_FOUND (refresh impossible), and text search,
  find-place, nearby search, and phone-number lookup all return ZERO_RESULTS. Service-area
  businesses created recently are simply not in the legacy index.
- **Conclusion: the 2026-06-11 "Path A only" decision is superseded.** The deal (newest 5-star
  wall) needs the Business Profile API (Path B, recipe above). Concretely: Matt adds Isaiah as
  a manager on the Valley Arbor Google Business Profile, then request Business Profile API
  access in the Google Cloud console (approval takes days), then swap the fetcher. This slots
  naturally into Kelpie onboarding (Kelpie's review-request loop wants that access anyway).
- Until Path B lands, the wall shows the newest of Google's "most relevant" 5. Honest but not
  the deal.

Also fixed 2026-07-08: the marquee "scroll disappears" bug. The seamless -50% loop assumed one
copy of the card set was wider than the screen; with only 5 live cards on a wide window it was
not, so blank space swept through late in every cycle. `concept.js` now measures the row and
repeats the set until it covers it (scaling the animation duration to keep the speed constant),
rebuilds on resize, and applies the same logic to the static no-JS fallback.

## What I need to flip it on
- [x] Decision (2026-06-11): **Path A only.** Isaiah confirmed the most-recent-5 display is all that is wanted, and Matt has only 5-star reviews, so the Places API's 5 returned reviews always fill the wall correctly. Path B stays documented but is not planned.
- [ ] Valley Arbor **place id** - Isaiah: open https://developers.google.com/maps/documentation/places/web-service/place-id (Place ID Finder), search "Valley Arbor Research VIC", copy the `ChIJ...` token. ~30 seconds. (Anonymous lookup is blocked, so this needs a human browser.)
- [ ] Google Cloud project + billing + an API key with **Places API (New)** enabled. Restrict the key by **API only** (Places API (New)); do NOT add an HTTP-referrer restriction, because the key is used server-side from the Vercel function and server calls send no referrer (a referrer-restricted key gets rejected). The key never reaches the browser, so API-only restriction is the correct lockdown.
- [ ] Env vars `GOOGLE_PLACES_KEY` + `GOOGLE_PLACE_ID` in the Vercel project at deploy time.
- [x] Terms/Privacy pages built (2026-06-11): `site/privacy.html` + `site/terms.html`, linked from both page footers, both referencing Google's policies as required. Draft copy; Isaiah to skim before launch.
- [x] Real social URLs found and wired site-wide (2026-06-11): Instagram https://www.instagram.com/valleyarbor/ and Facebook https://www.facebook.com/p/Valley-Arbor-61558923426033/ (footer, gallery CTA, schema sameAs).
- [ ] Real review text for the static no-JS fallback cards: Isaiah to paste the current reviews from the Google listing **as text** (not screenshots), then the placeholder cards get replaced.
