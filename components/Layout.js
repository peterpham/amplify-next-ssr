// components/Layout.js

import Header from "./Header";
import Head from "next/head";

const layoutStyle = {

};

const contentStyle = {

};

const Layout = props => (
  <div className="Layout" style={layoutStyle}>
    <Head>
        <title>Amplify SSR</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <div className="Content" style={contentStyle}>
      {props.children}
    </div>
  </div>
);

export default Layout;