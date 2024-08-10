import React from "preact/compat";
import { render, unmountComponentAtNode } from "preact/compat";
import Headless from "./Headless";
export function initSuprSendInbox(targetElem, config) {
  if (
    !targetElem ||
    !config?.workspaceKey ||
    !config?.distinctId ||
    !config?.subscriberId
  ) {
    return;
  }

  render(
    <Headless
      workspaceKey={config.workspaceKey}
      distinctId={config.distinctId}
      subscriberId={config.subscriberId}
      tenantId={config?.tenantId}
      stores={config?.stores}
      pageSize={config?.pageSize}
      pagination={config?.pagination}
      themeType={config?.themeType}
      hideInbox={config?.hideInbox}
      hideToast={config?.hideToast}
      notificationClickHandler={config?.notificationClickHandler}
      popperPosition={config?.popperPosition}
      theme={config?.theme}
      toastProps={config?.toastProps}
    />,
    targetElem
  );
}

export function cleanSuprSend(targetElem) {
  if (!targetElem) return;
  unmountComponentAtNode(targetElem);
}
