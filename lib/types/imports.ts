export interface DataImport {
  id: number

  file_name: string

  total_rows: number

  imported: number

  updated: number

  skipped: number

  errors: number

  status:
    | "processing"
    | "done"
    | "failed"

  created_at: string
}

export interface ImportsResponse {
  count: number

  next: string | null

  previous: string | null

  results: DataImport[]
}