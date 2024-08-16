import React, { useEffect } from "preact/compat";
import { useState } from "preact/compat";
import styled, { keyframes } from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useNotifications,
  SuprSendProvider,
  useStoresUnseenCount,
} from "@suprsend/react-inbox";
import NotificationCard from "./NotificationCard";

export default function FullScreenNotifications({
  workspaceKey,
  distinctId,
  subscriberId,
  stores,
}) {
  return (
    <SuprSendProvider
      workspaceKey={workspaceKey}
      distinctId={distinctId}
      subscriberId={subscriberId}
      stores={stores}
    >
      <NotifsContainer>
        <NotificationsContainer stores={stores} type="FULL_PAGE" />
      </NotifsContainer>
    </SuprSendProvider>
  );
}

export function NotificationsContainer({ stores, type }) {
  const [changeTab, setChangetab] = useState(false);
  const [active, setActive] = useState(() =>
    stores && Array.isArray(stores) && stores.length > 0
      ? stores[0].storeId
      : null
  );
  const {
    notifications,
    hasNext,
    initialLoading,
    markAllRead,
    markClicked,
    fetchPrevious,
    markArchived,
  } = useNotifications(active);
  const unseenData = useStoresUnseenCount();


  useEffect(()=>{
    const archiveNotification = (e) => {
      const n_id = e.detail.n_id;
      if(n_id) {
        markClicked(n_id);
        markArchived(n_id);
      }
    }
    document.addEventListener("archive-notification",archiveNotification);
    return () => {
      document.removeEventListener("archive-notification",archiveNotification);
    }
  })
  if (initialLoading) {
    return (
      <div>
        <Header
          active={active}
          markAllRead={markAllRead}
          stores={stores}
          setActive={setActive}
          setChangetab={setChangetab}
          unseenData={unseenData}
          type={type}
        />
        <InitialLoader>
          <Loader size="large" />
        </InitialLoader>
      </div>
    );
  }
  if (notifications?.length < 1) {
    return (
      // currently its empty
      <div></div>
    );
  }
  return (
    <div>
      <Header
        active={active}
        markAllRead={markAllRead}
        stores={stores}
        setActive={setActive}
        setChangetab={setChangetab}
        unseenData={unseenData}
        type={type}
      />
      {changeTab ? null : (
        <InfiniteScroll
          scrollableTarget="ss-notification-container"
          dataLength={notifications.length}
          next={fetchPrevious}
          hasMore={hasNext}
          loader={<Loader />}
        >
          {notifications.map((notification) => {
            let notificationType;
            try {
              notificationType = JSON.parse(
                notification.message.extra_data
              ).notification_type;
            } catch {}
            if (!notificationType) return null;
            return (
              <NotificationCard
                notificationData={notification}
                key={notification.n_id}
                markClicked={markClicked}
                markArchived={markArchived}
                notificationType={notificationType}
              />
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
}

function Header({
  active,
  markAllRead,
  stores,
  setActive,
  setChangetab,
  unseenData,
  type,
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        background: "white",
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <TabsContainer>
        {stores &&
          stores?.map((store, index) => {
            const isActiveTab = active === store.storeId;
            const tabUnseenCount = unseenData?.[store.storeId] || 0;
            const showBadge = tabUnseenCount > 0;

            return (
              <TabContainer
                key={index}
                selected={isActiveTab}
                onClick={() => {
                  setChangetab(true);
                  setActive(store.storeId);
                  setTimeout(() => {
                    setChangetab(false);
                  }, 0);
                }}
              >
                <TabText selected={isActiveTab}>{store.label}</TabText>
                {showBadge && (
                  <TabBadge>
                    <TabBadgeText count={tabUnseenCount}>
                      {tabUnseenCount}
                    </TabBadgeText>
                  </TabBadge>
                )}
              </TabContainer>
            );
          })}
      </TabsContainer>
    </div>
  );
}

function Loader({ size }) {
  return (
    <SpinnerContainer>
      <Spinner size={size} />
    </SpinnerContainer>
  );
}

const NotifsContainer = styled.div`
  margin: 0px;
`;

const CText = styled.p`
  font-size: 14px;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 20px;
  color: #1c1c1c;
  margin: 0px;
`;

const MarkAllReadText = styled(CText)`
  color: #066af3;
  cursor: pointer;
`;

const ShowAlltextText = styled(MarkAllReadText)`
  border-right: 1px solid #dbdada;
  padding-right: 5px;
`;

const LeftDiv = styled.div`
  display: flex;
  gap: 5px;
`;

const EmptyText = styled(CText)`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  background-color: transparent;
  margin: 20px 0px;
  margin-bottom: 16px;
  color: #1c1c1c;
  margin-top: 200px;
`;

const EmptySubText = styled(CText)`
  color: #707070;
  text-align: center;
`;

const spin = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const Spinner = styled.div`
  border: ${(props) =>
    props.size === "large" ? `5px solid #DBDADA` : `3px solid #DBDADA`};
  border-top: ${(props) =>
    props.size === "large" ? "5px solid" : "3px solid"};
  border-top-color: #066af3;
  border-radius: 50%;
  width: ${(props) => (props.size === "large" ? "20px" : "10px")};
  height: ${(props) => (props.size === "large" ? "20px" : "10px")};
  animation: ${spin} 1s linear infinite;
  margin: 5px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InitialLoader = styled.div`
  margin-top: 32px;
`;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabContainer = styled.div`
  padding: 5px 15px 3px 15px;
  border-bottom: ${(props) => {
    return props.selected ? `2px solid #066AF3` : "none";
  }};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const TabText = styled(CText)`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => {
    return props.selected ? "#1C1C1C" : "#707070";
  }};
`;

const TabBadge = styled.div`
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background-color: #066af3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const TabBadgeText = styled.p`
  margin: 0px;
  padding: 0px;
  font-size: ${(props) => {
    return props?.count > 99 ? "8px" : "10px";
  }};
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
`;
