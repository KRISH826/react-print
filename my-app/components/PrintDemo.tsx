'use client';

import React, { useRef } from 'react';

export default function SimplePrintBill() {
    // Mock data for the bill
    const invoiceData = {
        restaurantName: "THE GOURMET KITCHEN",
        address: "123 Park Street, Kolkata",
        phone: "+91 98765 43210",
        orderId: "2048",
        tableNo: "T-04",
        date: new Date().toLocaleString(),
        items: [
            { name: "Chicken Biryani", qty: 2, price: 280 },
            { name: "Fish Fry (Special)", qty: 1, price: 120 },
            { name: "Virgin Mojito", qty: 2, price: 110 }
        ],
        gstRate: 0.05 // 5% GST
    };

    // Calculate totals
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const gst = subtotal * invoiceData.gstRate;
    const total = subtotal + gst;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 print:bg-white print:p-0 print:block print:h-auto print:min-h-0">      {/* 1. THE PRINT BUTTON (Visible on screen, automatically hidden during print) */}
            <button
                onClick={handlePrint}
                className="print:hidden bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-150 flex items-center gap-2 text-lg uppercase tracking-wide mb-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.252c.11.603-.404 1.148-1.017 1.148H7.123c-.613 0-1.127-.545-1.017-1.148L6.34 18m11.318 0A19.52 19.52 0 0 0 18 13.5v-3a6 6 0 0 0-12 0v3c0 1.623.295 3.18.832 4.618M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6.375 2.25A4.125 4.125 0 1 1 12.375 8.25.375.375 0 0 0 12.75 8.625v1.5a.375.375 0 0 0 .375.375h1.5a.375.375 0 0 0 .375-.375 4.125 4.125 0 0 1 8.25 0ZM3.375 13.125h1.5a.375.375 0 0 1 .375.375v1.5a.375.375 0 0 1-.375.375h-1.5a.375.375 0 0 1-.375-.375v-1.5a.375.375 0 0 1 .375-.375Z" />
                </svg>
                Print Restaurant Bill
            </button>

            {/* 2. THE RECEIPT (Formatted to match 80mm standard receipt paper size) */}
            <div
                className="bg-white p-4 shadow-md rounded-lg w-[78mm] text-black font-mono text-xs print:shadow-none print:p-2 print:m-0"
                style={{ width: '78mm' }}
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider">{invoiceData.restaurantName}</h2>
                    <p className="text-[10px] text-gray-600">{invoiceData.address}</p>
                    <p className="text-[10px] text-gray-600">Ph: {invoiceData.phone}</p>
                    <p className="text-[11px] font-bold mt-2 border-y border-dashed border-black py-0.5">*** CASH RECEIPT ***</p>
                </div>

                {/* Metadata */}
                <div className="text-[10px] space-y-0.5 mb-3">
                    <div><span className="font-bold">Order ID:</span> #{invoiceData.orderId}</div>
                    <div><span className="font-bold">Table No:</span> {invoiceData.tableNo}</div>
                    <div><span className="font-bold">Date:</span> {invoiceData.date}</div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-[11px] mb-3">
                    <thead>
                        <tr className="border-b border-dashed border-black">
                            <th className="pb-1 font-bold">Item</th>
                            <th className="pb-1 text-center font-bold w-10">Qty</th>
                            <th className="pb-1 text-right font-bold w-16">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.items.map((item, index) => (
                            <tr key={index} className="align-top">
                                <td className="py-1 pr-1 break-words">{item.name}</td>
                                <td className="py-1 text-center">{item.qty}</td>
                                <td className="py-1 text-right">₹{(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div className="border-t border-dashed border-black pt-2 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                        <span>GST (5%):</span>
                        <span>₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm border-t border-double border-black pt-1.5 mt-1">
                        <span>GRAND TOTAL:</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-3 pt-2 border-t border-dashed border-black text-[10px] text-gray-600">
                    <p className="font-bold text-black">Thank You! Please Visit Again</p>
                    <p className="text-[9px]">Software Powered by Next.js</p>
                </div>
            </div>

        </div>
    );
}