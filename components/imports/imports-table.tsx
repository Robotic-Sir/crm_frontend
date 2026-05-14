import { DataImport } from "@/lib/types/imports"

interface ImportsTableProps {
  imports: DataImport[]
}

export function ImportsTable({
  imports,
}: ImportsTableProps) {
  if (!imports.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
        No imports found
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">
              File
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-left">
              Total Rows
            </th>

            <th className="p-4 text-left">
              Imported
            </th>

            <th className="p-4 text-left">
              Updated
            </th>

            <th className="p-4 text-left">
              Errors
            </th>
          </tr>
        </thead>

        <tbody>
          {imports.map((item) => (
            <tr
              key={item.id}
              className="border-b"
            >
              <td className="p-4">
                {item.file_name}
              </td>

              <td className="p-4 capitalize">
                {item.status}
              </td>

              <td className="p-4">
                {item.total_rows}
              </td>

              <td className="p-4">
                {item.imported}
              </td>

              <td className="p-4">
                {item.updated}
              </td>

              <td className="p-4">
                {item.errors}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}