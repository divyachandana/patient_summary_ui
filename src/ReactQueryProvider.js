// Import necessary libraries and components
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

// Create a query client instance
const queryClient = new QueryClient();

// Create a provider component for React Query
const ReactQueryProvider = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

// Export the provider component
export default ReactQueryProvider;
