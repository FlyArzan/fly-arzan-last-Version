import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PropTypes from "prop-types";

const queryClient = new QueryClient();

const TanstackQueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

TanstackQueryProvider.propTypes = {
  children: PropTypes.node,
};

export default TanstackQueryProvider;
