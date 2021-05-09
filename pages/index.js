import Head from "next/head";

import { Landing } from "app";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Landing />
    </>
  );
}
