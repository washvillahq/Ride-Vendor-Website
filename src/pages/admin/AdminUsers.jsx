import React from 'react';
import { useAdminUsers, useBlockUser, useUnblockUser } from '../../features/admin/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { cn } from '../../utils/cn';
import { Users } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';

const AdminUsers = () => {
  const { data, isLoading, isError, refetch } = useAdminUsers();
  const { mutateAsync: blockUser, isLoading: isBlocking } = useBlockUser();
  const { mutateAsync: unblockUser, isLoading: isUnblocking } = useUnblockUser();
  
  const users = data?.data?.users || [];

  const handleStatusToggle = async (user) => {
    if (user.status === 'blocked') {
      await unblockUser(user._id);
    } else {
      if (confirm(`Are you sure you want to block ${user.name}? They will lose all access to their account.`)) {
        await blockUser(user._id);
      }
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Identification</h1>
           <p className="text-slate-500 mt-1 font-medium">Manage all customer accounts and administrator privileges.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100/50 px-6 py-3 rounded-2xl border border-slate-100">
           <Users className="text-blue-500" size={20} />
           <p className="text-sm font-black text-slate-900 tracking-tight">{users.length} Total Registered</p>
        </div>
      </section>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : users.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="py-5 px-8 font-black uppercase tracking-widest text-[10px]">Registry Identity</TableHead>
                <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Communication</TableHead>
                <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Authority</TableHead>
                <TableHead className="py-5 font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="py-5 px-8 font-black uppercase tracking-widest text-[10px] text-right">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-6 px-8">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-slate-900/10">
                           {user.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-black text-slate-900 leading-none">{user.name}</p>
                           <p className="text-[10px] font-black text-blue-500 mt-1.5 uppercase tracking-widest leading-none bg-blue-50 px-2 py-0.5 rounded-md inline-block">ID: {user._id.slice(-6)}</p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="py-6">
                     <p className="text-sm font-black text-slate-700">{user.email}</p>
                     <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.phone || 'No Phone Sync'}</p>
                  </TableCell>
                  <TableCell className="py-6">
                     <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'} 
                        className={cn(
                          "uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-lg",
                          user.role === 'admin' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                        )}
                     >
                        {user.role}
                     </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge 
                      className={cn(
                        "uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-lg",
                        user.status === 'blocked' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                      )}
                    >
                       {user.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 px-8 text-right">
                     {user.role !== 'admin' ? (
                       <Button 
                         variant={user.status === 'blocked' ? 'outline' : 'ghost'} 
                         size="sm"
                         className={cn(
                           "text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                           user.status !== 'blocked' ? 'text-red-500 hover:text-red-700 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                         )}
                         onClick={() => handleStatusToggle(user)}
                         isLoading={isBlocking || isUnblocking}
                       >
                         {user.status === 'blocked' ? 'Restore Access' : 'Restrict Account'}
                       </Button>
                     ) : (
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-not-allowed">Admin Protected</span>
                     )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !isLoading ? (
        <div className="p-12 text-center text-slate-400 font-bold italic">No system users found.</div>
      ) : (
        <div className="space-y-3">
           {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
