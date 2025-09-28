'use client';
import {
    Pagination as ChakraPagination,
    usePaginationContext,
} from '@chakra-ui/react';
import { Flex, ButtonGroup, Button } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function Pagination({ limit, totalData }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(totalData / limit);

    // Default page = 1
    const currentPage = Number(searchParams.get('page')) || 1;
    const [pageNumber, setPageNumber] = useState(currentPage);

    // Sync state if URL changes manually
    useEffect(() => {
        if (currentPage !== pageNumber) {
            setPageNumber(currentPage);
        }
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        setPageNumber(newPage);

        // Preserve other query params
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
            if (key !== 'page') params.set(key, value);
        });
        params.set('page', newPage.toString());

        router.replace(`${pathname}?${params.toString()}`);
    };

    const PaginationLink = ({ children, page, isNumber = false }) => {
        const pagination = usePaginationContext();

        let newPage;
        if (isNumber) {
            newPage = page;
        } else if (page === 'prev') {
            newPage = pageNumber - 1 >= 1 ? pageNumber - 1 : null;
        } else if (page === 'next') {
            newPage = pageNumber + 1 <= totalPages ? pageNumber + 1 : null;
        }

        const isDisabled = newPage === null || newPage === undefined;

        const isActive = isNumber && page === pageNumber;

        return (
            <Button
                onClick={() => !isDisabled && handlePageChange(newPage)}
                disabled={isDisabled}
                colorPalette='gray'
                variant={isActive ? 'solid' : 'outline'}
            >
                {children}
            </Button>
        );
    };

    return (
        <Flex w="full" bg="bg" alignItems="center" justify="flex-end" px={5} py={2}>
            <ChakraPagination.Root
                count={totalData}
                pageSize={limit}
                page={pageNumber}
                onPageChange={(e) => handlePageChange(e.page)}
            >
                <ButtonGroup variant="ghost" size="sm">
                    <PaginationLink page="prev">
                        <LuChevronLeft />
                    </PaginationLink>

                    <ChakraPagination.Items
                        render={(page) => (
                            <PaginationLink key={page.value} page={page.value} isNumber>
                                {page.value}
                            </PaginationLink>
                        )}
                    />

                    <PaginationLink page="next">
                        <LuChevronRight />
                    </PaginationLink>
                </ButtonGroup>
            </ChakraPagination.Root>
        </Flex>
    );
}

export default Pagination;
