import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withErrorHandling } from '#/lib/errors'
import { api } from '#/lib/api-client'
import { settingsKeys } from '#/hooks/queries/settings.query'
import type { AdminSettings } from '#/types'

const doSave = withErrorHandling(
  async (patch: Partial<AdminSettings>): Promise<AdminSettings> =>
    api.put('/admin/settings', patch),
  'Unable to save settings',
)

/**
 * Saves site settings; the API merges nested contact/socials/features.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export const useSaveSettingsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doSave,
    onSuccess: (data) => queryClient.setQueryData(settingsKeys.all, data),
  })
}
