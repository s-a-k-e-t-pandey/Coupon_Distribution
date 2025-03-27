import { motion } from 'framer-motion';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
}

export const DataTable = ({ title, columns, data }: DataTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      <ScrollArea.Root className="w-full overflow-hidden">
        <ScrollArea.Viewport className="w-full h-[400px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-3 text-gray-400 font-medium"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-3 text-gray-300">
                      {row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-800 transition-colors duration-[160ms] ease-out hover:bg-gray-700 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </motion.div>
  );
};