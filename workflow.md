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
