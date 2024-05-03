import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type ResponseError = AxiosError<{ statusCode: string; message: string; error: string }>;

type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
    UseMutationOptions<TData, ResponseError, TVariables, unknown>,
    'mutationFn'
>;

export type { ResponseError, UseMutationCustomOptions };
