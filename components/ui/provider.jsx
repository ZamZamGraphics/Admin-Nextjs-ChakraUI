'use client'
import { SessionProvider } from "next-auth/react"
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { theme } from '../theme'

export function Provider(props) {
  return (
    <SessionProvider>
      <ChakraProvider value={theme}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </SessionProvider>
  )
}
