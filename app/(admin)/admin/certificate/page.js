"use client"

import { Alert, Box, Field, Input, Flex, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import CertificatePreview from "@/lib/certificate/CertificatePreview";

function CertificatePage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [data, setData] = useState("");
    const [studentId, setStudentId] = useState("");
    const [batchNo, setBatchNo] = useState("");

    const handleChange = (name, value) => {
        setData("")
        setError("")
        if (name === "batchNo") {
            setBatchNo(value)
        } else if (name === "studentId") {
            setStudentId(value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch('/api/certificate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ batchNo, studentId }),
            })
            const result = await res.json();
            console.log('[result]', result);
            if (!result?.success) {
                setError({ message: result?.message });
            }

            if (result?.success) {
                const { status } = result?.admission;
                console.log('[status]', status);
                if (status !== "Paid") {
                    setError({ message: "Please pay the due amount of course fees." })
                } else {
                    setData(result?.admission)
                }
            }
        } catch (e) {
            setError({ message: e.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            p={8}
            mx="auto"
            bg="bg"
            rounded="2xl"
            shadow="sm"
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            gap="6"
        >
            <Box flexBasis="25%">
                <Flex direction="column" gap={5}>
                    <Text textStyle="2xl" fontWeight="semibold">Generate Certificate</Text>
                    {error?.message &&
                        <Alert.Root status="error">
                            <Alert.Indicator />
                            <Alert.Title>{error?.message}</Alert.Title>
                        </Alert.Root>
                    }
                    <form onSubmit={handleSubmit}>
                        <Flex
                            direction="column"
                            gap={6}
                        >
                            <Field.Root>
                                <Input
                                    name='batchNo'
                                    value={batchNo}
                                    onChange={(e) => handleChange('batchNo', e.target.value)}
                                    placeholder="Batch No"
                                />
                            </Field.Root>
                            <Field.Root>
                                <Input
                                    name='studentId'
                                    value={studentId}
                                    onChange={(e) => handleChange('studentId', e.target.value)}
                                    placeholder="Student Id"
                                />
                            </Field.Root>
                            <Box mx="auto">
                                <Button
                                    type='submit'
                                    colorPalette="gray"
                                    disabled={loading}
                                >
                                    Generate certificate
                                </Button>
                            </Box>
                        </Flex>
                    </form>
                </Flex>
            </Box>
            <Box flexBasis="75%">
                <Flex my={5} gap={3} direction="column" align="center">
                    {loading && <p style={{ padding: 24 }}>Loading certificate…</p>}
                    {data && <CertificatePreview data={data} />}
                </Flex>
            </Box>
        </Box>
    )
}

export default CertificatePage