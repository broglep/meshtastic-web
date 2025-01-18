import type { TabElementProps } from "@app/components/Dialog/NewDeviceDialog";
import { Button } from "@components/UI/Button.tsx";
import { Input } from "@components/UI/Input.tsx";
import { Label } from "@components/UI/Label.tsx";
import { Switch } from "@components/UI/Switch.tsx";
import { useAppStore } from "@core/stores/appStore.ts";
import { useDeviceStore } from "@core/stores/deviceStore.ts";
import { subscribeAll } from "@core/subscriptions.ts";
import { randId } from "@core/utils/randId.ts";
import { HttpConnection } from "@meshtastic/js";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const HTTP = ({ closeDialog }: TabElementProps): JSX.Element => {
  const { addDevice } = useDeviceStore();
  const { setSelectedDevice } = useAppStore();
  const { register, handleSubmit, control } = useForm<{
    ip: string;
    tls: boolean;
  }>({
    defaultValues: {
      ip: window.location.host + (new URLSearchParams(window.location.search).get("path") || "/meshtastic/web"),
      tls: location.protocol === "https:",
    },
  });

  const tlsEnabled = useWatch({
    control,
    name: "tls",
    defaultValue: location.protocol === "https:",
  });

  const [connectionInProgress, setConnectionInProgress] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setConnectionInProgress(true);

    const id = randId();
    const device = addDevice(id);
    const connection = new HttpConnection(id);
    // TODO: Promise never resolves
    await connection.connect({
      address: data.ip,
      fetchInterval: 2000,
      tls: data.tls,
    });

    setSelectedDevice(id);
    device.addConnection(connection);
    subscribeAll(device, connection);
    closeDialog();
  });

  return (
    <form className="flex w-full flex-col gap-2 p-4" onSubmit={onSubmit}>
      <div className="flex h-48 flex-col gap-2">
        <Label>IP Address/Hostname</Label>
        <Input
          // label="IP Address/Hostname"
          prefix={tlsEnabled ? "https://" : "http://"}
          placeholder="000.000.000.000 / meshtastic.local"
          disabled={connectionInProgress}
          {...register("ip")}
        />
        <Controller
          name="tls"
          control={control}
          render={({ field: { value, ...rest } }) => (
            <>
              <Label>Use TLS</Label>
              <Switch
                // label="Use TLS"
                // description="Description"
                disabled={
                  location.protocol === "https:" || connectionInProgress
                }
                checked={value}
                {...rest}
              />
            </>
          )}
        />
      </div>
      <Button type="submit" disabled={connectionInProgress}>
        <span>{connectionInProgress ? "Connecting..." : "Connect"}</span>
      </Button>
    </form>
  );
};
