import {
    getApiV2MetricGetMetricsOptions,
    getApiV2UserGetUserDisplayNameOptions,
    getApiV2AppPersonGetAppPersonOptions
} from '../../api/@tanstack/react-query.gen';

import {
    QueryObserverResult,
    useQueries,
    useQuery,
} from '@tanstack/react-query';
import { useMemo } from 'react';

interface MetricModel {
    id: number;
    metricOwnerId: string;
    createdUserId: number;
    updatedUserId: number;
}

interface UserDisplayNameResult {
    userId: number;
    displayName: string;
}

export interface UserDisplayNameResponse {
    displayName: string;
}

export interface OwnerDisplayNameResponse {
    fullName: string;
}

interface OwnerDisplayNameResult {
    metricOwnerId: string;
    fullName: string;
}

export const useMetricsDataTransformation = () => {
    const metricsQuery = useQuery(getApiV2MetricGetMetricsOptions());

    const userIds = useMemo(() => {
        const ids = new Set<number>();
        if (metricsQuery.data) {
            (metricsQuery.data as MetricModel[]).forEach((metric) => {
                ids.add(metric.createdUserId);
                ids.add(metric.updatedUserId);
            });
        }
        return Array.from(ids);
    }, [metricsQuery.data]);

    const userDisplayNameQueries = useQueries({
        queries: userIds.map((userId) => ({
            ...getApiV2UserGetUserDisplayNameOptions({
                queryParams: { userId }
            })
        })),
    }) as QueryObserverResult<UserDisplayNameResponse, Error>[];

    const userDisplayNameMap = useMemo(() => {
        const map = new Map<number, string>();
        userDisplayNameQueries.forEach((query: QueryObserverResult<UserDisplayNameResponse, Error>, index: number) => {
            const userId = userIds[index];
            if (query.isSuccess && query.data) {
                map.set(userId, query.data.displayName);
            } else {
                map.set(userId, `User ${userId}`);
            }
        });
        return map;
    }, [userDisplayNameQueries, userIds]);

    // Owner
    const ownerIds = useMemo(() => {
        const ids = new Set<string>();
        if (metricsQuery.data) {
            (metricsQuery.data as MetricModel[]).forEach((metric) => {
                ids.add(metric.metricOwnerId);
            });
        }
        return Array.from(ids);
    }, [metricsQuery.data]);

    const ownerDisplayNameQueries = useQueries({
        queries: ownerIds.map((metricOwnerId) => ({
            ...getApiV2AppPersonGetAppPersonOptions({
                queryParams: { userId: metricOwnerId }
            }),
            enabled: metricOwnerId !== null && metricOwnerId !== undefined,
            retry: false,
        })),
    }) as QueryObserverResult<OwnerDisplayNameResult[], Error>[];

    const ownerDisplayNameMap = useMemo(() => {
        const map = new Map<string, string>();
        ownerDisplayNameQueries.forEach((query: QueryObserverResult<OwnerDisplayNameResult[], Error>, index: number) => {
            const ownerId = ownerIds[index];
            if (query.isSuccess && query.data) {
                map.set(ownerId, query.data[0].fullName);
            } else {
                ownerId !== null
                    ? map.set(ownerId, `Owner ${ownerId}`)
                    : map.set(ownerId, 'Owner Missing');
            }
        });
        return map;
    }, [ownerDisplayNameQueries, ownerIds]);

    const metricsWithUserNames = useMemo(() => {
        if (!metricsQuery.data) {
            return [];
        }
        return (metricsQuery.data as MetricModel[]).map((metric) => ({
            ...metric,
            metricOwner:
                ownerDisplayNameMap.get(metric.metricOwnerId) ||
                `Owner ${metric.metricOwnerId}`,
            createdBy:
                userDisplayNameMap.get(metric.createdUserId) ||
                `User ${metric.createdUserId}`,
            updatedBy:
                userDisplayNameMap.get(metric.updatedUserId) ||
                `User ${metric.updatedUserId}`,
        }));
    }, [metricsQuery.data, ownerDisplayNameMap, userDisplayNameMap]);

    const isLoading =
        metricsQuery.isLoading ||
        (userDisplayNameQueries.length > 0 &&
            userDisplayNameQueries.some((query: QueryObserverResult<UserDisplayNameResponse, Error>) => query.isLoading));

    const isError =
        metricsQuery.isError ||
        (userDisplayNameQueries.length > 0 &&
            userDisplayNameQueries.every((query: QueryObserverResult<UserDisplayNameResponse, Error>) => query.isError));

    const error =
        metricsQuery.error ||
        userDisplayNameQueries.find((query: QueryObserverResult<UserDisplayNameResponse, Error>) => query.error)?.error;

    const status = metricsQuery.status;

    return {
        metrics: metricsWithUserNames,
        metricsQuery,
        isLoading,
        isError,
        error,
        status,
    };
};