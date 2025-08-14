export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  occupation?: string;
  annual_income?: number;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  financial_goals?: string;
  created_at: string;
}

export interface UserProfile {
  id: number;
  user: number;
  emergency_fund_target?: number;
  retirement_age?: number;
  monthly_savings_target?: number;
  investment_preferences: Record<string, any>;
  notification_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user: number;
  category: number;
  category_name: string;
  category_color: string;
  amount: number;
  description: string;
  transaction_type: 'expense' | 'income';
  date: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  location?: string;
  receipt_image?: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color: string;
  created_at: string;
}

export interface Budget {
  id: number;
  user: number;
  category: number;
  category_name: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: number;
  user: number;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  goal_type: 'savings' | 'investment' | 'debt_payoff' | 'emergency_fund' | 'retirement' | 'other';
  target_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
  progress_percentage: number;
  remaining_amount: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  user: number;
  name: string;
  account_type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan' | 'other';
  balance: number;
  currency: string;
  institution?: string;
  account_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: number;
  user: number;
  session_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ChatMessage {
  id: number;
  session: number;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  feedback_rating?: number;
  feedback_comment?: string;
}

export interface LifeEvent {
  id: number;
  user: number;
  event_type: 'job_loss' | 'marriage' | 'child_birth' | 'medical_emergency' | 'home_purchase' | 'retirement' | 'inheritance' | 'business_start';
  description: string;
  expected_date?: string;
  financial_impact?: number;
  is_simulated: boolean;
  created_at: string;
}

export interface TransactionSummary {
  total_income: number;
  total_expenses: number;
  net_amount: number;
  period: string;
  category_breakdown: Record<string, {
    income: number;
    expense: number;
    color: string;
  }>;
}

export interface BudgetSummary {
  total_budget: number;
  total_spent: number;
  total_remaining: number;
  overall_percentage_used: number;
  budgets: Budget[];
}

export interface GoalSummary {
  total_goals: number;
  completed_goals: number;
  active_goals: number;
  total_target_amount: number;
  total_current_amount: number;
  overall_progress: number;
  goals: FinancialGoal[];
}

export interface DashboardData {
  user?: User;
  profile?: UserProfile;
  recent_sessions?: ChatSession[];
  recent_events?: LifeEvent[];
  transaction_summary?: TransactionSummary;
  budget_summary?: BudgetSummary;
  goal_summary?: GoalSummary;
  recent_transactions?: Transaction[];
  accounts?: Account[];
  // Actual backend response structure
  summary?: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    period: string;
  };
  recentTransactions?: any[];
  activeBudgets?: any[];
  activeGoals?: any[];
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface SimulationRequest {
  event_type: string;
  description: string;
  expected_date?: string;
  financial_impact?: number;
}

export interface FeedbackRequest {
  message_id: number;
  rating: number;
  comment?: string;
} 