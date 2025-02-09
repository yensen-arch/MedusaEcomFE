// queries.js
import { gql } from '@apollo/client';

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

