import { SortOrder } from 'antd/lib/table/interface';
import { OrderDirection } from '../generated';

export const sortOrderCuts: Record<NonNullable<SortOrder>, OrderDirection> = {
  ascend: 'asc',
  descend: 'desc',
};
