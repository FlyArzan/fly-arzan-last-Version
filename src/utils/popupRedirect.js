/**
 * Opens a new window immediately on user click (preserving user gesture),
 * shows a loading screen, then redirects to the target URL after a delay.
 *
 * This approach bypasses popup blockers because:
 * 1. window.open() is called synchronously in the click handler
 * 2. Changing location.href of an existing window is not a popup
 *
 * @param {string} targetUrl - The affiliate/partner URL to redirect to
 * @param {object} options - Configuration options
 * @param {number} options.delay - Delay in ms before redirect (default: 3000)
 * @param {string} options.partnerName - Partner name to display (default: "Trip.com")
 * @param {string} options.partnerLogo - Partner logo URL (default: "/icons/trip.webp")
 * @returns {boolean} - True if window opened successfully, false if blocked
 */
export function openPartnerWithLoading(targetUrl, options = {}) {
  const {
    delay = 3000,
    partnerName = "Trip.com",
    partnerLogo = "/icons/trip.webp",
  } = options;

  // Open new window IMMEDIATELY (preserves user gesture)
  // NOTE: Cannot use "noopener" because we need to write to the window
  const win = window.open("", "_blank");

  if (win) {
    // Write loading page content matching the /loader page branding
    const loadingHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting to ${partnerName}...</title>
          <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: 'Rubik', sans-serif;
              background: #fff;
            }
            
            .directing-main {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              padding: 40px 20px;
            }
            
            .logo-container {
              margin-bottom: 30px;
              animation: float 3s ease-in-out infinite;
            }
            
            .logo {
              width: 120px;
              height: auto;
              filter: drop-shadow(0 4px 12px rgba(80, 173, 216, 0.3));
            }
            
            h2 {
              color: #000;
              text-align: center;
              font-family: 'Rubik', sans-serif;
              font-size: 42px;
              font-weight: 500;
              line-height: normal;
              margin-bottom: 8px;
            }
            
            .partner-name {
              color: #50ADD8;
              text-align: center;
              font-family: 'Rubik', sans-serif;
              font-size: 28px;
              font-weight: 600;
              margin-bottom: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            
            .partner-name::before,
            .partner-name::after {
              content: '';
              width: 40px;
              height: 2px;
              background: linear-gradient(90deg, transparent, #50ADD8);
            }
            
            .partner-name::after {
              background: linear-gradient(90deg, #50ADD8, transparent);
            }
            
            /* Loader bar matching the original design */
            .loaderBar {
              width: min(500px, 80vw);
              height: 16px;
              position: relative;
              overflow: hidden;
              border-radius: 50px;
              background: #e7dcdc;
            }
            
            .loaderBar::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              border-radius: 50px;
              background: repeating-linear-gradient(
                45deg,
                #50add8 0 30px,
                #50add8 0 40px
              ) right/200% 100%;
              animation: fillProgress ${delay}ms ease-in-out forwards;
            }
            
            @keyframes fillProgress {
              0% { width: 0; }
              33% { width: 33.333%; }
              66% { width: 66.67%; }
              100% { width: 100%; }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            
            .subtitle {
              color: #666;
              font-size: 14px;
              margin-top: 20px;
              opacity: 0;
              animation: fadeIn 0.5s ease-out 0.5s forwards;
            }
            
            @keyframes fadeIn {
              to { opacity: 1; }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
              h2 { font-size: 32px; }
              .partner-name { font-size: 22px; }
              .loaderBar { height: 12px; }
              .logo { width: 100px; }
            }
            
            @media (max-width: 480px) {
              h2 { font-size: 26px; }
              .partner-name { font-size: 18px; }
              .loaderBar { height: 10px; }
              .logo { width: 80px; }
            }
          </style>
        </head>
        <body>
          <div class="directing-main">
            <div class="logo-container">
              <img src="${partnerLogo}" alt="${partnerName}" class="logo" onerror="this.style.display='none'" />
            </div>
            <h2>Directing To</h2>
            <p class="partner-name">${partnerName}</p>
            <div class="loaderBar"></div>
            <p class="subtitle">Finding the best deals for you...</p>
          </div>
          <script>
            // Redirect after delay
            setTimeout(function() {
              window.location.href = "${targetUrl.replace(/"/g, '\\"')}";
            }, ${delay});
          </script>
        </body>
      </html>
    `;

    win.document.write(loadingHTML);
    win.document.close();

    return true;
  } else {
    // Fallback: popup was blocked, redirect in same tab
    console.warn("Popup blocked, redirecting in same tab");
    window.location.href = targetUrl;
    return false;
  }
}
