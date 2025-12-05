'use client';

import { Tabs } from "@chakra-ui/react"
import GeneralSettings from "./general"
import Authentication from "./authentication"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Trusted from "./trusted";

function SettingsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [value, setValue] = useState('general')

    const handleTabChange = (value) => {
        setValue(value);
        router.replace(`${pathname}#${value}`);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'authentication' || hash === 'general') {
                setValue(hash)
            }
        }
    }, []);

    return (
        <Tabs.Root value={value} onValueChange={(e) => handleTabChange(e.value)}>
            <Tabs.List>
                <Tabs.Trigger value="general">General</Tabs.Trigger>
                <Tabs.Trigger value="authentication">Authentication</Tabs.Trigger>
                <Tabs.Trigger value="trusted">Trusted Device</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="general">
                <GeneralSettings />
            </Tabs.Content>
            <Tabs.Content value="authentication">
                <Authentication />
            </Tabs.Content>
            <Tabs.Content value="trusted">
                <Trusted />
            </Tabs.Content>
        </Tabs.Root>
    )
}

export default SettingsPage
