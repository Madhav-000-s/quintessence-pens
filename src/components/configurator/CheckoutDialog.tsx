"use client";

import { useState } from "react";
import { X, ShoppingCart, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Heading } from "../landing-page/heading";
import { PenPreview } from "./PenPreview";

interface CartItem {
  id: number;
  pen_id: number;
  count: number;
  total_price: number;
  penConfig?: any;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onCheckoutComplete: () => void;
}

type CheckoutStep = "cart" | "payment" | "confirmation";
type PaymentMethod = "credit-card" | "debit-card" | "paypal" | "bank-transfer";

export function CheckoutDialog({ isOpen, onClose, cartItems, onCheckoutComplete }: CheckoutDialogProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    setCurrentStep("confirmation");
    
    // Call completion handler after a delay
    setTimeout(() => {
      onCheckoutComplete();
      onClose();
      setCurrentStep("cart");
    }, 3000);
  };

  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: "💳" },
    { id: "debit-card", name: "Debit Card", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🅿️" },
    { id: "bank-transfer", name: "Bank Transfer", icon: "🏦" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-amber-400/30 bg-black/60 p-2 text-white/60 transition-all hover:border-amber-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with step indicator */}
        <div className="border-b border-amber-400/20 bg-black/40 p-6">
          <Heading as="h2" size="md" className="mb-4 text-amber-400">
            Checkout
          </Heading>
          
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[
              { id: "cart", label: "Cart", icon: ShoppingCart },
              { id: "payment", label: "Payment", icon: CreditCard },
              { id: "confirmation", label: "Confirmation", icon: CheckCircle },
            ].map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = 
                (step.id === "cart" && (currentStep === "payment" || currentStep === "confirmation")) ||
                (step.id === "payment" && currentStep === "confirmation");

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        isActive
                          ? "border-amber-400 bg-amber-400 text-black"
                          : isCompleted
                          ? "border-green-400 bg-green-400 text-black"
                          : "border-amber-400/30 bg-black/60 text-white/40"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span
                      className={`font-raleway text-sm ${
                        isActive ? "text-amber-400" : isCompleted ? "text-green-400" : "text-white/40"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`mx-2 h-px flex-1 ${
                        isCompleted ? "bg-green-400" : "bg-amber-400/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
          {/* Step 1: Cart */}
          {currentStep === "cart" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-abril mb-4 text-xl text-white">Your Cart</h3>
                
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-white/20" />
                    <p className="font-raleway text-white/60">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 rounded-lg border border-amber-400/20 bg-black/40 p-4"
                      >
                        {item.penConfig && (
                          <PenPreview config={item.penConfig} size="sm" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-abril mb-1 text-lg text-white">
                            Custom Pen #{item.pen_id}
                          </h4>
                          <p className="font-raleway mb-2 text-sm text-white/60">
                            Quantity: {item.count}
                          </p>
                          <p className="font-raleway text-lg font-semibold text-amber-400">
                            ${item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="rounded-lg border border-amber-400/30 bg-black/60 p-6">
                <h3 className="font-abril mb-4 text-lg text-white">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between font-raleway text-white/80">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-raleway text-white/80">
                    <span>Tax (18%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-amber-400/20 pt-3">
                    <div className="flex justify-between font-abril text-xl text-amber-400">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === "payment" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-abril mb-4 text-xl text-white">Select Payment Method</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                        paymentMethod === method.id
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-amber-400/20 bg-black/40 hover:border-amber-400/40"
                      }`}
                    >
                      <span className="text-3xl">{method.icon}</span>
                      <span className="font-raleway text-white">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment form */}
              <div className="rounded-lg border border-amber-400/30 bg-black/60 p-6">
                <h3 className="font-abril mb-4 text-lg text-white">Payment Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-raleway mb-2 block text-sm text-white/80">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-lg border border-amber-400/30 bg-black/60 px-4 py-3 font-raleway text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="font-raleway mb-2 block text-sm text-white/80">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full rounded-lg border border-amber-400/30 bg-black/60 px-4 py-3 font-raleway text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-raleway mb-2 block text-sm text-white/80">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full rounded-lg border border-amber-400/30 bg-black/60 px-4 py-3 font-raleway text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-raleway mb-2 block text-sm text-white/80">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-amber-400/30 bg-black/60 px-4 py-3 font-raleway text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="rounded-lg border border-amber-400/30 bg-black/60 p-4">
                <div className="flex justify-between font-abril text-xl text-amber-400">
                  <span>Total to Pay</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === "confirmation" && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-400/20">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <Heading as="h2" size="md" className="mb-4 text-green-400">
                Payment Successful!
              </Heading>
              <p className="font-raleway mb-2 text-white/80">
                Your order has been placed successfully.
              </p>
              <p className="font-raleway text-sm text-white/60">
                Order confirmation has been sent to your email.
              </p>
              <div className="mt-8">
                <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full animate-pulse bg-amber-400" />
                </div>
                <p className="font-raleway mt-2 text-xs text-white/40">
                  Redirecting...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with navigation */}
        {currentStep !== "confirmation" && (
          <div className="border-t border-amber-400/20 bg-black/40 p-6">
            <div className="flex justify-between gap-4">
              {currentStep === "payment" && (
                <button
                  onClick={() => setCurrentStep("cart")}
                  className="flex items-center gap-2 rounded-lg border border-amber-400/30 bg-transparent px-6 py-3 font-raleway text-white transition-all hover:border-amber-400 hover:bg-amber-400/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cart
                </button>
              )}
              
              <button
                onClick={() => {
                  if (currentStep === "cart") {
                    setCurrentStep("payment");
                  } else if (currentStep === "payment") {
                    handlePayment();
                  }
                }}
                disabled={processing || cartItems.length === 0}
                className="ml-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-3 font-raleway font-semibold text-black transition-all hover:shadow-lg hover:shadow-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Processing...
                  </>
                ) : currentStep === "cart" ? (
                  <>
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Complete Payment
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
