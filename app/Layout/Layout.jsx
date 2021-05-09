import { Header, Footer } from "./components";
import cl from "./Layout.module.scss";

const Layout = (props) => {
  const { children, isLanding } = props;

  return (
    <div className={`${cl.root} ${isLanding ? cl.landing : ""}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export { Layout };
