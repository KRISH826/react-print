'use client';

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

interface InvoicePayload {
  restaurantName: string;
  address: string;
  phone: string;
  fssai: string;
  orderId: string;
  tableNo: string;
  waiter: string;
  date: string;
  items: InvoiceItem[];
  cgstRate: number;
  sgstRate: number;
}

// ─── Separate bill component so react-to-print gets a clean ref ───
const BillTemplate = React.forwardRef<HTMLDivElement, { order: InvoicePayload }>(
  ({ order }, ref) => {
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const cgst = subtotal * order.cgstRate;
    const sgst = subtotal * order.sgstRate;
    const grandTotal = Math.round(subtotal + cgst + sgst);

    return (
      <div
        ref={ref}
        style={{
          width: '76mm',
          maxWidth: '76mm',
          margin: "0 auto",
          padding: '2mm',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          color: '#000',
          background: '#fff',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {order.restaurantName}
          </div>
          <div style={{ fontSize: '10px', color: '#444' }}>{order.address}</div>
          <div style={{ fontSize: '10px' }}>Mob: {order.phone}</div>
          <div style={{ fontSize: '9px', color: '#555' }}>FSSAI Lic No: {order.fssai}</div>
          <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />
          <div style={{ fontWeight: 'bold', letterSpacing: '2px' }}>— TAX INVOICE —</div>
          <div style={{ borderBottom: '1px dashed #000', margin: '4px 0' }} />
        </div>

        {/* Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '10px', marginBottom: '4px', gap: '2px' }}>
          <div><b>Bill No:</b> {order.orderId}</div>
          <div style={{ textAlign: 'right' }}><b>Table:</b> {order.tableNo}</div>
          <div><b>Steward:</b> {order.waiter}</div>
          <div style={{ textAlign: 'right' }}><b>Date:</b> {order.date.split(',')[0]}</div>
        </div>

        {/* Items Table */}
        <div style={{ borderTop: '1px dashed #000', marginBottom: '2px' }} />
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px dashed #000' }}>
              <th style={{ textAlign: 'left', paddingBottom: '3px' }}>Item</th>
              <th style={{ textAlign: 'center', paddingBottom: '3px', width: '30px' }}>Qty</th>
              <th style={{ textAlign: 'right', paddingBottom: '3px', width: '60px' }}>Amt</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td style={{ padding: '2px 4px 2px 0', wordBreak: 'break-word' }}>{item.name}</td>
                <td style={{ textAlign: 'center', padding: '2px 0' }}>{item.qty}</td>
                <td style={{ textAlign: 'right', padding: '2px 0' }}>{(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }} />

        {/* Totals */}
        <div style={{ fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Sub Total:</span><span>{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#444' }}>
            <span>CGST @ 2.5%:</span><span>{cgst.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#444' }}>
            <span>SGST @ 2.5%:</span><span>{sgst.toFixed(2)}</span>
          </div>
          <div style={{ borderTop: '1px dashed #000', marginTop: '4px', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px' }}>
            <span>GRAND TOTAL:</span><span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '12px', borderTop: '1px dashed #000', paddingTop: '6px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '11px' }}>Thank You! Visit Again.</div>
          <div style={{ fontSize: '8px', color: '#888', letterSpacing: '1px', marginTop: '2px' }}>
            DINEREDGE — SYSTEM GENERATED RECEIPT
          </div>
        </div>
      </div>
    );
  }
);

BillTemplate.displayName = 'BillTemplate';

// ─── Main Page ───
export default function DinerEdgePrintDemo() {
  const billRef = useRef<HTMLDivElement>(null);

  const mockOrder: InvoicePayload = {
    restaurantName: 'THE GOURMET KITCHEN',
    address: '123 Park Street, Kolkata - 700016',
    phone: '+91 98765 43210',
    fssai: '12345678901234',
    orderId: 'DE-2026-0984',
    tableNo: 'Table 04',
    waiter: 'Rahul S.',
    date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    items: [
      { name: 'Chicken Biryani', qty: 2, price: 280 },
      { name: 'Mutton Kosha', qty: 1, price: 340 },
      { name: 'Crispy Chilli Baby Corn', qty: 1, price: 190 },
      { name: 'Fish Fry (Mitra Cafe Style)', qty: 2, price: 120 },
      { name: 'Virgin Mojito', qty: 2, price: 110 },
    ],
    cgstRate: 0.025,
    sgstRate: 0.025,
  };

  // ─── react-to-print hook ───
  const handlePrint = useReactToPrint({
    contentRef: billRef,           // points to BillTemplate's root div
    documentTitle: `DinerEdge-Bill-${mockOrder.orderId}`,
    pageStyle: `
      @page {
        size: 100mm auto;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
      }
    `,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">

      {/* Control Panel */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl text-center mb-6">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.252c.11.603-.404 1.148-1.017 1.148H7.123c-.613 0-1.127-.545-1.017-1.148L6.34 18m11.318 0A19.52 19.52 0 0 0 18 13.5v-3a6 6 0 0 0-12 0v3c0 1.623.295 3.18.832 4.618M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <h1 className="text-base font-bold tracking-wide">DinerEdge Print Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">100mm Thermal Roll — react-to-print</p>
        </div>
        <button
          onClick={handlePrint}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-lg shadow-lg active:scale-[0.99] transition-transform uppercase tracking-wider text-xs"
        >
          🖨️ Execute Bill Print
        </button>
        <p className="text-[10px] text-slate-500 mt-3">
          No extra CSS needed — react-to-print handles everything ✅
        </p>
      </div>

      {/* Bill Preview (screen only) */}
      <div className="border border-slate-700 rounded-lg overflow-hidden shadow-xl">
        <BillTemplate ref={billRef} order={mockOrder} />
      </div>
    </div>
  );
}