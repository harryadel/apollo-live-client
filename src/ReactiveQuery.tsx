import * as React from 'react';
import { useEffect } from 'react';
import { reduceStore } from './reduceStore';
import { useQuery, QueryResult } from '@apollo/client/react';
import { OperationVariables } from '@apollo/client/core';
import { DocumentNode } from 'graphql';

export interface ReactiveQueryProps {
  children: (result: QueryResult) => React.ReactNode;
  query: DocumentNode;
  subscription: DocumentNode;
  variables?: OperationVariables;
  // Apollo Client query options
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
  errorPolicy?: 'none' | 'ignore' | 'all';
  notifyOnNetworkStatusChange?: boolean;
  skip?: boolean;
  onCompleted?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export default function ReactiveQuery({
  children,
  subscription,
  query,
  variables,
  ...rest
}: ReactiveQueryProps) {
  const queryResult = useQuery(query, { ...(variables && { variables }), ...rest });
  const { subscribeToMore } = queryResult;

  useEffect(() => {
    if (!subscribeToMore) {return;}

    const unsubscribe = subscribeToMore({
      document: subscription,
      ...(variables && { variables }),
      updateQuery: (prev: unknown, { subscriptionData }: { subscriptionData: { data?: Record<string, unknown> } }) => {
        if (!subscriptionData?.data) {return prev;}

        const storeName = Object.keys(subscriptionData.data)[0];
        if (!storeName) {return prev;}

        const prevData = prev as Record<string, unknown>;
        const newStore = {
          ...prevData,
          [storeName]: reduceStore(
            subscriptionData.data[storeName] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            prevData[storeName] as any // eslint-disable-line @typescript-eslint/no-explicit-any
          ),
        };

        return newStore;
      },
    });

    return unsubscribe;
  }, [subscribeToMore, subscription, variables]);

  return <>{children(queryResult)}</>;
}
