import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Eye } from 'lucide-react';
import { useContactSubmissions, useUpdateContactSubmission } from '../../features/cms/hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const AdminContactSubmissions = () => {
  const { data, isLoading } = useContactSubmissions({ sort: '-createdAt', limit: 50 });
  const submissions = data?.data?.submissions || [];
  const { mutateAsync: updateSubmission, isLoading: isUpdating } = useUpdateContactSubmission();

  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const openModal = (item) => {
    setSelected(item);
    setNotes(item.adminNotes || '');
  };

  const markReviewed = async () => {
    if (!selected) return;
    try {
      await updateSubmission({
        id: selected._id,
        data: {
          status: 'reviewed',
          adminNotes: notes,
        },
      });
      toast.success('Submission marked as reviewed');
      setSelected(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update submission');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section>
        <h1 className="text-3xl font-medium text-slate-900">Contact Submissions</h1>
        <p className="text-slate-500 mt-1">Review and update incoming contact form requests.</p>
      </section>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${item.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <button onClick={() => openModal(item)} className="p-2 text-slate-500 hover:text-black">
                    <Eye size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-slate-400">
                  No submissions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Submission details"
        size="md"
      >
        {selected && (
          <div className="space-y-4 pt-3">
            <div>
              <p className="text-xs uppercase text-slate-400">Name</p>
              <p className="text-sm text-slate-900">{selected.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Email</p>
              <p className="text-sm text-slate-900">{selected.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Message</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[100px] rounded-xl border border-slate-200 p-3 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button onClick={markReviewed} isLoading={isUpdating}>
                Mark Reviewed
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminContactSubmissions;
