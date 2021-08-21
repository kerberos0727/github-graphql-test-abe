import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, NormalizedCacheObject, concat, createHttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';

let globalApolloClient: ApolloClient<NormalizedCacheObject> = null;

//   //   // globalApolloClient.cache.restore({
//   //   //   ...globalApolloClient.cache.extract(),
//   //   //   ...initialState
//   //   // });
//   // }
//   return globalApolloClient;
// }

// const token = "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";
  // private token = "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";
  
export const initApolloClient = (token: string):ApolloClient<NormalizedCacheObject> =>  {
  const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
  });
  
  const authLink = setContext((_, { headers }) => {
    let _token = '';
    if (token) {
      _token = token;
    } else {
      if (localStorage && localStorage.getItem('apollo-client')) {
        _token = localStorage.getItem('apollo-client');
      }
    }
    
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${_token}`,
      }
    }
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  globalApolloClient = client;
  return client
}
export {globalApolloClient};