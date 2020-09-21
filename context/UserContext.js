import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsExports from "../src/aws-exports";
Amplify.configure({ ...awsExports, ssr: true });

// Create a context that will hold the values that we are going to expose to our components.
// Don't worry about the `null` value. It's gonna be *instantly* overriden by the component below 
export const UserContext = React.createContext(null);

// Create a "controller" component that will calculate all the data that we need to give to our
// components bellow via the `UserContext.Provider` component. This is where the Amplify will be
// mapped to a different interface, the one that we are going to expose to the rest of the app.
export const UserProvider = ({ children }) => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);
    React.useEffect(() => {
        // attempt to fetch the info of the user that was already logged in
        Auth.currentAuthenticatedUser()
        .then(user => setUser(user))
        .catch(() => setUser(null));
    }, []);


    // Make sure to not force a re-render on the components that are reading these values,
    // unless the `user` value has changed. This is an optimisation that is mostly needed in cases
    // where the parent of the current component re-renders and thus the current component is forced
    // to re-render as well. If it does, we want to make sure to give the `UserContext.Provider` the 
    // same value as long as the user data is the same. If you have multiple other "controller"
    // components or Providers above this component, then this will be a performance booster.
    const values = React.useMemo(() => ({ user, authState}), [user, authState]);
    
    // Finally, return the interface that we want to expose to our other components
    return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

// We also create a simple custom hook to read these values from. We want our React components
// to know as little as possible on how everything is handled, so we are not only abtracting them from
// the fact that we are using React's context, but we also skip some imports.
export const useUser = () => {
  const context = React.useContext(UserContext);
  
  if(context === undefined) {
    throw new Error('`useUser` hook must be used within a `UserProvider` component');
  }
  return context;
};