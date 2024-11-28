import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * to check if error body has code
 * @props
 * error :FetchBaseQueryError | SerializedError | undefined
 * status :number
 * code :string
 * @returns boolean
 * */

interface ICheckErrorArgs {
  error: FetchBaseQueryError | SerializedError | undefined;
  status: number;
  code?: string | number;
}

export const checkError = (args: ICheckErrorArgs): boolean => {
  const { error, status, code } = args;

  let result = false;
  // @ts-ignore
  if (error) result = error?.status === status;
  // @ts-ignore
  if (code) result = (result && (error?.data?.ErrorCode || [])[0]) || error?.data?.code === code;

  return result;
};
