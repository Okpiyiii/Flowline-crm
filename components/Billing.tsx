import React, { useState } from 'react';
import { GlassCard, Button, Badge } from './ui/GlassComponents';
import { CreditCard, Clock, CheckCircle, Zap, Shield, Sparkles, Download } from 'lucide-react';

export const Billing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  const plans = [
    {
      name: 'Starter',
      price: billingCycle === 'MONTHLY' ? 0 : 0,
      description: 'Perfect for freelancers just starting out.',
      features: ['Up to 500 Leads', 'Basic Pipeline', 'Community Support'],
      highlight: false
    },
    {
      name: 'Pro',
      price: billingCycle === 'MONTHLY' ? 29 : 24,
      description: 'Everything you need to grow your business.',
      features: ['Unlimited Leads', 'Advanced Analytics', 'Email Integration', 'Priority Support'],
      highlight: true
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'MONTHLY' ? 99 : 89,
      description: 'Advanced features for large teams.',
      features: ['Dedicated Account Manager', 'Custom API Access', 'SSO & Advanced Security', 'SLA Guarantee'],
      highlight: false
    }
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300 space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end pb-2 border-b border-zinc-100">
        <div>
          <h1 className="text-xl font-medium text-zinc-900">Billing & Subscription</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your plan, billing details, and invoices.</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-lg mt-4 md:mt-0">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${billingCycle === 'MONTHLY' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center ${billingCycle === 'YEARLY' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            Yearly <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded">-20%</span>
          </button>
        </div>
      </div>

      {/* Usage Stats (Current Plan Context) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-2 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-zinc-900 flex items-center"><Zap size={16} className="nr-2 text-amber-500 mr-2" /> Current Usage</h3>
            <Badge color="blue">Pro Plan</Badge>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-zinc-600">Leads Generated</span>
                <span className="text-zinc-900 font-medium">750 / Unlimited</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-zinc-900 h-full rounded-full w-[25%]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-zinc-600">API Calls</span>
                <span className="text-zinc-900 font-medium">8.5k / 100k</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div className="bg-zinc-900 h-full rounded-full w-[8%]"></div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-zinc-900 mb-1">Next Payment</h3>
            <p className="text-sm text-zinc-500">Your next charge will be on <span className="text-zinc-900 font-medium">Nov 24, 2023</span></p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-50">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-medium text-zinc-900">${billingCycle === 'MONTHLY' ? '29' : '288'}</span>
              <span className="text-sm text-zinc-500">/{billingCycle === 'MONTHLY' ? 'mo' : 'yr'}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl p-6 border transition-all duration-200 flex flex-col ${selectedPlan === plan.name
                ? 'bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-200 ring-offset-2 scale-[1.02] shadow-xl'
                : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:shadow-md'
              }`}
          >
            {plan.highlight && selectedPlan !== plan.name && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
            )}
            <div>
              <h3 className={`font-medium text-lg ${selectedPlan === plan.name ? 'text-white' : 'text-zinc-900'}`}>{plan.name}</h3>
              <p className={`text-sm mt-1 mb-4 ${selectedPlan === plan.name ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.description}</p>
              <div className="flex items-baseline space-x-1 mb-6">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className={`text-sm ${selectedPlan === plan.name ? 'text-zinc-500' : 'text-zinc-400'}`}>/mo</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start text-sm">
                  <CheckCircle size={16} className={`mr-2.5 mt-0.5 shrink-0 ${selectedPlan === plan.name ? 'text-zinc-400' : 'text-zinc-900'}`} />
                  <span className={selectedPlan === plan.name ? 'text-zinc-300' : 'text-zinc-600'}>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedPlan(plan.name)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${selectedPlan === plan.name
                  ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
            >
              {selectedPlan === plan.name ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-zinc-900" />
              <h3 className="font-medium text-zinc-900">Payment Method</h3>
            </div>
            <Button variant="outline" size="sm" className="h-8">Update</Button>
          </div>
          <div className="flex items-center space-x-4 border border-zinc-100 p-4 rounded-lg bg-zinc-50/50">
            <div className="w-12 h-8 bg-[#1A1F71] rounded flex items-center justify-center text-white/90">
              <span className="font-bold text-[10px] italic tracking-wider">VISA</span>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">Visa ending in 4242</p>
              <p className="text-xs text-zinc-500">Expires 12/24</p>
            </div>
            <CheckCircle size={16} className="ml-auto text-emerald-500" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-zinc-900" />
              <h3 className="font-medium text-zinc-900">Invoice History</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-md hover:bg-zinc-50 transition-all cursor-pointer group">
                <div>
                  <p className="text-sm font-medium text-zinc-700">Oct 24, 2023</p>
                  <p className="text-[11px] text-zinc-400">#INV-00{i} • Pro Plan</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-zinc-900">$29.00</span>
                  <button className="text-zinc-300 hover:text-zinc-900 transition-colors p-1">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};