"use client";

// import Image from "next/image"; // If you need images

const TrendingTokenCard = ({ token }) => {
  console.log(token, "token");
  if (!token || !token.id) {
    return null;
  }

  // Get ID for side display
  const ticketId = token.id ? token.id.substring(0, 6).toUpperCase() : "TICKET";

  return (
    <div className="entry raffle" id="raffle-green">
      <div className="no-scale">
        <div className="ticket-content">
          <div className="token-image">
            <img src={token.tokenImage} alt="token" />
          </div>
        </div>
      </div>

      <style jsx>{`
        #raffle-green {
          background: transparent;
          width: 220px;
          height: 120px;
          position: relative;
          margin: 10px;
        }

        .entry {
          text-align: center;
          position: relative;
          height: 100%;
        }

        #raffle-green div {
          background-image: radial-gradient(
              circle at top left,
              transparent 17px,
              #4ade80 17px
            ),
            radial-gradient(circle at top right, transparent 17px, #4ade80 17px),
            radial-gradient(
              circle at bottom left,
              transparent 17px,
              #4ade80 17px
            ),
            radial-gradient(
              circle at bottom right,
              transparent 17px,
              #4ade80 17px
            );
          box-shadow: 0 38px 14px -35px rgba(0, 0, 0, 0.3);
          background-size: 50% 50%;
          background-position: top left, top right, bottom left, bottom right;
          background-color: #1f2937;
          background-repeat: no-repeat;
        }

        .raffle div {
          width: 220px;
          height: 110px;
          margin-left: -110px;
          margin-top: -55px;
        }

        .entry div {
          position: absolute;
          left: 50%;
          top: 50%;
        }

        #raffle-green div:before {
          content: "lottery";
          width: 234px;
          height: 76px;
          padding-left: 40px;
          left: -7px;
          top: 17px;
          background-size: 7px 7px;
          background-repeat: repeat-y;
          background-position: 0 0, 0 0, 100% 0, 100% 0;
          background-image: linear-gradient(45deg, transparent 75%, #4ade80 75%),
            linear-gradient(135deg, transparent 75%, #4ade80 75%),
            linear-gradient(-45deg, transparent 75%, #4ade80 75%),
            linear-gradient(-135deg, transparent 75%, #4ade80 75%);
          line-height: 1.9;
          font-size: 42px;
          text-align: left;
          font-family: "HelveticaNeue-CondensedBold", "Arial Narrow", Impact,
            "Roboto", sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(74, 222, 128, 0.3);
         
        }

        .raffle div:before,
        .raffle div:after {
          box-sizing: border-box;
          color: #333;
        }

        .entry div:before,
        .entry div:after {
          display: block;
          content: "";
          position: absolute;
        }

        #raffle-green div:after {
          content: "${token.ticker
            ? token.ticker.substring(0, 6).toUpperCase()
            : "TICKET"}";
          width: 75px;
          height: 185px;
          padding-top: 162px;
          top: -37px;
          left: 72px;
          background: linear-gradient(
            to bottom,
            transparent 155px,
            #4ade80 155px,
            #4ade80 158px,
            transparent 158px
          );
          border: 3px solid #4ade80;
          border-radius: 10px;
          transform: rotate(-90deg);
          font-size: 14px;
          font-family: monospace;
          text-align: center;
          line-height: 1;
          z-index: 2;
        }

    
        .token-image {
          width: 35%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
        }

        .token-image img {
          z-index: 10;
          width: 60px;
          height: 60px;
          object-fit: contain;
          opacity: 1;
          visibility: visible;
          border-radius: 50px;
        }

        .lottery-pool-amount {
          font-size: 10px;
          color: #e5e7eb; /* Light gray, adjust as needed */
          text-align: center;
          margin-top: 4px;
          font-weight: bold;
        }

        .ticket-data {
          width: 65%;
          font-size: 12px;
          color: #d1d5db;
          text-align: left;
          padding: 10px;
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .data-field {
          margin: 2px 0;
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 10px;
          color: #9ca3af;
          display: block;
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .value {
          font-weight: bold;
          color: #d1d5db;
        }

        .side-id {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          top: 0;
          color: #4ade80;
          font-family: monospace;
          font-size: 14px;
          font-weight: bold;
          z-index: 5;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .left-id {
          left: 10px;
        }

        .right-id {
          right: 10px;
        }
      `}</style>
    </div>
  );
};

export default TrendingTokenCard;
