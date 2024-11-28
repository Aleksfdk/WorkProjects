import { ISlides } from 'types/entities';

export const getSlideKey = (data: ISlides.Common): string => {
  const keys = [data?.contentType, data?.type, data?.responseType];
  const key = keys.reduce((acc, key) => (typeof key !== 'undefined' ? `${acc}.${key}` : acc), '');
  return key.slice(1);
};
