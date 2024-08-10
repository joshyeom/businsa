import { useNavigate } from "react-router-dom";

export const useRouteHandler = () => {
  const navigate = useNavigate();

  const routeHandler = (url: string) => {
    navigate(`/${url}`);
  };

  return routeHandler;
};