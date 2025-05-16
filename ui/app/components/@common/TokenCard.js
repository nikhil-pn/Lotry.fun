import Image from "next/image";
import Link from "next/link";

const TokenCard = ({ token }) => {
  return (
    <Link href={`/token/${token.id}`} key={token.id} passHref>
      <div className="lottery-ticket-card">
        <div className="ticket-inner">
          {/* Ticket header with decorative elements */}
          <div className="ticket-header">
            <div className="header-content">
              <div className="lottery-badge">L</div>
              <span className="lottery-text">LOTTERY TICKET</span>
            </div>
            <div className="ticker-symbol">{token.ticker || "---"}</div>
          </div>

          {/* Token image */}
          <div className="token-image-container">
            {token.tokenImage ? (
              <Image
                src={token.tokenImage}
                alt={token.tokenName || "Token image"}
                width={120}
                height={120}
                className="token-image rounded-full border-2 border-green-400 object-cover"
              />
            ) : (
              <div className="no-image">
                <span>No image</span>
              </div>
            )}
          </div>

          {/* Ticket body */}
          <div className="ticket-body">
            <h3 className="token-name">{token.tokenName || "Unnamed Token"}</h3>

            {/* Ticket footer with serial number */}
            <div className="ticket-serial">
              <span className="serial-number">
                Lottery Pool: {token.lotteryPool || "000000"} ETH
              </span>
            </div>
          </div>
        </div>

        {/* CSS for the lottery ticket styling */}
        <style jsx>{`
          .lottery-ticket-card {
            width: 100%;
            height: 330px;
            position: relative;
            perspective: 1000px;
            margin: 0 auto;
            transition: transform 0.3s;
          }

          .lottery-ticket-card:hover {
            transform: translateY(-10px);
          }

          .ticket-inner {
            width: 100%;
            height: 100%;
            background-color: #1f2937;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);

            /* Curved corners using radial gradient */
            background-image: radial-gradient(
                circle at top left,
                transparent 15px,
                #4ade80 15px
              ),
              radial-gradient(
                circle at top right,
                transparent 15px,
                #4ade80 15px
              ),
              radial-gradient(
                circle at bottom left,
                transparent 15px,
                #4ade80 15px
              ),
              radial-gradient(
                circle at bottom right,
                transparent 15px,
                #4ade80 15px
              );
            background-size: 50% 50%;
            background-position: top left, top right, bottom left, bottom right;
            background-repeat: no-repeat;
            border: 2px solid #4ade80;
          }

          .ticket-header {
            padding: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed #4ade80;
            z-index: 1;
          }

          .header-content {
            display: flex;
            align-items: center;
          }

          .lottery-badge {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #4ade80;
            color: #134e4a;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
          }

          .lottery-text {
            font-weight: bold;
            color: #4ade80;
            font-size: 0.8rem;
            letter-spacing: 1px;
          }

          .ticker-symbol {
            color: #4ade80;
            font-family: monospace;
            font-weight: bold;
          }

          .token-image-container {
            position: relative;
            height: 160px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 2px dashed #4ade80;
            padding: 15px;
            overflow: hidden;
          }

          .token-image {
            border-radius: 50%;
            border: 3px solid #4ade80;
            object-fit: cover;
          }

          .no-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background-color: #134e4a;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4ade80;
            border: 3px solid #4ade80;
          }

          .ticket-body {
            flex: 1;
            padding: 15px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: linear-gradient(to bottom, #1f2937, #111827);
          }

          .token-name {
            font-weight: bold;
            font-size: 1.2rem;
            color: white;
            text-align: center;
            margin-bottom: 10px;
          }

          .ticket-serial {
            display: flex;
            justify-content: center;
            margin-top: auto;
          }

          .serial-number {
            font-family: monospace;
            font-size: 0.8rem;
            color: #4ade80;
            background-color: rgba(74, 222, 128, 0.1);
            padding: 4px 12px;
            border-radius: 20px;
            border: 1px solid #4ade80;
          }

          /* Edge decoration removed */

          /* Add dotted pattern for ticket effect */
          .token-image-container:after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-image: radial-gradient(#ffffff10 1px, transparent 1px);
            background-size: 8px 8px;
            pointer-events: none;
          }
        `}</style>
      </div>
    </Link>
  );
};

export default TokenCard;
