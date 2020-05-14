import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import rootReducer from "./Store/Reducers/rootReducer";
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import fbConfig from "./Config/fbConfig";
import { I18nextProvider } from "react-i18next";
import { reduxFirestore, getFirestore } from 'redux-firestore'
// import i18n from "./i18n";


const store = createStore(rootReducer,
    compose(
        applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore})),
        reactReduxFirebase(fbConfig, {userProfile: 'users', useFirestoreForProfile: true, attachAuthIsReady: true}),
        reduxFirestore(fbConfig) // redux bindings for firestore
    )
);

store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(
    <Provider store={ store }>
      <I18nextProvider>
          <App />
      </I18nextProvider>
    </Provider>, document.getElementById("root"));
  serviceWorker.register();
});
