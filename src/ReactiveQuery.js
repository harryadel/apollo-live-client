import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { reduceStore } from './reduceStore';
import { useQuery, QueryResult, OperationVariables } from '@apollo/client';
import { DocumentNode } from 'graphql';

export interface ReactiveQueryProps {
  children: (result: QueryResult) => React.ReactNode;
  query: DocumentNode;
  subscription: DocumentNode;
  variables?: OperationVariables;
  [key: string]: any;
}

export default function ReactiveQuery({
  children,
  subscription,
  query,
  variables,
  ...rest
}: ReactiveQueryProps) {
  const queryResult = useQuery(query, { variables, ...rest });
  const { data, subscribeToMore } = queryResult;

  useEffect(() => {
    if (!subscribeToMore) return;

    const unsubscribe = subscribeToMore({
      document: subscription,
      variables: variables,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData?.data) return prev;

        const storeName = Object.keys(subscriptionData.data)[0];
        if (!storeName) return prev;

        const newStore = {
          ...prev,
          [storeName]: reduceStore(
            subscriptionData.data[storeName],
            prev[storeName]
          ),
        };

        return newStore;
      },
    });

    return unsubscribe;
  }, [subscribeToMore, subscription, variables]);

  return <>{children(queryResult)}</>;
}
