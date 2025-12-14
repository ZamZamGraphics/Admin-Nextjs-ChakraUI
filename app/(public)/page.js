export const dynamic = 'force-dynamic';

import { Button, HStack } from "@chakra-ui/react"
import { ColorModeButton } from "@/components/ui/color-mode";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h3>Home Page</h3>
      <HStack>
        <Button asChild colorPalette="green">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild colorPalette="blue">
          <Link href="/admin">Dashboard</Link>
        </Button>
        <ColorModeButton />
      </HStack>
    </div>
  );
}
