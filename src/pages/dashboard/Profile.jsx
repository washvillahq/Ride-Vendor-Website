import React from 'react';
import { useAuth, useUpdateProfile } from '../../features/auth/hooks';
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

const InfoSection = ({ label, value, icon: Icon, isEditing, onChange, name, placeholder, type = "text" }) => (
  <div className="flex items-center gap-5 p-7 rounded-[2.5rem] bg-white border border-slate-100 group hover:border-[#FDB813]/40 hover:shadow-xl hover:shadow-[#FDB813]/5 transition-all duration-500">
    <div className="h-14 w-14 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-[#1A2B3D] group-hover:text-[#FDB813] group-hover:bg-[#1A2B3D] transition-all duration-500 shadow-sm">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.25em] mb-1.5">{label}</p>
      {isEditing && onChange ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-base font-medium text-[#1A2B3D] tracking-tight outline-none border-b-2 border-slate-100 focus:border-[#FDB813] placeholder:font-medium placeholder:text-slate-300 pb-1.5 transition-colors"
        />
      ) : (
        <p className="text-base font-medium text-[#1A2B3D] tracking-tight transition-all group-hover:translate-x-1 duration-500">{value || 'Not provided'}</p>
      )}
    </div>
    {!isEditing && <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#FDB813]/10 group-hover:text-[#FDB813] transition-all"><ChevronRight size={18} /></div>}
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  React.useEffect(() => {
    if (!isEditing) {
      setFormData({
        name: user?.name || '',
        phone: user?.phone || ''
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (isEditing) {
      updateProfile({
        userId: user._id,
        data: {
          name: formData.name,
          phone: formData.phone
        }
      }, {
        onSuccess: () => {
          setIsEditing(false);
        }
      });
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Dynamic Header */}
      <div className="relative p-10 lg:p-14 rounded-[4rem] bg-[#1A2B3D] text-white overflow-hidden shadow-2xl shadow-[#1A2B3D]/20">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FDB813]/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FDB813]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-[#FDB813] animate-pulse" />
              <span className="text-[9px] font-medium uppercase tracking-widest text-white/70">Verified Account</span>
            </div>
            <h1 className="text-5xl font-medium tracking-tighter leading-none">Account Command Center</h1>
            <p className="text-white/40 font-medium tracking-tight max-w-md">Manage your personal identity, contact protocols, and secure access across the RideVendor fleet.</p>
          </div>

          <div className="flex items-center gap-4">
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="px-8 py-4 rounded-2xl text-[11px] font-medium uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
              >
                Discard
              </button>
            )}
            <button
              onClick={handleUpdate}
              disabled={isPending}
              className="px-10 py-4 rounded-2xl bg-[#FDB813] text-[#1A2B3D] text-[11px] font-medium uppercase tracking-widest shadow-2xl shadow-[#FDB813]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              {isPending ? (
                <div className="h-4 w-4 border-2 border-[#1A2B3D]/30 border-t-[#1A2B3D] rounded-full animate-spin" />
              ) : isEditing ? 'Deploy Changes' : 'Initialize Update'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 flex flex-col items-center text-center shadow-sm relative group">
            <div className="relative mb-8">
              <div className="h-40 w-40 rounded-[3rem] bg-[#1A2B3D] border-[8px] border-slate-50 flex items-center justify-center font-medium text-6xl text-white relative overflow-hidden group-hover:rotate-3 transition-transform duration-700">
                <span className="relative z-10">{user?.name?.charAt(0) || 'U'}</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FDB813]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <button className="absolute bottom-1 right-1 h-12 w-12 bg-[#FDB813] rounded-2xl border-4 border-white flex items-center justify-center text-[#1A2B3D] shadow-xl hover:scale-110 active:scale-90 transition-all">
                <Camera size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-2 mb-10">
              <h3 className="text-3xl font-medium text-[#1A2B3D] tracking-tighter">{user?.name}</h3>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.3em]">{user?.email}</p>
            </div>

            <div className="w-full pt-8 border-t border-slate-50 space-y-4">
              <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50">
                <span className="text-[10px] font-medium uppercase text-slate-400 tracking-widest">Protocol</span>
                <span className="text-[10px] font-medium uppercase text-[#1A2B3D] tracking-widest">{user?.role || 'User'}</span>
              </div>
              <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50">
                <span className="text-[10px] font-medium uppercase text-slate-400 tracking-widest">Access Key</span>
                <span className="text-[10px] font-medium uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                  Active <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A2B3D] rounded-[3rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-8">
              <div className="h-14 w-14 rounded-2xl bg-[#FDB813]/10 border border-[#FDB813]/20 flex items-center justify-center text-[#FDB813]">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium uppercase tracking-widest">Fleet Security</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">
                  Your account identity is protected by end-to-end encryption. Any modification to legal credentials requires fleet-wide authentication.
                </p>
              </div>
              <button className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-medium uppercase tracking-widest text-[#FDB813] transition-all">
                Manage Access Controls
              </button>
            </div>
          </div>
        </div>

        {/* Identity & Contact */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <User className="text-[#FDB813]" size={20} />
              <h3 className="text-xl font-medium text-[#1A2B3D] tracking-tight">Personal Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoSection
                label="Legal Full Name"
                value={isEditing ? formData.name : user?.name}
                icon={User}
                isEditing={isEditing}
                name="name"
                onChange={handleChange}
                placeholder="Enter legal name"
              />
              <InfoSection
                label="Identification Level"
                value="Tier 1 Verified"
                icon={ShieldCheck}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <Mail className="text-[#FDB813]" size={20} />
              <h3 className="text-xl font-medium text-[#1A2B3D] tracking-tight">Contact Access</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoSection
                label="Primary Email"
                value={user?.email}
                icon={Mail}
              />
              <InfoSection
                label="Mobile Protocol"
                value={isEditing ? formData.phone : user?.phone}
                icon={Phone}
                isEditing={isEditing}
                name="phone"
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
              <InfoSection
                label="Legacy Member Since"
                value={dayjs(user?.createdAt).format('DD MMMM, YYYY')}
                icon={Calendar}
              />
              <InfoSection
                label="Fleet Location"
                value="Ilorin Hub (Default)"
                icon={Settings}
              />
            </div>
          </div>

          {/* Security / Critical Actions */}
          <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8 py-10 px-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Lock className="text-red-500" size={18} />
                <p className="font-medium text-[#1A2B3D] text-lg tracking-tight">Account Deactivation</p>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-sm">DANGER: ALL RENTAL HISTORY AND FLEET PRIVILEGES WILL BE RECURSIVELY ERASED.</p>
            </div>
            <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-red-50 text-red-600 border-2 border-red-100 text-[11px] font-medium uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-xl shadow-red-500/5">
              Request Termination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
