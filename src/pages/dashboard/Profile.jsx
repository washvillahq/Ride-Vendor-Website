import React from 'react';
import { useAuth } from '../../features/auth/hooks';
import Button from '../../components/ui/Button';
import dayjs from 'dayjs';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Camera, 
  Settings, 
  ChevronRight,
  Bell,
  Lock
} from 'lucide-react';

const InfoSection = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-accent/30 transition-all duration-300">
    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:bg-accent/5 transition-all">
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-sm font-black text-slate-900 tracking-tight">{value || 'Not provided'}</p>
    </div>
    <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
  </div>
);

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-12 max-w-6xl pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Account Profile</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage your personal identification and secure credentials.</p>
        </div>
        <Button variant="accent" className="rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-accent/20">
          Update Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Section: Visual Profile */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[3rem] border border-slate-100 p-10 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <div className="relative">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-[#002E3E] border-[6px] border-white shadow-2xl flex items-center justify-center font-black text-4xl text-white relative overflow-hidden">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-accent rounded-2xl border-4 border-white flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform">
                       <Camera size={16} />
                    </button>
                 </div>
                 
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{user?.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{user?.role || 'Verified Member'}</p>
                    </div>
                 </div>

                 <div className="pt-6 grid grid-cols-2 gap-3 w-full border-t border-slate-50">
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                       <p className="text-lg font-black text-slate-900">12</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hires</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                       <p className="text-lg font-black text-slate-900">4.9</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                    </div>
                 </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute top-[-50px] left-[-50px] h-32 w-32 bg-accent/5 rounded-full blur-3xl opacity-50" />
           </div>

           <div className="bg-[#002E3E] rounded-[2.5rem] p-8 text-white space-y-6">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="text-accent" size={24} />
                 <p className="text-sm font-black uppercase tracking-widest">Safety & Security</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-medium">
                Your account is protected by industry-standard encryption. Enable 2FA for extra logistics security.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 hover:gap-3 transition-all">
                Security Settings <ChevronRight size={14} />
              </button>
           </div>
        </div>

        {/* Right Section: Fields */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InfoSection label="Legal Name" value={user?.name} icon={User} />
                 <InfoSection label="Contact Email" value={user?.email} icon={Mail} />
                 <InfoSection label="Verified Phone" value={user?.phone} icon={Phone} />
                 <InfoSection label="Member Since" value={dayjs(user?.createdAt).format('MMMM D, YYYY')} icon={Calendar} />
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight ml-2">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {[
                   { label: 'Notifications', icon: Bell, color: 'bg-blue-50 text-blue-500' },
                   { label: 'Security', icon: Lock, color: 'bg-emerald-50 text-emerald-500' },
                   { label: 'Preferences', icon: Settings, color: 'bg-amber-50 text-amber-500' }
                 ].map((action, i) => (
                   <button key={i} className="flex flex-col items-center gap-4 p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${action.color}`}>
                         <action.icon size={24} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">{action.label}</p>
                   </button>
                 ))}
              </div>
           </div>

           <div className="flex items-center justify-between p-8 rounded-[2rem] bg-red-50/50 border border-red-100">
              <div className="space-y-1">
                 <p className="font-black text-red-600 text-sm tracking-tight">Deactivate Account</p>
                 <p className="text-[10px] font-medium text-red-400 uppercase tracking-wider">This action cannot be undone.</p>
              </div>
              <button className="px-6 py-3 rounded-xl border-2 border-red-100 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                 Request Closure
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
