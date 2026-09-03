interface AutosaveSchema<TData, TResult> {
  safeParse: (
    data: TData
  ) => { success: true; data: TResult } | { success: false };
}

// Persists a step as soon as its values become schema-valid so data survives
// full page navigations (URL jumps, refreshes, the inbox OAuth round trip)
// without waiting for a step transition. Invalid drafts are never saved; the
// transition save and the final submit remain the gates that surface
// validation and save failures.
export const autosaveListener = <TData, TResult>(
  schema: AutosaveSchema<TData, TResult>,
  onValidSubmit: (value: TResult) => void | Promise<void>
) => ({
  onChange: async ({ formApi }: { formApi: { state: { values: TData } } }) => {
    const parsed = schema.safeParse(formApi.state.values);

    if (parsed.success) {
      try {
        await onValidSubmit(parsed.data);
      } catch {
        // Autosave retries on the next change; the transition save and the
        // final submit still surface save failures to the user.
      }
    }
  },
  onChangeDebounceMs: 500,
});
