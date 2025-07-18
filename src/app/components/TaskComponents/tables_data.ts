
import type { Table } from './TaskTable';

/** Example tables used by TaskTable tests and documentation. */
const tables: Record<string, Table> = {
  basic: [
    [
      { text: 'Header 1', highlighted: true },
      { text: 'Header 2', highlighted: true }
    ],
    [
      { text: 'Cell 1' },
      { text: 'Cell 2' }
    ],
    [
      { text: 'Spanning', colspan: 2, align: 'center' }
    ]
  ]
};

export default tables;

