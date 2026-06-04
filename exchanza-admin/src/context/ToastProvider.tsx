import React, { useState } from "react";
import AppToast from "../components/common/AppToast";
import { ToastContext, type ToastType } from "./toast-context";

export default function ToastProvider({ children,
}: {
  children: React.ReactNode;
}) {

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");

  const showToast = ( msg: string, toastType: ToastType = "success") => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AppToast
        visible={visible}
        message={message}
        type={type}
        onHide={() => setVisible(false)}
      />
    </ToastContext.Provider>
  );
}