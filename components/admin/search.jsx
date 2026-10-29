'use client';

import useDebounce from "@/hooks/useDebounce";
import { Box, Input, InputGroup } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { LuSearch } from "react-icons/lu";

function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const urlSearch = searchParams.get("search") || "";
  const [value, setValue] = useState(urlSearch);
  const debounce = useDebounce(value, 500);

  const spRef = useRef(searchParams)
  spRef.current = searchParams;
  const lastPushed = useRef(urlSearch);

  useEffect(() => {
    if (urlSearch === lastPushed.current) return;
    lastPushed.current = urlSearch;
    setValue(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const current = spRef.current;
    if (debounce === (current.get("search") || "")) return;

    const params = new URLSearchParams(current.toString());
    if (debounce) {
      params.set("search", debounce);
      params.set("page", "1");
    } else {
      params.delete("search");
      params.delete("page");
    }

    lastPushed.current = debounce;
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debounce]);

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
