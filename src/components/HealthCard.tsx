import React from 'react';
import { Activity, Heart, Footprints, Flame } from 'lucide-react';

function HealthMetricCard({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  color,
  glowColor 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: number; 
  unit: string; 
  color: string;
  glowColor: string;
}) {
  return (
    <div className={`relative flex items-center p-6 bg-gray-900/80 rounded-xl backdrop-blur-sm border border-gray-700 ${color} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
      <div className={`absolute inset-0 ${glowColor} opacity-10 blur-xl rounded-xl`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent rounded-xl"></div>
      <div className="relative flex items-center w-full h-6">
        <div className="flex-shrink-0">
          <Icon className="w-8 h-8 text-gray-100" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-base font-bold text-white">
            {value.toLocaleString()} <span className="text-sm text-gray-400">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function HealthCard() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
          
          <div className="relative p-8">
            <div className="flex items-center mb-8">
              <Activity className="w-10 h-10 text-blue-400" />
              <div className="ml-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Health Dashboard</h2>
                <p className="text-blue-300/80">Real-time Health Metrics</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <HealthMetricCard
                icon={Footprints}
                title="Steps"
                value={8432}
                unit="steps"
                color="hover:border-blue-500/50"
                glowColor="bg-blue-500"
              />
              <HealthMetricCard
                icon={Heart}
                title="Heart Rate"
                value={72}
                unit="bpm"
                color="hover:border-red-500/50"
                glowColor="bg-red-500"
              />
              <HealthMetricCard
                icon={Flame}
                title="Calories"
                value={1842}
                unit="kcal"
                color="hover:border-orange-500/50"
                glowColor="bg-orange-500"
              />
            </div>
            
            <div className="mt-8">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4">Daily Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Steps Goal (10,000)</span>
                      <span>84%</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-blue-500/20 blur-sm"></div>
                      <div className="relative w-[84%] h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Calories Goal (2,000)</span>
                      <span>92%</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-orange-500/20 blur-sm"></div>
                      <div className="relative w-[92%] h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthCard;