import '../styles/global.css'
import { ApolloProvider} from "@apollo/client";
import {initApolloClient} from './api/apollo-client'
import { useState } from "react";
import  { Provider } from "react-redux";
import store from "../redux/store";
import withRedux from "next-redux-wrapper";

import "@material-tailwind/react/tailwind.css";

function App({ Component, pageProps }) {
  const [client, setClient] = useState(initApolloClient(''))
  return (
    <ApolloProvider client={client}>
      <Provider store = {store}>
        <Component client={client} setClient={setClient} {...pageProps} />
      </Provider>
    </ApolloProvider>
    
  );
}

//makeStore function that returns a new store for every request
const makeStore = () => store;

//withRedux wrapper that passes the store to the App Component
export default withRedux(makeStore)(App);