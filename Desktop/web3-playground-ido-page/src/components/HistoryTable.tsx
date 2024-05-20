import DataTable from 'react-data-table-component'
import { ReactElement } from 'react'

export interface Row {
  amount: number
  timestamp: number
}

export default function HistoryTable({
  columns,
  data
}: {
  columns: any
  data: Row[]
}): ReactElement {
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: 'black',
        borderBottom: '1px solid white'
      }
    },
    headCells: {
      style: {
        color: 'white'
      }
    },
    rows: {
      style: {
        backgroundColor: 'black'
      }
    },
    cells: {
      style: {
        color: 'white'
      }
    },
    pagination: {
      style: {
        backgroundColor: 'black'
      }
    }
  }
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={true}
      theme="dark"
      customStyles={customStyles}
      responsive
    />
  )
}
