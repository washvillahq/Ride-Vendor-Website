import React from 'react';
import { useAuth } from '../../features/auth/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader 
        title="Profile Settings" 
        description="Manage your personal information and account preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 border-slate-200">
           <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center font-black text-3xl shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{user?.name}</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">{user?.role}</p>
              </div>
              <Badge variant="success" className="rounded-full px-4">{user?.status || 'Active'}</Badge>
           </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Full Name</p>
                   <p className="font-bold text-slate-900">{user?.name}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Email Address</p>
                   <p className="font-bold text-slate-900">{user?.email}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phone Number</p>
                   <p className="font-bold text-slate-900">{user?.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Member Since</p>
                   <p className="font-bold text-slate-900">{new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
             </div>
             
             <div className="pt-6 border-t flex gap-4">
                <button className="text-sm font-black text-slate-900 hover:underline">Edit Profile</button>
                <button className="text-sm font-black text-red-600 hover:underline">Deactivate Account</button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
