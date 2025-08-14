import api from './api';
import {
  Transaction,
  Budget,
  FinancialGoal,
  Account,
  Category,
  TransactionSummary,
  BudgetSummary,
  GoalSummary,
  DashboardData,
} from '../types/index';

export const financialService = {
  // Dashboard
  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get('/api/financial/dashboard');
    return response.data;
  },

  // Transactions
  async getTransactions(params?: any): Promise<Transaction[]> {
    const response = await api.get('/api/financial/transactions', { params });
    return response.data.transactions || response.data;
  },

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await api.post('/api/financial/transactions', {
      type: transaction.transaction_type,
      category: transaction.category_name,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date
    });
    return response.data.transaction;
  },

  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await api.put(`/api/financial/transactions/${id}`, {
      type: transaction.transaction_type,
      category: transaction.category_name,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date
    });
    return response.data.transaction;
  },

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/api/financial/transactions/${id}`);
  },

  async getTransactionSummary(period: string = 'month'): Promise<TransactionSummary> {
    const response = await api.get(`/api/financial/summary?period=${period}`);
    return response.data;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/api/financial/categories');
    return response.data.categories || response.data;
  },

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    const response = await api.get('/api/financial/budgets');
    return response.data.budgets || response.data;
  },

  async createBudget(budget: Partial<Budget>): Promise<Budget> {
    const response = await api.post('/api/financial/budgets', {
      name: budget.category_name,
      amount: budget.amount,
      category: budget.category_name,
      period: budget.period,
      startDate: budget.start_date,
      endDate: budget.end_date
    });
    return response.data.budget;
  },

  async updateBudget(id: number, budget: Partial<Budget>): Promise<Budget> {
    const response = await api.put(`/api/financial/budgets/${id}`, {
      name: budget.category_name,
      amount: budget.amount,
      category: budget.category_name,
      period: budget.period,
      startDate: budget.start_date,
      endDate: budget.end_date
    });
    return response.data.budget;
  },

  async deleteBudget(id: number): Promise<void> {
    await api.delete(`/api/financial/budgets/${id}`);
  },

  async getBudgetSummary(): Promise<BudgetSummary> {
    const response = await api.get('/api/financial/summary/budgets');
    return response.data;
  },

  // Financial Goals
  async getGoals(): Promise<FinancialGoal[]> {
    const response = await api.get('/api/financial/goals');
    return response.data.goals || response.data;
  },

  async createGoal(goal: Partial<FinancialGoal>): Promise<FinancialGoal> {
    const response = await api.post('/api/financial/goals', {
      title: goal.title,
      description: goal.description,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date,
      goal_type: goal.goal_type,
      priority: goal.priority
    });
    return response.data.goal;
  },

  async updateGoal(id: number, goal: Partial<FinancialGoal>): Promise<FinancialGoal> {
    const response = await api.put(`/api/financial/goals/${id}`, {
      title: goal.title,
      description: goal.description,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date,
      goal_type: goal.goal_type,
      priority: goal.priority
    });
    return response.data.goal;
  },

  async deleteGoal(id: number): Promise<void> {
    await api.delete(`/api/financial/goals/${id}`);
  },

  async getGoalSummary(): Promise<GoalSummary> {
    const response = await api.get('/api/financial/summary/goals');
    return response.data;
  },

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const response = await api.get('/api/financial/accounts');
    return response.data.accounts || response.data;
  },

  async createAccount(account: Partial<Account>): Promise<Account> {
    const response = await api.post('/api/financial/accounts', {
      name: account.name,
      account_type: account.account_type,
      balance: account.balance,
      currency: account.currency,
      institution: account.institution,
      account_number: account.account_number
    });
    return response.data.account;
  },

  async updateAccount(id: number, account: Partial<Account>): Promise<Account> {
    const response = await api.put(`/api/financial/accounts/${id}`, {
      name: account.name,
      account_type: account.account_type,
      balance: account.balance,
      currency: account.currency,
      institution: account.institution,
      account_number: account.account_number
    });
    return response.data.account;
  },

  async deleteAccount(id: number): Promise<void> {
    await api.delete(`/api/financial/accounts/${id}`);
  },
}; 