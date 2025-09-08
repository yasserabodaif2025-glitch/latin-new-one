/**
 * Financial-related types and interfaces
 * Generated based on the Swagger API documentation
 */

export interface CreateExpenseDto {
  /**
   * The account code for the expense
   * @minLength 1
   */
  accountCode: string;

  /**
   * The amount of the expense
   * @format double
   * @minimum 0.01
   */
  amount: number;

  /**
   * Description of the expense
   * @minLength 1
   */
  description: string;

  /**
   * The date and time when the expense occurred
   * @format date-time
   */
  expenseDate: string;

  /**
   * Additional notes about the expense
   */
  notes?: string;
}

export interface CreateStaffExpenseDto {
  /**
   * The amount of the expense
   * @format double
   * @minimum 0.01
   */
  amount: number;

  /**
   * Description of the expense
   * @minLength 1
   */
  description: string;

  /**
   * The date and time when the expense occurred
   * @format date-time
   */
  expenseDate: string;

  /**
   * Additional notes about the expense
   */
  notes?: string;
}

export interface ExpenseDto {
  /**
   * Unique identifier for the expense
   * @format int64
   */
  id: number;

  /**
   * The account code for the expense
   */
  accountCode: string;

  /**
   * The amount of the expense
   * @format double
   */
  amount: number;

  /**
   * Description of the expense
   */
  description: string;

  /**
   * The date and time when the expense was created
   * @format date-time
   */
  createdAt: string;

  /**
   * The date and time when the expense was last updated
   * @format date-time
   */
  updatedAt: string;

  /**
   * The date and time when the expense occurred
   * @format date-time
   */
  expenseDate: string;

  /**
   * Additional notes about the expense
   */
  notes?: string;

  /**
   * ID of the user who created the expense
   * @format int64
   */
  createdById?: number;

  /**
   * Name of the user who created the expense
   */
  createdByName?: string;
}

export interface ExpensePaginationResult {
  /**
   * The current page number
   * @format int32
   */
  page: number;

  /**
   * The number of items per page
   * @format int32
   */
  pageSize: number;

  /**
   * The total number of items available
   * @format int64
   */
  total: number;

  /**
   * Whether there are more items available
   */
  hasMore: boolean;

  /**
   * The collection of expense items
   */
  items: ExpenseDto[];
}

/**
 * Parameters for querying expenses with pagination
 */
export interface ExpenseQueryParams {
  /**
   * The page number to retrieve
   * @minimum 1
   * @default 1
   */
  page?: number;

  /**
   * The number of items per page
   * @minimum 1
   * @maximum 100
   * @default 10
   */
  pageSize?: number;

  /**
   * Filter expenses by account code
   */
  accountCode?: string;

  /**
   * Filter expenses by description (case-insensitive contains)
   */
  description?: string;

  /**
   * Filter expenses created after this date
   * @format date-time
   */
  fromDate?: string;

  /**
   * Filter expenses created before this date
   * @format date-time
   */
  toDate?: string;

  /**
   * Field to sort by
   * @default "createdAt"
   */
  sortBy?: 'createdAt' | 'amount' | 'expenseDate';

  /**
   * Sort order
   * @default "desc"
   */
  sortOrder?: 'asc' | 'desc';
}

export interface ReceiptDto {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  date: string;
  receiptNumber?: string;
  description: string;
  type: string;
  receiptType?: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  enrollment?: string;
  serviceType?: string;
}

export interface ReceiptPaginationResult {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  items: ReceiptDto[];
}

export interface ReceiptQueryParams {
  page?: number;
  pageSize?: number;
  employeeId?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'createdAt' | 'amount' | 'date';
  sortOrder?: 'asc' | 'desc';
}
