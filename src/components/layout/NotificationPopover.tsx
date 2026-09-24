"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Info,
  UserPlus,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  Notification,
} from "@/lib/api/notifications";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const fetchNotif = async () => {
    setLoading(true);
    const data = await getNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotif();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotif, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleRead = async (id: string) => {
    try {
      await readNotification(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadAll = async () => {
    try {
      await readAllNotifications();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Hapus semua notifikasi?")) return;
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "registration":
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "observation":
        return <Calendar className="w-4 h-4 text-teal-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 bg-white border border-teal-50 rounded-xl hover:bg-[#F4F9F8] hover:border-[#2B7A75] text-gray-400 hover:text-[#2B7A75] transition-colors duration-300 shadow-[0_2px_10px_rgba(43,122,117,0.05)] focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-400 border border-white"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed inset-x-4 top-[85px] sm:absolute sm:inset-auto sm:right-0 sm:translate-x-0 sm:mt-3 w-auto sm:w-[400px] bg-white rounded-2xl shadow-2xl shadow-teal-900/10 border border-teal-50 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-extrabold text-[#1E5C58]">
                  Notifikasi
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {unreadCount} belum dibaca
                </p>
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    onClick={handleReadAll}
                    title="Tandai semua dibaca"
                    className="p-1.5 rounded-lg hover:bg-teal-50 text-[#2B7A75] transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[70vh] overflow-y-auto sidebar-scroll">
              {loading && notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-gray-400 font-medium">Memuat...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-bold">
                    Belum ada notifikasi
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Kami akan mengabari Anda jika ada pembaruan.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read_at && handleRead(notif.id)}
                      className={`p-4 flex gap-3 transition-colors cursor-pointer group relative ${!notif.read_at ? "bg-teal-50/30" : "hover:bg-gray-50"}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${!notif.read_at ? "bg-white border-teal-100 shadow-sm" : "bg-gray-50 border-gray-100"}`}
                      >
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p
                            className={`text-xs capitalize font-bold ${!notif.read_at ? "text-[#1E5C58]" : "text-gray-500"}`}
                          >
                            {notif.type.replace("_", " ")}
                          </p>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {formatDistanceToNow(new Date(notif.created_at), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </span>
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${!notif.read_at ? "text-[#2B7A75] font-semibold" : "text-gray-600 font-medium"}`}
                        >
                          {notif.data.message}
                        </p>
                      </div>

                      {/* Delete button (hidden by default, shown on hover/touch) */}
                      <button
                        onClick={(e) => handleDelete(notif.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all absolute right-2 top-10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {!notif.read_at && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-400 group-hover:hidden" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-50 bg-gray-50/50">
                <button
                  onClick={handleDeleteAll}
                  className="w-full py-2 flex items-center justify-center gap-2 text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Semua Notifikasi
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
