import { useNavigate } from "react-router-dom";

const useRouteHandler = () => {
  const navigate = useNavigate();

  const routeHandler = (url: string) => {
    navigate(`/${url}`);
  };

  return routeHandler;
};

export default useRouteHandler;