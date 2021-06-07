import cl from "./Loading.module.scss";

const Loading = ({ className }) => <div 
  className={`${cl.loading} ${className || ''}`} 
/>;

export { Loading };
