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

- create folder `ProductDetail` in `pages` folder, set route `:id` in `useRouteElements` file

- There are 2 main parts: product info (images, title, rating, sold number, price, cart, CTA button) and product description (description is provided in html code)

- use `DOMPurify` package to exclude JS from `html code` => to prevent XSS attack

### 5.2. Image Slider of product

- product detail page

### 5.3. Image Zooming

- hover on active image and the image will be zoomed

- when we hover and move on relative `div` (onMouseMove), the `absolute image` will re-set up top and left (with `style` property on `img` element), while height and width will be calculated again (bigger) going back to original width and height of image. Or we can use `ref`

- potential problem: bubble event => hover on parent `div` as the same time as son `div` => use `pointer-event-none` to `image` element to prevent this element receieve the event, and only the `div` element get it

### 5.4. URL friendly with SEO (like Shopee)

- URL form : host/name-of-product-i.id (in `Product` component)

If we delete `name-of-product`, link still work because link will use `id` as query to call api product

- Before displaying info on URL, we should `sanitize` them to remove `special characters` such as `/` => create `generateNameAndId` in `utils.ts` file

- Issue: `vite` will not regconize `.` on URL => can sustitute `.` with `-`

### 5.5. Search function

- on URL in `ProductList` page, we use `QueryConfig` to work with query params on url. Now we need to use thses `QueryConfig` on `Header` component to know on which state we are (which filter we are using).

- if we check `Components` on Devtool, Header and `ProductList` will be on the same level => to get `QueryConfig` for `Header` , we will use a customized hook named `useQueryConfig` which will check url and retrieve the `queryConfig` (query params), so both components can use this `QueryConfig` without transfer them from `ProductList` to `Header`

- for `search` form, we dont need to validate the entry data. we only refuse to let user submit if there is nothing enter.

### 5.6. Similar products

### 5.7. Separate `QuantityController` component

- Because this component is reusable (in `cart`, `product details`), we will seperate it as an independent component.

- This component is a combination between 2 buttons and 1 input.

- Functioning: each product has a limit units available (inventory), if we add (click on `+` button) more than number of inventory, it will go back to number of inventory.

### 5.8. Analyze and define `purchases` api

- We will define 2 api:

1. POST `add-to-cart`
2. GET `purchases` with query param which display status of products in cart (from -1 to 5)

- Create `purchase` type (`types` folder)
- Define `purchaseApi` (including get `/purchases` and `/purchases/add-to-cart`)
- Create `purchaseStatus` constant (`constant` folder)

### 5.9. Add product to cart

- add `addToCart` function in `ProductDetail`
- display products in `cart` on `Header`
- Flow: `addToCart`, and call again `/purchases` api, to get purchase list, to update the cart on `Header`.

## 6. Cart Page

### 6.1. Update InputNumber and quantityController with local state component

### 6.2. Use useController API to create InputV2

- this is an API from react-hook-form, help to shorten code related to Controller of react-hook-form. And this component is only used with react-hook-form. This input can sustitute both `Input` component and `NumberInput` component.
- Test only on `AsideFilter` component, not `QuantityController` or `NumberInput` component

### 6.3. Define Api for purchasing in cart and fix logout mistake which has not cleaned data on React Query

- when logout, `Header` will not call again the `purchases` api to get list of buy on `cart` item
- after logout, the buy list popover on `cart` item must be cleared
- define api of purchasing: put `update-purchase`, delete and post `buy-product`

### 6.4. Code Cart page UI

- add route in `useRouteElements` file
- create `Cart` folder in `pages`

### 6.5. Manage `Checked` all and `unChecked`all in cart

- use `useState` hook to manage state of each purchase, add more properties to state including : `checked` and `disabled`

- can use `immer` package simplify the change of state in redux

### 6.6. Update purchase in Cart

- work with `QuantityController` component
- call `update` api whenever increase or decrease the quantity, and if modify by number, api will be called after finishing auto-focus on `numberInput`
- use `keyBy` of lodash => use `keyBy` \_id to get purchase

### 6.7. Delete purchase and buy product

- For `delete`, will have delete 1 purchase or many purchases at the same time => create two delete method for two cases.

### 6.8. UI CartLayout and custom hook `useSearchProducts`

- separate the upper part of Header as `NavHeader` component with function `logout` and links to `Profile` and `My Order`

- create `useSearchProducts` hook to use for both search froms in `CartHeader` and `Header`

### 6.9. Function to buy only product when clicking on button `Buy Now`

- use `useLocation` of `react-hook` to transfer state from one page to another

- when click on button `Buy Now` on `Product Detail` page (state as null) , a `purchase` api will be called to add a new purchase to the purchases list, navigate user to the `cart` page with the new state (info of new purchase), this info can be retrieved by using `useLocation` hook from `react-router`. Therefore, the new purchase will appear in `Cart` page with a `checked` state.

```ts
{pathname: '/cart', search: '', hash: '', state: {…}, key: 'nt31l92b'}
hash: ""
key: "nt31l92b"
pathname: "/cart"
search: ""
state:
  purchaseId: "6776e806fb373204161ed439"
  [[Prototype]]: Object
[[Prototype]]: Object
```

- In this app, state of cart will only be reset when we use `F5` (unmount and mount the component again). But when we are in cart, there are some purchases which have been checked, we navigate to another page, and later coming back to `cart` page, the `checked` purchases are stilled in `checked` state, not losing it previous state. So solve this problem, we will use `contextApi` to save the state as a global state, we will still maintain the state when moving between `pages` => move `extendedPurchases` to appContext.

- use `useMemo` to optimize performance, for loop or calculation such as :

```ts
// check if all purchase is `checked`
// if all purchases are checked, this input will be checked
const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)

// get checked purchases and its length
const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
const checkedPurchasesCount = checkedPurchases.length

// calculate total price of checked purchases
const totalCheckedPurchasesValue = checkedPurchases.reduce((result, current) => {
  return result + current.product.price * current.buy_count
}, 0)

// calculate saved money
const totalCheckedSavingValue = checkedPurchases.reduce((result, current) => {
  return result + (current.product.price_before_discount - current.product.price) * current.buy_count
}, 0)
```

- Note: use `useMemo`, need to pass enough dependencies. Using `useMemo`, we will only re-compute above value again when one of the dependencies has changed. For `variable`, use `useMemo`. For function, use `useCallback`

## Reference:

[Format_a_number_as_currency_in_js](https://dev.to/saranshk/how-to-format-a-number-as-currency-in-javascript-587b)
