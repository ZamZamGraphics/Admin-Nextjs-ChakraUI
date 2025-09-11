'use client';

import useDebounce from "@/hooks/useDebounce";
import { Box, Input, InputGroup } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu";

function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [value, setValue] = useState(initialSearch);

  const debounce = useDebounce(value, 500);
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debounce) {
      params.set("search", debounce);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  }, [debounce, pathname, replace, searchParams]);

  return (
    <Box bg="bg" w="sm">
      <InputGroup startElement={<LuSearch />}>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      </InputGroup>
    </Box>
  );
}

export default Search;
