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
  const win = window.open("", "_blank", "noopener");

  if (win) {
    // Write loading page content to the new window
    win.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting to ${partnerName}...</title>
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
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .logo {
              width: 120px;
              height: auto;
              margin-bottom: 24px;
              border-radius: 8px;
              background: white;
              padding: 10px;
            }
            h2 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            p {
              font-size: 16px;
              opacity: 0.9;
              margin-bottom: 24px;
            }
            .loader-bar {
              width: 200px;
              height: 4px;
              background: rgba(255, 255, 255, 0.3);
              border-radius: 2px;
              overflow: hidden;
              margin: 0 auto;
            }
            .loader-bar::after {
              content: '';
              display: block;
              width: 100%;
              height: 100%;
              background: white;
              animation: loading ${delay}ms linear forwards;
              transform-origin: left;
            }
            @keyframes loading {
              from { transform: scaleX(0); }
              to { transform: scaleX(1); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${partnerLogo}" alt="${partnerName}" class="logo" />
            <h2>Redirecting to ${partnerName}</h2>
            <p>Please wait while we connect you to our partner...</p>
            <div class="loader-bar"></div>
          </div>
        </body>
      </html>
    `);
    win.document.close();

    // After delay, navigate the EXISTING window to affiliate URL
    setTimeout(() => {
      win.location.href = targetUrl;
    }, delay);

    return true;
  } else {
    // Fallback: popup was blocked, redirect in same tab
    console.warn("Popup blocked, redirecting in same tab");
    window.location.href = targetUrl;
    return false;
  }
}
