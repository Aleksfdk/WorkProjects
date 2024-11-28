import { FC } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { useGetAllDictionaryQuery, useGetDictionaryQuery } from 'api/student/dictionary/dictionary.api';

interface IDictionarySelectProps extends SelectProps {
  label: string;
}

export const UniversalSelect: FC<IDictionarySelectProps> = ({ label, ...props }) => {
  const { data: allDictionary } = useGetAllDictionaryQuery();
  const neededDictionary = allDictionary?.find((item) => item.label === label) || { id: '' };
  const dictionaryQuery = useGetDictionaryQuery(neededDictionary?.id);

  return <Select {...props} options={dictionaryQuery.data?.map(({ label, id }) => ({ label, value: id }))} />;
};
