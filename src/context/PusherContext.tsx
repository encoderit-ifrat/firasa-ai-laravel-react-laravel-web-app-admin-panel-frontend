import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import Pusher, { Channel } from "pusher-js";
import { API_BASE_URL, PUSHER_CLUSTER, PUSHER_KEY } from "../consts";


type PusherContextType = {
  pusher: Pusher | null;
  isConnected: boolean;
  isStatusUpdate: boolean;
  setIsStatusUpdate: Dispatch<SetStateAction<boolean>>;
};

const PusherContext = createContext<PusherContextType | null>(null);




export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
  const currentUser = user ? JSON.parse(user) : null;
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStatusUpdate, setIsStatusUpdate] = useState(false);

  // Sync state with localStorage on mount and when changed
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("user"));
    };
    window.addEventListener("storage", handleStorageChange);
    // Also check periodically or via custom event since navigate might not fire storage event on same tab
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);




  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !currentUser?.id) {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Initialize Pusher
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER || "ap2",
      authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    pusherRef.current = pusher;

    pusher.connection.bind("connected", () => {
      console.log("Pusher connected");
      setIsConnected(true);
    });

    pusher.connection.bind("disconnected", () => {
      console.log("Pusher disconnected");
      setIsConnected(false);
    });

    const channel = pusher.subscribe(`private-notifications.admins.${currentUser?.id}`);
    channelRef.current = channel;

    channel.bind("notifications.admins.created", (res: any) => {
      console.log("🚀 ~ PusherProvider ~ service.status", res);
    });

    return () => {
      pusher.disconnect();
      pusherRef.current = null;
      setIsConnected(false);
    };
  }, [user]);

  return (
    <PusherContext.Provider value={{ pusher: pusherRef.current, isConnected, isStatusUpdate, setIsStatusUpdate }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusherContext = (): PusherContextType => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusherContext must be used within PusherProvider");
  }
  return context;
};