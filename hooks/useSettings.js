"use client"

import { api } from "@/utils/clientFetch";
import { useCallback, useEffect, useState } from "react";

function useSettings() {
  const [limit, setLimit] = useState(10)
  const [darkMode, setDarkMode] = useState(true)
  const [email, setEmail] = useState(false)
  const [sms, setSMS] = useState(false)

  const fetchSettings = useCallback(async () => {
    const res = await api("/v2/settings");
    const data = await res.json()
    setLimit(data?.perPage)
    setDarkMode(data?.darkMode)
    setEmail(data?.emailChecked)
    setSMS(data?.smsChecked)
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { limit, darkMode, email, sms }
}

export default useSettings

