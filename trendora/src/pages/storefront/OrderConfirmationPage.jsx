import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function OrderConfirmationPage() {
  const { id } = useParams();

  return (
    <div className="container py-20 max-w-3xl">
      <div className="bg-surface border border-border rounded-2xl shadow-lg p-10 text-center">
        <div className="w-20 h-20 bg-success-soft rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-success" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted text-lg mb-8">
          Thank you for shopping with TRENDORA. Your order has been placed successfully and is now being processed.
        </p>

        <div className="bg-bg rounded-xl p-6 mb-8 text-left border border-border">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <div>
              <p className="text-sm text-muted">Order Number</p>
              <p className="font-bold text-lg">{id}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Date</p>
              <p className="font-bold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex gap-3">
              <Package className="text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">Delivery Method</p>
                <p className="text-sm text-muted">Checkpoint Delivery</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">Pickup Location</p>
                <p className="text-sm text-muted">Molyko, Buea</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm-flex-row gap-4 justify-center">
          <Link to="/track-order">
            <Button size="lg" className="w-full sm-w-auto">Track Order</Button>
          </Link>
          <Link to="/catalog">
            <Button variant="outline" size="lg" className="w-full sm-w-auto">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
