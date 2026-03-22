import React from 'react';
import { useAdminUsers, useBlockUser, useUnblockUser } from '../../features/admin/hooks';
import { PageHeader } from '../../components/shared/Headers';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
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
    <div className="space-y-8">
      <PageHeader 
        title="User Identification" 
        description="Manage all customer accounts and administrator privileges."
      />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : users.length > 0 ? (
        <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Information</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 border flex items-center justify-center font-black text-xs">
                           {user.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-black text-slate-900 leading-none">{user.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">ID: {user._id.slice(-6)}</p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                     <p className="text-sm font-medium">{user.email}</p>
                     <p className="text-xs text-slate-400">{user.phone || 'No Phone'}</p>
                  </TableCell>
                  <TableCell>
                     <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="uppercase font-bold">
                        {user.role}
                     </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'success' : 'destructive'} className="uppercase font-bold">
                       {user.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     {user.role !== 'admin' && (
                       <Button 
                         variant={user.status === 'blocked' ? 'outline' : 'ghost'} 
                         size="sm"
                         className={user.status !== 'blocked' ? 'text-red-500 hover:text-red-700 hover:bg-red-50' : ''}
                         onClick={() => handleStatusToggle(user)}
                         isLoading={isBlocking || isUnblocking}
                       >
                         {user.status === 'blocked' ? 'Unblock Access' : 'Restrict Account'}
                       </Button>
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
