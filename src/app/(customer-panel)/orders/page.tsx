"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Heading } from "@/components/landing-page/heading";
import Image from "next/image";
import { Package, Clock, CheckCircle, XCircle, Calendar, DollarSign } from "lucide-react";

interface Order {
  status: string;
  start_date: string;
  end_date: string | null;
  grand_total: number;
  pen: string;
  created_at: string;
  count: number;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
    label: "Pending"
  },
  processing: {
    icon: Package,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    label: "Processing"
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
    label: "Completed"
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    label: "Cancelled"
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  const headerRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!loading && headerRef.current && ordersRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(ordersRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, [loading]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/history");
      
      if (response.status === 401) {
        setError("Please log in to view your orders");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = selectedFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-amber-400/30 border-t-amber-400 mx-auto" />
          <p className="font-raleway text-white/60">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="text-center max-w-md">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <Heading as="h2" size="md" className="mb-4 text-white">
            {error}
          </Heading>
          <button
            onClick={() => window.location.href = "/login"}
            className="font-raleway rounded-lg bg-amber-400 px-8 py-3 text-sm font-medium text-black transition-all hover:bg-amber-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Golden Glow Effects */}
      <div className="fixed top-1/4 left-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div ref={headerRef} className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/images/hero/icon.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <Heading as="h1" size="lg" className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                My Orders
              </Heading>
            </div>
            
            <p className="font-raleway text-white/60 mb-8">
              Track and manage your luxury pen orders
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3">
              {["all", "pending", "processing", "completed", "cancelled"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`font-raleway rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? "bg-amber-400 text-black"
                      : "border border-amber-400/30 bg-transparent text-white/60 hover:border-amber-400 hover:text-white"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <Heading as="h3" size="sm" className="mb-2 text-white/60">
                No orders found
              </Heading>
              <p className="font-raleway text-sm text-white/40">
                {selectedFilter === "all" 
                  ? "You haven't placed any orders yet"
                  : `No ${selectedFilter} orders`}
              </p>
            </div>
          ) : (
            <div ref={ordersRef} className="space-y-6">
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg border border-amber-400/20 bg-black/40 backdrop-blur-sm transition-all hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-400/10"
                  >
                    {/* Decorative corner accents */}
                    <div className="absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-amber-400/20 transition-all group-hover:border-amber-400/40" />
                    <div className="absolute right-0 top-0 h-12 w-12 border-r-2 border-t-2 border-amber-400/20 transition-all group-hover:border-amber-400/40" />

                    <div className="p-6 sm:p-8">
                      <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left: Order Details */}
                        <div className="lg:col-span-2">
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <Heading as="h3" size="sm" className="mb-2 text-white">
                                {order.pen}
                              </Heading>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${status.bgColor} ${status.color} ${status.borderColor} border`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </span>
                                <span className="font-raleway text-xs text-white/40">
                                  Quantity: {order.count}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-amber-400/60" />
                              <div>
                                <p className="font-raleway text-xs text-white/40">Order Date</p>
                                <p className="font-raleway text-sm text-white/80">
                                  {formatDate(order.created_at)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-amber-400/60" />
                              <div>
                                <p className="font-raleway text-xs text-white/40">Start Date</p>
                                <p className="font-raleway text-sm text-white/80">
                                  {formatDate(order.start_date)}
                                </p>
                              </div>
                            </div>

                            {order.end_date && (
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-amber-400/60" />
                                <div>
                                  <p className="font-raleway text-xs text-white/40">End Date</p>
                                  <p className="font-raleway text-sm text-white/80">
                                    {formatDate(order.end_date)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Price & Actions */}
                        <div className="flex flex-col justify-between border-t border-amber-400/10 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                          <div>
                            <p className="font-raleway mb-2 text-xs text-white/40">Total Amount</p>
                            <div className="mb-6 flex items-baseline gap-2">
                              <DollarSign className="h-5 w-5 text-amber-400" />
                              <Heading as="h3" size="sm" className="text-amber-400">
                                {formatCurrency(order.grand_total)}
                              </Heading>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <button className="font-raleway w-full rounded-lg border border-amber-400/30 bg-transparent px-4 py-2 text-sm font-medium text-amber-400 transition-all hover:border-amber-400 hover:bg-amber-400/10">
                              View Details
                            </button>
                            {order.status === "completed" && (
                              <button className="font-raleway w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-black transition-all hover:bg-amber-300">
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
