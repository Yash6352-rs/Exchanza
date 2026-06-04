const fs = require('fs')
const path = require('path')

const logoPath = path.join(__dirname, '../assets/exchanza_logo.png')

const logoBase64 = fs.readFileSync(logoPath, {
  encoding: 'base64'
})

exports.generateAnalyticsTemplate = ({
  overview,
  topUsers,
  topTags,
  avgCompletionTime,
  adminName,
  charts
}) => {
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

@page {
  size: A4;
  margin: 0;
}

/* PAGE */

.page {
  width: 794px;
  min-height: 1123px;
  margin: 5 auto;
  padding: 28px;
  overflow: hidden;
  page-break-after: always;
  background: #EEF2F7;
}

/* GLOBAL */

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #0F172A;
}

.section-sub {
  margin-top: 6px;
  font-size: 14px;
  color: #64748B;
  line-height: 24px;
}

.divider {
  width: 100%;
  height: 2px;
  background: #DCE3EA;
   margin: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-number {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
}

/* HERO */

.hero {
  background:
    linear-gradient(
      135deg,
      #0F172A 0%,
      #0F766E 55%,
      #134E4A 100%
    );

  border-radius: 40px;
  padding: 34px;
  color: white;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
}

.hero::before {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);

  top: -160px;
  right: -120px;
}

.hero::after {
  content: "";
  position: absolute;

  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255,255,255,0.03);
  bottom: -140px;
  left: -100px;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 18px;
}

.chart-card,
.table-card,
.stat-card {
  page-break-inside: avoid;
}

.logo {
  width: 110px;
  height: 80px;
  object-fit: contain;
  margin-left: -15px'
}

.brand {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-top: 15px;
}

.brand-sub {
  font-size: 12px;
  font-weight: 500;
  //color: #CCFBF1;
}

.report-title {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-top: 15px;
}

.meta {
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
}

.summary-card {
  position: relative;
  z-index: 5;
  padding: 28px;
  border-radius: 28px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
}

.summary-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 16px;
}

.summary-text {
  font-size: 15px;
  line-height: 30px;
  color: #ECFEFF;
}

/* KPI GRID */

.stats-grid {
  margin-top: 28px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 28px;
  padding: 24px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 10px 40px rgba(15,23,42,0.06);
  position: relative;
  overflow: hidden;
}

.stat-label {
  position: relative;
  z-index: 2;

  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #64748B;
  font-weight: 700;
}

.stat-value {
  position: relative;
  z-index: 2;

  margin-top: 16px;

  font-size: 36px;
  font-weight: 900;
  letter-spacing: -0.04em;

  color: #0F766E;
}

.stat-sub {
  margin-top: 8px;
  font-size: 13px;
  color: #94A3B8;
}

/* CHARTS */

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.chart-card {
  background: white;
  border-radius: 24px;
  padding: 18px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 16px 50px rgba(15,23,42,0.06);
  overflow: hidden;
}

.chart-card.large {
  padding: 26px;
}

.chart-header {
  margin-bottom: 18px;
}

.chart-title {
  font-size: 24px;
  font-weight: 800;
  color: #0F172A;
}

.chart-subtitle {
  margin-top: 6px;
  font-size: 14px;
  color: #64748B;
}

.chart-image {
  width: 100%;
  height: 250px;
  object-fit: contain;
  border-radius: 20px;
  display: block;
}

.chart-image-large {
  width: 100%;
  height: 320px;
  object-fit: contain;
  border-radius: 20px;
  display: block;
}

.chart-image-xl {
  width: 100%;
  height: 340px;
  object-fit: contain;
  border-radius: 20px;
  display: block;
}

/* TABLE */

.table-card {
  background: white;
  border-radius: 34px;
  padding: 28px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 14px 45px rgba(15,23,42,0.06);
}

.table-header {
  margin-bottom: 24px;
}

.table-title {
  font-size: 28px;
  font-weight: 900;
}

.table-subtitle {
  margin-top: 6px;
  color: #64748B;
  font-size: 14px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
}

.table thead tr {
  background: #F8FAFC;
}

.table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #475569;
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #E2E8F0;
  font-size: 14px;
  color: #0F172A;
}

.table tbody tr:nth-child(even) {
  background: #FCFDFE;
}

/* BADGES */

.badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.badge-green {
  background: rgba(16,185,129,0.12);
  color: #059669;
}

.badge-blue {
  background: rgba(59,130,246,0.12);
  color: #2563EB;
}

/* FOOTER */

.footer {
  margin-top: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #64748B;
  font-size: 13px;
}

/* PDF SAFE */

img {
  max-width: 100%;
}

</style>

</head>

<body>

<!-- PAGE 1 -->

<div class="page">

  <!-- TOP HEADER -->
    <div
      class="page-header"
      style="
        margin-bottom: 24px;
        align-items: flex-start;
      "
    >

      <!-- LEFT SECTION -->
      <div
        style="
          display:flex;
          align-items:flex-start;
          gap:8px;
        "
      >

        <!-- LOGO -->
        <img
          src="data:image/png;base64,${logoBase64}"
          class="logo"
        />

        <!-- BRAND -->
        <div>

          <div
            class="brand"
            style="
              color:#0F172A;
              line-height:1;
            "
          >
            Exchanza
          </div>

          <div
            class="brand-sub"
            style="
              color:#64748B;
              margin-top:10px;
            "
          >
            Premium Analytics Reporting System
          </div>
        </div>
      </div>

      <!-- RIGHT SECTION -->
      <div style="text-align:right;">

        <div
          class="report-title"
          style="
            color:#0F172A;
            line-height:1;
          "
        >
          Analytics Report
        </div>

        <div
          class="meta"
          style="
            color:#64748B;
            margin-top:12px;
          "
        >
          Generated: ${date}
        </div>

        <div
          class="meta"
          style="color:#64748B;"
        >
          Administrator: ${adminName}
        </div>
      </div>
    </div>

    <!-- HERO -->
    <div class="hero">

      <div class="summary-card">

        <div class="summary-title">
          Executive Overview
        </div>

        <div class="summary-text">

          Exchanza currently operates with
          <strong>${overview.totalUsers}</strong>
          active users,
          <strong>${overview.totalTrades}</strong>
          platform trades and
          <strong>${overview.totalPosts}</strong>
          exchange posts.

          Current trade completion rate stands at
          <strong>${overview.completionRate}%</strong>
          with an average completion time of
          <strong>${avgCompletionTime}</strong>.

          Platform engagement continues to grow through active
          community participation, skill exchanges, and user-driven
          marketplace activity.

        </div>
      </div>
    </div>

    <div style="margin-top: 40px; margin-bottom-22px">
      <div class="section-title">
        Platform Statistics
      </div>

      <div class="section-sub">
        Comprehensive platform statistics, performance metrics, and marketplace growth insights.
      </div>
    </div>

    <div class="stats-grid">

      <div class="stat-card">
        <div class="stat-label">Total Users</div>
        <div class="stat-value">${overview.totalUsers}</div>
        <div class="stat-sub">Registered platform users</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total Posts</div>
        <div class="stat-value">${overview.totalPosts}</div>
        <div class="stat-sub">Community exchange posts</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total Trades</div>
        <div class="stat-value">${overview.totalTrades}</div>
        <div class="stat-sub">Platform trade volume</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Completion Rate</div>
        <div class="stat-value">${overview.completionRate}%</div>
        <div class="stat-sub">Trade success ratio</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Completed Trades</div>
        <div class="stat-value">${overview.completedTrades}</div>
        <div class="stat-sub">Successfully completed</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Avg Completion</div>
        <div class="stat-value">${avgCompletionTime}</div>
        <div class="stat-sub">Average trade duration</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Reports</div>
        <div class="stat-value">${overview.reportsCount}</div>
        <div class="stat-sub">Platform reports logged</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Blocked Users</div>
        <div class="stat-value">${overview.blockedUsers}</div>
        <div class="stat-sub">Restricted accounts</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total Tags</div>
        <div class="stat-value">${overview.totalTags}</div>
        <div class="stat-sub">Marketplace skill tags</div>
      </div>

    </div>

    <!-- FOOTER -->
      <div
        style="
          margin-top: 28px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >
        <div class="page-number">
          Page 1
        </div>
      </div>

  </div>


    <!-- PAGE 2 -->

    <div class="page">

      <!-- TOP SPACE -->
      <div style="height: 60px;"></div>

      <!-- HEADER -->

      <div>

        <div class="section-title">
          Trade & Growth Analytics
        </div>

        <div class="section-sub">
          Platform trade performance and marketplace growth overview
        </div>

      </div>

      <!-- SPACE -->
      <div style="height: 50px;"></div>

      <!-- ROW 1 -->

      <div class="chart-grid">

        <div class="chart-card">

          <div class="chart-header">
            <div class="chart-title">
              Trade Analytics
            </div>
          </div>

          <img
            src="${charts.tradeChart}"
            class="chart-image"
          />

        </div>

        <div class="chart-card">

          <div class="chart-header">
            <div class="chart-title">
              Platform Growth
            </div>
          </div>

          <img
            src="${charts.growthChart}"
            class="chart-image"
          />

        </div>

      </div>

      <!-- SPACE -->
      <div style="height: 40px;"></div>

      <!-- DIVIDER -->

      <div class="divider"></div>

      <!-- SPACE -->
      <div style="height: 40px;"></div>

      <!-- ROW 2 -->

      <div class="chart-card">

        <div class="chart-header">

          <div class="chart-title">
            Weekly Growth
          </div>

        </div>

        <img
          src="${charts.weeklyChart}"
          class="chart-image-large"
        />

      </div>

      <!-- FOOTER -->

      <div
        style="
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >
        <div class="page-number">
          Page 2
        </div>
      </div>

    </div>


    <!-- PAGE 3 -->

    <div class="page">

      <!-- TOP SPACE -->
      <div style="height: 60px;"></div>

      <!-- HEADER -->

      <div>

        <div class="section-title">
          Performance & Engagement
        </div>

        <div class="section-sub">
          Trade completion metrics and engagement insights
        </div>

      </div>

      <!-- SPACE -->
      <div style="height: 50px;"></div>

      <!-- ROW 1 -->

      <div class="chart-grid">

        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              Trade Completion
            </div>
          </div>

          <img
            src="${charts.completionChart}"
            class="chart-image"
          />
        </div>

        <div class="chart-card">

          <div class="chart-header">

            <div class="chart-title">
              Platform Activity
            </div>

          </div>

          <img
            src="${charts.activityChart}"
            class="chart-image"
          />

        </div>

      </div>

      <!-- SPACE -->
      <div style="height: 40px;"></div>

      <!-- DIVIDER -->

      <div class="divider"></div>

      <!-- SPACE -->
      <div style="height: 40px;"></div>

      <!-- ROW 2 -->

      <div class="chart-card">

        <div class="chart-header">

          <div class="chart-title">
            User vs Post vs Trade Activity
          </div>

        </div>

        <img
          src="${charts.scatterChart}"
          class="chart-image-xl"
        />

      </div>

      <!-- FOOTER -->

      <div
        style="
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >

        <div class="page-number">
          Page 3
        </div>

      </div>

    </div>


  <!-- PAGE 4 -->

    <div class="page">

      <!-- TOP SPACE -->
      <div style="height: 60px;"></div>

      <!-- HEADER -->

      <div>

        <div class="section-title">
          Activity Insights
        </div>

        <div class="section-sub">
          User activity distribution and engagement heatmaps
        </div>

      </div>

      <!-- SPACE -->
      <div style="height: 40px;"></div>

      <!-- ROW 1 -->

      <div class="chart-grid">

        <div class="chart-card">

          <div class="chart-header">

            <div class="chart-title">
              Skills & Tags Radar
            </div>

          </div>

          <img
            src="${charts.radarChart}"
            class="chart-image"
          />

        </div>

        <div class="chart-card">

          <div class="chart-header">

            <div class="chart-title">
              Conversion Funnel
            </div>

          </div>

          <img
            src="${charts.funnelChart}"
            class="chart-image"
          />

        </div>

      </div>


      <!-- SPACE -->
      <div style="height: 35px;"></div>

      <!-- DIVIDER -->

      <div class="divider"></div>

      <!-- SPACE -->
      <div style="height: 35px;"></div>

      <!-- ROW 2 -->

      <div class="chart-card">

        <div class="chart-header">

          <div class="chart-title">
            Activity Heatmap
          </div>

        </div>

        <img
          src="${charts.heatmapChart}"
          class="chart-image-xl"
        />

      </div>

      <!-- FOOTER -->

      <div
        style="
          margin-top: 50px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >

        <div class="page-number">
          Page 4
        </div>

      </div>

    </div>


    <!-- PAGE 5 -->

    <div class="page">

      <!-- TOP SPACE -->
      <div style="height: 60px;"></div>

      <!-- HEADER -->

      <div>

        <div class="section-title">
          Leaderboards & Trending Insights
        </div>

        <div class="section-sub">
          Top performing users and trending platform skills
        </div>

      </div>

      <!-- SPACE -->
      <div style="height: 50px;"></div>

      <!-- TOP USERS -->

      <div class="table-card">

        <div class="table-header">

          <div class="table-title">
            Top Users
          </div>

          <div class="table-subtitle">
            Highest rated and most active users
          </div>

        </div>

        <table class="table">

          <thead>

            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            ${topUsers
              .map(
                (user, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>⭐ ${user.rating || 0}</td>
                <td>${user.totalReviews || 0}</td>
                <td>
                  <span class="badge badge-green">
                    Top Performer
                  </span>
                </td>
              </tr>
            `
              )
              .join('')}

          </tbody>

        </table>

      </div>

      <!-- SPACE -->
      <div style="height: 40px;"></div>

      <!-- DIVIDER -->

      <div class="divider"></div>

      <!-- SPACE -->
      <div style="height: 40px;"></div>

      <!-- TRENDING SKILLS -->

      <div class="table-card">

        <div class="table-header">

          <div class="table-title">
            Trending Skills
          </div>

          <div class="table-subtitle">
            Most in-demand marketplace skills
          </div>

        </div>

        <table class="table">

          <thead>

            <tr>
              <th>#</th>
              <th>Skill</th>
              <th>Usage Count</th>
              <th>Popularity</th>
            </tr>

          </thead>

          <tbody>

            ${(topTags || [])
              .slice(0, 4)
              .map(
                (tag, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${tag.name}</td>
                    <td>${tag.usageCount}</td>
                    <td>
                      <span class="badge badge-blue">
                        Trending
                      </span>
                    </td>
                  </tr>
                `
              )
              .join('')}

          </tbody>

        </table>

      </div>

      <!-- FOOTER -->

      <div class="footer">
        <div>
          Generated by Exchanza Analytics Reporting System
        </div>

        <div>
          © ${new Date().getFullYear()} Exchanza
        </div>

      </div>

      <!-- PAGE NUMBER -->

      <div
        style="
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >

        <div class="page-number">
          Page 5
        </div>

      </div>

    </div>

</body>

</html>

  `
}
