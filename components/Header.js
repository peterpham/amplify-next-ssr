// components/Header.js
import React from 'react';

import { AmplifySignOut } from '@aws-amplify/ui-react';
import { useUser } from '../context/UserContext';

const Header = () => {
  let {user} = useUser();
  console.debug('user',user)
    
  return (
      <div className="Header">
        <a href="/">Amplify SSR with Next.JS</a>
        {
          user ? <AmplifySignOut buttonText={`Sign out ${user.username}`}></AmplifySignOut> : ''
        }
      </div>
  );
}

export default Header;