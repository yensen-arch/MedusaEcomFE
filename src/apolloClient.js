
  // apolloClient.js
  import { ApolloClient, InMemoryCache } from '@apollo/client';

  const client = new ApolloClient({
    uri: 'https://api.clothd.co/graphql/',
    cache: new InMemoryCache(),
  });

  export { client };
