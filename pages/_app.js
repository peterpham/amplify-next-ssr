import '../styles/globals.css';

// use a UserProvider so that we can easy access to user information across components
import {UserProvider} from '../context/UserContext';

function MyApp({ Component, pageProps }) {
  return (
  <UserProvider>
    <Component {...pageProps} />
  </UserProvider>
  )
}

export default MyApp
