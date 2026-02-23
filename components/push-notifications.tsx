"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permissionState = Notification.permission;
      setPermission({
        granted: permissionState === "granted",
        denied: permissionState === "denied",
        default: permissionState === "default",
      });
      setIsSubscribed(permissionState === "granted");
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
      const granted = result === "granted";
      
      setPermission({
        granted,
        denied: result === "denied",
        default: result === "default",
      });
      setIsSubscribed(granted);

      if (granted) {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive daily reminders to train your brain!",
          variant: "default",
        });

        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.update();
        }
      } else {
        toast({
          title: "Permission Denied",
          description: "You can enable notifications in your browser settings.",
          variant: "destructive",
        });
      }

      return granted;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const sendTestNotification = useCallback(() => {
    if (permission.granted && "Notification" in window) {
      new Notification("Care4Brain", {
        body: "This is a test notification. Your reminders are working!",
        icon: "/brain-ai-logo.png",
        badge: "/brain-ai-logo.png",
        tag: "test-notification",
      });
    }
  }, [permission.granted]);

  return {
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    sendTestNotification,
  };
}

export function NotificationSettings() {
  const {
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    sendTestNotification,
  } = usePushNotifications();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          <CardTitle className="text-lg">Push Notifications</CardTitle>
        </div>
        <CardDescription>
          {isSubscribed
            ? "You'll receive daily reminders to train"
            : "Get reminded to train your brain daily"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission.denied ? (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Notifications are blocked. Enable them in your browser settings.
            </p>
          </div>
        ) : isSubscribed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              Notifications enabled
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
            >
              Send Test Notification
            </Button>
          </div>
        ) : (
          <Button
            onClick={requestPermission}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Requesting..." : "Enable Notifications"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function scheduleDailyNotification(time: string = "09:00") {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  
  if (Notification.permission === "granted") {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeout = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      new Notification("Care4Brain - Daily Training", {
        body: "Time to train your brain! Play a game to maintain your streak.",
        icon: "/brain-ai-logo.png",
        badge: "/brain-ai-logo.png",
        tag: "daily-reminder",
        requireInteraction: true,
      });
    }, timeout);
  }
}
