export type SortDirection = 'ASC' | 'DESC';

export interface RankingLevel {
  /**
   * Field name from OrderDto to sort by
   * Examples: 'totalOrderValue', 'customerTier', 'createdAt'
   */
  field: string;

  /**
   * Sort direction (ascending or descending)
   */
  direction: SortDirection;

  /**
   * Sort precedence (1 = highest priority, 2 = secondary, etc.)
   */
  order: number;
}

export interface RankingTemplate {
  /**
   * Unique template identifier
   */
  id: string;

  /**
   * Demand type this template applies to (matches DemandType enum value)
   * Examples: 'RETAIL', 'WHOLESALE', 'D2C'
   */
  demandType: string;

  /**
   * Human-readable template name
   */
  name: string;

  /**
   * Ordered list of ranking levels defining sort precedence
   */
  levels: RankingLevel[];
}
