This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Techstack
- Nextjs
- Tailwindcss
- Shadcn UI
- Formik
- React toastify, React-toploader

## Features
- Fake wallet connect with 3 different blockchain
- Wallet page that shows all token balances
- Swap page: user can swap with seleted blockchain, token and amount
  - Fetching rate and fee time time user change the input
  - Or refetching with manual refresh button
  - Handle exception case: insufficent amount, loading
  - Lazy load of token + image on Token selector popup
  - Skeleton loading

## Enhancements
- Toast message is not implemented
- Import token by address which is not supported already


