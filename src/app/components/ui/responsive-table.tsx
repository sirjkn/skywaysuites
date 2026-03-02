import { ReactNode } from 'react';

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveTable = ({ children, className = '' }: ResponsiveTableProps) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="min-w-full inline-block align-middle">
          {children}
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => {
  return (
    <table className={`w-full ${className}`}>
      {children}
    </table>
  );
};

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export const TableHeader = ({ children, className = '' }: TableHeaderProps) => {
  return (
    <thead className={`bg-gray-50 border-b border-gray-200 ${className}`}>
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export const TableBody = ({ children, className = '' }: TableBodyProps) => {
  return (
    <tbody className={`divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow = ({ children, className = '', onClick }: TableRowProps) => {
  return (
    <tr 
      className={`hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export const TableHead = ({ children, className = '' }: TableHeadProps) => {
  return (
    <th className={`px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td className={`px-3 sm:px-4 md:px-6 py-4 text-sm whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
};
