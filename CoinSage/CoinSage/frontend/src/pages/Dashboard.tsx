import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { financialService } from '../services/financialService';
import { DashboardData, Transaction, Account } from '../types/index';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await financialService.getDashboardData();
        console.log('Dashboard data:', data); // Debug log
        setDashboardData(data);
      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Refresh
        </button>
      </div>
    );
  }

  // Handle the actual backend response structure
  const { summary, recentTransactions, activeBudgets, activeGoals, accounts } = dashboardData;

  // Add safety checks
  if (!summary) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Dashboard data is incomplete</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType, icon, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {changeType === 'positive' ? (
                <ArrowUpRight className="h-4 w-4 text-success-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-danger-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's your financial overview for {format(new Date(), 'MMMM yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-success-500"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={<TrendingDown className="h-6 w-6 text-white" />}
          color="bg-danger-500"
        />
        <StatCard
          title="Net Amount"
          value={formatCurrency(summary.netIncome)}
          change={`${summary.netIncome >= 0 ? '+' : ''}${formatCurrency(summary.netIncome)}`}
          changeType={summary.netIncome >= 0 ? 'positive' : 'negative'}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-primary-500"
        />
        <StatCard
          title="Active Budgets"
          value={`${activeBudgets?.length || 0}`}
          icon={<PiggyBank className="h-6 w-6 text-white" />}
          color="bg-warning-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <Link to="/transactions" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((transaction: any) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#3B82F6' }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.date), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent transactions</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Goals */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/transactions"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <CreditCard className="h-5 w-5 mr-3 text-primary-600" />
                Add Transaction
              </Link>
              <Link
                to="/budgets"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <PiggyBank className="h-5 w-5 mr-3 text-primary-600" />
                Set Budget
              </Link>
              <Link
                to="/goals"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Target className="h-5 w-5 mr-3 text-primary-600" />
                Create Goal
              </Link>
              <Link
                to="/chat"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <TrendingUp className="h-5 w-5 mr-3 text-primary-600" />
                Get AI Advice
              </Link>
            </div>
          </div>

          {/* Financial Goals */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Goals</h2>
            <div className="space-y-3">
              {activeGoals && activeGoals.slice(0, 3).map((goal: any) => (
                <div key={goal._id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900">{goal.name || goal.title}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(goal.currentAmount || goal.current_amount || 0)} / {formatCurrency(goal.targetAmount || goal.target_amount)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(
                          ((goal.currentAmount || goal.current_amount || 0) / (goal.targetAmount || goal.target_amount)) * 100, 
                          100
                        )}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {(((goal.currentAmount || goal.current_amount || 0) / (goal.targetAmount || goal.target_amount)) * 100).toFixed(1)}% complete
                  </p>
                </div>
              ))}
              {(!activeGoals || activeGoals.length === 0) && (
                <p className="text-gray-500 text-center py-4">No goals set yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Overview */}
      {accounts && accounts.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Accounts Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account: any) => (
              <div
                key={account._id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{account.type || account.account_type}</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 