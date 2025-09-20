"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Loader2 } from "lucide-react";

export default function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function subscribe() {
    setIsLoading(true);
    
    try {
      // Check if service worker is supported
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service Worker not supported");
      }

      // Check if push messaging is supported
      if (!("PushManager" in window)) {
        throw new Error("Push messaging not supported");
      }

      // Register service worker
      const reg = await navigator.serviceWorker.register("/sw.js");
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Fetch VAPID public key from our API
      const res = await fetch("/api/vapid-key");
      if (!res.ok) {
        throw new Error("Failed to fetch VAPID key");
      }
      const { publicKey } = await res.json();

      // Convert base64 key
      function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

      // Subscribe to push notifications
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send subscription to our API
      const subscribeRes = await fetch("/api/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      if (!subscribeRes.ok) {
        throw new Error("Failed to save subscription");
      }

      toast({
        title: "✅ Subscribed to crypto alerts!",
        description: "You'll receive push notifications when your price alerts are triggered.",
      });
    } catch (error) {
      console.error("Subscription failed:", error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={subscribe}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Subscribing...
        </>
      ) : (
        <>
          <Bell className="w-4 h-4 mr-2" />
          Enable Push Notifications
        </>
      )}
    </Button>
  );
}
