import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import TableHeaderRow from './TableHeaderRow';
import { useClassNames } from '../utils';
import { RsRefForwardingComponent, WithAsProps } from '../@types/common';

export interface TableProps extends WithAsProps {
  rows: any[];
  inSameMonth?: (date: Date) => boolean;
}

const defaultProps: Partial<TableProps> = {
  as: 'div',
  classPrefix: 'calendar-table',
  rows: []
};

const Table: RsRefForwardingComponent<'div', TableProps> = React.forwardRef(
  (props: TableProps, ref) => {
    const { as: Component, className, classPrefix, inSameMonth, rows, ...rest } = props;
    const { merge, withClassPrefix } = useClassNames(classPrefix);
    const classes = merge(className, withClassPrefix());

    return (
      <Component role="table" {...rest} ref={ref} className={classes}>
        <TableHeaderRow />
        {rows.map((week, index) => (
          <TableRow key={index} weekendDate={week} inSameMonth={inSameMonth} />
        ))}
      </Component>
    );
  }
);

Table.displayName = 'Table';
Table.defaultProps = defaultProps;
Table.propTypes = {
  rows: PropTypes.array,
  inSameMonth: PropTypes.func,
  className: PropTypes.string,
  classPrefix: PropTypes.string
};

export default Table;
