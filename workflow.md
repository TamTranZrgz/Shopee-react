# Shopee-clone

## 1. Set up project

### Install `react` through `vite`

```bash
npm create vite@latest
```

### Install packages related to `eslint`, `prettier` and `tailwindcss`

- install `eslint` and `prettier` packages

```bash
npm i prettier eslint-config-prettier eslint-plugin-prettier @types/node -D
```

- install `tailwindcss`

```bash
npm install -D tailwindcss postcss autoprefixer
```

### import path

- there are 3 environments we will work with: VS code (will direct us to that file when we click on it), ESLint, and Terminal

## 2. React Router

- use `useRoutes` as a customized hook, return value of `useRoutes` is a React element, and is also used to render the route tree
- create customized hook in `useRouteElements.tsx` file, and use it in `app.tsx` file
- create layout file `RegisterLayout.tsx`, and use it to wrap `Register` and `Login` components in `useRouteElements` hook

## 3. Authentication

### 3.1. Register & Login Layout

- set global style (html, body, etc.) for app in `index.css` file
- code UI for `Register` layout. Add `RegisterHeader` and `Footer` components
- code UI for `Register`/`Login` page

### 3.2. Register Form Validation

- validate form with `React Hook Form` library (useForm)
- check `input` using `register` from `useform`

```tsx
<input
  {...register('test', {
    pattern: {
      value: /[A-Za-z]{3}/,
      message: 'error message' // JS only: <p>error message</p> TS only support string
    }
  })}
/>
```

- seperate `rules` for `input` as objects in seperate file (`utils` folder - `rules` file) for re-use later

- create reusable `input` component (./components/Input)

- use `yup` as a library to validate schema. It will validate input data against schema and return with either errors or a valid result.

### 3.3. Declare interface/type and implement `register` api

- Set up `axios` and `react query`: create file http.ts (in `utils` folder) to create an instance of`axios`, use `QueryClient` and `QueryClientProvider` to wrap app (main.ts file), and install `react-query-devtools`.

- Define interface/type to be used for creating `register` api: First, we will define type/interface for `User`, `AuthResponse` and `ApiResponse` (`types` folder). Aftert that, register `auth` api (`api` folder). In this stage, we will register `/register` api that let user to register an account (`post` method) later.

- Implement calling `register` api: use `useMutation` hook from `@tanstack/react-query` in `Register` page (`Register.ts` file)

### 3.4. Handle '422' error & other errors returned from server

- Show 422 error => base on `onError` to get error. First, use `setError` from `useForm` hook, when we get error, we will set error into `react hook form`, and `react-hook-form` will show error on client side.

- Show other errors : use `react-toastify` to display other types of error (not form input data error). First, integrate `axios interceptor` function and `toast` object in `https.ts` file. Then, include `ToastContainer` component in `App` component (`App.tsx` file)

### 3.5. Implement Login

- same with Register process, but we must omit `confirm_password` from `Schema` (login form only needs `email` and `password`)

```tsx
type FormData = Omit<Schema, 'confirm_password'>
```

### 3.6. UI Header (Main Layout)

- re-use Footer
- create `Header` component for `main layout` which is different from `register layout`
- use `framer motion` library for popover

```bash
npm install motion
```

- use `floating ui` library to calculate positions to display floating elements suchas as tooltips, popovers, dropdowns, etc. and optionally create interactions for them

```bash
npm install @floating-ui/react
```

- create `Popover` component to re-use for different popover comonents
- create `cart` based on `Popover` component
- setup `protected route` and `rejected route` with `react-router`: create `ProtectedRoute` inside `useRouteElements.tsx` file

```tsx
const isAuthenticated = false

function ProtectedRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
```

### 3.7. Complete authentication module and Optimization

- to manage the `authentication mode`, use `state` of ``Context API` -> create `app.context.tsx` file (contexts folder).
- create `auth.ts` (in `utils` folder) to create functions serving the authenticaton such as : save access_token to local storage, remove access_token from local storage, get access_token from local storage
- create a context to manage the authentication state for the whole app, and use the `provider` to wrap the app (`main.tsx` file)
- handle `login` at `axios` stage (`https.ts` file in `utils` folder) -> save `access_token` to local storage (use Interceptor). At the same time, use `interceptors` to get access_token from LS when app start, and save it to RAM memory (retrieve info from RAM with be faster than from LS).
- implement `navigate` to redirect user to pages that user has permission after actions such as `login`, `register`, `logout`
- prevent user from clicking on `submit button` continuously on `login` and `register` page: create a `Button` component to re-use in `login` and `register` pages
- set `profile` for user after login/register: same as working with access_token

## 4. Product List Page (Home Page)

### 4.1. UI for Aside Filter, SortProductList and Product

- Filtering aside: Display all catagories, According to Price, According to Evaluation, and Delete all filtering
- Main parts: SortProductList (Most Popular, Newest, Most Sale, Price), Pagination, Grid of products
- Because `AsideFilter`, `SortProductList`, and `Product` only exist in `Product List` page, we will create them as `components` in `ProductList` folder
- install package `Multi-line truncation` to truncate the long title

```bash
npm install @tailwindcss/line-clamp
```

Add to `tailwind.config.js` file

```js
plugins: [
  plugin(function ({ addComponents, theme }) {
    addComponents({
      '.container': {
        maxWidth: theme('columns.7xl'),
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: theme('spacing.4'),
        paddingRight: theme('spacing.4')
      }
    })
  }),
  require('@tailwindcss/line-clamp')
]
```

### 4.2. DEfine product interface and api

- product api: GET `/products`
- create three interfaces `Product`, `ProductList`, `ProductListConfig` with `product.type.ts` file (`types` folder)
- create `productApi` in `product.api.ts` file (`api` folder)

### 4.3. Render products in `ProductList` page

- create `seQueryParams()` function to get params from URL (`useQueryParams.tsx` file in `hooks` folder)
- use `useQuery` to render data in `ProductList` page
- in `product` info, there are properties that need attention such as `price` and `quantity`. We will use `Intl.NumberFormat` for their format (Reference: [Format_a_number_as_currency_in_js](https://dev.to/saranshk/how-to-format-a-number-as-currency-in-javascript-587b)). Create two functions `formatNumberToSocialStyle` (ex: 55k, 2k) and `formatCurrency` (ex: $, e, vnd)
- work with `ProductRating`: create `ProductRating` component. We will use this algorithm

Ex: display rating (series of star) if rating = 3.4
1 <= 3.4 => 100% yellow star (the first star)
2 <= 3.4 => 100% yellow star (the secondstar)
3 <= 3.4 => 100% yellow star (the third star)
4 > 3.4 => 40% (4 - 3.4 < 1) (the fourth star)
5 > 3.4 => 0% (5- 3.4 > 1)

### 4.4. Pagination

- use `Link` to move between pages
- Use this format for pagination with gap of 2 unit

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 7 8 ... 19 20
1 2 ... 13 14 [15] 16 17 ... 19 20

1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]

- create `Pagination` component
- in `ProductList` page, `filter` or `pagination` will be manipulated through `query` from URL. The reason for using through query of URL, but not through `state` of React is: if we want to copy and pass the link of the page at that time with our chosen queries, it will be maintained when other received that link.
- when we define the `interface` for `query`, there will be queries with possibilities of undefined. We can use `lodash` library (`omit` function) to omit undefined query

### 4.5. SortProductList

### 4.6. AsideFilter

- filter accroding to `category`: first, create `Category` interface (`types` folder) and `categoryApi` (`api` folder).

- filter according to `range of price`

- filter accroding to rating

- delete all filter

## 5. Product Detail Page

### 5.1. UI Product Detail

- create folder `ProductDetail` in `pages` folder, set route in `useRouteElements` file

## Reference:

[Format_a_number_as_currency_in_js](https://dev.to/saranshk/how-to-format-a-number-as-currency-in-javascript-587b)
