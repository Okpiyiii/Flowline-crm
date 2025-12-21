import React from 'react';
import { GlassCard, Button, Badge } from './ui/GlassComponents';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';

export const Billing: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
       <div className="mb-8 pb-2 border-b border-zinc-100">
          <h1 className="text-xl font-medium text-zinc-900">Billing & Plan</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 space-y-6">
            <GlassCard>
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="font-medium text-zinc-900">Current Plan</h3>
                   <div className="flex items-center mt-2 space-x-2">
                      <span className="text-3xl font-medium text-zinc-900">$29</span>
                      <span className="text-zinc-500">/mo</span>
                      <Badge color="blue">Pro</Badge>
                   </div>
                </div>
                <Button variant="outline" size="sm">Change Plan</Button>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600">Leads used</span>
                    <span className="text-zinc-900 font-medium">750 / 1000</span>
                 </div>
                 <div className="w-full bg-zinc-100 rounded-full h-1.5">
                    <div className="bg-zinc-800 h-1.5 rounded-full w-3/4"></div>
                 </div>
                 <p className="text-xs text-zinc-400">Next billing date: November 24, 2023</p>
              </div>
            </GlassCard>

             <GlassCard>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-zinc-900">Payment Method</h3>
                  <Button variant="ghost" size="sm" className="h-8">Update</Button>
                </div>
                <div className="flex items-center space-x-4 border border-zinc-100 p-3 rounded-md">
                  <div className="w-10 h-7 bg-zinc-900 rounded flex items-center justify-center text-white">
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Visa ending in 4242</p>
                    <p className="text-xs text-zinc-500">Expires 12/24</p>
                  </div>
                  <CheckCircle size={16} className="ml-auto text-zinc-400" />
                </div>
             </GlassCard>
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider pl-1">Invoices</h3>
             <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md hover:bg-white border border-transparent hover:border-zinc-200 transition-all cursor-pointer group">
                    <div className="flex items-center space-x-3">
                        <div className="text-zinc-400 group-hover:text-zinc-600">
                        <Clock size={14} />
                        </div>
                        <div>
                        <p className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">Oct 24, 2023</p>
                        <p className="text-xs text-zinc-400">#INV-00{i}</p>
                        </div>
                    </div>
                    <span className="text-sm text-zinc-600">$29.00</span>
                </div>
                ))}
             </div>
             <Button variant="outline" size="sm" className="w-full">View All Invoices</Button>
          </div>
        </div>
    </div>
  );
};