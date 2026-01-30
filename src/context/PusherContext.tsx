import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import Pusher, { Channel } from "pusher-js";
import { API_BASE_URL, PUSHER_CLUSTER, PUSHER_KEY } from "../consts";


type PusherContextType = {
  isConnected: boolean;
  isStatusUpdate: boolean;
  setIsStatusUpdate: Dispatch<SetStateAction<boolean>>;
};

const PusherContext = createContext<PusherContextType | null>(null);




export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");
  // console.log("🚀 ~ PusherProvider ~ user:", user)
  const currentUser = user ? JSON.parse(user) : null;
  console.log("🚀 ~ PusherProvider ~ currentUser:", currentUser)
  // console.log("🚀 ~ PusherProvider ~ currentUser:", currentUser?.id)
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStatusUpdate, setIsStatusUpdate] = useState(false);




  useEffect(() => {
    // Example: You probably get your auth token from localStorage or cookies
    const token = localStorage.getItem("token");

    // Initialize PRIVATE Pusher
    pusherRef.current = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER || "ap2",
      // 🔐 REQUIRED FOR PRIVATE CHANNEL AUTH
      authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    // Connection state handlers
    pusherRef.current!.connection.bind("connected", () => {
      console.log("Pusher connected");
      setIsConnected(true);
    });

    pusherRef.current!.connection.bind("disconnected", () => {
      console.log("Pusher disconnected");
      setIsConnected(false);
    });

    // 🔐 Subscribe to PRIVATE channel
    // channelRef.current = pusherRef.current!.subscribe(
    //     `private-notification.user.${currentUser?.id}`
    // );
    // channelRef.current!.bind(`notification.user.${currentUser?.id}`, (data) => {
    //   console.log("🚀 ~ notification.user ~ data:", data)
    // });

    channelRef.current = pusherRef.current!.subscribe(
      `private-notifications.admins.33`
    );
    channelRef.current!.bind("notifications.admins.created", (res) => {
      console.log("🚀 ~ PusherProvider ~ service.status", res);
    });

  }, [])

  return (
    <PusherContext.Provider value={{ isConnected, isStatusUpdate, setIsStatusUpdate }}>
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