import { MutationCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSettled: () => {
      queryClient.invalidateQueries();
    },
  }),
});
