import { FC, useCallback, useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { useDebounce } from 'common/hooks';
import { useGetCompanySuggestionsQuery } from 'api/student/dadata/dadata.api';
import { ISuggestion } from 'types/entities';
import styles from './styles.module.scss';

interface IProps extends SelectProps {
  onChange: (suggestion: ISuggestion) => void;
  initialSearch?: string;
}

export const CompanySelect: FC<IProps> = ({ onChange, initialSearch = '', ...props }) => {
  const [skip, setSkip] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [initSearch, setInitSearch] = useState<string>(initialSearch);
  const [debouncedValue] = useDebounce(searchValue, 500);
  const companySuggestionsQuery = useGetCompanySuggestionsQuery(debouncedValue, { skip });

  useEffect(() => {
    if (!initSearch) return;

    setSkip(!initSearch);
    setSearchValue(initSearch);

    const selected = companySuggestionsQuery.data?.suggestions?.find((item) => item.value === initialSearch);

    if (selected) {
      onChange(selected);
      setInitSearch('');
    }
  }, [onChange, companySuggestionsQuery, initialSearch, initSearch, setSkip]);

  const onSelect = useCallback(
    (data: string, option: DefaultOptionType) => {
      const selectedCompany = companySuggestionsQuery.data?.suggestions?.find((item) => item.value === option.value);

      if (selectedCompany) {
        onChange(selectedCompany);
      }
    },
    [companySuggestionsQuery, onChange]
  );

  const onSearch = (query: string) => {
    setSkip(!query);
    setSearchValue(query);
  };

  const options = companySuggestionsQuery.data?.suggestions?.map((suggestion) => (
    <Select.Option key={suggestion.value} value={suggestion.value}>
      <div>{suggestion.value}</div>
      <div className={styles.select}>{suggestion.data.address.value}</div>
    </Select.Option>
  )) || <></>;

  if (companySuggestionsQuery.isLoading) {
    return <Spin />;
  }

  return (
    <Select {...props} onSelect={onSelect} onSearch={onSearch} className={styles.select} filterOption={false} showSearch>
      {options}
    </Select>
  );
};
