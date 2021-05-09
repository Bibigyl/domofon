import Head from "next/head";

import { Cabinet } from "app";

export default function Home() {
  return (
    <>
      <Head>
        <title>Личный кабинет</title>
      </Head>

      <Cabinet />
    </>
  );
}
