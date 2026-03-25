import React from 'react';
import { toast } from 'react-hot-toast';
import { useCreateOrder } from '../hooks';
import { useInitializePayment } from '../../payments/hooks';
import Button from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const PurchaseWidget = ({ car }) => {
  const { mutateAsync: createOrder, isLoading: isCreating } = useCreateOrder();
  const { mutateAsync: initPayment, isLoading: isPaying } = useInitializePayment();

  const onPurchase = async () => {
    try {
      const orderRes = await createOrder({ carId: car._id });
      const orderId = orderRes.data._id;
      
      const paymentRes = await initPayment({
        type: 'order',
        relatedId: orderId
      });

      toast.success('Order created! Redirecting to payment...');
      if (paymentRes.data.url) {
        window.location.href = paymentRes.data.url;
      }
    } catch (err) {
      // Handled globally
    }
  };

  return (
    <Card className="sticky top-24 border-gray-200 shadow-xl overflow-hidden rounded-[2rem]">
      <CardContent className="p-8">
        <div className="mb-8">
          <p className="text-sm font-bold text-gray-medium uppercase tracking-widest mb-1">Selling Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black tracking-tighter text-primary">
              ₦{car.salePrice?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
             <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-medium">Vehicle Status</span>
                <Badge variant={car.status === 'available' ? 'success' : 'destructive'} className="uppercase">
                  {car.status}
                </Badge>
             </div>
             <p className="text-xs text-gray-medium font-medium">
               Inclusive of all ownership transfer documents and standard mechanical certification.
             </p>
          </div>

          <Button 
            className="w-full h-16 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
            onClick={onPurchase}
            isLoading={isCreating || isPaying}
            disabled={car.status !== 'available'}
          >
            Buy Now
          </Button>

          <div className="pt-2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.018A8.997 8.997 0 0012 21a8.997 8.997 0 00-7.618-4.018l-.947-4.436a9.146 9.146 0 011.895-1.784l2.05-2.05h.01l2.05-2.05a9.146 9.146 0 011.784-1.895l4.436.947Z" /></svg>
               Secure Purchase Guarantee
            </div>
            <p className="text-[10px] text-center text-gray-medium font-bold px-6 leading-relaxed">
              Upon payment, a sales agent will contact you within 24 hours to schedule the handover and paperwork.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseWidget;
