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

export const LOGOUT_MUTATION = gql`
  mutation TokenRemove {
    tokenRemove {
      accountErrors {
        field
        message
      }
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
      lines {
        id
        quantity
        variant {
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
