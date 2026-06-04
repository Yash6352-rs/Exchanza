export const generateInvoiceHTML = ({
  trade,
  post,
  review,
  logoBase64
}: any) => {
  const date = new Date().toLocaleDateString()

  return `
  <!DOCTYPE html>

    <html>
    <head>
    <meta charset="UTF-8" />

    <style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
        background: #EEF2F7;
        font-family: Inter, Arial, sans-serif;
        color: #0F172A;
    }

    .page {
        width: 100%;
        padding: 30px;
    }

    /* CONTAINER */

    .container {
        max-width: 760px;
        margin: auto;
        background: white;
        border-radius: 34px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(15,23,42,0.06);
    }

    /* HERO */

    .hero {
      background:
          linear-gradient(
              135deg,
              #134E4A 0%,
              #0F766E 35%,
              #0F172A 100%
          );

      padding: 36px;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
        content: "";
        position: absolute;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);

        top: -140px;
        right: -100px;
    }

    .hero::after {
        content: "";
        position: absolute;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        background: rgba(255,255,255,0.03);

        bottom: -100px;
        left: -80px;
    }

    .hero-content {
        position: relative;
        z-index: 5;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .brand {
        font-size: 34px;
        font-weight: 900;
        margin-left:-5px;
        letter-spacing: -0.04em;
        color: white;
    }

    .brand-sub {
        margin-top: 10px;
        font-size: 13px;
        color: #CCFBF1;
    }

    .invoice-title {
        font-size: 34px;
        font-weight: 900;
        letter-spacing: -0.04em;
        color: white;
        text-align: right;
    }

    .meta {
        margin-top: 10px;
        font-size: 13px;
        color: #D1FAE5;
        text-align: right;
    }

    /* CONTENT */

    .content {
        padding: 34px;
    }

    /* CARDS */

    .card {
        background: #F8FAFC;
        border-radius: 24px;
        padding: 24px;
        border: 1px solid #E2E8F0;
        margin-bottom: 24px;
    }

    .section-title {
        font-size: 18px;
        font-weight: 800;
        margin-bottom: 18px;
        color: #0F172A;
    }

    .label {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #64748B;
        font-weight: 700;
        margin-bottom: 8px;
    }

    .value {
        font-size: 16px;
        font-weight: 600;
        color: #0F172A;
        line-height: 28px;
    }

    .value2 {
      margin-top:-5px
      font-size: 13px;
      font-weight: 600;
      color: #0F172A;
    }

    /* GRID */

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
    }

    /* TABLE */

    table {
        width: 100%;
        border-collapse: collapse;
        overflow: hidden;
    }

    thead tr {
        background: #F1F5F9;
    }

    th {
        text-align: left;
        padding: 14px 15px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #475569;
    }

    td {
        padding: 15px;
        border-bottom: 1px solid #E2E8F0;
        font-size: 15px;
        color: #0F172A;
    }

    /* BADGE */

    .badge {
        display: inline-block;
        padding: 10px 16px;
        border-radius: 999px;
        background: rgba(16,185,129,0.12);
        color: #059669;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 18px;
    }

    /* REVIEW */

    .review-box {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 24px;
        padding: 18px;
    }

    /* FOOTER */

    /* FOOTER */

    .footer {
        margin-top: 24px;
        padding: 18px 4px 0 4px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        border-top: 1px solid #E2E8F0;

        font-size: 12px;
        color: #64748B;
    }

    </style>
    </head>

    <body>

    <div class="page">

    <div class="container">

        <!-- HERO -->
        <div class="hero">

            <div class="hero-content">

                <div class="header">
                  <!-- LEFT -->
                  <div
                      style="
                          display:flex;
                          gap:10px;
                      "
                  >

                      <!-- LOGO -->
                      <img
                        src="data:image/png;base64,${logoBase64}"
                        style="
                          width:110px;
                          height:90px;
                          object-fit:contain;
                          margin-left:-22px;
                          margin-top:-20px;
                        "
                      />

                      <!-- BRAND -->
                      <div>
                          <div class="brand">
                              Exchanza
                          </div>

                          <div class="brand-sub">
                              Premium Skill Exchange Platform
                          </div>

                      </div>

                  </div>

                  <!-- RIGHT -->
                  <div style="text-align:right;">

                      <div class="invoice-title">
                          Trade Invoice
                      </div>

                      <div class="meta">
                          Invoice ID: #${trade.id}
                      </div>

                      <div class="meta">
                          Generated: ${date}
                      </div>

                  </div>

              </div>

            </div>

        </div>

        <!-- CONTENT -->
        <div class="content">

            <!-- TRADE SUMMARY -->
            <div class="card">

              <div
                style="
                  display:flex;
                  gap: 40px;
                  align-items:center;
                "
              >
                <!-- LEFT -->
                <div class="section-title">
                    Trade Summary
                </div>
                
              <!-- RIGHT -->
                <div>
                    <span class="badge">
                        Trade Completed Successfully
                    </span>
                </div>
              </div>


                <div class="grid">

                    <div>
                        <div class="label">
                            From User
                        </div>

                        <div class="value">
                            ${trade.fromUserName || 'User'}
                        </div>
                    </div>

                    <div>
                        <div class="label">
                            To User
                        </div>

                        <div class="value">
                            ${trade.toUserName || 'User'}
                        </div>
                    </div>

                </div>

            </div>

            <!-- POST DETAILS -->
            ${
              post
                ? `
                <div class="card">

                    <div class="section-title">
                        Exchange Post Details
                    </div>

                    <div style="margin-bottom:18px;">
                        <div class="label">
                            Post Title
                        </div>

                        <div class="value">
                            ${post.title}
                        </div>
                    </div>

                    <div style="margin-bottom:18px;">
                        <div class="label">
                            Description
                        </div>

                        <div class="value">
                            ${post.description}
                        </div>
                    </div>

                    <div>
                        <div class="label">
                            Tags
                        </div>

                        <div class="value">
                            ${post.tags}
                        </div>
                    </div>

                </div>
            `
                : ''
            }

            <!-- TRADE DETAILS -->
            <div class="card">

                <div class="section-title">
                    Trade Agreement
                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Offer</th>
                            <th>Request</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>${trade.offerText}</td>
                            <td>${trade.requestText}</td>
                        </tr>
                    </tbody>

                </table>

            </div>

            ${
              review?.rating
                ? `
            <div class="review-box">

                <div class="section-title">
                    Trade Review
                </div>

                <div
                  style="
                    display:flex;
                    gap:30px;
                    align-items-center;
                  "
                > 
                  <div class="label">
                      User Rating
                  </div>

                  <div class="value2">
                      ⭐ ${review.rating}/5
                  </div>
                </div>
                
            </div>
            `
                : ''
            }

            <!-- FOOTER -->
            <div class="footer">

                <div>
                    Generated by Exchanza Invoice System
                </div>

                <div>
                    © ${new Date().getFullYear()} Exchanza
                </div>

            </div>

        </div>

    </div>

    </div>

    </body>
  </html>
  `
}
