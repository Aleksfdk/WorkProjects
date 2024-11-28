import { FC, useCallback, useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { useDebounce } from 'common/hooks';
import { useGetAddressSuggestionsQuery } from 'api/student/dadata/dadata.api';
import { Address } from 'types/entities';
import styles from './styles.module.scss';

interface IProps extends SelectProps {
  onChange: (suggestion: Address) => void;
  initialSearch?: string;
}

export const AddressSelect: FC<IProps> = ({ onChange, initialSearch = '', ...props }) => {
  const [skip, setSkip] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [initSearch, setInitSearch] = useState<string>(initialSearch);
  const [debouncedValue] = useDebounce(searchValue, 500);
  const addressSuggestionsQuery = useGetAddressSuggestionsQuery(debouncedValue, { skip });

  useEffect(() => {
    if (!initSearch) return;

    setSkip(!initSearch);
    setSearchValue(initSearch);

    const selected = addressSuggestionsQuery.data?.suggestions?.find((item) => item.value === initialSearch);

    if (selected) {
      onChange(selected);
      setInitSearch('');
    }
  }, [onChange, addressSuggestionsQuery.data, initialSearch, initSearch, setSkip]);

  const onSelect = useCallback(
    (data: string, option: DefaultOptionType) => {
      const selectedCompany = addressSuggestionsQuery.data?.suggestions?.find((item) => item.value === option.value);

      if (selectedCompany) {
        onChange(selectedCompany);
      }
    },
    [addressSuggestionsQuery, onChange]
  );

  const onSearch = (query: string) => {
    setSkip(!query);
    setSearchValue(query);
  };

  const options = addressSuggestionsQuery.data?.suggestions?.map((suggestion) => {
    return (
      <Select.Option key={suggestion.value} value={suggestion.value}>
        <div>{suggestion.value}</div>
      </Select.Option>
    );
  }) || <></>;

  if (addressSuggestionsQuery.isLoading) {
    return <Spin />;
  }

  return (
    <Select {...props} onSelect={onSelect} onSearch={onSearch} className={styles.select} filterOption={false} showSearch>
      {options}
    </Select>
  );
};
