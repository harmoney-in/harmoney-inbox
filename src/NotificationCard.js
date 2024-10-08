import React from "preact/compat";
import styled, { keyframes, css } from "styled-components";

const NOTIFICATION_TYPES = {
  improve_bid_or_buy: "improve_bid_or_buy",
  improve_offer_or_sell: "improve_offer_or_sell",
  inventory_offer_or_sell: "inventory_offer_or_sell",
  revive_non_inventory_eoi: "revive_non_inventory_eoi",
};

export default function Notification({
  notificationData,
  notificationType,
  markClicked,
  markArchived,
}) {
  const { message, seen_on: seenOn } = notificationData;
  const orderType = message.text.includes("BID") ? "BID" : "OFFER";

  const handleArchive = () => {
    markArchived(notificationData.n_id);
  };
  const handleNotificationClick = () => {
    if (!notificationData.interacted_on) {
      markClicked(notificationData.n_id);
    }
  };

  const handleActionClick = (data, url) => {
    // fire an event to the main app
    handleNotificationClick();
    const event = new CustomEvent("action-center", {
      detail: {
        data,
        url,
      },
    });
    document.dispatchEvent(event);
  };

  return (
    <Container
      read={!!seenOn}
      $orderType={orderType}
      onClick={(e) => {
        e.stopPropagation();
        handleNotificationClick();
      }}
    >
      <Header>
        <span>{message.header}</span>
        <button onClick={handleArchive}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <mask
              id="mask0_2701_13538"
              style="mask-type:alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="16"
              height="16"
            >
              <rect width="16" height="16" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_2701_13538)">
              <path
                d="M4.265 12.4361L3.5625 11.7336L7.29583 8.00029L3.5625 4.26695L4.265 3.56445L7.99833 7.29779L11.7317 3.56445L12.4342 4.26695L8.70083 8.00029L12.4342 11.7336L11.7317 12.4361L7.99833 8.70279L4.265 12.4361Z"
                fill="#244275"
              />
            </g>
          </svg>
        </button>
      </Header>
      <BodyContent>
        <Details>
          <OrderType $type={orderType}>{message.text}</OrderType>
          <Quote>{message.subtext.text}</Quote>
        </Details>
        <Actions>
          {message.actions?.length > 1 &&
            message.actions[0].name === "Improve" && (
              <ImproveButton
                $orderType={orderType}
                onClick={() =>
                  handleActionClick(message, message.actions[0].url)
                }
              >
                Improve
              </ImproveButton>
            )}
          {message.actions?.length > 1 &&
            message.actions[0].name === "Offer" && (
              <OfferButton
                $orderType={orderType}
                onClick={() =>
                  handleActionClick(message, message.actions[0].url)
                }
              >
                Offer
              </OfferButton>
            )}
          {message.actions?.length > 1 &&
            message.actions[1].name === "Sell" && (
              <SellButton
                onClick={() =>
                  handleActionClick(message, message.actions[1].url)
                }
              >
                Sell
              </SellButton>
            )}
          {message.actions?.length > 1 && message.actions[1].name === "Buy" && (
            <BuyButton
              onClick={() => handleActionClick(message, message.actions[1].url)}
            >
              Buy
            </BuyButton>
          )}
        </Actions>
      </BodyContent>
    </Container>
  );
}

// change background color from white to D8E2F3
const blink = keyframes`
  0% {
    background-color: #D8E2F3;
  }
  50% {
    background-color: #FFF;
  }
  100% {
    background-color: #D8E2F3;
  }
`;
const blinkAnimation = (props) =>
  css`
    ${blink} 1s linear infinite;
  `;

const Container = styled.div`
  display: flex;
  padding: 8px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-left: 2px solid
    ${(props) => (props.$orderType === "BID" ? "#059425" : "#B91338")};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
  animation: ${(props) => (props.read ? "none" : blinkAnimation)};
`;
//   &:hover {
// background-color: ${(props) => (props.read ? "#F6F6F6" : "#DFECFF")};
// }
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  color: #666;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
const OrderType = styled.div`
  color: ${(props) => (props.$type === "BID" ? "#059425" : "#B91338")};
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;

const BodyContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-end;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
`;
const Quote = styled.div`
  color: #333;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const Actions = styled.div`
  display: flex;
  height: 24px;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;
const ImproveButton = styled.button`
  display: flex;
  height: 24px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.$orderType === "BID" ? "#059425" : "#B91338")};
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const OfferButton = styled.button`
  display: flex;
  height: 24px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  color: #b91338;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
const SellButton = styled.button`
  display: flex;
  width: 48px;
  height: 24px;
  font-size: 12px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: #b91338;
  color: #fff;
`;
const BuyButton = styled.button`
  display: flex;
  width: 48px;
  height: 24px;
  font-size: 12px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: #059425;
  color: #fff;
`;
