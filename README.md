# Product Explorer

A small React storefront where users can browse, search, filter and sort products, view details, and manage a cart. Data from free public DummyJSON API.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS + React Router 7 + Zustand + Axios + Vitest

**Links:**

- Live: <https://product-explorer-phi-lyart.vercel.app/>
- API: https://dummyjson.com/docs/products

## Setup

```sh
git clone <https://github.com/samantasubedi/productExplorer>
cd productExplorer
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm test         # vitest run (all 3 tests)
npm run lint
```

### State Management

I used **Zustand** for cart state management because it is simple, has less boilerplate, and is a good fit for this project's small scope. It also makes it easy to manage shared cart state across components.

### (BUG) Search Input and URL Synchronization

I already had an effect for **search input → URL** synchronization. The remaining problem was **URL → search input**, especially with browser back/forward navigation.

Initially i was doing:

```js
const searchText = searchParams.get("q") ?? "";
const [searchInput, setSearchInput] = useState(searchText);
```

This only works on the first render because `useState()` uses `searchText` as the initial value. And my back and forward buttons of browsers were not working.
I first tried:

```js
if (searchText !== searchInput) {
  setSearchInput(searchText);
}
```

This synced the URL correctly, but caused a bug while typing. `searchInput` can temporarily differ from `searchText`, so it would immediately overwrite the user's input. I also tried `useEffect`, but it caused cascading re-render issues with the existing search synchronization logic.

I solved URL → input synchronization by tracking the previous URL value:

```js
const [prevQ, setPrevQ] = useState(searchText);

if (searchText !== prevQ) {
  setPrevQ(searchText);
  setSearchInput(searchText);
}
```

Now `prevQ` detects an actual URL change without interfering with normal typing.

Another issue was that each search update created a separate browser history entry, so searching `react` could create history entries for each update. I fixed this with:

```js
setSearchParams(updateParams, { replace: true });
```

`replace: true` replaces the current history entry instead of creating a new one, keeping the browser history clean.

**Final roles:**

- `searchText` → URL value
- `searchInput` → user's current input
- `prevQ` → detects URL changes
- `replace: true` → prevents unnecessary history entries

### What I would improve with more time

1. **Use React Query (or SWR) for data fetching.** It would replace my hand-written `AbortController` and loading/error state with built-in caching, request deduplication, retries, and background refetching. Navigating back to the list would also feel instant, because the previous results would already be cached.

2. **Combine search and category on the client, since the API supports only one at a time, and add a client-side sort fallback.**

## Decisions and tradeoffs

- **Search vs category exclusive:** DummyJSON has separate `/search` and `/category` endpoints, so I clear one when the other is selected. Combining both would require additional client-side logic.

- **Numbered pagination over Load more:** Used `limit=12` and `skip` with a shareable `?page=` parameter. This keeps the DOM limited and makes navigation simple. Tradeoff: each page change fetches new products and scrolls to the top instead of smoothly appending products.

- **No TanStack Query:** It felt unnecessary for this project's scope and setup time. Instead, I used a custom `useProducts` hook with Axios and `AbortController` to cancel outdated requests. Tradeoff: no built-in caching.

- **Debounced search:** Used local `searchInput` with `useDebouncedValue(400ms)` to update `?q=` only after the user stops typing. This keeps typing responsive and reduces unnecessary API calls. Tradeoff: URL and input synchronization needs extra handling, and `{ replace: true }` is needed to avoid creating too many browser history entries.
-

## AI Usage

- **Testing:** Used AI to help write tests because I had no prior experience with testing. I reviewed the tests and learned how they work.
- **Custom filter select:** Used AI to explore solutions for a mobile UI issue where the native HTML select popup was not rendering properly within the mobile viewport. This led me to implement a custom select popup for better control over the UI.
- **Exploring solutions:** Used AI to explore possible solutions for implementation challenges, such as synchronizing URL search parameters with the search input. I evaluated the approaches and implemented the solution myself.
