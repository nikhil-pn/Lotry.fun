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

            <div className="token-stats">
              <div className="market-cap">
                <span className="stat-label">market cap:</span>
                <span className="stat-value">${token.marketCap || "0"}</span>
              </div>
              <div className="replies">
                <span className="stat-label">replies:</span>
                <span className="stat-value">{token.replies || "0"}</span>
              </div>
            </div>

            {/* Token description */}
            {token.description && (
              <p className="token-description">{token.description}</p>
            )}

            {/* Ticket footer with lottery pool */}
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
            height: 100%;
            position: relative;
            perspective: 1000px;
            margin: 0 auto;
            transition: transform 0.3s ease;
            cursor: pointer;
          }

          .lottery-ticket-card:hover {
            transform: translateY(-5px);
          }

          .ticket-inner {
            background: #1e1e24;
            border-radius: 16px;
            border: 1px solid #333;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          .ticket-inner::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #22c55e, #16a34a);
          }

          .ticket-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px dashed #333;
          }

          .header-content {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .lottery-badge {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-weight: bold;
            color: white;
            font-size: 14px;
          }

          .lottery-text {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            color: #9ca3af;
          }

          .ticker-symbol {
            font-weight: bold;
            font-size: 18px;
            color: #22c55e;
            text-transform: uppercase;
          }

          .token-image-container {
            padding: 20px 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .token-image {
            border: 2px solid #22c55e;
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
          }

          .no-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            border: 2px solid #22c55e;
          }

          .ticket-body {
            padding: 0 16px 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .token-name {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 12px;
            color: white;
          }

          .token-stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }

          .market-cap,
          .replies {
            display: flex;
            flex-direction: column;
          }

          .stat-label {
            color: #9ca3af;
            font-size: 14px;
          }

          .stat-value {
            color: #22c55e;
            font-weight: 600;
          }

          .token-description {
            font-size: 14px;
            color: #d1d5db;
            margin-bottom: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .ticket-serial {
            margin-top: auto;
            border-top: 1px dashed #333;
            padding-top: 10px;
            display: flex;
            justify-content: center;
          }

          .serial-number {
            font-family: monospace;
            font-size: 14px;
            color: #9ca3af;
            letter-spacing: 0.5px;
          }
        `}</style>
      </div>
    </Link>
  );
};

export default TokenCard;
