// queries.js
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 10, channel: "default-channel") {
      edges {
        node {
          id
          name
          slug
          description
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
              stop {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          category {
            name
          }
          thumbnail {
            url
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 100) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const GET_SUBCATEGORIES = gql`
  query GetSubcategories($parentCategoryId: ID!) {
    category(id: $parentCategoryId) {
      id
      name
      children(first: 50) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_SUBCATEGORY = gql`
  query GetProductsBySubcategory($subcategoryId: ID!, $channel: String!) {
    products(
      first: 50
      channel: $channel
      filter: { categories: [$subcategoryId] }
    ) {
      edges {
        node {
          id
          name
          slug
          thumbnail {
            url
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProduct($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      id
      name
      slug
      description
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
          stop {
            gross {
              amount
              currency
            }
          }
        }
      }
      category {
        id
        name
      }
      media {
        url
      }
      variants {
        id
        name
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            name
          }
          values {
            name
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProduct($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
          stop {
            gross {
              amount
              currency
            }
          }
        }
      }
      category {
        name
      }
      thumbnail {
        url
      }
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: ID!, $channel: String!) {
    products(
      first: 10
      channel: $channel
      filter: { categories: [$categoryId] }
    ) {
      edges {
        node {
          id
          name
          slug
          description
          pricing {
            priceRange {
              start {
                gross {
                  amount
                }
              }
            }
          }
          media {
            url
          }
          thumbnail {
            url
          }
          variants {
            id
          }
          category {
            name
          }
        }
      }
    }
  }
`;
export const REGISTER_MUTATION = gql`
  mutation RegisterUser($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      errors {
        field
        code
      }
      user {
        email
        isActive
        isConfirmed
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      csrfToken
      user {
        id
        email
      }
      accountErrors {
        field
        message
      }
    }
  }
`;

export const REQUEST_RESET_PASSWORD = gql`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        field
        message
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation {
    tokensDeactivateAll {
      errors {
        field
        message
      }
    }
  }
`;

export const ME_QUERY = gql`
  query {
    me {
      id
      email
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser {
    me {
      id
      email
      firstName
      lastName
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation TokenRefresh($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      errors {
        field
        message
      }
    }
  }
`;
export const ADD_TO_CART = gql`
  mutation AddToCart($checkoutId: ID!, $variantId: ID!, $quantity: Int!) {
    checkoutLinesAdd(
      checkoutId: $checkoutId
      lines: [{ quantity: $quantity, variantId: $variantId }]
    ) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
          }
        }
        lines {
          id
          quantity
          variant {
            id
            name
          }
        }
      }
      errors {
        message
      }
    }
  }
`;

export const ADD_TO_NEW_CART = gql`
  mutation AddToNewCart($variantId: ID!, $quantity: Int!) {
    checkoutCreate(
      input: {
        lines: [{ quantity: $quantity, variantId: $variantId }]
        channel: "default-channel"
      }
    ) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
          }
        }
        lines {
          id
          quantity
          variant {
            id
            name
          }
        }
      }
      errors {
        message
      }
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query GetCartItems($checkoutId: ID!) {
    checkout(id: $checkoutId) {
      id
      totalPrice {
        gross {
          amount
          currency
        }
      }
      subtotalPrice {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      lines {
        id
        quantity
        variant {
          id
          name
          attributes {
            attribute {
              name
            }
            values {
              name
            }
          }
          pricing {
            price {
              gross {
                amount
                currency
              }
            }
          }
          product {
            name
            category {
              name
            }
            thumbnail {
              url
              alt
            }
          }
        }
      }
    }
  }
`;

export const GET_SHIPPING_METHODS = gql`
  query GetShippingMethods($checkoutId: ID!) {
    checkout(id: $checkoutId) {
      shippingMethods {
        id
        name
        price {
          amount
          currency
        }
        minimumDeliveryDays
        maximumDeliveryDays
      }
    }
  }
`;

export const SHIPPING_METHOD_UPDATE = gql`
  mutation CheckoutShippingMethodUpdate(
    $checkoutId: ID!
    $shippingMethodId: ID!
  ) {
    checkoutShippingMethodUpdate(
      checkoutId: $checkoutId
      shippingMethodId: $shippingMethodId
    ) {
      checkout {
        id
        shippingMethod {
          id
          name
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_LINES_UPDATE = gql`
  mutation CheckoutLinesUpdate(
    $checkoutId: ID!
    $lines: [CheckoutLineUpdateInput!]!
  ) {
    checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_SHIPPING_ADDRESS_UPDATE = gql`
  mutation CheckoutShippingAddressUpdate(
    $checkoutId: ID!
    $shippingAddress: AddressInput!
  ) {
    checkoutShippingAddressUpdate(
      checkoutId: $checkoutId
      shippingAddress: $shippingAddress
    ) {
      checkout {
        id
        shippingAddress {
          firstName
          lastName
          streetAddress1
          streetAddress2
          city
          postalCode
          country {
            code
            country
          }
          phone
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_BILLING_ADDRESS_UPDATE = gql`
  mutation CheckoutBillingAddressUpdate(
    $checkoutId: ID!
    $billingAddress: AddressInput!
  ) {
    checkoutBillingAddressUpdate(
      checkoutId: $checkoutId
      billingAddress: $billingAddress
    ) {
      checkout {
        id
        billingAddress {
          firstName
          lastName
          streetAddress1
          streetAddress2
          city
          postalCode
          country {
            code
            country
          }
          phone
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_PAYMENT_CREATE = gql`
  mutation CheckoutPaymentCreate($checkoutId: ID!, $input: PaymentInput!) {
    checkoutPaymentCreate(checkoutId: $checkoutId, input: $input) {
      payment {
        id
        chargeStatus
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_EMAIL_UPDATE = gql`
  mutation CheckoutEmailUpdate($checkoutId: ID!, $email: String!) {
    checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
      checkout {
        id
        email
      }
      errors {
        field
        message
      }
    }
  }
`;
export const CHECKOUT_COMPLETE = gql`
  mutation CheckoutComplete($checkoutId: ID!) {
    checkoutComplete(checkoutId: $checkoutId) {
      order {
        id
        status
        userEmail
        created
      }
      confirmationNeeded
      confirmationData
      errors {
        field
        message
        code
      }
    }
  }
`;
export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders {
    me {
      email
      orders(first: 100) {
        edges {
          node {
            id
            number
            status
            created
            subtotal {
              gross {
                amount
                currency
              }
            }
            shippingPrice {
              gross {
                amount
                currency
              }
            }
            total {
              gross {
                amount
                currency
              }
            }
            paymentStatus
            payments {
              id
              chargeStatus
              gateway
            }
            shippingAddress {
              firstName
              lastName
              streetAddress1
              city
              postalCode
              country {
                country
              }
            }
            lines {
              productName
              quantity
              unitPrice {
                gross {
                  amount
                  currency
                }
              }
              variant {
                product {
                  thumbnail {
                    url
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

export const CHECKOUT_ADD_PROMO_CODE = gql`
  mutation CheckoutAddPromoCode($checkoutId: ID!, $promoCode: String!) {
    checkoutAddPromoCode(checkoutId: $checkoutId, promoCode: $promoCode) {
      checkout {
        id
        discount {
          amount
          
        }
        subtotalPrice {
          gross {
            amount
          }
        }
        totalPrice {
          gross {
            amount
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
